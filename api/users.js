function createUsersHelpers({
  containerEnvValue,
  dockerHosts,
  hostIdQuery,
  imageNameFromRef,
  imagePartsFromContainer,
  labelMapFromContainer,
  logLine,
  NetBoxClient,
  ownerEnvVarName,
  parseProfiles,
  plainObject,
  readState,
  selectedProfileConfig,
  templateLabelValue = (labels, key) => labels[String(key || "").toLowerCase()] || "",
  visibleProfileNames = () => [],
  writeState,
}) {
  function userLimitValue(value) {
    const number = Math.floor(Number(value));
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, number);
  }

  function normalizedEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizedTemplateKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function storedUserLimits(state) {
    return plainObject((state || readState()).users);
  }

  function userMaxInstancesOverride(email, templateName) {
    const emailKey = normalizedEmail(email);
    const templateKey = normalizedTemplateKey(templateName);
    if (!emailKey || !templateKey) return null;
    const templates = plainObject(plainObject(storedUserLimits()[emailKey]).templates);
    const value = templates[templateKey];
    if (value === undefined || value === null || value === "") return null;
    return userLimitValue(value);
  }

  // Containers created outside the order/enroll flow (eg. the admin "Create" form) never get a
  // saashup.template.* label, so fall back to matching their image:version against the template catalog.
  function catalogImageKey(image, version) {
    const name = imageNameFromRef(image || "");
    const versionText = String(version || "").trim();
    return name && versionText ? `${name}\u0000${versionText}` : "";
  }

  function templateCatalogIndex(templates) {
    const index = new Map();
    Object.entries(plainObject(templates)).forEach(([name, template]) => {
      const entry = plainObject(template);
      const key = catalogImageKey(entry.image, entry.version);
      if (key && !index.has(key)) index.set(key, name);
    });
    return index;
  }

  function templateDefaultLimitIndex(templates) {
    const index = new Map();
    Object.entries(plainObject(templates)).forEach(([name, template]) => {
      const entry = plainObject(template);
      index.set(normalizedTemplateKey(name), userLimitValue(entry.max_instances ?? 1));
    });
    return index;
  }

  function templateForContainer(container, labels, catalogIndex) {
    const labelName = templateLabelValue(labels, "name") || templateLabelValue(labels, "template");
    if (labelName) return { name: String(labelName).trim(), limitable: true };

    const { image, version } = imagePartsFromContainer(container, labels);
    const matched = catalogIndex.get(catalogImageKey(image, version));
    if (matched) return { name: matched, limitable: true };

    const fallback = [imageNameFromRef(image), version].filter(Boolean).join(":");
    return { name: fallback || "Unassigned", limitable: false };
  }

  async function ownersForProfile(name, config, catalogIndex) {
    if (!config.netbox || !config.token) return [];

    const client = new NetBoxClient(config);
    const hosts = await dockerHosts(client, config.tag);
    if (!hosts.length) return [];

    const hostFilter = await hostIdQuery(client, config.tag);
    if (hostFilter.host_id === "__none__") return [];

    const containers = await client.list("/api/plugins/docker/containers/", { limit: 1000, ...hostFilter });
    const ownerEnvName = ownerEnvVarName(config);
    const owners = new Map();
    containers.forEach((container) => {
      const labels = labelMapFromContainer(container);
      const owner = normalizedEmail(labels.owner || labels.creator || containerEnvValue(container, ownerEnvName));
      if (!owner) return;

      const { name: templateName, limitable } = templateForContainer(container, labels, catalogIndex);
      const templateKey = normalizedTemplateKey(templateName);
      if (!owners.has(owner)) owners.set(owner, { user: owner, templates: new Map() });
      const entry = owners.get(owner);
      if (!entry.templates.has(templateKey)) {
        entry.templates.set(templateKey, { template: templateName, limitable, instances: 0, profiles: new Set() });
      }
      const templateEntry = entry.templates.get(templateKey);
      templateEntry.instances += 1;
      templateEntry.profiles.add(name || "default");
    });
    return [...owners.values()];
  }

  async function listUsers(req, res) {
    try {
      const state = readState();
      const config = plainObject(state.config);
      const profiles = parseProfiles(config.profiles);
      const names = visibleProfileNames().length ? visibleProfileNames() : Object.keys(profiles);
      const catalogIndex = templateCatalogIndex(state.templates);
      const defaultLimitIndex = templateDefaultLimitIndex(state.templates);
      const ownersByUser = new Map();

      for (const name of names) {
        const profileConfig = selectedProfileConfig({ profile: name, config_profile: name });
        const owners = await ownersForProfile(name, profileConfig, catalogIndex);
        owners.forEach((owner) => {
          if (!ownersByUser.has(owner.user)) ownersByUser.set(owner.user, { user: owner.user, templates: new Map() });
          const entry = ownersByUser.get(owner.user);
          owner.templates.forEach((templateEntry, templateKey) => {
            if (!entry.templates.has(templateKey)) {
              entry.templates.set(templateKey, { template: templateEntry.template, limitable: templateEntry.limitable, instances: 0, profiles: new Set() });
            }
            const merged = entry.templates.get(templateKey);
            merged.instances += templateEntry.instances;
            templateEntry.profiles.forEach((profileName) => merged.profiles.add(profileName));
          });
        });
      }

      Object.entries(storedUserLimits(state)).forEach(([email, limits]) => {
        if (!ownersByUser.has(email)) ownersByUser.set(email, { user: email, templates: new Map() });
        const entry = ownersByUser.get(email);
        Object.keys(plainObject(plainObject(limits).templates)).forEach((templateKey) => {
          if (!entry.templates.has(templateKey)) {
            entry.templates.set(templateKey, { template: templateKey, limitable: true, instances: 0, profiles: new Set() });
          }
        });
      });

      const rows = [];
      [...ownersByUser.values()]
        .sort((left, right) => left.user.localeCompare(right.user))
        .forEach((entry) => {
          [...entry.templates.entries()]
            .sort((left, right) => left[1].template.localeCompare(right[1].template))
            .forEach(([templateKey, templateEntry]) => {
              rows.push({
                user: entry.user,
                profiles: [...templateEntry.profiles].sort((left, right) => left.localeCompare(right)),
                template: templateEntry.template,
                instances: templateEntry.instances,
                limitable: templateEntry.limitable,
                max_instances: templateEntry.limitable ? userMaxInstancesOverride(entry.user, templateKey) : null,
                template_default_max_instances: templateEntry.limitable ? defaultLimitIndex.get(templateKey) ?? null : null,
              });
            });
        });

      res.json({ users: rows });
    } catch (error) {
      logLine(`USERS : list failed ${error.message || "unknown error"}`);
      res.status(error.statusCode || 502).json({ detail: error.message });
    }
  }

  function applyUserLimit(email, templateName, rawValue) {
    const templateKey = normalizedTemplateKey(templateName);
    const hasValue = rawValue !== undefined && rawValue !== null && String(rawValue).trim() !== "";
    const value = hasValue ? userLimitValue(rawValue) : null;

    writeState((state) => {
      const users = plainObject(state.users);
      const templates = plainObject(plainObject(users[email]).templates);
      if (hasValue) templates[templateKey] = value;
      else delete templates[templateKey];

      if (Object.keys(templates).length) users[email] = { templates };
      else delete users[email];

      state.users = users;
      return state;
    });

    logLine(`USERS : ${email} limit for ${templateKey} ${hasValue ? `set to ${value}` : "cleared"}`);
    return value;
  }

  function setUserLimit(req, res) {
    const email = normalizedEmail(req.params.email);
    const template = String(req.params.template || "").trim();
    if (!email || !template) {
      res.status(400).json({ error: "email and template are required" });
      return;
    }

    const value = applyUserLimit(email, template, plainObject(req.body).max_instances);
    res.json({ user: email, template, max_instances: value });
  }

  function clearUserLimit(req, res) {
    const email = normalizedEmail(req.params.email);
    const template = String(req.params.template || "").trim();
    if (!email || !template) {
      res.status(400).json({ error: "email and template are required" });
      return;
    }

    applyUserLimit(email, template, null);
    res.json({ user: email, template, max_instances: null });
  }

  return { listUsers, setUserLimit, clearUserLimit, userMaxInstancesOverride };
}

function registerUsersRoutes(app, { listUsers, setUserLimit, clearUserLimit, requireAdmin }) {
  app.get("/admin/users", requireAdmin, listUsers);
  app.put("/admin/users/:email/templates/:template/limit", requireAdmin, setUserLimit);
  app.delete("/admin/users/:email/templates/:template/limit", requireAdmin, clearUserLimit);
}

module.exports = { createUsersHelpers, registerUsersRoutes };
