const { creationProgressFor } = require("../lib/creation-progress");

function createOrderHelpers({
  authUserFromRequest,
  containerEnvValue,
  hostIdQuery,
  imagePartsFromContainer,
  isContainerStopped,
  isReadyContainer,
  labelMapFromContainer,
  logLine,
  maxInstancesValue,
  NetBoxClient,
  orderTemplateEnabled,
  ownerEnvVarName,
  plainObject,
  selectedProfileConfig,
  templateEntryForRequest,
  templateLabelValue,
  userMaxInstancesOverride = () => null,
  visibleProfileNames = () => [],
  valueText,
}) {
  function orderInstanceStatus(container) {
    if (isReadyContainer(container)) return "ready";
    if (isContainerStopped(container)) return "failed";
    return "creating";
  }

  function orderLabelValue(labels, key) {
    return templateLabelValue(labels, key) || labels[String(key || "").toLowerCase()] || "";
  }

  function orderInstanceFromContainer(container, labels, ownerEnvNameValue, profile) {
    const labelOwnerEnvName = orderLabelValue(labels, "owner_env_var") || ownerEnvNameValue;
    const owner = String(orderLabelValue(labels, "owner") || orderLabelValue(labels, "creator") || containerEnvValue(container, labelOwnerEnvName)).trim().toLowerCase();
    const { image, version } = imagePartsFromContainer(container, labels);
    const name = orderLabelValue(labels, "dns_name") || valueText(container.display || container.name || container.id);
    return {
      instance: name,
      dns_name: name,
      template: orderLabelValue(labels, "name") || orderLabelValue(labels, "template") || "",
      image,
      version,
      status: orderInstanceStatus(container),
      profile,
      owner,
      source: "netbox-label",
    };
  }

  async function orderInstancesForUser(req, profile, requestedTemplate = "") {
    const creator = String(authUserFromRequest(req).email || authUserFromRequest(req).user || "").trim().toLowerCase();
    if (!creator) return [];

    const config = selectedProfileConfig({ profile, config_profile: profile });
    if (!config.netbox || !config.token) return [];

    try {
      const client = new NetBoxClient(config);
      const hostFilter = await hostIdQuery(client, config.tag);
      if (hostFilter.host_id === "__none__") return [];

      const requested = String(requestedTemplate || "").trim().toLowerCase();
      const ownerEnvNameValue = ownerEnvVarName(config);
      const containers = await client.list("/api/plugins/docker/containers/", { limit: 1000, ...hostFilter });
      return containers
        .map((container) => {
          const labels = labelMapFromContainer(container);
          return orderInstanceFromContainer(container, labels, ownerEnvNameValue, profile);
        })
        .filter((item) => item.owner === creator)
        .filter((item) => item.template || !requested)
        .filter((item) => !requested || String(item.template).trim().toLowerCase() === requested)
        .map(({ owner, ...item }) => item)
        .sort((left, right) => String(left.instance).localeCompare(String(right.instance)));
    } catch (error) {
      logLine(`ORDER : NetBox label discovery failed ${error.message || "unknown error"}`);
      return [];
    }
  }

  async function currentProfileUsage(req, profile) {
    const body = plainObject(req.body);
    const requestedTemplate = String(req.query.template || body.order_template || "").trim();
    const template = plainObject((await templateEntryForRequest(req, profile, requestedTemplate))?.template);
    const creator = String(authUserFromRequest(req).email || authUserFromRequest(req).user || "").trim().toLowerCase();
    const userOverride = creator && requestedTemplate ? userMaxInstancesOverride(creator, requestedTemplate) : null;
    const max = userOverride !== null && userOverride !== undefined
      ? userOverride
      : maxInstancesValue(template.max_instances ?? body.max_instances ?? 1);
    const visibleInstances = await orderInstancesForUser(req, profile, requestedTemplate);
    const used = visibleInstances.length;
    return {
      profile,
      template: requestedTemplate,
      used,
      total_used: visibleInstances.length || used,
      max,
      remaining: Math.max(0, max - used),
      reached: used >= max,
      instances: visibleInstances,
    };
  }

  async function currentUsage(req, profile) {
    if (profile) return currentProfileUsage(req, profile);

    const profiles = visibleProfileNames();
    const requestedTemplate = String(req.query.template || plainObject(req.body).order_template || "").trim();
    if (!profiles.length) {
      return {
        profile: "",
        profiles: [],
        template: requestedTemplate,
        used: 0,
        total_used: 0,
        max: 0,
        remaining: 0,
        reached: false,
        instances: [],
      };
    }

    const usages = await Promise.all(profiles.map((name) => currentProfileUsage(req, name)));
    const instances = usages.flatMap((usage) => usage.instances);
    const used = usages.reduce((total, usage) => total + Number(usage.used), 0);
    const max = usages.reduce((total, usage) => total + Number(usage.max), 0);
    if (profiles.length === 1) return usages[0];
    return {
      profile: "",
      profiles,
      template: requestedTemplate,
      used,
      total_used: used,
      max,
      remaining: Math.max(0, max - used),
      reached: max > 0 && used >= max,
      instances,
    };
  }

  async function validateOrderTemplate(req, res, profile = "") {
    const requestedName = String(req.body.order_template || "").trim();
    if (!requestedName) return true;

    const entry = await templateEntryForRequest(req, profile, requestedName);
    if (!entry) {
      return true;
    }

    if (!orderTemplateEnabled(entry.template.saashup_enabled, true)) {
      res.status(403).json({ code: "template_disabled", detail: `Template "${entry.name}" is disabled for orders` });
      return false;
    }

    return true;
  }

  return {
    currentUsage,
    validateOrderTemplate,
  };
}

function registerOrderRoutes(app, {
  currentUsage,
}) {
  app.get("/order/limit", async (req, res) => {
    const usage = await currentUsage(req, req.query.profile || req.query.config_profile || "");
    usage.instances = (usage.instances || []).map((item) => {
      const progress = creationProgressFor(item.dns_name || item.instance);
      return progress ? { ...item, progress } : item;
    });
    const pending = String(req.query.pending || "").trim();
    if (pending) {
      const pendingProgress = creationProgressFor(pending);
      if (pendingProgress) usage.pending_progress = pendingProgress;
    }
    res.json(usage);
  });
}

module.exports = { createOrderHelpers, registerOrderRoutes };
