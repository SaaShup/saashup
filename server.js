const path = require("path");
const fs = require("fs");
const express = require("express");
const { fetch: undiciFetch } = require("undici");
const packageJson = require("./package.json");
const { loadEnv } = require("./lib/env");
const { registerConfigRoutes } = require("./api/config");
const { createCreateHelpers } = require("./api/create");
const { createEnrollHelpers, registerEnrollRoutes } = require("./api/enroll");
const { registerMetricsMiddleware, registerMetricsRoutes } = require("./api/metrics");
const { registerNetBoxRoutes } = require("./api/netbox");
const { registerOperationRoutes } = require("./api/operations");
const { createOrderHelpers, registerOrderRoutes } = require("./api/order");
const { registerRegistryWebhookRoutes } = require("./api/registry-webhooks");
const { createReportHandlers } = require("./api/reports");
const { registerSystemRoutes } = require("./api/system");
const { createUsersHelpers, registerUsersRoutes } = require("./api/users");
const { authUserFromRequest, createAuthHelpers, createPublicImageAccess, imagesToKeepValue, maxInstancesValue } = require("./lib/auth");
const {
  asArray,
  authRedirectPayloadFromContainer,
  authRedirectPayloadFromForm,
  authRedirectRequested,
  authRedirectRequestedFromForm,
  bindPayloadsFromForm,
  containerConfigConflict,
  containerConfigPayloadFromForm,
  containerCreatePayloadFromForm,
  containerNetworkNames,
  dnsNameFromData,
  formData,
  hostMatchesTag,
  hostName,
  imageNameFromRef,
  instanceShort,
  instanceZone,
  normalizedSaashupLabelConfig,
  ownerEnvVarName,
  isContainerRunning,
  isContainerStopped,
  isOperationDone,
  isReadyContainer,
  traefikEnabled,
  valueText,
  volumePayloadsFromForm,
} = require("./lib/docker");
const { createMetrics, metricLabel, metricLine, operationLabel: operationLabelForMetrics, routeLabel: routeLabelForMetrics, statusClass } = require("./lib/metrics");
const { NetBoxClient, dockerHosts, hostIdQuery, setNetBoxFetchForTests } = require("./lib/netbox");
const { createOidcAuth, setOidcFetchForTests } = require("./lib/oidc");
const { createOperationHelpers, delay } = require("./lib/operations");
const { createPublicApiGuard, requestOrigin, timingSafeStringEqual } = require("./lib/public-api");
const { checkRegistryImageExists, setRegistryFetchForTests } = require("./lib/registry");
const {
  createRegistryWebhookEvents,
  createRegistryWebhookHelpers,
  githubPackageImage: githubPackageImageRaw,
  githubPackageTag: githubPackageTagRaw,
  imageFromDistributionTarget: imageFromDistributionTargetRaw,
} = require("./lib/registry-webhooks");
const { parseSmtpConfig, sendSmtpMail, smtpClientName, smtpMessage, smtpSenderAddress, smtpTransportOptions } = require("./lib/smtp");
const { createStateStore, parseProfiles, plainObject } = require("./lib/state");
const { createTemplateCatalogHelpers } = require("./lib/template-catalog");

const env = loadEnv(process.env, __dirname);
const app = express();
const {
  adminAllowedEmails,
  appOwnerEmail,
  blockedEnrollmentImages,
  brandingLimit,
  createConfigureDelayMs,
  createRecreateDelayMs,
  dataPath,
  oidc,
  operationPollMs,
  operationTimeoutSeconds,
  publicApiAllowedOriginSet,
  publicApiSecret,
  publicPath,
  recreateOperationSettleDelayMs,
  registryWebhookSecret,
  turnstileSecretKey,
} = env;
const saashupEmailLogo = (() => {
  try {
    return fs.readFileSync(path.join(publicPath, "assets/email/saashup-logo.png")).toString("base64");
  } catch {
    return "";
  }
})();
const startedAt = Date.now();
const oidcAuth = createOidcAuth({
  clientId: oidc.clientId,
  clientSecret: oidc.clientSecret,
  enabled: oidc.enabled,
  issuerUrl: oidc.issuerUrl,
  redirectUri: oidc.redirectUri,
  sessionSecret: oidc.sessionSecret,
});

const metrics = createMetrics();
const { readState, writeState, logLine } = createStateStore(dataPath);
const { isAdminAllowed, selectedProfileConfig } = createAuthHelpers({ adminAllowedEmails, readState });
const canCreatePublicImage = createPublicImageAccess({ adminAllowedEmails, publicImage: env.publicImage });
const publicApiGuard = createPublicApiGuard({
  allowedOrigins: env.publicApiAllowedOrigins,
  allowedOriginSet: publicApiAllowedOriginSet,
  secret: publicApiSecret,
});
const registryWebhookEvents = createRegistryWebhookEvents({ imageNameFromRef, plainObject });
const imageFromDistributionTarget = (target) => imageFromDistributionTargetRaw(target, plainObject);
const githubPackageImage = (payload) => githubPackageImageRaw(payload, plainObject);
const githubPackageTag = (payload) => githubPackageTagRaw(payload, plainObject);
let smtpSender = sendSmtpMail;
let turnstileFetch = undiciFetch;
const {
  createDnsRecord,
  deleteDnsRecord,
  ensureImageOnHost,
  registerAuthRedirects,
  unregisterAuthRedirects,
  requestContainerOperation,
  waitForContainerConfigured,
  waitForContainerStopped,
  waitForHostReady,
} = createOperationHelpers({ logLine, operationPollMs, operationTimeoutSeconds });

function routeLabel(req) {
  return routeLabelForMetrics(req, metrics);
}

function operationLabel(req) {
  return operationLabelForMetrics(req, metrics);
}

function sendAccepted(res, body = { status: "requested" }) {
  res.status(202).json(body);
}

function asyncOperation(res, fn) {
  sendAccepted(res);
  fn().catch((error) => {
    logLine(`ERROR : ${error.message || "operation failed"} payload=${JSON.stringify(error.payload || {}).slice(0, 240)}`);
  });
}

function waitForRequest(data) {
  return data.wait === true || data.wait === "true" || data.wait === "on";
}

function profileUsesNetBoxTemplates(profile) {
  const config = selectedProfileConfig({ profile, config_profile: profile });
  return Boolean(config.netbox && config.token);
}

function visibleProfileNames() {
  const config = plainObject(readState().config);
  const profiles = profilesWithSingleDefault(parseProfiles(config.profiles));
  return Object.entries(profiles)
    .filter(([, profile]) => plainObject(profile).saashup_visible === true)
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));
}

function labelMapFromContainer(container) {
  const labels = plainObject(container?.labels);
  const entries = Array.isArray(container?.labels)
    ? container.labels
    : Object.entries(labels).map(([key, value]) => ({ key, value }));

  return entries.reduce((map, label) => {
    const key = String(label?.key || label?.name || label?.label || "").trim().toLowerCase();
    if (key) map[key] = String(label?.value ?? "");
    return map;
  }, {});
}

