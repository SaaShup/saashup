function createEnrollHelpers({
  asArray,
  authUserFromRequest,
  blockedEnrollmentImages,
  containerEnvValue,
  hostIdQuery,
  imagesToKeepValue,
  imageKeyFromImageObject,
  imageKeyFromRefAndVersion,
  imageNameFromRef,
  imageNameKey,
  imageNameKeyFromImageObject,
  labelMapFromContainer,
  logLine,
  maxInstancesValue,
  NetBoxClient,
  orderInstanceCountForTemplate,
  ownerEnvVarName,
  plainJsonObject,
  plainObject,
  profileUsesNetBoxTemplates,
  readState,
  selectedProfileConfig,
  syncTemplatesToNetBoxConfigContext,
  templateEntryForRequest,
  templateLabelValue,
  templatesForRequest,
  visibleProfileNames = () => [],
  workflowsForRequest,
  writeState,
}) {
  async function currentProfileEnrollmentUsage(req, profile, options = {}) {
    const instances = await enrollmentTemplatesForRequest(req, profile, { ownerOnly: options.ownerOnly !== false });
    const used = instances.length;
    const config = selectedProfileConfig({ profile, config_profile: profile });
    const max = maxInstancesValue(config.enrollment_limit ?? config.max_templates);
    return { profile, used, max, remaining: Math.max(0, max - used), reached: used >= max, instances };
  }

  async function currentEnrollmentUsage(req, profile, options = {}) {
    if (profile) return currentProfileEnrollmentUsage(req, profile, options);

    const profiles = visibleProfileNames();
    if (!profiles.length) {
      return {
        profile: "",
        profiles: [],
        used: 0,
        max: 0,
        remaining: 0,
        reached: false,
        instances: [],
      };
    }
    if (profiles.length === 1) return currentProfileEnrollmentUsage(req, profiles[0], options);

    const usages = await Promise.all(profiles.map((name) => currentProfileEnrollmentUsage(req, name, options)));
    const instances = usages.flatMap((usage) => usage.instances);
    const used = usages.reduce((total, usage) => total + Number(usage.used), 0);
    const max = usages.reduce((total, usage) => total + Number(usage.max), 0);
    return {
      profile: "",
      profiles,
      used,
      max,
      remaining: Math.max(0, max - used),
      reached: max > 0 && used >= max,
      instances,
    };
  }

  function normalizedEnrollImageName(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) return "";

    const withoutDigest = raw.split("@")[0];
    const slashIndex = withoutDigest.lastIndexOf("/");
    const colonIndex = withoutDigest.lastIndexOf(":");
    if (colonIndex > slashIndex) return withoutDigest.slice(0, colonIndex);
    return withoutDigest;
  }

  function imageTagFromRef(value) {
    const raw = String(value || "").trim();
    const withoutDigest = raw.split("@")[0];
    const slashIndex = withoutDigest.lastIndexOf("/");
    const colonIndex = withoutDigest.lastIndexOf(":");
    return colonIndex > slashIndex ? withoutDigest.slice(colonIndex + 1).trim() : "";
  }

  function enrollImageTokens(value) {
    const normalized = normalizedEnrollImageName(value);
    if (!normalized) return new Set();
    const parts = normalized.split("/").filter(Boolean);
    return new Set([normalized, parts.at(-1)].filter(Boolean));
  }

  function enrollImageMatches(candidate, blocked) {
    const candidateTokens = enrollImageTokens(candidate);
    return [...enrollImageTokens(blocked)].some((token) => candidateTokens.has(token));
  }

  function configuredEnrollmentImageBlock(image) {
    return blockedEnrollmentImages.find((blocked) => enrollImageMatches(image, blocked)) || "";
  }

  async function validateEnrollmentTemplate(req, res, profile = "", data = {}) {
    const templateKey = templateNameFromEnrollmentData(data).toLowerCase();
    const otherProfiles = templateKey ? visibleProfileNames().filter((name) => name !== String(profile || "")) : [];
    for (const otherProfile of otherProfiles) {
      const templates = await templatesForRequest(req, otherProfile);
      const taken = Object.keys(plainObject(templates)).find((name) => name.toLowerCase() === templateKey);
      if (taken) {
        res.status(409).json({ code: "template_name_taken", detail: `Template "${taken}" already exists in profile "${otherProfile}".`, template: taken, profile: otherProfile });
        return false;
      }
    }

    const image = normalizedEnrollImageName(data.image);
    if (!image) return true;

    const version = String(data.version || imageTagFromRef(data.image) || "").trim();
    if (!version) {
      res.status(400).json({ code: "image_version_required", detail: "Enrollment image version is required.", image });
      return false;
    }
    if (version.toLowerCase() === "latest") {
      res.status(400).json({ code: "image_version_latest_not_allowed", detail: "Enrollment image version cannot be latest.", image, version });
      return false;
    }

    const blocked = configuredEnrollmentImageBlock(image);
    if (blocked) {
      res.status(403).json({ code: "image_not_enrollable", detail: `Image "${image}" is not enrollable for this config.`, image, blocked_image: blocked });
      return false;
    }

    const existingEntries = await enrollmentTemplatesForRequest(req, profile, { ownerOnly: false });
    const duplicate = existingEntries.find((entry) => normalizedEnrollImageName(entry?.image) === image);
    if (duplicate) {
      res.status(409).json({ code: "template_already_enrolled", detail: `Image "${image}" is already enrolled for this config.`, image, existing_template: duplicate.instance || "" });
      return false;
    }

    return true;
  }

  async function enrollmentTemplatesForUser(req, profile) {
    return enrollmentTemplatesForRequest(req, profile, { ownerOnly: true });
  }

  async function enrollmentTemplatesForRequest(req, profile, options = {}) {
    const user = authUserFromRequest(req);
    const creator = String(user.email || user.user || "").trim().toLowerCase();
    const ownerOnly = options.ownerOnly !== false;
    if (!creator && ownerOnly) return [];

    const state = readState();
    const useNetBox = profileUsesNetBoxTemplates(profile);
    const localTemplates = useNetBox ? [] : localEnrollmentTemplatesForUser(state, creator, { ownerOnly });
    const netboxTemplates = (await netboxTemplateEntriesForUser(req, profile, state, creator, { ownerOnly }))
      .map((entry) => enrollmentTemplateItem(entry, state, "netbox-template", profile));
    const merged = new Map();

    netboxTemplates.forEach((template) => merged.set(template.instance.toLowerCase(), template));
    localTemplates.forEach((template) => {
      if (!merged.has(template.instance.toLowerCase())) merged.set(template.instance.toLowerCase(), template);
    });

    return [...merged.values()];
  }

  async function netboxTemplateEntriesForUser(req, profile, state, creator, options = {}) {
    const config = selectedProfileConfig({ profile, config_profile: profile });
    if (!config.netbox || !config.token) return [];
    try {
      const templates = await templatesForRequest(req, profile);
      return Object.entries(plainObject(templates))
        .map(([name, template]) => ({ name, template: plainObject(template) }))
        .filter(({ template }) => options.ownerOnly === false || String(template.creator_email || "").trim().toLowerCase() === creator)
        .filter(({ template }) => String(template.config_profile || template.profile || profile || "") === String(profile || ""))
        .filter(({ name }) => name)
        .map(({ name, template }) => ({ name, template, state }));
    } catch (error) {
      logLine(`ENROLL : NetBox template discovery failed ${error.message || "unknown error"}`);
      return [];
    }
  }

  function localEnrollmentTemplatesForUser(state, creator, options = {}) {
    return Object.entries(plainObject(state.templates))
      .map(([name, template]) => ({ name, template: plainObject(template) }))
      .filter(({ template }) => options.ownerOnly === false || String(template.creator_email || "").trim().toLowerCase() === creator)
      .map((entry) => enrollmentTemplateItem(entry, state, "template"))
      .filter((item) => item.instance);
  }

  function enrollmentTemplateItem({ name, template }, state, source, profile = "") {
    template = plainObject(template);
    const discoveredCount = Number(template.instance_count || 0);
    const itemProfile = String(template.config_profile || template.profile || profile || "").trim();
    return {
      instance: name,
      dns_name: "",
      image: template.image || "",
      version: template.version || "",
      profile: itemProfile,
      config_profile: itemProfile,
      registry_webhook_secret: template.registry_webhook_secret || template.dockerhub_webhook_secret || "",
      status: template.status || "ready",
      source,
      instance_count: Math.max(discoveredCount, orderInstanceCountForTemplate(state, name)),
    };
  }

  function templateNameFromEnrollmentData(data) {
    const explicit = String(data.order_template || data.template_name || "").trim();
    if (explicit) return explicit;
    const imageName = imageNameFromRef(data.image || "");
    const parts = imageName.split("/").filter(Boolean);
    return (parts.at(-1) || imageName || String(data.instance || "").trim()).trim();
  }

  async function enrollmentTemplateDeleteUsage(req, profile, templateName, ownerEmail) {
    const requestedName = String(templateName || "").trim().toLowerCase();
    const requestedOwner = String(ownerEmail || "").trim().toLowerCase();
    const usage = { owned: 0, blocked: 0, total: 0 };
    if (!requestedName) return usage;

    const config = selectedProfileConfig({ profile, config_profile: profile });
    if (!config.netbox || !config.token) return usage;

    try {
      const client = new NetBoxClient(config);
      const hostFilter = await hostIdQuery(client, config.tag);
      if (hostFilter.host_id === "__none__") return usage;

      const entry = await templateEntryForRequest(req, profile, templateName);
      const template = plainObject(entry?.template);
      const templateKey = imageKeyFromRefAndVersion(template?.image, template?.version);
      const templateImageName = imageNameKey(template?.image);
      const ownerEnvNameValue = ownerEnvVarName(config);
      const containers = await client.list("/api/plugins/docker/containers/", { limit: 1000, ...hostFilter });

      containers.forEach((container) => {
        const labels = labelMapFromContainer(container);
        const labelTemplateName = String(templateLabelValue(labels, "name") || templateLabelValue(labels, "template") || "").trim().toLowerCase();
        const containerKey = imageKeyFromImageObject(container?.image)
          || imageKeyFromRefAndVersion(container?.image_name || container?.image_display, container?.image_version || container?.image_tag);
        const containerImageName = imageNameKeyFromImageObject(container?.image)
          || imageNameKey(container?.image_name || container?.image_display);
        const matchesTemplate = labelTemplateName === requestedName
          || (templateKey && containerKey === templateKey)
          || (templateImageName && containerImageName === templateImageName);
        if (!matchesTemplate) return;

        const containerOwner = String(templateLabelValue(labels, "owner") || templateLabelValue(labels, "creator") || containerEnvValue(container, ownerEnvNameValue)).trim().toLowerCase();
        usage.total += 1;
        if (containerOwner && containerOwner === requestedOwner) usage.owned += 1;
        else usage.blocked += 1;
      });
    } catch (error) {
      logLine(`ENROLL : template delete usage check failed ${error.message || "unknown error"}`);
      usage.blocked += 1;
      usage.total += 1;
    }

    return usage;
  }

  function enrollmentTemplateFromData(data, existing = {}, profile = "", creatorEmail = "") {
    const requestedEnabled = data.saashup_enabled;
    return {
      ...existing,
      config_profile: profile || data.config_profile || data.profile || existing.config_profile || existing.profile || "",
      instance: data.instance || existing.instance || "",
      dns_name: data.dns_name || existing.dns_name || "",
      image: data.image || existing.image || "",
      version: data.version || existing.version || "",
      max_instances: maxInstancesValue(data.max_instances ?? existing.max_instances),
      images_to_keep: imagesToKeepValue(data.images_to_keep ?? existing.images_to_keep),
      registry_webhook_secret: data.registry_webhook_secret || data.dockerhub_webhook_secret || existing.registry_webhook_secret || existing.dockerhub_webhook_secret || "",
      network: data.network || existing.network || "",
      log_driver: data.log_driver || existing.log_driver || "",
      log_driver_options: plainJsonObject(data.log_driver_options || existing.log_driver_options),
      traefik: data.traefik ?? existing.traefik ?? true,
      all_hosts: data.all_hosts ?? existing.all_hosts ?? false,
      saashup_enabled: requestedEnabled === false || requestedEnabled === "false" ? false : (existing.saashup_enabled ?? true),
      creator_email: existing.creator_email || creatorEmail,
      env: asArray(data.var_env_key).map((key, index) => ({ key, value: asArray(data.var_env_value)[index] || "" })).filter((item) => item.key),
      labels: asArray(data.label_key).map((key, index) => ({ key, value: asArray(data.label_value)[index] || "" })).filter((item) => item.key),
      ports: asArray(data.port_value).filter(Boolean).map((value) => ({ value })),
    };
  }

  function workflowsWithEnrollmentTemplate(workflows, profile, templateName, template) {
    const workflowKey = profile ? `${profile}::templates` : "templates";
    const existingWorkflow = plainObject(workflows[workflowKey]);
    const existingSteps = Array.isArray(existingWorkflow.steps) ? existingWorkflow.steps : [];
    const stepExists = existingSteps.some((step) => String((typeof step === "string" ? step : step?.template) || "").trim().toLowerCase() === templateName.toLowerCase());
    const steps = stepExists
      ? existingSteps.map((step) => {
        if (String((typeof step === "string" ? step : step?.template) || "").trim().toLowerCase() !== templateName.toLowerCase()) return step;
        return typeof step === "string"
          ? { template: templateName, template_data: { ...template, saashup_enabled: true }, enabled: true }
          : { ...plainObject(step), template: templateName, template_data: { ...plainObject(step.template_data), ...template, saashup_enabled: true }, enabled: step.enabled !== false };
      })
      : [...existingSteps, { template: templateName, template_data: { ...template, saashup_enabled: true }, enabled: true }];

    return {
      ...plainObject(workflows),
      [workflowKey]: {
        name: existingWorkflow.name || "templates",
        config_profile: existingWorkflow.config_profile || profile || "",
        ...existingWorkflow,
        steps,
      },
    };
  }

  async function recordEnrollment(req, profile, data) {
    const user = authUserFromRequest(req);
    const creatorEmail = String(user.email || user.user || "").trim();
    const templateName = templateNameFromEnrollmentData(data);
    const useNetBox = profileUsesNetBoxTemplates(profile);

    if (templateName && useNetBox) {
      const templates = await templatesForRequest(req, profile);
      const existing = plainObject(templates[templateName]);
      const nextTemplate = { ...enrollmentTemplateFromData(data, existing, profile, creatorEmail), status: "creating" };
      const nextTemplates = {
        ...templates,
        [templateName]: nextTemplate,
      };
      const nextWorkflows = workflowsWithEnrollmentTemplate(await workflowsForRequest(req, profile), profile, templateName, nextTemplate);
      const syncResult = await syncTemplatesToNetBoxConfigContext(req, profile, nextTemplates, nextWorkflows);
      logLine(`ENROLL : template ${templateName} synced to config context ${syncResult?.name || ""} action=${syncResult?.action || "none"}`);
    }

    if (templateName && !useNetBox) {
      writeState((state) => {
        state.templates = plainObject(state.templates);
        const existing = plainObject(state.templates[templateName]);
        state.templates[templateName] = { ...enrollmentTemplateFromData(data, existing, profile, creatorEmail), status: "creating" };
        return state;
      });
    }
  }

  async function updateEnrollmentInstanceStatus(req, profile, templateName, status) {
    const name = String(templateName || "").trim();
    if (!name) return;

    const useNetBox = profileUsesNetBoxTemplates(profile);
    if (useNetBox) {
      const templates = await templatesForRequest(req, profile);
      const existingName = Object.keys(templates).find((item) => item.toLowerCase() === name.toLowerCase()) || name;
      const existing = plainObject(templates[existingName]);
      if (!Object.keys(existing).length) return;
      const nextTemplates = {
        ...templates,
        [existingName]: { ...existing, status },
      };
      const nextWorkflows = workflowsWithEnrollmentTemplate(await workflowsForRequest(req, profile), profile, existingName, nextTemplates[existingName]);
      const syncResult = await syncTemplatesToNetBoxConfigContext(req, profile, nextTemplates, nextWorkflows);
      logLine(`ENROLL : template ${existingName} status ${status} synced to config context ${syncResult?.name || ""} action=${syncResult?.action || "none"}`);
      return;
    }

    writeState((state) => {
      state.templates = plainObject(state.templates);
      const existingName = Object.keys(state.templates).find((item) => item.toLowerCase() === name.toLowerCase()) || name;
      const existing = plainObject(state.templates[existingName]);
      if (Object.keys(existing).length) state.templates[existingName] = { ...existing, status };
      return state;
    });
  }

  return {
      currentEnrollmentUsage,
      enrollmentTemplateDeleteUsage,
      recordEnrollment,
      templateNameFromEnrollmentData,
      updateEnrollmentInstanceStatus,
      validateEnrollmentTemplate,
      normalizedEnrollImageName,
      imageTagFromRef,
      enrollImageTokens,
      enrollImageMatches,
      configuredEnrollmentImageBlock,
      enrollmentTemplatesForUser,
      enrollmentTemplatesForRequest,
      enrollmentTemplateFromData,
      workflowsWithEnrollmentTemplate,
    };
  }
function registerEnrollRoutes(app, {
  currentEnrollmentUsage,
}) {
  app.get("/enroll/limit", async (req, res) => {
    const ownerOnly = req.query.owner_only === "false" || req.query.all === "true" ? false : true;
    res.json(await currentEnrollmentUsage(req, req.query.profile || req.query.config_profile || "", { ownerOnly }));
  });
}

module.exports = { createEnrollHelpers, registerEnrollRoutes };
