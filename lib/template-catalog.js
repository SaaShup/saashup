const crypto = require("crypto");

function createTemplateCatalogHelpers({
  imagesToKeepValue,
  maxInstancesValue,
  orderInstanceCountForTemplate,
  orderTemplateEnabled,
  plainObject,
}) {
  function normalizedCatalogNetBoxUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "").toLowerCase();
  }

  function templateCatalogScope(profile, config = {}) {
    const scope = {
      profile: String(profile || "").trim(),
      netbox: normalizedCatalogNetBoxUrl(config.netbox),
      tag: String(config.tag || "").trim(),
    };
    return {
      ...scope,
      key: crypto.createHash("sha1").update(`${scope.profile}\n${scope.netbox}\n${scope.tag}`).digest("hex").slice(0, 12),
    };
  }

  function templateCatalogContextName(profile, config = {}) {
    const scope = templateCatalogScope(profile, config);
    const profilePart = String(profile || "default").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "default";
    return `saashup-template-catalog-${profilePart}-${scope.key}`;
  }

  const templateCatalogReservedKeys = new Set([
    "config",
    "config_profile",
    "creator_email",
    "instance_count",
    "profile",
    "saashup_enabled",
    "saashup_template_catalog",
    "saashup_templates",
    "saashup_workflows",
    "templates",
    "workflows",
  ]);

  function looksLikeWorkflowDefinition(value) {
    const entry = plainObject(value);
    return Array.isArray(entry.steps) || Object.hasOwn(entry, "delete_volumes");
  }

  function plainJsonObject(value) {
    if (typeof value !== "string") return plainObject(value);
    try {
      return plainObject(JSON.parse(value));
    } catch {
      return {};
    }
  }

  function looksLikeTemplateDefinition(name, value) {
    if (templateCatalogReservedKeys.has(String(name || "").trim().toLowerCase())) return false;
    const entry = plainObject(value);
    if (!Object.keys(entry).length || looksLikeWorkflowDefinition(entry)) return false;

    const templateKeys = ["image", "template_url", "saashup_template_url", "version", "network", "log_driver", "log_driver_options", "log_options", "logging_options", "ports", "labels", "env", "binds", "volumes", "dns_name", "traefik", "instance", "port_value"];
    return templateKeys.some((key) => Object.hasOwn(entry, key));
  }

  function configContextCatalogData(context) {
    const data = plainObject(context?.data);
    const hasCatalogData = (
      data.saashup_template_catalog === true ||
      Object.hasOwn(data, "saashup_templates") ||
      Object.hasOwn(data, "templates") ||
      Object.hasOwn(data, "saashup_workflows") ||
      Object.hasOwn(data, "workflows")
    );
    return hasCatalogData ? data : {};
  }

  function configContextMatchesCatalogScope(data, scope) {
    if (!Object.keys(data).length) return false;

    const contextScope = String(data.saashup_scope || data.scope || "").trim();
    const contextProfile = String(data.saashup_profile || data.profile || "").trim();
    const contextNetbox = normalizedCatalogNetBoxUrl(data.saashup_netbox_url || data.netbox_url || data.netbox);
    const contextTag = String(data.saashup_tag || data.tag || "").trim();
    const contextProfileKey = contextProfile.toLowerCase();
    const scopeProfileKey = String(scope.profile || "").trim().toLowerCase();
    const contextTagKey = contextTag.toLowerCase();
    const scopeTagKey = String(scope.tag || "").trim().toLowerCase();
    if (contextScope && contextScope !== scope.key && !contextProfile && !contextNetbox && !contextTag) return false;
    if (contextProfile && contextProfileKey !== scopeProfileKey) return false;
    if (contextNetbox && contextNetbox !== scope.netbox) return false;
    if (contextTag && contextTagKey !== scopeTagKey) return false;
    return true;
  }

  function configContextTemplateDefinitions(data) {
    const direct = plainObject(data.saashup_templates || data.templates);
    return Object.hasOwn(direct, "templates") ? plainObject(direct.templates) : direct;
  }

  function configContextWorkflowDefinitions(data) {
    const direct = plainObject(data.saashup_workflows || data.workflows);
    if (Object.keys(direct).length) return direct;

    const nestedTemplates = plainObject(data.saashup_templates || data.templates);
    return plainObject(nestedTemplates.workflows);
  }

  function workflowEntriesFromTemplates(data, profile) {
    const steps = Object.entries(configContextTemplateDefinitions(data))
      .filter(([name, template]) => looksLikeTemplateDefinition(name, template))
      .map(([name]) => ({ template: name, enabled: true }));
    if (!steps.length) return [];

    const workflowName = "templates";
    const key = profile ? `${profile}::${workflowName}` : workflowName;
    return [{
      name: key,
      workflow: {
        name: workflowName,
        config_profile: profile || "",
        steps,
        source: "netbox-config-context",
      },
    }];
  }

  function templateEntriesFromConfigContext(context, profile, scope, state) {
    const data = configContextCatalogData(context);
    if (!configContextMatchesCatalogScope(data, scope)) return [];
    const contextOwner = String(data.saashup_owner || data.creator_email || data.owner || "").trim();

    return Object.entries(configContextTemplateDefinitions(data))
      .filter(([name, template]) => looksLikeTemplateDefinition(name, template))
      .map(([name, template]) => {
        const entry = plainObject(template);
        return {
          name,
          template: {
            ...entry,
            config_profile: entry.config_profile || profile,
            source: "netbox-config-context",
            creator_email: entry.creator_email || contextOwner,
            saashup_enabled: orderTemplateEnabled(entry.saashup_enabled, true),
            max_instances: maxInstancesValue(entry.max_instances ?? 1),
            images_to_keep: imagesToKeepValue(entry.images_to_keep),
            instance_count: orderInstanceCountForTemplate(state, name),
          },
        };
      })
      .filter((entry) => entry.name);
  }

  function workflowEntriesFromConfigContext(context, profile, scope) {
    const data = configContextCatalogData(context);
    if (!configContextMatchesCatalogScope(data, scope)) return [];

    const workflowEntries = Object.entries(configContextWorkflowDefinitions(data))
      .filter(([, workflow]) => looksLikeWorkflowDefinition(workflow))
      .map(([name, workflow]) => ({
        name,
        workflow: {
          ...plainObject(workflow),
          config_profile: plainObject(workflow).config_profile || profile,
          source: "netbox-config-context",
        },
      }))
      .filter((entry) => entry.name);
    return workflowEntries.length ? workflowEntries : workflowEntriesFromTemplates(data, profile);
  }

  function templatesWithCreatorEmails(templates, existingTemplates, creatorEmail) {
    const email = String(creatorEmail || "").trim();
    return Object.fromEntries(
      Object.entries(plainObject(templates)).map(([name, template]) => {
        const entry = plainObject(template);
        const existing = plainObject(existingTemplates[name]);
        const creator_email = String(Object.hasOwn(entry, "creator_email") ? entry.creator_email : (existing.creator_email || email || "")).trim();
        return [
          name,
          creator_email ? { ...entry, creator_email } : entry,
        ];
      }),
    );
  }

  function profilesWithSingleDefault(profiles) {
    const entries = Object.entries(plainObject(profiles));
    return Object.fromEntries(entries.map(([name, profile]) => {
      const entry = plainObject(profile);
      if (entry.saashup_visible !== true && entry.saashup_default === true) entry.saashup_visible = true;
      delete entry.saashup_default;
      if (entry.saashup_visible !== true) delete entry.saashup_visible;
      return [name, entry];
    }));
  }

  return {
    configContextCatalogData,
    configContextMatchesCatalogScope,
    configContextTemplateDefinitions,
    configContextWorkflowDefinitions,
    plainJsonObject,
    profilesWithSingleDefault,
    templateCatalogContextName,
    templateCatalogScope,
    templateEntriesFromConfigContext,
    templatesWithCreatorEmails,
    workflowEntriesFromConfigContext,
  };
}

module.exports = { createTemplateCatalogHelpers };