function labelListFromContainer(container) {
  if (Array.isArray(container?.labels)) {
    return container.labels
      .map((label) => ({
        key: String(label?.key || label?.name || label?.label || "").trim(),
        value: String(label?.value ?? ""),
      }))
      .filter((label) => label.key);
  }
  return Object.entries(plainObject(container?.labels))
    .map(([key, value]) => ({ key, value: String(value ?? "") }))
    .filter((label) => label.key);
}

function recreateLabels(container, data) {
  const labels = labelListFromContainer(container);
  const versionKey = "saashup.template.version";
  const match = labels.find((label) => label.key.trim().toLowerCase() === versionKey);
  if (match) {
    match.key = versionKey;
    match.value = String(data.version || "");
  } else {
    labels.push({ key: versionKey, value: String(data.version || "") });
  }
  return labels;
}

function templateLabelValue(labels, key) {
  const normalizedKey = String(key || "").toLowerCase();
  return labels[`saashup.template.${normalizedKey}`]
    || labels[`saashup.template_${normalizedKey}`]
    || labels[`saashup_template_${normalizedKey}`]
    || labels[`saashup_${normalizedKey}`]
    || "";
}

function boolLabelValue(value, defaultValue = true) {
  if (value === undefined || value === null || value === "") return defaultValue;
  return !["false", "0", "off", "no", "disabled"].includes(String(value).trim().toLowerCase());
}

function imagePartsFromContainer(container, labels) {
  const labeledImage = templateLabelValue(labels, "image");
  const labeledVersion = templateLabelValue(labels, "version");
  if (labeledImage || labeledVersion) return { image: labeledImage, version: labeledVersion };

  const image = container?.image;
  const imageText = valueText(image?.display || image?.name || image);
  return {
    image: imageNameFromRef(imageText),
    version: valueText(image?.version || image?.tag || container?.image_version),
  };
}

function containerPortValues(container, labels) {
  const labeledPort = templateLabelValue(labels, "port") || templateLabelValue(labels, "private_port");
  if (labeledPort) return [{ value: labeledPort }];

  return asArray(container?.ports)
    .map((port) => ({
      value: String(port?.private_port || port?.value || port?.port || "").trim(),
    }))
    .filter((port) => port.value)
    .slice(0, 1);
}

async function netboxTemplateCatalogEntries(client, profile, state, scope) {
  const contexts = await client.list("/api/extras/config-contexts/", { limit: 1000 });
  return contexts
    .filter((context) => context?.is_active !== false)
    .flatMap((context) => templateEntriesFromConfigContext(context, profile, scope, state));
}

async function netboxWorkflowCatalogEntries(client, profile, scope) {
  const contexts = await client.list("/api/extras/config-contexts/", { limit: 1000 });
  return contexts
    .filter((context) => context?.is_active !== false)
    .flatMap((context) => workflowEntriesFromConfigContext(context, profile, scope));
}

function netboxTemplateEntryFromContainer(container, labels, ownerEnvNameValue, creator, profile) {
  const name = templateLabelValue(labels, "name") || templateLabelValue(labels, "template") || "";
  if (!name) return null;

  const owner = String(templateLabelValue(labels, "owner") || templateLabelValue(labels, "creator") || containerEnvValue(container, ownerEnvNameValue)).trim().toLowerCase();
  if (owner !== creator) return null;

  const { image, version } = imagePartsFromContainer(container, labels);
  const maxInstances = templateLabelValue(labels, "max_instances") || templateLabelValue(labels, "max");
  const network = templateLabelValue(labels, "network") || containerNetworkNames(container)[0] || "";
  const traefik = boolLabelValue(templateLabelValue(labels, "traefik"), true);
  return {
    name,
    template: {
      config_profile: profile,
      source: "netbox-template",
      image,
      version,
      max_instances: maxInstancesValue(maxInstances || 1),
      network,
      traefik,
      ports: containerPortValues(container, labels),
      creator_email: owner,
      saashup_enabled: boolLabelValue(templateLabelValue(labels, "enabled"), true),
    },
  };
}

function templateImageKey(template) {
  return imageKeyFromRefAndVersion(template?.image, template?.version);
}

function templateImageNameKey(template) {
  return imageNameKey(template?.image);
}

function imageNameKey(ref) {
  const imageRef = String(ref || "").trim();
  return imageRef ? imageNameFromRef(imageRef) : "";
}

function imageKeyFromRefAndVersion(ref, versionValue = "") {
  const imageRef = String(ref || "").trim();
  if (!imageRef) return "";

  const image = imageNameFromRef(imageRef);
  const refTag = imageRef.lastIndexOf(":") > imageRef.lastIndexOf("/") ? imageRef.slice(imageRef.lastIndexOf(":") + 1) : "";
  const version = String(versionValue || refTag || "").trim();
  return image && version ? `${image}\u0000${version}` : "";
}

function imageKeyFromImageObject(image) {
  const data = plainObject(image);
  return imageKeyFromRefAndVersion(data.name || data.display || data.label || data.value || image, data.version || data.tag);
}

function imageNameKeyFromImageObject(image) {
  const data = plainObject(image);
  return imageNameKey(data.name || data.display || data.label || data.value || image);
}

async function imageContainerCountsByImage(client, hostFilter, containers = []) {
  const images = await client.list("/api/plugins/docker/images/", { limit: 1000, ...hostFilter });
  const imageKeyById = new Map();
  const imageNameById = new Map();
  const counts = new Map();
  const imageCounts = new Map();

  images.forEach((image) => {
    const key = imageKeyFromImageObject(image);
    const imageName = imageNameKeyFromImageObject(image);
    if (!image.id) return;
    if (key) {
      imageKeyById.set(String(image.id), key);
      if (!counts.has(key)) counts.set(key, 0);
    }
    if (imageName) {
      imageNameById.set(String(image.id), imageName);
      if (!imageCounts.has(imageName)) imageCounts.set(imageName, 0);
    }
  });

  containers.forEach((container) => {
    const image = plainObject(container?.image);
    const imageId = valueText(image.id || container?.image_id);
    const key = imageKeyById.get(imageId)
      || imageKeyFromImageObject(container?.image)
      || imageKeyFromRefAndVersion(container?.image_name || container?.image_display, container?.image_version || container?.image_tag);
    const imageName = imageNameById.get(imageId)
      || imageNameKeyFromImageObject(container?.image)
      || imageNameKey(container?.image_name || container?.image_display);
    if (key) counts.set(key, Number(counts.get(key) || 0) + 1);
    if (imageName) imageCounts.set(imageName, Number(imageCounts.get(imageName) || 0) + 1);
  });

  return { exact: counts, image: imageCounts };
}

async function netboxTemplateEntriesForUser(req, profile, state, creator, options = {}) {
  const config = selectedProfileConfig({ profile, config_profile: profile });
  if (!config.netbox || !config.token) return [];

  try {
    const client = new NetBoxClient(config);
    const templates = new Map();
    const ownerOnly = options.ownerOnly === true;
    const creatorKey = String(creator || "").trim().toLowerCase();
    const catalogEntries = await netboxTemplateCatalogEntries(client, profile, state, templateCatalogScope(profile, config));
    catalogEntries
      .filter((entry) => !ownerOnly || String(entry?.template?.creator_email || "").trim().toLowerCase() === creatorKey)
      .forEach((entry) => templates.set(entry.name.toLowerCase(), entry));

    if (!creator) return [...templates.values()];

    const ownerEnvNameValue = ownerEnvVarName(config);
    const hostFilter = await hostIdQuery(client, config.tag);
    if (hostFilter.host_id === "__none__") return [...templates.values()];
    const containers = await client.list("/api/plugins/docker/containers/", { limit: 1000, ...hostFilter });
    const imageCounts = await imageContainerCountsByImage(client, hostFilter, containers);
    const declaredNames = new Set(catalogEntries.map((entry) => entry.name.toLowerCase()));
    const sharedHostIds = await sharedProfileHostIds(client, profile, config);

    containers.forEach((container) => {
      const labels = labelMapFromContainer(container);
      const entry = netboxTemplateEntryFromContainer(container, labels, ownerEnvNameValue, creator, profile);
      if (!entry) return;
      // On a host shared with another visible profile, container labels can't tell which profile owns the template.
      if (sharedHostIds.has(valueText(container?.host?.id ?? container?.host)) && !declaredNames.has(entry.name.toLowerCase())) return;

      const key = entry.name.toLowerCase();
      const existing = templates.get(key) || entry;
      existing.instance_count = Number(existing.instance_count || 0) + 1;
      if (!existing.template.image && entry.template.image) existing.template.image = entry.template.image;
      if (!existing.template.version && entry.template.version) existing.template.version = entry.template.version;
      if (!existing.template.network && entry.template.network) existing.template.network = entry.template.network;
      if (!existing.template.ports?.length && entry.template.ports?.length) existing.template.ports = entry.template.ports;
      templates.set(key, existing);
    });

    return Promise.all([...templates.values()]
      .map(async (entry) => {
        const imageCount = imageCounts.exact.get(templateImageKey(entry.template))
          || imageCounts.image.get(templateImageNameKey(entry.template))
          || 0;
        return {
          ...entry,
          template: {
            ...entry.template,
            instance_count: Math.max(Number(entry.instance_count || 0), imageCount, orderInstanceCountForTemplate(state, entry.name)),
          },
        };
      }));
  } catch (error) {
    logLine(`ENROLL : NetBox template discovery failed ${error.message || "unknown error"}`);
    return [];
  }
}

async function sharedProfileHostIds(client, profile, config) {
  const netbox = templateCatalogScope(profile, config).netbox;
  const otherTags = visibleProfileNames()
    .filter((name) => name !== profile)
    .map((name) => selectedProfileConfig({ profile: name, config_profile: name }))
    .filter((other) => other.tag && templateCatalogScope("", other).netbox === netbox)
    .map((other) => other.tag);
  if (!otherTags.length) return new Set();

  const hosts = await dockerHosts(client, config.tag);
  return new Set(hosts
    .filter((host) => otherTags.some((tag) => hostMatchesTag(host, tag)))
    .map((host) => valueText(host.id)));
}

async function syncTemplatesToNetBoxConfigContext(req, profile, templates, workflows = {}, options = {}) {
  const config = selectedProfileConfig({ profile, config_profile: profile });
  if (!config.netbox || !config.token) return null;

  const client = new NetBoxClient(config);
  const scope = templateCatalogScope(profile, config);
  const contextName = templateCatalogContextName(profile, config);
  const contexts = await client.list("/api/extras/config-contexts/", { q: contextName, limit: 20 });
  const existing = contexts.find((context) => String(context?.name || "") === contextName);
  const existingData = plainObject(existing?.data);
  const preserveExisting = options.preserveExisting === true && existing?.id;
  const body = {
    name: contextName,
    weight: 1000,
    is_active: true,
    data: {
      ...(preserveExisting ? existingData : {}),
      saashup_template_catalog: true,
      saashup_profile: String(profile || "").trim(),
      saashup_scope: scope.key,
      saashup_netbox_url: scope.netbox,
      saashup_tag: scope.tag,
      saashup_templates: preserveExisting ? configContextTemplateDefinitions(existingData) : templates,
      saashup_workflows: preserveExisting ? configContextWorkflowDefinitions(existingData) : plainObject(workflows),
    },
  };

  if (existing?.id) {
    await client.request("PATCH", `/api/extras/config-contexts/${existing.id}/`, { body });
    return { action: "updated", id: existing.id, name: contextName };
  }

  const { payload } = await client.request("POST", "/api/extras/config-contexts/", { body, expected: [200, 201, 202] });
  return { action: "created", id: payload?.id, name: contextName };
}

async function templateEntriesForRequest(req, profile = "", options = {}) {
  const state = readState();
  const creator = String(authUserFromRequest(req).email || authUserFromRequest(req).user || "").trim().toLowerCase();
  const merged = new Map();
  const useNetBox = profileUsesNetBoxTemplates(profile);

  const ownerOnly = options.ownerOnly === true;

  (await netboxTemplateEntriesForUser(req, profile, state, creator, { ownerOnly }))
    .forEach((entry) => merged.set(entry.name.toLowerCase(), { name: entry.name, template: plainObject(entry.template) }));

  if (!useNetBox) {
    Object.entries(plainObject(state.templates))
      .filter(([, template]) => !ownerOnly || String(plainObject(template).creator_email || "").trim().toLowerCase() === creator)
      .forEach(([name, template]) => {
        const key = name.toLowerCase();
        if (!merged.has(key)) merged.set(key, { name, template: plainObject(template) });
      });
  }

  return [...merged.values()];
}

async function templatesForRequest(req, profile = "", options = {}) {
  return Object.fromEntries((await templateEntriesForRequest(req, profile, options))
    .map(({ name, template }) => [name, template]));
}

async function templatesForVisibleProfiles(req, options = {}) {
  const merged = new Map();
  for (const profile of visibleProfileNames()) {
    const templates = await templatesForRequest(req, profile, options);
    Object.entries(templates).forEach(([name, template]) => {
      const key = name.toLowerCase();
      const value = plainObject(template);
      const owned = !value.config_profile || value.config_profile === profile;
      // A copy stored in another profile's context must not hide the owning profile's copy.
      if (!merged.has(key) || (owned && !merged.get(key).owned)) {
        merged.set(key, { name, template: { ...value, config_profile: value.config_profile || profile }, owned });
      }
    });
  }
  return Object.fromEntries([...merged.values()].map(({ name, template }) => [name, template]));
}

async function workflowsForRequest(req, profile = "") {
  const state = readState();
  const merged = new Map();
  const useNetBox = profileUsesNetBoxTemplates(profile);
  const config = selectedProfileConfig({ profile, config_profile: profile });

  if (config.netbox && config.token) {
    const client = new NetBoxClient(config);
    try {
      (await netboxWorkflowCatalogEntries(client, profile, templateCatalogScope(profile, config)))
        .forEach((entry) => merged.set(entry.name.toLowerCase(), { name: entry.name, workflow: plainObject(entry.workflow) }));
    } catch (error) {
      logLine(`ENROLL : NetBox workflow discovery failed ${error.message || "unknown error"}`);
    }
  }

  if (!useNetBox) {
    Object.entries(plainObject(state.workflows)).forEach(([name, workflow]) => {
      const key = name.toLowerCase();
      if (!merged.has(key)) merged.set(key, { name, workflow: plainObject(workflow) });
    });
  }

  return Object.fromEntries([...merged.values()].map(({ name, workflow }) => [name, workflow]));
}

async function workflowsForVisibleProfiles(req) {
  const merged = new Map();
  for (const profile of visibleProfileNames()) {
    const workflows = await workflowsForRequest(req, profile);
    Object.entries(workflows).forEach(([name, workflow]) => {
      const key = name.toLowerCase();
      const value = plainObject(workflow);
      const owned = !value.config_profile || value.config_profile === profile;
      if (!merged.has(key) || (owned && !merged.get(key).owned)) {
        merged.set(key, { name, workflow: { ...value, config_profile: value.config_profile || profile }, owned });
      }
    });
  }
  return Object.fromEntries([...merged.values()].map(({ name, workflow }) => [name, workflow]));
}

function orderInstanceCountForTemplate(state, templateName) {
  return 0;
}

function orderTemplateEnabled(value, defaultValue = true) {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  return !["false", "0", "off", "no", "disabled"].includes(String(value).trim().replace(/;+$/, "").toLowerCase());
}

const {
  configContextCatalogData,
  configContextTemplateDefinitions,
  configContextWorkflowDefinitions,
  plainJsonObject,
  profilesWithSingleDefault,
  templateCatalogContextName,
  templateCatalogScope,
  templateEntriesFromConfigContext,
  templatesWithCreatorEmails,
  workflowEntriesFromConfigContext,
} = createTemplateCatalogHelpers({
  imagesToKeepValue,
  maxInstancesValue,
  orderInstanceCountForTemplate,
  orderTemplateEnabled,
  plainObject,
});

function orderTemplateEntry(name) {
  const requestedName = String(name || "").trim();
  if (!requestedName) return null;

  const templates = plainObject(readState().templates);
  if (Object.hasOwn(templates, requestedName)) return { name: requestedName, template: plainObject(templates[requestedName]) };

  const match = Object.keys(templates).find((templateName) => templateName.toLowerCase() === requestedName.toLowerCase());
  return match ? { name: match, template: plainObject(templates[match]) } : null;
}

async function templateEntryForRequest(req, profile, name) {
  const requestedName = String(name || "").trim();
  if (!requestedName) return null;

  if (!profileUsesNetBoxTemplates(profile)) {
    const localEntry = orderTemplateEntry(requestedName);
    if (localEntry) return localEntry;
  }

  const state = readState();
  const creator = String(authUserFromRequest(req).email || authUserFromRequest(req).user || "").trim().toLowerCase();

  return (await netboxTemplateEntriesForUser(req, profile, state, creator))
    .find((entry) => entry.name.toLowerCase() === requestedName.toLowerCase()) || null;
}

function exactContainerNameMatches(containers, name) {
  const expected = instanceShort(name);
  const items = asArray(containers);
  const matches = items.filter((container) => {
    const names = [
      container?.name,
      container?.display,
      container?.container_name,
      container?.container,
    ].map((value) => instanceShort(valueText(value))).filter(Boolean);
    return names.includes(expected);
  });
  return matches.length || items.length !== 1 ? matches : items;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function orderReadyEmail(data, recipient, smtpConfig, { ccOwner = true } = {}) {
  const instance = dnsNameFromData(data) || data.instance || "your instance";
  const image = data.image || "";
  const cc = ccOwner && appOwnerEmail && appOwnerEmail.toLowerCase() !== String(recipient || "").toLowerCase() ? [appOwnerEmail] : [];
  const actionUrl = /^https?:\/\//i.test(instance) ? instance : `https://${instance}`;
  const text = [
    "Hello,",
    "",
    `Your instance is now running: ${instance}`,
    image ? `Image: ${image}` : "",
    "",
    "You can start using it now.",
  ].filter((line) => line !== "").join("\n");
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e7ef;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#ffffff;">
                  ${saashupEmailLogo ? `<img src="cid:saashup-logo" width="28" height="26" alt="SaaShup" style="display:inline-block;vertical-align:middle;margin-right:8px;background:#ffffff;border-radius:4px;padding:2px;">` : ""}
                  <span style="vertical-align:middle;color:#ffffff;">SaaShup</span>
                </div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">Your instance is ready</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Hello,</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.5;">Your instance is now running and ready to use.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;color:#667085;font-size:13px;border-bottom:1px solid #eef0f5;">Instance</td>
                    <td style="padding:10px 0;text-align:right;font-size:14px;border-bottom:1px solid #eef0f5;"><strong>${escapeHtml(instance)}</strong></td>
                  </tr>
                  ${image ? `<tr>
                    <td style="padding:10px 0;color:#667085;font-size:13px;border-bottom:1px solid #eef0f5;">Image</td>
                    <td style="padding:10px 0;text-align:right;font-size:14px;border-bottom:1px solid #eef0f5;">${escapeHtml(image)}</td>
                  </tr>` : ""}
                </table>
                <a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 18px;border-radius:6px;">Open instance</a>
                <p style="margin:24px 0 0;color:#667085;font-size:13px;line-height:1.5;">If the button does not work, open this URL: ${escapeHtml(actionUrl)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return {
    from: smtpSenderAddress(smtpConfig, appOwnerEmail),
    to: recipient,
    cc,
    subject: `${instance} is ready`,
    text,
    html,
    inlineImages: saashupEmailLogo ? [{
      cid: "saashup-logo",
      filename: "saashup-logo.png",
      contentType: "image/png",
      content: saashupEmailLogo,
    }] : [],
  };
}

async function sendOrderReadyEmail(data, recipient) {
  const smtpConfig = parseSmtpConfig(data.smtp_config);
  if (!smtpConfig || !recipient) return;

  const info = await smtpSender(smtpConfig, orderReadyEmail(data, recipient, smtpConfig));
  logLine(`EMAIL : ready notification sent to ${recipient} for ${data.instance || ""} ${smtpInfoText(info)}`);
}

function imageRefWithVersion(image, version) {
  const name = String(image || "").trim();
  const tag = String(version || "").trim();
  return tag ? `${name}:${tag}` : name;
}

function imageUpgradeEmail(data, recipient, smtpConfig, { ccOwner = true } = {}) {
  const image = data.image || "";
  const fromImage = data.from_image || imageRefWithVersion(image, data.from_version);
  const toImage = data.to_image || imageRefWithVersion(image, data.to_version || data.version);
  const cc = ccOwner && appOwnerEmail && appOwnerEmail.toLowerCase() !== String(recipient || "").toLowerCase() ? [appOwnerEmail] : [];
  const text = [
    "Hello,",
    "",
    "Your image has now been upgraded.",
    fromImage ? `From Image: ${fromImage}` : "",
    toImage ? `To Image: ${toImage}` : "",
    "",
    "Your running instances have been recreated with the new image.",
  ].filter((line) => line !== "").join("\n");
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e7ef;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#ffffff;">
                  ${saashupEmailLogo ? `<img src="cid:saashup-logo" width="28" height="26" alt="SaaShup" style="display:inline-block;vertical-align:middle;margin-right:8px;background:#ffffff;border-radius:4px;padding:2px;">` : ""}
                  <span style="vertical-align:middle;color:#ffffff;">SaaShup</span>
                </div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">Your image was upgraded</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Hello,</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.5;">Your image has now been upgraded and your running instances were recreated.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border-collapse:collapse;">
                  ${fromImage ? `<tr>
                    <td style="padding:10px 0;color:#667085;font-size:13px;border-bottom:1px solid #eef0f5;">From Image</td>
                    <td style="padding:10px 0;text-align:right;font-size:14px;border-bottom:1px solid #eef0f5;">${escapeHtml(fromImage)}</td>
                  </tr>` : ""}
                  ${toImage ? `<tr>
                    <td style="padding:10px 0;color:#667085;font-size:13px;border-bottom:1px solid #eef0f5;">To Image</td>
                    <td style="padding:10px 0;text-align:right;font-size:14px;border-bottom:1px solid #eef0f5;"><strong>${escapeHtml(toImage)}</strong></td>
                  </tr>` : ""}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return {
    from: smtpSenderAddress(smtpConfig, appOwnerEmail),
    to: recipient,
    cc,
    subject: `${toImage || image || "Image"} was upgraded`,
    text,
    html,
    inlineImages: saashupEmailLogo ? [{
      cid: "saashup-logo",
      filename: "saashup-logo.png",
      contentType: "image/png",
      content: saashupEmailLogo,
    }] : [],
  };
}

async function sendImageUpgradeEmail(data, recipient) {
  const smtpConfig = parseSmtpConfig(data.smtp_config);
  if (!smtpConfig || !recipient) return;

  const info = await smtpSender(smtpConfig, imageUpgradeEmail(data, recipient, smtpConfig));
  logLine(`EMAIL : image upgrade notification sent to ${recipient} for ${imageRefWithVersion(data.image, data.to_version || data.version)} ${smtpInfoText(info)}`);
}

function smtpInfoText(info) {
  if (!info || typeof info !== "object") return "";
  const accepted = Array.isArray(info.accepted) ? info.accepted.join(",") : "";
  const rejected = Array.isArray(info.rejected) ? info.rejected.join(",") : "";
  return [
    info.messageId ? `messageId=${info.messageId}` : "",
    accepted ? `accepted=${accepted}` : "",
    rejected ? `rejected=${rejected}` : "",
    info.response ? `response=${String(info.response).slice(0, 120)}` : "",
  ].filter(Boolean).join(" ");
}

function contactProfileConfig(source) {
  const profile = source?.profile || source?.config_profile || "";
  return selectedProfileConfig(profile ? { profile, config_profile: profile } : {});
}

function cleanContactField(value, limit = 500) {
  return String(value || "").replace(/\r/g, "").trim().slice(0, limit);
}

function contactEmailAddress(value) {
  const email = cleanContactField(value, 320).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function contactTurnstileToken(data) {
  return cleanContactField(data.turnstileToken || data.turnstile_token || data["cf-turnstile-response"], 4096);
}

function requestIp(req) {
  const forwarded = String(req.get("cf-connecting-ip") || req.get("x-forwarded-for") || "").split(",")[0].trim();
  return forwarded || req.ip || req.socket?.remoteAddress || "";
}

async function verifyContactTurnstile(data, req) {
  if (!turnstileSecretKey) return;
  const token = contactTurnstileToken(data);
  if (!token) {
    const error = new Error("captcha verification is required");
    error.statusCode = 400;
    throw error;
  }

  const form = new URLSearchParams();
  form.set("secret", turnstileSecretKey);
  form.set("response", token);
  const ip = requestIp(req);
  if (ip) form.set("remoteip", ip);

  let response;
  try {
    response = await turnstileFetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
  } catch {
    const error = new Error("captcha verification failed");
    error.statusCode = 502;
    throw error;
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || !payload.success) {
    const error = new Error("captcha verification failed");
    error.statusCode = 403;
    throw error;
  }
}

function contactFormEmail(data, smtpConfig) {
  const name = cleanContactField(data.name, 120);
  const email = contactEmailAddress(data.email);
  const subject = cleanContactField(data.subject, 160) || "Website contact";
  const message = cleanContactField(data.message, 5000);
  const phone = cleanContactField(data.phone, 80);
  const company = cleanContactField(data.company, 120);
  const page = cleanContactField(data.page || data.url, 500);
  const lines = [
    "New website contact form message",
    "",
    name ? `Name: ${name}` : "",
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
    company ? `Company: ${company}` : "",
    page ? `Page: ${page}` : "",
    "",
    message,
  ].filter((line) => line !== "").join("\n");

  return {
    from: smtpSenderAddress(smtpConfig, appOwnerEmail),
    to: appOwnerEmail,
    replyTo: email || undefined,
    subject: `Website contact: ${subject}`,
    text: lines,
    html: `<!doctype html>
<html>
  <body style="font-family:Arial,Helvetica,sans-serif;color:#172033;line-height:1.5;">
    <h1 style="font-size:20px;margin:0 0 16px;">New website contact form message</h1>
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 20px;">
      ${name ? `<tr><td style="padding:4px 16px 4px 0;color:#667085;">Name</td><td style="padding:4px 0;">${escapeHtml(name)}</td></tr>` : ""}
      ${email ? `<tr><td style="padding:4px 16px 4px 0;color:#667085;">Email</td><td style="padding:4px 0;">${escapeHtml(email)}</td></tr>` : ""}
      ${phone ? `<tr><td style="padding:4px 16px 4px 0;color:#667085;">Phone</td><td style="padding:4px 0;">${escapeHtml(phone)}</td></tr>` : ""}
      ${company ? `<tr><td style="padding:4px 16px 4px 0;color:#667085;">Company</td><td style="padding:4px 0;">${escapeHtml(company)}</td></tr>` : ""}
      ${page ? `<tr><td style="padding:4px 16px 4px 0;color:#667085;">Page</td><td style="padding:4px 0;">${escapeHtml(page)}</td></tr>` : ""}
    </table>
    <div style="white-space:pre-wrap;border-top:1px solid #e4e7ef;padding-top:16px;">${escapeHtml(message)}</div>
  </body>
</html>`,
  };
}

async function sendContactEmail(data) {
  if (cleanContactField(data.website || data.url_honeypot, 200)) return { skipped: true };
  const config = contactProfileConfig(data);
  const smtpConfig = parseSmtpConfig(config.smtp_config);
  if (!appOwnerEmail) {
    const error = new Error("owner email is not configured");
    error.statusCode = 400;
    throw error;
  }
  if (!smtpConfig) {
    const error = new Error("smtp config is not configured");
    error.statusCode = 400;
    throw error;
  }
  if (!contactEmailAddress(data.email)) {
    const error = new Error("valid email is required");
    error.statusCode = 400;
    throw error;
  }
  if (!cleanContactField(data.message, 5000)) {
    const error = new Error("message is required");
    error.statusCode = 400;
    throw error;
  }

  const info = await smtpSender(smtpConfig, contactFormEmail(data, smtpConfig));
  logLine(`EMAIL : contact message sent from ${contactEmailAddress(data.email)} ${smtpInfoText(info)}`);
  return info;
}

async function sendTestEmail(data) {
  const smtpConfig = parseSmtpConfig(data.smtp_config);
  if (!appOwnerEmail) {
    const error = new Error("owner email is not configured");
    error.statusCode = 400;
    throw error;
  }
  if (!smtpConfig) {
    const error = new Error("smtp config is not configured");
    error.statusCode = 400;
    throw error;
  }

  const info = await smtpSender(smtpConfig, orderReadyEmail({
    ...data,
    instance: data.instance || "test-instance.example.com",
    image: data.image || "saashup/example",
    version: data.version || "test",
  }, appOwnerEmail, smtpConfig, { ccOwner: false }));
  logLine(`EMAIL : test notification sent to owner for ${data.profile || data.config_profile || "default"} ${smtpInfoText(info)}`);
  return info;
}

function requireAdmin(req, res, next) {
  const user = authUserFromRequest(req);
  if (oidcAuth.enabled && !user.email && !user.user && !user.name) return oidcAuth.loginRequired(req, res, next);
  if (isAdminAllowed(req)) return next();
  metrics.adminForbidden += 1;
  res.status(403).sendFile(path.join(publicPath, "forbidden.html"));
}

const {
  registrySecretForTemplate,
  registryWebhookAllowed,
  registryWebhookTemplates,
} = createRegistryWebhookHelpers({
  imageNameFromRef,
  orderTemplateEntry,
  plainObject,
  readState,
  registryWebhookEvents,
  registryWebhookSecret,
  timingSafeStringEqual,
});

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
const defaultJsonParser = express.json({ limit: "1mb" });
const brandingJsonParser = express.json({ limit: "4mb" });
app.use((req, res, next) => (req.path === "/admin/brandings" ? brandingJsonParser(req, res, next) : defaultJsonParser(req, res, next)));
registerMetricsMiddleware(app, { metrics });

registerRegistryWebhookRoutes(app, {
  imageNameFromRef,
  imagesToKeepValue,
  logLine,
  recreateContainers,
  registryWebhookAllowed,
  registryWebhookEvents,
  registryWebhookTemplates,
  sendImageUpgradeEmail,
  sendOrderReadyEmail,
  selectedProfileConfig,
  templatesForRequest,
});

registerSystemRoutes(app, {
  authUserFromRequest,
  canCreatePublicImage,
  oidcAuth,
  packageJson,
  publicPath,
  requireAdmin,
  isAdminAllowed,
});
registerMetricsRoutes(app, { metrics, packageJson, startedAt });

const {
  currentEnrollmentUsage,
  enrollmentTemplateDeleteUsage,
  recordEnrollment,
  templateNameFromEnrollmentData,
  updateEnrollmentInstanceStatus,
  validateEnrollmentTemplate,
} = createEnrollHelpers({
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
  visibleProfileNames,
  workflowsForRequest,
  writeState,
});

registerConfigRoutes(app, {
  appOwnerEmail,
  authUserFromRequest,
  brandingLimit,
  dataPath,
  maxInstancesValue,
  parseProfiles,
  plainObject,
  profilesWithSingleDefault,
  publicApiGuard,
  readState,
  registrySecretForTemplate,
  registryWebhookSecret,
  requireAdmin,
  isAdminAllowed,
  selectedProfileConfig,
  sendContactEmail,
  sendTestEmail,
  syncTemplatesToNetBoxConfigContext,
  enrollmentTemplateDeleteUsage,
  templatesForRequest,
  templatesForVisibleProfiles,
  templatesWithCreatorEmails,
  visibleProfileNames,
  verifyContactTurnstile,
  writeState,
  workflowsForVisibleProfiles,
  workflowsForRequest,
});

async function testConnection(req, res) {
  try {
    const client = new NetBoxClient(selectedProfileConfig(formData(req)));
    const { payload } = await client.request("GET", "/api/status/", { expected: [200] });
    res.json(payload);
  } catch (error) {
    res.status(error.statusCode || 502).json({ detail: error.message, payload: error.payload });
  }
}

function containerEnvValue(container, name) {
  const entries = [
    ...(Array.isArray(container?.env) ? container.env : []),
    ...(Array.isArray(container?.env_vars) ? container.env_vars : []),
    ...(Array.isArray(container?.environment) ? container.environment : []),
  ];

  const match = entries.find((entry) => (
    entry
    && typeof entry === "object"
    && valueText(entry.var_name || entry.name || entry.key) === name
  ));
  return match ? valueText(match.value) : "";
}

function firstValueText(...values) {
  return values.map((value) => valueText(value)).find(Boolean) || "";
}

function imageVersionFromRef(ref) {
  const text = String(ref || "");
  const slash = text.lastIndexOf("/");
  const colon = text.lastIndexOf(":");
  return colon > slash ? text.slice(colon + 1) : "";
}

function containerImageRef(container) {
  const image = container?.image;
  return firstValueText(
    image?.display,
    image?.name,
    image,
    container?.image_display,
    container?.image_name,
  );
}

function containerImageVersion(container) {
  const image = container?.image;
  const ref = containerImageRef(container);
  return firstValueText(
    image?.version,
    image?.tag,
    container?.image_version,
    container?.image_tag,
    imageVersionFromRef(ref),
  );
}

function containerImageId(container) {
  const image = container?.image;
  return firstValueText(
    image?.id,
    container?.image_id,
    typeof image === "object" ? "" : image,
  );
}

function containerMatchesRecreateImage(container, data) {
  const name = imageNameFromRef(containerImageRef(container));
  if (!name || name !== imageNameFromRef(data.image)) return false;
  const version = containerImageVersion(container);
  if (!version) return false;
  return data.oldversion ? String(version) === String(data.oldversion) : String(version) !== String(data.version);
}

function containerMatchesTargetImage(container, data, image) {
  const expectedId = valueText(image?.id);
  const actualId = containerImageId(container);
  if (expectedId && actualId && String(actualId) === String(expectedId)) return true;

  const name = imageNameFromRef(containerImageRef(container));
  const version = containerImageVersion(container);
  return name === imageNameFromRef(data.image) && String(version) === String(data.version);
}

function setRecreateContainer(containersById, container, source) {
  const id = valueText(container?.id);
  if (!id || containersById.has(id)) return;
  containersById.set(id, { container, source: source || container });
}

async function waitForRecreatedContainerReady(client, container, data, image) {
  const display = `${hostName(container)}/${valueText(container.display || container.name)}`;
  const deadline = Date.now() + operationTimeoutSeconds * 1000;
  while (Date.now() < deadline) {
    const { payload } = await client.request("GET", `/api/plugins/docker/containers/${container.id}/`);
    if (isReadyContainer(payload) && containerMatchesTargetImage(payload, data, image)) {
      logLine(`RECREATE : ${display} verified image=${data.image}:${data.version} status=${valueText(payload.status) || valueText(payload.state) || "unknown"} operation=${valueText(payload.operation) || "none"}`);
      return true;
    }
    await delay(operationPollMs);
  }
  logLine(`RECREATE : ${display} did not verify image=${data.image}:${data.version} after ${operationTimeoutSeconds}s`);
  return false;
}

const { reportImages } = createReportHandlers({
  containerEnvValue,
  dockerHosts,
  imageNameFromRef,
  logLine,
  NetBoxClient,
  ownerEnvVarName,
  parseProfiles,
  plainObject,
  readState,
  selectedProfileConfig,
  valueText,
});

registerNetBoxRoutes(app, {
  checkRegistryImageExists,
  containerNetworkNames,
  hostIdQuery,
  NetBoxClient,
  publicApiGuard,
  reportImages,
  requireAdmin,
  selectedProfileConfig,
  testConnection,
});

const {
  clearUserLimit,
  listUsers,
  setUserLimit,
  userMaxInstancesOverride,
} = createUsersHelpers({
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
  templateLabelValue,
  visibleProfileNames,
  writeState,
});

registerUsersRoutes(app, {
  clearUserLimit,
  listUsers,
  requireAdmin,
  setUserLimit,
});

const {
  currentUsage,
  validateOrderTemplate,
} = createOrderHelpers({
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
  userMaxInstancesOverride,
  visibleProfileNames,
  valueText,
});

registerOrderRoutes(app, {
  currentUsage,
});

registerEnrollRoutes(app, {
  currentEnrollmentUsage,
});

function imagesSelectedForCleanup(images, keepCountPerHost) {
  const keepCount = Math.max(0, keepCountPerHost);
  const byHost = new Map();
  for (const image of images) {
    const key = hostName(image);
    if (!byHost.has(key)) byHost.set(key, []);
    byHost.get(key).push(image);
  }
  const toDelete = [];
  for (const group of byHost.values()) {
    const sorted = [...group].sort((a, b) => Number(b.id) - Number(a.id));
    toDelete.push(...sorted.slice(keepCount));
  }
  return toDelete;
}

async function recreateContainers(data) {
  const client = new NetBoxClient(data);
  const hostFilter = await hostIdQuery(client, data.tag);
  if (hostFilter.host_id === "__none__") {
    logLine(`RECREATE : no Docker hosts found with tag ${data.tag}`);
    return false;
  }
  const query = { name: data.image, limit: 200, ...hostFilter };
  if (data.oldversion) query.version = data.oldversion;
  const oldImages = (await client.list("/api/plugins/docker/images/", query)).filter((image) => data.oldversion ? String(image.version) === String(data.oldversion) : String(image.version) !== String(data.version));
  const containersById = new Map();
  for (const oldImage of oldImages) {
    const containers = await client.list("/api/plugins/docker/containers/", { image_id: oldImage.id, limit: 200 });
    for (const container of containers) setRecreateContainer(containersById, container, oldImage);
  }
  const scannedContainers = await client.list("/api/plugins/docker/containers/", { limit: 1000, ...hostFilter });
  for (const container of scannedContainers.filter((item) => containerMatchesRecreateImage(item, data))) {
    setRecreateContainer(containersById, container, container);
  }
  if (!oldImages.length && !containersById.size) {
    logLine(`RECREATE : no old images found for ${data.image}:${data.oldversion || "all previous versions"}`);
    return false;
  }
  const removeOldImages = (data.remove_old_images === true || data.remove_old_images === "true" || data.remove_old_images === "on")
    && (!data.oldversion || String(data.oldversion) !== String(data.version));
  const imagesToKeep = imagesToKeepValue(data.images_to_keep);
  const imagesPendingDeletion = removeOldImages ? imagesSelectedForCleanup(oldImages, data.oldversion ? 0 : imagesToKeep - 1) : [];
  const recreateOne = async ({ container, source }) => {
    const newImage = await ensureImageOnHost(client, source, data.image, data.version);
    const sourceName = firstValueText(container.name, container.display);
    const targetName = (data.clean_name === true || data.clean_name === "true" || data.clean_name === "on") ? sourceName.replace(/-17[0-9]{8,}$/, "") : sourceName;
    let ready = false;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      await client.request("PATCH", "/api/plugins/docker/containers/", { body: [{ id: container.id, image: newImage.id, labels: recreateLabels(container, data), ...(targetName && targetName !== container.name ? { name: targetName } : {}) }] });
      logLine(`RECREATE : ${hostName(container)}/${valueText(container.display || container.name)} image set to ${data.image}:${data.version}${attempt > 1 ? ` retry=${attempt}` : ""}`);
      const operationReady = await requestContainerOperation(client, container, "recreate", "RECREATE");
      if (operationReady && recreateOperationSettleDelayMs > 0) await delay(recreateOperationSettleDelayMs);
      ready = operationReady && await waitForRecreatedContainerReady(client, container, data, newImage);
      if (ready || attempt === 2) break;
      logLine(`RECREATE : ${hostName(container)}/${valueText(container.display || container.name)} retrying recreate after verification failed`);
    }
    return ready;
  };
  // With parallel_upgrade, hosts run in parallel and containers of one host stay sequential.
  // Without it, every container lands in a single group, processed one after the other.
  const parallel = parallelUpgradeEnabled(data);
  const containersByHost = new Map();
  for (const entry of containersById.values()) {
    const hostKey = parallel ? (valueText(entry.container?.host?.id || entry.container?.host) || hostName(entry.container)) : "all";
    if (!containersByHost.has(hostKey)) containersByHost.set(hostKey, []);
    containersByHost.get(hostKey).push(entry);
  }
  const hostResults = await Promise.allSettled([...containersByHost.values()].map(async (entries) => {
    let ready = 0;
    for (const entry of entries) {
      if (await recreateOne(entry)) ready += 1;
    }
    return { containerCount: entries.length, readyCount: ready };
  }));
  let readyCount = 0;
  let containerCount = 0;
  const failures = [];
  for (const result of hostResults) {
    if (result.status === "fulfilled") {
      containerCount += result.value.containerCount;
      readyCount += result.value.readyCount;
    } else {
      failures.push(result.reason);
    }
  }
  if (failures.length) {
    failures.forEach((error) => logLine(`RECREATE : host failed ${error?.message || "unknown error"}`));
    throw failures[0];
  }
  for (const oldImage of imagesPendingDeletion) {
    await client.request("DELETE", `/api/plugins/docker/images/${oldImage.id}/`, { expected: [200, 202, 204] });
    logLine(`RECREATE : removed old image ${data.image}:${firstValueText(oldImage.version, data.oldversion)} from ${hostName(oldImage)}`);
  }
  logLine(`RECREATE : finished ${data.image}:${data.oldversion || "all previous versions"} -> ${data.version}`);
  return containerCount > 0 && readyCount === containerCount;
}

function parallelUpgradeEnabled(data) {
  return data.parallel_upgrade === true || data.parallel_upgrade === "true" || data.parallel_upgrade === "on";
}

function deleteVolumesEnabled(data) {
  return data.delete_volumes === true || data.delete_volumes === "true" || data.delete_volumes === "on";
}

function containerVolumeRefs(container) {
  const hostId = container?.host?.id || container?.host || "";
  const mounts = [
    ...(Array.isArray(container?.mounts) ? container.mounts : []),
    ...(Array.isArray(container?.volumes) ? container.volumes : []),
  ];
  const refs = new Map();

  mounts
    .map((mount) => {
      const volume = mount?.volume || mount?.docker_volume || mount;
      const id = valueText(volume?.id || mount?.volume_id);
      const name = valueText(volume?.name || mount?.volume_name);
      return { id, name, hostId };
    })
    .filter((ref) => ref.id || ref.name)
    .forEach((ref) => refs.set(ref.id || ref.name, ref));

  return [...refs.values()];
}

async function deleteContainerVolumes(client, container) {
  const refs = containerVolumeRefs(container);
  for (const ref of refs.filter((item) => item.id)) {
    await client.request("DELETE", `/api/plugins/docker/volumes/${ref.id}/`, { expected: [200, 202, 204] });
    logLine(`DELETE : volume ${ref.name || ref.id} deleted`);
  }
  for (const ref of refs.filter((item) => !item.id)) {
    const query = { name: ref.name };
    if (ref.hostId) {
      query.host_id = ref.hostId;
    } else {
      delete query.host_id;
    }
    const volumes = await client.list("/api/plugins/docker/volumes/", query);
    for (const volume of volumes) {
      await client.request("DELETE", `/api/plugins/docker/volumes/${volume.id}/`, { expected: [200, 202, 204] });
      logLine(`DELETE : volume ${firstValueText(volume.name, ref.name, volume.id)} deleted`);
    }
  }
}

const { createInstance } = createCreateHelpers({
  authRedirectPayloadFromForm,
  authRedirectRequestedFromForm,
  containerConfigPayloadFromForm,
  containerCreatePayloadFromForm,
  createConfigureDelayMs,
  createDnsRecord,
  createRecreateDelayMs,
  delay,
  dockerHosts,
  ensureImageOnHost,
  hostName,
  logLine,
  NetBoxClient,
  normalizedSaashupLabelConfig,
  registerAuthRedirects,
  requestContainerOperation,
  sendOrderReadyEmail,
  templateNameFromEnrollmentData,
  traefikEnabled,
  updateEnrollmentInstanceStatus,
  valueText,
  volumePayloadsFromForm,
  waitForContainerConfigured,
});

registerOperationRoutes(app, {
  asyncOperation,
  authRedirectPayloadFromContainer,
  authRedirectRequested,
  authUserFromRequest,
  bindPayloadsFromForm,
  canCreatePublicImage,
  containerConfigConflict,
  isAdminAllowed,
  createInstance,
  currentEnrollmentUsage,
  currentUsage,
  deleteContainerVolumes,
  deleteDnsRecord,
  deleteVolumesEnabled,
  dockerHosts,
  exactContainerNameMatches,
  hostIdQuery,
  hostName,
  instanceShort,
  isContainerRunning,
  labelMapFromContainer,
  logLine,
  NetBoxClient,
  oidcAuth,
  recordEnrollment,
  recreateContainers,
  requestContainerOperation,
  selectedProfileConfig,
  unregisterAuthRedirects,
  updateEnrollmentInstanceStatus,
  validateEnrollmentTemplate,
  validateOrderTemplate,
  valueText,
  waitForContainerStopped,
  waitForHostReady,
  waitForRequest,
});

app.use(express.static(publicPath));

/* v8 ignore next 6 */
if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`${packageJson.name} listening on ${env.port}`);
  });
}

module.exports = {
  app,
  asArray,
  authUserFromRequest,
  bindPayloadsFromForm,
  containerConfigPayloadFromForm,
  containerCreatePayloadFromForm,
  containerEnvValue,
  deleteContainerVolumes,
  boolLabelValue,
  containerPortValues,
  githubPackageImage,
  githubPackageTag,
  hostMatchesTag,
  imageFromDistributionTarget,
  imageVersionFromRef,
  imagePartsFromContainer,
  imageNameFromRef,
  instanceShort,
  instanceZone,
  isContainerRunning,
  isContainerStopped,
  isOperationDone,
  isReadyContainer,
  labelMapFromContainer,
  maxInstancesValue,
  metricLabel,
  metricLine,
  operationLabel,
  orderTemplateEnabled,
  parseProfiles,
  parseSmtpConfig,
  plainObject,
  requestOrigin,
  registryWebhookAllowed,
  routeLabel,
  registryWebhookEvents,
  sendSmtpMail,
  setNetBoxFetchForTests,
  setOidcFetchForTests,
  setRegistryFetchForTests,
  setSmtpSenderForTests: (sender) => {
    smtpSender = sender || sendSmtpMail;
  },
  setTurnstileFetchForTests: (fetcher) => {
    turnstileFetch = fetcher || undiciFetch;
  },
  smtpClientName,
  smtpMessage,
  smtpSenderAddress,
  smtpTransportOptions,
  statusClass,
  templateLabelValue,
  timingSafeStringEqual,
  valueText,
  waitForRequest,
  volumePayloadsFromForm,
};
