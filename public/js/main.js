const urlParams = new URLSearchParams(window.location.search);
const actionFromUrl = urlParams.get("action");
const isOrderPage = document.body?.classList.contains("order-page");
const isEnrollPage = document.body?.classList.contains("enroll-page");
const isCatalogPage = document.body?.classList.contains("catalog-page");
const isClientPage = isOrderPage || isEnrollPage || isCatalogPage;
const orderTemplateName = urlParams.get("template") || "";

const navigationParam = urlParams.get("navigation");
if (isClientPage && navigationParam !== null) {
  try {
    sessionStorage.setItem("saashup_navigation", navigationParam === "false" ? "false" : "true");
  } catch {}
}

function sessionProfileName() {
  try {
    return sessionStorage.getItem("saashup_profile") || "";
  } catch {
    return "";
  }
}

function navigationHidden() {
  try {
    return sessionStorage.getItem("saashup_navigation") === "false";
  } catch {
    return false;
  }
}

function applyNavigationVisibility() {
  if (!isClientPage) return;
  const hidden = navigationHidden();
  document.querySelector(".order-page-menu")?.classList.toggle("hidden", hidden);
  document.querySelector(".top-left-bar .brand-badge")?.classList.toggle("hidden", hidden);
}

const form = document.getElementById("instanceForm");
const appShell = document.querySelector(".app-shell");
const appBootLoader = document.getElementById("appBootLoader");
const sidebarToggle = document.getElementById("sidebarToggle");
const adminMenuToggle = document.getElementById("adminMenuToggle");
const adminSidebar = document.getElementById("adminSidebar");
const formCard = document.querySelector(".form-card");
const submitBtn = document.getElementById("submitBtn");
const restartInstanceBtn = document.getElementById("restartInstanceBtn");
const deleteInstanceBtn = document.getElementById("deleteInstanceBtn");
const deleteImageBtn = document.getElementById("deleteImageBtn");
const testBtn = document.getElementById("testBtn");
const testEmailBtn = document.getElementById("testEmailBtn");
const deleteConfigBtn = document.getElementById("deleteConfigBtn");
const deleteBrandingBtn = document.getElementById("deleteBrandingBtn");
const exportConfigBtn = document.getElementById("exportConfigBtn");
const importConfigBtn = document.getElementById("importConfigBtn");
const importConfigFile = document.getElementById("importConfigFile");
const clearBtn = document.getElementById("clearBtn");
const dockerRunBtn = document.getElementById("dockerRunBtn");
const templateSelect = document.getElementById("templateSelect");
const createTemplateSelect = document.getElementById("create_template_select");
const templateCreatorEmailWrap = document.getElementById("templateCreatorEmailWrap");
const templateCreatorEmail = document.getElementById("templateCreatorEmail");
const configDefaultWrap = document.getElementById("configDefaultWrap");
const configDefaultInput = document.getElementById("configDefaultInput");
const loadTemplateBtn = document.getElementById("loadTemplateBtn");
const orderTemplateBtn = document.getElementById("orderTemplateBtn");
const saveTemplateBtn = document.getElementById("saveTemplateBtn");
const saveAllTemplatesBtn = document.getElementById("saveAllTemplatesBtn");
const deleteTemplateBtn = document.getElementById("deleteTemplateBtn");
const orderCancelBtn = document.getElementById("orderCancelBtn");
const dockerRunModal = document.getElementById("dockerRunModal");
const dockerRunInput = document.getElementById("dockerRunInput");
const dockerComposeInput = document.getElementById("dockerComposeInput");
const templateExportFile = document.getElementById("templateExportFile");
const templateExportFileName = document.getElementById("templateExportFileName");
const importProfileSelect = document.getElementById("importProfileSelect");
const createWorkflowInput = document.getElementById("createWorkflowInput");
const importTemplateOrdersInput = document.getElementById("importTemplateOrdersInput");
const exportCreateWorkflowInput = document.getElementById("exportCreateWorkflowInput");
const exportImportTemplateOrdersInput = document.getElementById("exportImportTemplateOrdersInput");
const enrollSummary = document.getElementById("enrollSummary");
const dockerRunApplyBtn = document.getElementById("dockerRunApplyBtn");
const dockerRunCancelBtn = document.getElementById("dockerRunCancelBtn");
const dockerRunCloseBtn = document.getElementById("dockerRunCloseBtn");
const importTabButtons = [...document.querySelectorAll("[data-import-tab]")];
const importPanels = [...document.querySelectorAll("[data-import-panel]")];
const profileHelpModal = document.getElementById("profileHelpModal");
const profileHelpTitle = document.getElementById("profileHelpTitle");
const profileHelpBody = document.getElementById("profileHelpBody");
const profileHelpCloseBtn = document.getElementById("profileHelpCloseBtn");
const profileHelpOkBtn = document.getElementById("profileHelpOkBtn");
const formTitle = document.getElementById("form-title");
const formTitleBadge = document.getElementById("formTitleBadge");
const workflowTitleBadge = document.getElementById("workflowTitleBadge");
const formDescription = document.getElementById("form-description");
const tokenToggle = document.getElementById("tokenToggle");
const registryWebhookSecretInput = document.getElementById("registry_webhook_secret");
const registryWebhookSecretToggle = document.getElementById("registryWebhookSecretToggle");
const smtpConfigToggle = document.getElementById("smtpConfigToggle");
const envList = document.getElementById("envList");
const addEnvBtn = document.getElementById("addEnvBtn");
const loggingList = document.getElementById("loggingList");
const addLoggingBtn = document.getElementById("addLoggingBtn");
const labelList = document.getElementById("labelList");
const addLabelBtn = document.getElementById("addLabelBtn");
const portList = document.getElementById("portList");
const volumeList = document.getElementById("volumeList");
const addVolumeBtn = document.getElementById("addVolumeBtn");
const bindList = document.getElementById("bindList");
const addBindBtn = document.getElementById("addBindBtn");
const instanceOptions = document.getElementById("instanceOptions");
const refreshInstancesBtn = document.getElementById("refreshInstancesBtn");
const imageOptions = document.getElementById("imageOptions");
const oldVersionOptions = document.getElementById("oldVersionOptions");
const restartVersionOptions = document.getElementById("restartVersionOptions");
const refreshImagesBtn = document.getElementById("refreshImagesBtn");
const logsCard = document.getElementById("logsCard");
const logsFullscreenBtn = document.getElementById("logsFullscreenBtn");
const clearLogsBtn = document.getElementById("clearLogsBtn");
const configProfileSelect = document.getElementById("config_profile");
const profileSyncWarning = document.getElementById("profileSyncWarning");
const orderActions = document.getElementById("orderActions");
const orderLoading = document.getElementById("orderLoading");
const orderStatus = document.getElementById("orderStatus");
const orderInstances = document.getElementById("orderInstances");
const enrollInstances = document.getElementById("enrollInstances");
const catalogList = document.getElementById("catalogList");
const catalogSearch = document.getElementById("catalogSearch");
const catalogSort = document.getElementById("catalogSort");
const authUser = document.getElementById("authUser");
const authAvatar = document.getElementById("authAvatar");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const adminLink = document.getElementById("adminLink");
const enrollLink = document.querySelector('.order-page-menu a[href="/enroll"]');
const clearCacheBtn = document.getElementById("clearCacheBtn");
const logoutBtn = document.getElementById("logoutBtn");
const reportCard = document.getElementById("reportCard");
const reportProfileSelect = document.getElementById("reportProfileSelect");
const refreshReportBtn = document.getElementById("refreshReportBtn");
const reportSummary = document.getElementById("reportSummary");
const reportTableHead = document.getElementById("reportTableHead");
const reportTableBody = document.getElementById("reportTableBody");
const reportViewButtons = Array.from(document.querySelectorAll("[data-report-view]"));
const environmentCard = document.getElementById("environmentCard");
const environmentSummary = document.getElementById("environmentSummary");
const environmentList = document.getElementById("environmentList");
const refreshEnvironmentBtn = document.getElementById("refreshEnvironmentBtn");
const workflowCard = document.getElementById("workflowCard");
const workflowActionSelect = document.getElementById("workflowActionSelect");
const workflowDeleteVolumesField = document.getElementById("workflowDeleteVolumesField");
const workflowDeleteVolumesInput = document.getElementById("workflowDeleteVolumesInput");
const workflowSelect = document.getElementById("workflowSelect");
const workflowSummary = document.getElementById("workflowSummary");
const workflowTableBody = document.getElementById("workflowTableBody");
const runWorkflowBtn = document.getElementById("runWorkflowBtn");
const saveWorkflowBtn = document.getElementById("saveWorkflowBtn");
const deleteWorkflowBtn = document.getElementById("deleteWorkflowBtn");
const authUserCacheKey = "saashup_auth_user";
const enrollImportNotice = "Import a Docker run command or compose with a single service.";
const enrollMultiComposeNotice = "Compose files on enroll must contain a single service.";
const enrollDockerRunNotices = [
  "Docker run image and port are required",
  "Docker run image is required",
  "Docker run port is required",
  "Docker run image version is required",
  "Docker run image version cannot be latest",
  "Bind mounts are not allowed for enrollment. Use a named Docker volume like myimage-data:/data.",
];
const enrollComposeNotices = [
  enrollMultiComposeNotice,
  "Compose services with images are required",
  "Compose service must expose one port.",
  "Compose service image version is required",
  "Compose service image version cannot be latest",
  "Bind mounts are not allowed for enrollment. Use a named Docker volume like myimage-data:/data.",
];

let currentAction = (isOrderPage || isEnrollPage) ? "create" : (localStorage.getItem("current_action") || "config");
let currentConfigProfile = localStorage.getItem("current_config_profile") || "";
let noticeTimeout = null;
let savedConfig = {};
let configProfiles = {};
let serverConfigProfiles = {};
let imageRecords = [];
const instancesRequestCache = new Map();
let containerCountRequestId = 0;
let createNetworkRequestId = 0;
let lastLogsHtml = "";
let logsPollFailed = false;
let createTemplates = {};
let createWorkflows = {};
let workflowStepStatuses = {};
let workflowDragIndex = null;
let workflowPointerDrag = null;
let workflowMouseDrag = null;
let workflowCatalogDirty = false;
let generatedCreateInstanceName = "";
let generatedCreateDnsName = "";
let orderInstanceCards = [];
let orderInstanceLimit = { max: 0, used: 0 };
let enrollmentCards = [];
let enrollmentLimit = { max: 0, used: 0, reached: false };
let catalogCards = [];
let catalogLimit = {};
let enrollSubmitInProgress = false;
const orderDeletingInstances = new Set();
let currentAuthUser = null;
let publicImageAllowed = true;
let currentReportView = "images";
let lastReportData = null;
let environmentLoaded = false;
let orderStatusPollTimer = null;
let orderRedirectTarget = "";
let orderRedirectSince = 0;
let orderRedirectTemplateName = "";
let orderPendingProgressActive = false;
let orderPendingFailed = false;
let orderLastProgressStep = 0;
let enrollmentStatusPollTimer = null;
let mailSettings = { owner_email_configured: false };
let registryWebhookDefaultSecret = "";
let registryWebhookDefaultLoaded = false;
let currentImportTab = "run";
let templateVersionOverride = "";
let templateNetworkOverride = "";
const logsPollFailureNotice = "Activity logs unavailable: network error";
const defaultLogDriver = "syslog";
const defaultLogDriverOptions = {
  "syslog-address": "udp://127.0.0.1:5514",
  tag: "{{.Name}}",
};
const sidebarCollapsedStorageKey = "sidebar_collapsed";

const profileFieldHelp = {
  config_profile: {
    title: "Config profile",
    body: "Selects which saved NetBox connection and deployment defaults are used by create, upgrade, refresh, operate and delete actions.",
  },
  config_name: {
    title: "Profile name",
    body: "Names the profile you are saving. Use a stable name such as production, staging or a customer identifier.",
  },
  customer_name: {
    title: "Customer name",
    body: "Stores the customer or organization name shown in exported configuration and shared profile data.",
  },
  netbox: {
    title: "NetBox URL",
    body: "The base URL of the NetBox instance that stores Docker hosts, images, containers, volumes and Cloudflare DNS records.",
  },
  token: {
    title: "NetBox Token",
    body: "The API token used to read and update NetBox data for this profile. v1 tokens and v2 nbt_ tokens are both supported.",
  },
  proxy: {
    title: "Proxy URL",
    body: "Optional HTTP proxy used by the server when it connects to NetBox. Leave it empty when direct access is available.",
  },
  domain: {
    title: "Domain",
    body: "The default domain appended to short instance names during creation. For example, tiles becomes tiles.example.com.",
  },
  tag: {
    title: "Tag",
    body: "Filters Docker hosts and image lookups to the matching NetBox tag, so each profile can target a specific environment or host group.",
  },
  max_instances: {
    title: "Max instances",
    body: "Limits how many order-page containers a user can request from this template. Set it to 0 to block new orders for the template.",
  },
  enrollment_limit: {
    title: "Enrollment limit",
    body: "Limits how many images each user can enroll for this profile. Set it to 0 to block new enrollments for the profile.",
  },
  owner_env_var: {
    title: "Owner env var",
    body: "The environment variable name used to store the requester email on newly created containers. The default is SAASHUP_OWNER.",
  },
  cloudflare_filter: {
    title: "Cloudflare IP restriction",
    body: "When enabled, created containers receive the Traefik IP allow-list label for Cloudflare source ranges. Disable it to create routes without that allow-list label.",
  },
  parallel_upgrade: {
    title: "Parallel upgrade",
    body: "When enabled, upgrades recreate containers on different Docker hosts at the same time. Containers on the same host are still recreated one at a time. Disabled by default.",
  },
  registry_webhook_secret: {
    title: "Registry webhook password",
    body: "Optional template-specific password for registry webhooks that target this template image. Leave it empty to use the REGISTRY_WEBHOOK_SECRET environment default.",
  },
  smtp_config: {
    title: "SMTP config",
    body: "Optional SMTP connection string for this profile in the format user:pwd@host:port.",
  },
  profile_branding: {
    title: "Branding",
    body: "Attaches a saved branding to this profile. The branding is applied on the customer pages (order, catalog, enroll). Manage brandings from the Branding menu entry.",
  },
  branding_select: {
    title: "Branding",
    body: "Pick a saved branding to edit it, or choose New branding to create one. New branding is hidden once the branding limit is reached (BRANDING_LIMIT environment variable); delete a branding to free a slot.",
  },
  branding_name: {
    title: "Branding name",
    body: "Names the branding so profiles can reference it.",
  },
  brand_logo: {
    title: "Brand logo",
    body: "Optional logo image (PNG, JPEG, WebP or SVG, converted to WebP and resized to 1000x1000 max) shown as a large translucent watermark on the customer pages, and used to suggest brand colors.",
  },
  brand_primary: {
    title: "Primary color",
    body: "Optional hex color (for example #246bfe) applied to buttons and accents on the customer pages. Set a logo URL first to get suggestions extracted from the logo.",
  },
  brand_secondary: {
    title: "Secondary color",
    body: "Optional hex color used with the primary color to build the background gradient when no background image is set.",
  },
  brand_background: {
    title: "Brand background",
    body: "Optional background image (PNG, JPEG or WebP, converted to WebP and resized to 2560x1440 max) applied to the customer pages. Without it, the brand colors build a gradient background.",
  },
  brand_welcome: {
    title: "Welcome text",
    body: "Optional welcome message shown above the instances list on the order page.",
  },
  brand_url: {
    title: "Website link",
    body: "Optional customer website URL opened by the top-left logo badge on the customer pages instead of saashup.com.",
  },
  brand_footer: {
    title: "Footer text",
    body: "Optional text shown in the footer of the customer pages instead of \"SaaShup © 2026\".",
  },
  operate_action: {
    title: "Action",
    body: "Choose the container operation to request. Start, stop, restart and kill can be applied to one instance or to all containers using the selected image version.",
  },
  instance: {
    title: "Instance name",
    body: "The Docker container name to create, operate on or delete. DNS is configured separately when Traefik is enabled.",
  },
  dns_name: {
    title: "DNS name",
    body: "The public DNS name used for Traefik labels and Cloudflare DNS when Traefik is enabled.",
  },
  delete_volumes: {
    title: "Delete volumes",
    body: "When enabled, deleting the instance also deletes the Docker volumes mounted on that container. Leave it off to keep data volumes.",
  },
  remove_image: {
    title: "Remove image",
    body: "When deleting by image, remove the matching Docker image records only after all matching containers have been deleted successfully.",
  },
  image: {
    title: "Image name",
    body: "The Docker image name used to find containers or available versions in NetBox, for example saashup/app.",
  },
  oldversion: {
    title: "Old version",
    body: "The currently deployed image version to replace during upgrade. Leave it empty to upgrade all previous versions except the target version.",
  },
  restart_version: {
    title: "Version",
    body: "The image version used to find containers for bulk operate actions.",
  },
  version: {
    title: "Version",
    body: "The target image version for creation or upgrade.",
  },
  clean_name: {
    title: "Clean name before recreate",
    body: "Removes generated timestamp suffixes from container names during upgrade before requesting the recreate operation.",
  },
  remove_old_images: {
    title: "Remove old images",
    body: "When enabled, each old image is deleted from its host only after all containers using that old image have recreated successfully.",
  },
  images_to_keep: {
    title: "Images to keep",
    body: "How many image versions to keep per host when a registry webhook upgrades this template (1 to 3, default 2). The oldest images beyond that count are removed once containers recreate successfully. A webhook request can override this with an images_to_keep query string value.",
  },
  saashup_enabled: {
    title: "Enable template orders",
    body: "When enabled, the template can be requested from the order page. Disable it to keep the template saved but unavailable for orders.",
  },
};

const configFields = ["config_profile", "config_name", "customer_name", "netbox", "token", "proxy", "domain", "tag", "enrollment_limit", "owner_env_var", "cloudflare_filter", "parallel_upgrade", "smtp_config", "profile_branding"];

function isCreateFormAction(action = currentAction) {
  return action === "create" || action === "template";
}

function isTemplateAction(action = currentAction) {
  return action === "template";
}

function selectedTemplateName() {
  return currentAction === "create" ? (createTemplateSelect?.value || "") : (templateSelect?.value || "");
}

const actions = {
  environment: {
    endpoint: "/admin/environment",
    method: "get",
    menu: "menu_environment",
    title: "Environment",
    description: "Review the server runtime environment.",
    submitLabel: "Refresh",
    buttonClass: "btn btn-primary",
    fields: [],
  },
  config: {
    endpoint: "/webhook",
    method: "get",
    menu: "menu_config",
    title: "Config",
    description: "Save the NetBox URL, token, optional proxy, domain and host tag used by the automation.",
    submitLabel: "Save config",
    buttonClass: "btn btn-primary",
    fields: ["config_profile", "config_name", "customer_name", "netbox", "token", "proxy", "domain", "tag", "enrollment_limit", "owner_env_var", "cloudflare_filter", "parallel_upgrade", "smtp_config", "profile_branding"],
  },
  branding: {
    endpoint: "/admin/brandings",
    method: "post",
    menu: "menu_branding",
    title: "Branding",
    description: "Create reusable brandings (logo, colors, texts) and attach them to profiles from the Profiles form.",
    submitLabel: "Save branding",
    buttonClass: "btn btn-primary",
    fields: ["branding_select", "branding_name", "brand_logo", "brand_primary", "brand_secondary", "brand_background", "brand_welcome", "brand_url", "brand_footer"],
  },
  create: {
    endpoint: "/create",
    method: "post",
    menu: "menu_create",
    title: "Create instance",
    description: "Create an instance from a saved template.",
    submitLabel: "Create instance",
    buttonClass: "btn btn-primary",
    fields: ["create_template", "instance", "dns_name", "image", "version"],
  },
  template: {
    endpoint: "/create",
    method: "post",
    menu: "menu_template",
    title: "Template",
    description: "Create and manage reusable instance templates.",
    submitLabel: "Create instance",
    buttonClass: "btn btn-primary",
    fields: ["config_profile", "network", "traefik", "logging", "max_instances", "images_to_keep", "registry_webhook_secret", "image", "version", "env_vars", "labels", "ports", "volumes", "binds"],
  },
  workflow: {
    endpoint: "",
    method: "post",
    menu: "menu_workflow",
    title: "Workflow",
    description: "Run compose-imported templates in the order they were defined.",
    submitLabel: "Run workflow",
    buttonClass: "btn btn-primary",
    fields: [],
  },
  recreate: {
    endpoint: "/recreate",
    method: "post",
    menu: "menu_recreate",
    title: "Upgrade containers",
    description: "Replace containers matching an image and old version with a new version.",
    submitLabel: "Upgrade containers",
    buttonClass: "btn btn-primary",
    fields: ["config_profile", "image", "oldversion", "version", "clean_name", "remove_old_images"],
  },
  restart: {
    endpoint: "/restart",
    method: "post",
    menu: "menu_restart",
    title: "Operate containers",
    description: "Start, stop, restart or kill one container or containers matching an image and version.",
    submitLabel: "Operate image",
    buttonClass: "btn btn-primary",
    fields: ["config_profile", "operate_action", "instance", "operate_instance_action", "image", "restart_version"],
  },
  report: {
    endpoint: "/report/images",
    method: "get",
    menu: "menu_report",
    title: "Image report",
    description: "Review image usage by container count for one config.",
    submitLabel: "Refresh report",
    buttonClass: "btn btn-primary",
    fields: [],
  },
  refresh_hosts: {
    endpoint: "/refresh-hosts",
    method: "post",
    menu: "menu_refresh_hosts",
    title: "Refresh Docker hosts",
    description: "Request a refresh for each Docker host in the selected NetBox config.",
    submitLabel: "Refresh hosts",
    buttonClass: "btn btn-primary",
    fields: ["config_profile"],
  },
  delete: {
    endpoint: "/delete",
    method: "post",
    menu: "menu_delete",
    title: "Delete instance",
    description: "Delete one instance. A confirmation will be requested before submitting.",
    submitLabel: "Delete instance",
    buttonClass: "btn btn-danger",
    fields: ["config_profile", "delete_volumes", "instance", "delete_instance_action", "image", "remove_image", "delete_image_action"],
    confirm: "Delete this instance?",
  },
};

const allFieldNames = [
  "netbox",
  "token",
  "proxy",
  "domain",
  "tag",
  "max_instances",
  "images_to_keep",
  "enrollment_limit",
  "owner_env_var",
  "config_profile",
  "operate_action",
  "delete_volumes",
  "config_name",
  "network",
  "traefik",
  "logging",
  "all_hosts",
  "saashup_enabled",
  "instance",
  "dns_name",
  "image",
  "oldversion",
  "restart_version",
  "version",
  "clean_name",
  "remove_old_images",
  "remove_image",
  "cloudflare_filter",
  "parallel_upgrade",
  "registry_webhook_secret",
  "smtp_config",
  "var_env_key",
  "var_env_value",
  "label_key",
  "label_value",
  "port_value",
  "volume_source",
  "volume_name",
  "bind_host_path",
  "bind_container_path",
  "bind_read_only",
];

const operateActionLabels = {
  start: "Start",
  stop: "Stop",
  restart: "Restart",
  kill: "Kill",
};

function field(name) {
  return document.getElementById(name);
}

function fieldValue(name, fallback = "") {
  const el = field(name);
  return el ? el.value : fallback;
}

function fieldChecked(name, fallback = false) {
  const el = field(name);
  return el ? Boolean(el.checked) : fallback;
}

function checkboxValue(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  return !["false", "0", "off", "no"].includes(String(value).toLowerCase());
}

function ownerEnvVarValue(value) {
  return String(value || "SAASHUP_OWNER").trim() || "SAASHUP_OWNER";
}

function userInitials(value) {
  const words = String(value || "")
    .trim()
    .split(/[\s._@-]+/)
    .filter(Boolean);

  if (!words.length) return "?";

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function normalizeAuthUser(user = {}) {
  const displayName = String(user.name || user.user || user.email || "").trim();

  if (!displayName) return null;

  return {
    name: displayName,
    user: String(user.user || "").trim(),
    email: String(user.email || "").trim(),
    admin: Boolean(user.admin),
    public_image: user.public_image !== false,
  };
}

function cachedAuthUser() {
  try {
    return normalizeAuthUser(JSON.parse(localStorage.getItem(authUserCacheKey) || "null") || {});
  } catch (error) {
    localStorage.removeItem(authUserCacheKey);
    return null;
  }
}

function cacheAuthUser(user) {
  const normalized = normalizeAuthUser(user);

  if (!normalized) {
    localStorage.removeItem(authUserCacheKey);
    return false;
  }

  localStorage.setItem(authUserCacheKey, JSON.stringify(normalized));
  return true;
}

function clearAuthUserDisplay() {
  localStorage.removeItem(authUserCacheKey);
  currentAuthUser = null;
  if (authUser) authUser.classList.add("hidden");
  updateAccountMenuAccess({ admin: false, public_image: false });
}

function updateAccountMenuAccess(user = {}) {
  const isAdmin = Boolean(user.admin);
  const canEnrollImages = isAdmin || user.public_image !== false;
  if (adminLink) adminLink.classList.toggle("hidden", !isAdmin);
  if (enrollLink) enrollLink.classList.toggle("hidden", !canEnrollImages);
}

function renderAuthUser(user) {
  if (!authUser) return false;

  const normalized = normalizeAuthUser(user);

  if (!normalized) return false;
  currentAuthUser = normalized;
  publicImageAllowed = Boolean(normalized.admin) || normalized.public_image !== false;
  updatePublicImageAccess();

  if (authName) authName.textContent = normalized.name;
  if (authEmail) authEmail.textContent = normalized.email && normalized.email !== normalized.name ? normalized.email : "";
  if (authAvatar) authAvatar.textContent = userInitials(normalized.name);
  updateAccountMenuAccess(normalized);

  authUser.classList.remove("hidden");
  return true;
}

function canCreatePublicImage() {
  return publicImageAllowed;
}

function shouldVerifyEnrollImageAvailability() {
  return currentAuthUser?.public_image !== false;
}

function publicImageDisabledMessage() {
  return "Only administrators can create or enroll images.";
}

function renderCachedAuthUser() {
  const user = cachedAuthUser();
  return user ? renderAuthUser(user) : false;
}

async function loadAuthUser() {
  if (!authUser) return false;

  try {
    const response = await fetch("/session/user", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      clearAuthUserDisplay();
      return false;
    }

    const user = await response.json();
    const rendered = renderAuthUser(user);

    if (rendered) {
      cacheAuthUser(user);
      return true;
    }

    clearAuthUserDisplay();
    return false;
  } catch (error) {
    if (!cachedAuthUser()) authUser.classList.add("hidden");
    return false;
  }
}

function logout() {
  localStorage.removeItem(authUserCacheKey);
  const returnUrl = window.location.origin + "/";
  window.location.href = `/logout?rd=${encodeURIComponent(returnUrl)}`;
}

function clearLocalCache() {
  if (!confirm("Clear local browser cache for this app?")) return;
  localStorage.clear();
  window.location.reload();
}

function setSidebarCollapsed(collapsed) {
  appShell?.classList.toggle("sidebar-collapsed", collapsed);
  if (sidebarToggle) {
    sidebarToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    sidebarToggle.setAttribute("aria-label", collapsed ? "Expand menu" : "Collapse menu");
    sidebarToggle.title = collapsed ? "Expand menu" : "Collapse menu";
  }
  localStorage.setItem(sidebarCollapsedStorageKey, collapsed ? "true" : "false");
}

function initializeSidebar() {
  if (isOrderPage || !appShell) return;
  setSidebarCollapsed(localStorage.getItem(sidebarCollapsedStorageKey) === "true");
}

function setAdminMobileMenuOpen(open) {
  document.body?.classList.toggle("admin-menu-open", open);
  if (adminMenuToggle) {
    adminMenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    adminMenuToggle.setAttribute("aria-label", open ? "Close admin menu" : "Open admin menu");
    adminMenuToggle.title = open ? "Close admin menu" : "Open admin menu";
  }
}

function isFqdn(value) {
  const name = String(value || "").trim();
  if (name.length > 253 || !name.includes(".")) return false;

  return name
    .split(".")
    .every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
}

function normalizeDomain(value) {
  return String(value || "").trim().replace(/^\.+|\.+$/g, "");
}

function instanceFqdn(value, domain) {
  const name = String(value || "").trim().replace(/\.+$/g, "");
  if (!name || isFqdn(name)) return name;

  const normalizedDomain = normalizeDomain(domain);
  return normalizedDomain ? `${name}.${normalizedDomain}` : name;
}

function dnsParts(value) {
  const text = String(value || "").trim();
  if (!text) return { host: "", path: "" };

  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    const path = `${url.pathname || ""}${url.search || ""}${url.hash || ""}`;
    return { host: url.hostname, path: path === "/" ? "" : path };
  } catch {
    const slash = text.indexOf("/");
    if (slash === -1) return { host: text, path: "" };
    return { host: text.slice(0, slash), path: text.slice(slash) || "" };
  }
}

function dnsNameFqdn(value, domain) {
  const { host, path } = dnsParts(value);
  const fqdnHost = instanceFqdn(host, domain);
  return fqdnHost ? `${fqdnHost}${path}` : "";
}

function createDnsName() {
  return dnsNameFqdn(fieldValue("instance"), selectedProfileCredentials().domain);
}

function syncCreateDnsName({ force = false } = {}) {
  const dnsInput = field("dns_name");
  if (!dnsInput || !isCreateFormAction()) return;

  const hasTraefik = fieldChecked("traefik", true);
  dnsInput.disabled = !hasTraefik;
  if (!hasTraefik) return;

  const nextName = createDnsName();
  const currentName = fieldValue("dns_name");
  if (force || !currentName || currentName === generatedCreateDnsName) {
    setFieldValue("dns_name", nextName);
  }
  generatedCreateDnsName = nextName;
}

function randomInstanceSuffix(length = 16) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const cryptoObject = window.crypto || window.msCrypto;
  const bytes = new Uint8Array(length);

  if (cryptoObject?.getRandomValues) {
    cryptoObject.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function instanceNamePrefix() {
  const credentials = selectedProfileCredentials();
  const source = credentials.profile || credentials.tag || "app";
  const prefix = String(source)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return prefix || "app";
}

function instanceShortName() {
  if (isTemplateAction()) return "instance";

  const name = String(fieldValue("instance") || "instance").trim();
  const shortName = (name.includes(".") ? name.split(".")[0] : name)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return shortName || "instance";
}

function generatedVolumeName(index) {
  const suffix = index === 0 ? "data" : `data-${index + 1}`;
  return `${instanceShortName()}-${suffix}`;
}

function syncVolumeNames() {
  let sourceIndex = 0;

  repeatRows(volumeList, ".repeat-row").forEach((row) => {
    const sourceInput = row.querySelector('[name="volume_source"]');
    const nameInput = row.querySelector('[name="volume_name"]');
    if (!nameInput) return;

    if (!sourceInput?.value) {
      nameInput.value = "";
      return;
    }

    nameInput.value = generatedVolumeName(sourceIndex);
    sourceIndex += 1;
  });
}

function ensureRandomCreateInstanceName() {
  if (!isCreateFormAction()) return;

  const currentName = fieldValue("instance");
  if (currentName && currentName !== generatedCreateInstanceName) return;

  generatedCreateInstanceName = `${instanceNamePrefix()}-${randomInstanceSuffix()}`;
  setFieldValue("instance", generatedCreateInstanceName);
  syncCreateDnsName({ force: true });
  syncVolumeNames();
}

function setFieldValue(name, value = "") {
  const el = field(name);
  if (!el) return;

  if (el.type === "checkbox") {
    el.checked = checkboxValue(value);
    return;
  }

  el.value = value || "";
}

function networkNamesFromItem(item) {
  if (!item || typeof item !== "object") return [];
  if (Array.isArray(item.networks)) return item.networks.filter(Boolean);
  if (item.network) return [item.network].filter(Boolean);
  if (!Array.isArray(item.network_settings)) return [];

  return item.network_settings
    .map((setting) => {
      const network = setting?.network;
      if (typeof network === "string") return network;
      if (!network || typeof network !== "object") return "";

      return network.name || network.display || network.value || "";
    })
    .filter(Boolean);
}

function isTraefikNetwork(name) {
  return String(name || "").toLowerCase().startsWith("traefik");
}

function queryCacheKey(query) {
  return Array.from(query.entries())
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => (
      leftKey === rightKey ? leftValue.localeCompare(rightValue) : leftKey.localeCompare(rightKey)
    ))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

async function loadInstances(query, { force = false } = {}) {
  const key = queryCacheKey(query);
  if (!force && instancesRequestCache.has(key)) return instancesRequestCache.get(key);

  const request = fetch(`/instances?${query.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  }).then((response) => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  });

  instancesRequestCache.set(key, request);
  try {
    return await request;
  } catch (error) {
    instancesRequestCache.delete(key);
    throw error;
  }
}

async function refreshCreateNetworkFromInstances(requestId) {
  const query = credentialsQuery({ includeTag: true });

  if (!query) {
    if (requestId === createNetworkRequestId) setFieldValue("network", "");
    return;
  }

  try {
    const data = await loadInstances(query);
    if (requestId !== createNetworkRequestId || !isCreateFormAction()) return;

    const networks = Array.from(new Set((Array.isArray(data) ? data : [])
      .flatMap(networkNamesFromItem)
      .filter(isTraefikNetwork)))
      .sort((a, b) => a.localeCompare(b));

    if (templateNetworkOverride) {
      setFieldValue("network", templateNetworkOverride);
      return;
    }
    setFieldValue("network", networks[0] || "");
  } catch {
    if (requestId === createNetworkRequestId && isCreateFormAction()) {
      if (templateNetworkOverride) {
        setFieldValue("network", templateNetworkOverride);
        return;
      }
      setFieldValue("network", "");
    }
  }
}

async function defaultEnrollNetwork() {
  const query = credentialsQuery({ includeTag: true });
  if (!query) return "";

  try {
    const data = await loadInstances(query, { force: true });
    const networks = Array.from(new Set((Array.isArray(data) ? data : [])
      .flatMap((item) => networkNamesFromItem(item))
      .filter(isTraefikNetwork)))
      .sort((a, b) => a.localeCompare(b));

    return networks[0] || "";
  } catch {
    return "";
  }
}

function syncCreateNetwork() {
  if (isOrderPage) return;

  const network = field("network");
  if (!network) return;

  network.readOnly = isCreateFormAction();
  if (!isCreateFormAction()) return;

  if (templateNetworkOverride) {
    setFieldValue("network", templateNetworkOverride);
    return;
  }
  setFieldValue("network", "");
  const requestId = ++createNetworkRequestId;
  refreshCreateNetworkFromInstances(requestId);
}

function profileLabel(name) {
  return name || "No config saved";
}

function knownProfileEntries() {
  return {
    ...parseProfiles(savedConfig.profiles),
    ...serverConfigProfiles,
    ...configProfiles,
  };
}

function knownProfileNames() {
  const deleted = new Set(deletedProfiles());
  return Object.keys(knownProfileEntries())
    .filter((name) => !deleted.has(name))
    .sort((a, b) => a.localeCompare(b));
}

function parseProfiles(value) {
  if (!value) return {};

  if (typeof value === "object" && !Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function storedProfiles() {
  return parseProfiles(localStorage.getItem("config_profiles"));
}

function smtpConfigValue(profile = {}) {
  if (profile.smtp_config) return profile.smtp_config;
  if (!profile.smtp_host) return "";

  const auth = profile.smtp_user || profile.smtp_password
    ? `${profile.smtp_user || ""}:${profile.smtp_password || ""}@`
    : "";
  const port = profile.smtp_port ? `:${profile.smtp_port}` : "";
  return `${auth}${profile.smtp_host}${port}`;
}

function normalizedProfileForSync(profile = {}) {
  return {
    netbox: profile.netbox || "",
    token: profile.token || "",
    proxy: profile.proxy || "",
    domain: normalizeDomain(profile.domain || ""),
    tag: profile.tag || "",
    enrollment_limit: enrollmentLimitValue(profile),
    owner_env_var: ownerEnvVarValue(profile.owner_env_var),
    cloudflare_filter: checkboxValue(profile.cloudflare_filter, true),
    parallel_upgrade: checkboxValue(profile.parallel_upgrade, false),
    smtp_config: smtpConfigValue(profile),
    saashup_visible: profile.saashup_visible === true || profile.saashup_default === true,
    branding: profile.branding || "",
  };
}

function currentProfileFieldValues() {
  return {
    netbox: fieldValue("netbox"),
    token: fieldValue("token"),
    proxy: fieldValue("proxy"),
    domain: fieldValue("domain"),
    tag: fieldValue("tag"),
    enrollment_limit: fieldValue("enrollment_limit"),
    owner_env_var: fieldValue("owner_env_var"),
    cloudflare_filter: fieldChecked("cloudflare_filter", true),
    parallel_upgrade: fieldChecked("parallel_upgrade", false),
    smtp_config: fieldValue("smtp_config"),
    saashup_visible: Boolean(configDefaultInput?.checked),
    branding: fieldValue("profile_branding"),
  };
}

function normalizedProfileNetBoxUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "").toLowerCase();
}

function duplicateProfileScopeName(profileName, netbox, tag) {
  const normalizedNetbox = normalizedProfileNetBoxUrl(netbox);
  const normalizedTag = String(tag || "").trim().toLowerCase();
  if (!normalizedNetbox || !normalizedTag) return "";

  return Object.entries(configProfiles).find(([name, profile]) => (
    name !== profileName
    && normalizedProfileNetBoxUrl(profile.netbox) === normalizedNetbox
    && String(profile.tag || "").trim().toLowerCase() === normalizedTag
  ))?.[0] || "";
}

function profileSyncState(name = currentConfigProfile) {
  if (!name || !configProfiles[name]) return { status: "none", message: "" };
  const localSource = currentAction === "config" && name === currentConfigProfile
    ? currentProfileFieldValues()
    : configProfiles[name];

  if (!serverConfigProfiles[name]) {
    return {
      status: "warning",
      message: "This profile exists only in this browser. Save config to sync it to the server.",
    };
  }

  const localProfile = JSON.stringify(normalizedProfileForSync(localSource));
  const serverProfile = JSON.stringify(normalizedProfileForSync(serverConfigProfiles[name]));
  if (localProfile === serverProfile) {
    return {
      status: "ok",
      message: "Profile synced with server.",
    };
  }

  return {
    status: "warning",
    message: "This profile differs from the server copy. Save config to align it.",
  };
}

function updateProfileSyncWarning() {
  if (!profileSyncWarning) return;

  const { status, message } = profileSyncState();
  profileSyncWarning.textContent = "";
  profileSyncWarning.title = message;
  profileSyncWarning.setAttribute("aria-label", message);
  profileSyncWarning.classList.toggle("hidden", status === "none");
  profileSyncWarning.classList.toggle("is-ok", status === "ok");
  profileSyncWarning.classList.toggle("is-warning", status === "warning");
}

function parseStoredObject(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function loadCreateTemplates({ useCache = true } = {}) {
  createTemplates = useCache ? normalizeCreateTemplates(parseStoredObject("create_templates")) : {};
  createWorkflows = useCache ? normalizeCreateWorkflows(parseStoredObject("create_workflows")) : {};
  const query = new URLSearchParams();
  if (isEnrollPage) query.set("enroll", "true");
  query.set("include_workflows", "true");

  return fetch(`/templates${query.toString() ? `?${query.toString()}` : ""}`, {
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((payload) => {
      const catalog = templateCatalogFromPayload(payload, { workflows: createWorkflows });
      createTemplates = catalog.templates;
      createWorkflows = catalog.workflows;
      localStorage.setItem("create_templates", JSON.stringify(createTemplates));
      localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
      updateTemplateOptions();
      updateWorkflowOptions();
    })
    .catch(() => {
      if (!useCache) {
        createTemplates = {};
        createWorkflows = {};
        localStorage.removeItem("create_templates");
        localStorage.removeItem("create_workflows");
      }
      updateTemplateOptions();
      updateWorkflowOptions();
    });
}

function persistCreateTemplates() {
  localStorage.setItem("create_templates", JSON.stringify(createTemplates));
  localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
  const query = new URLSearchParams();
  const profile = selectedProfileCredentials().profile;
  if (profile) query.set("profile", profile);
  query.set("include_workflows", "true");

  return fetch(`/templates${query.toString() ? `?${query.toString()}` : ""}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templates: createTemplates,
      workflows: createWorkflows,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const error = new Error(data.detail || `HTTP ${response.status}`);
      error.code = data.code || "";
      throw error;
    }
    return response.json().catch(() => ({ templates: createTemplates, workflows: createWorkflows }));
  });
}

function templateNameOwnedByOtherProfile(name, profile) {
  const key = String(name || "").trim().toLowerCase();
  const match = Object.entries(createTemplates).find(([templateName]) => templateName.toLowerCase() === key);
  if (!match) return "";
  const owner = String(match[1]?.config_profile || match[1]?.profile || "");
  return owner && owner !== String(profile || "") ? owner : "";
}

async function loadMailSettings() {
  try {
    const response = await fetch("/mail-settings", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    mailSettings = await response.json();
  } catch {
    mailSettings = { owner_email_configured: false };
  }
  updateTestEmailVisibility();
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportPortableConfig() {
  try {
    const response = await fetch("/portable-config", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`saashup-config-${date}.json`, data);
    setNotice("Config export ready", "success");
  } catch {
    setNotice("Config export failed", "error");
  }
}

function importPortableConfigFile() {
  importConfigFile?.click();
}

async function importPortableConfig(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!confirm("Import config from this file? Matching profile names will be replaced and new names will be added.")) {
      return;
    }

    const response = await fetch("/portable-config", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const importedConfig = plainObject(data.config);
    const importedProfiles = normalizeImportedProfiles(parseProfiles(data.profiles || importedConfig.profiles));
    const mergedProfiles = { ...configProfiles, ...importedProfiles };
    const selectedProfile = importedConfig.profile || importedConfig.config_profile || currentConfigProfile || Object.keys(mergedProfiles).sort((a, b) => a.localeCompare(b))[0] || "";

    configProfiles = mergedProfiles;
    serverConfigProfiles = { ...serverConfigProfiles, ...importedProfiles };
    savedConfig = { ...savedConfig, ...importedConfig, profiles: mergedProfiles };
    currentConfigProfile = selectedProfile;

    Object.keys(importedProfiles).forEach(forgetDeletedProfile);
    persistProfiles();
    updateProfileOptions();
    updateTemplateOptions();
    updateWorkflowOptions();
    applyProfileToFields(currentConfigProfile);
    setNotice("Config import complete", "success");
  } catch {
    setNotice("Config import failed", "error");
  } finally {
    if (importConfigFile) importConfigFile.value = "";
  }
}

function updateTemplateOptions(selected = "") {
  const normalizedTemplates = normalizeCreateTemplates(createTemplates);
  if (JSON.stringify(normalizedTemplates) !== JSON.stringify(createTemplates)) {
    createTemplates = normalizedTemplates;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
  }
  const names = Object.keys(createTemplates).sort((a, b) => a.localeCompare(b));
  const selectedValue = names.includes(selected) ? selected : "";
  [templateSelect, createTemplateSelect].filter(Boolean).forEach((select) => {
    select.replaceChildren(new Option(names.length ? "Select template" : "No templates saved", ""));
    names.forEach((name) => {
      select.appendChild(new Option(name, name));
    });
    select.value = selectedValue;
  });

  syncTemplateActions();
  updateFormTitleBadge();
}

function updateWorkflowOptions(selected = workflowSelect?.value || "") {
  const normalizedWorkflows = normalizeCreateWorkflows(createWorkflows);
  if (JSON.stringify(normalizedWorkflows) !== JSON.stringify(createWorkflows)) {
    createWorkflows = normalizedWorkflows;
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
  }
  updateWorkflowTitleBadge();
  if (!workflowSelect) return;

  const names = Object.keys(createWorkflows).sort((a, b) => workflowOptionLabel(a).localeCompare(workflowOptionLabel(b)));
  workflowSelect.replaceChildren(new Option(names.length ? "Select workflow" : "No workflows saved", ""));
  names.forEach((name) => workflowSelect.appendChild(new Option(workflowOptionLabel(name), name)));
  workflowSelect.value = names.includes(selected) ? selected : "";
  renderWorkflow();
}

function updateWorkflowTitleBadge() {
  if (!workflowTitleBadge) return;

  const count = Object.keys(createWorkflows).length;
  const label = `${count} workflow${count === 1 ? "" : "s"}`;
  workflowTitleBadge.textContent = String(count);
  workflowTitleBadge.title = label;
  workflowTitleBadge.setAttribute("aria-label", label);
}

function selectedWorkflow() {
  return createWorkflows[workflowSelect?.value || ""] || null;
}

function workflowProfile(workflow) {
  return workflow?.config_profile || workflow?.profile || "";
}

function workflowNameFromKey(key) {
  return String(key || "").split("::").pop() || "";
}

function workflowStorageKey(profileName, workflowName) {
  return profileName ? `${profileName}::${workflowName || "compose"}` : (workflowName || "compose");
}

function workflowOptionLabel(key) {
  const workflow = createWorkflows[key] || {};
  const name = workflow.name || workflowNameFromKey(key);
  const profile = workflowProfile(workflow);
  return profile ? `${profileLabel(profile)} / ${name}` : name;
}

function workflowStepName(step) {
  return typeof step === "string" ? step : step?.template;
}

function workflowStepTemplate(step) {
  const templateName = workflowStepName(step);
  const embeddedTemplate = plainObject(step?.template_data || step?.data);
  return createTemplates[templateName] || (Object.keys(embeddedTemplate).length ? embeddedTemplate : {});
}

function workflowStepEnabled(step) {
  return typeof step === "string" || step?.enabled !== false;
}

function selectedWorkflowKey() {
  return workflowSelect?.value || "";
}

function persistSelectedWorkflow() {
  const key = selectedWorkflowKey();
  if (!key || !createWorkflows[key]) return;
  localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
}

function updateWorkflowSaveState() {
  if (saveWorkflowBtn) saveWorkflowBtn.disabled = !workflowCatalogDirty;
}

function markWorkflowCatalogDirty() {
  workflowCatalogDirty = true;
  updateWorkflowSaveState();
}

async function saveWorkflowCatalog() {
  if (!workflowCatalogDirty) return;

  const previousText = saveWorkflowBtn?.textContent || "Save workflow";
  if (saveWorkflowBtn) {
    saveWorkflowBtn.disabled = true;
    saveWorkflowBtn.classList.add("btn-loading");
    saveWorkflowBtn.textContent = "Saving";
  }

  try {
    const selected = selectedWorkflowKey();
    const savedCatalog = templateCatalogFromPayload(await persistCreateTemplates());
    createTemplates = savedCatalog.templates;
    createWorkflows = savedCatalog.workflows;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
    workflowCatalogDirty = false;
    updateTemplateOptions();
    updateWorkflowOptions(selected);
    setNotice("Workflow saved", "success");
  } catch {
    workflowCatalogDirty = true;
    updateWorkflowSaveState();
    setNotice("Workflow save failed", "error");
  } finally {
    if (saveWorkflowBtn) {
      saveWorkflowBtn.classList.remove("btn-loading");
      saveWorkflowBtn.textContent = previousText;
      updateWorkflowSaveState();
    }
  }
}

function clearWorkflowDragState() {
  workflowDragIndex = null;
  workflowPointerDrag = null;
  workflowMouseDrag = null;
  workflowTableBody?.querySelectorAll(".workflow-step-dragging, .workflow-step-drop-target").forEach((row) => {
    row.classList.remove("workflow-step-dragging", "workflow-step-drop-target");
  });
}

function workflowStepRowAtPoint(clientX, clientY) {
  const element = document.elementFromPoint(clientX, clientY);
  return element instanceof Element ? element.closest("[data-workflow-step-index]") : null;
}

function markWorkflowDropTarget(row) {
  workflowTableBody?.querySelectorAll(".workflow-step-drop-target").forEach((item) => item.classList.remove("workflow-step-drop-target"));
  if (!(row instanceof HTMLElement) || workflowDragIndex === null) return;
  row.classList.toggle("workflow-step-drop-target", Number(row.dataset.workflowStepIndex) !== workflowDragIndex);
}

function moveWorkflowStep(fromIndex, toIndex) {
  const workflow = selectedWorkflow();
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];
  if (!workflow || fromIndex === toIndex || !steps[fromIndex] || !steps[toIndex]) return;

  const [movedStep] = steps.splice(fromIndex, 1);
  steps.splice(toIndex, 0, movedStep);
  workflow.steps = steps;
  workflowStepStatuses = {};
  persistSelectedWorkflow();
  markWorkflowCatalogDirty();
  renderWorkflow();
  setNotice("Workflow order changed", "success");
}

function workflowStepStatusIcon(status = "pending") {
  const normalized = ["pending", "running", "done", "failed"].includes(status) ? status : "pending";
  const labels = {
    pending: "Step pending",
    running: "Step running",
    done: "Step done",
    failed: "Step failed",
  };
  const icons = {
    pending: "↻",
    running: "↻",
    done: "✓",
    failed: "!",
  };
  return `<span class="workflow-step-status workflow-step-status-${normalized}" title="${labels[normalized]}" aria-label="${labels[normalized]}">${icons[normalized]}</span>`;
}

function renderWorkflow() {
  const workflow = selectedWorkflow();
  if (!workflowSummary || !workflowTableBody) return;

  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];
  const enabledSteps = steps.filter(workflowStepEnabled);
  const profile = workflowProfile(workflow);
  const action = workflowAction();
  workflowSummary.textContent = workflow
    ? `${enabledSteps.length}/${steps.length} enabled - ${action}${profile ? ` - ${profileLabel(profile)}` : ""}`
    : "No workflow selected";
  if (runWorkflowBtn) runWorkflowBtn.disabled = !enabledSteps.length;
  if (runWorkflowBtn) runWorkflowBtn.textContent = "Execute";
  if (deleteWorkflowBtn) deleteWorkflowBtn.disabled = !workflow;
  updateWorkflowSaveState();
  workflowDeleteVolumesField?.classList.toggle("hidden", action !== "delete");

  if (!steps.length) {
    workflowTableBody.innerHTML = '<tr><td colspan="6">Import a compose file with workflow enabled.</td></tr>';
    return;
  }

  workflowTableBody.replaceChildren(...steps.map((step, index) => {
    const templateName = workflowStepName(step);
    const template = workflowStepTemplate(step);
    const enabled = workflowStepEnabled(step);
    const status = workflowStepStatuses[index] || "pending";
    const row = document.createElement("tr");
    row.dataset.workflowStepIndex = String(index);
    row.dataset.workflowStepStatus = status;
    row.classList.toggle("workflow-step-disabled", !enabled);
    row.innerHTML = `
      <td><button type="button" class="icon-btn workflow-step-drag" data-workflow-step-drag="${index}" title="Drag to reorder ${escapeHtml(templateName || "workflow step")}" aria-label="Drag to reorder ${escapeHtml(templateName || "workflow step")}">↕</button></td>
      <td>${workflowStepStatusIcon(status)}</td>
      <td><input type="checkbox" data-workflow-step-enabled="${index}" aria-label="Enable ${escapeHtml(templateName || "workflow step")}" ${enabled ? "checked" : ""}></td>
      <td>${escapeHtml(templateName || "")}</td>
      <td>${escapeHtml(template.image || "")}:${escapeHtml(template.version || "")}</td>
      <td><button type="button" class="icon-btn icon-btn-danger workflow-step-delete" data-workflow-step-delete="${index}" title="Remove ${escapeHtml(templateName || "workflow step")}" aria-label="Remove ${escapeHtml(templateName || "workflow step")}">×</button></td>
    `;
    return row;
  }));
}

function updateImportProfileOptions() {
  if (!importProfileSelect) return;

  const profileNames = knownProfileNames();
  const names = profileNames.length ? profileNames : [""];
  importProfileSelect.replaceChildren(...names.map((name) => new Option(profileLabel(name), name)));
  importProfileSelect.value = names.includes(currentConfigProfile) ? currentConfigProfile : names[0] || "";
}

function syncTemplateActions() {
  const name = selectedTemplateName();
  const hasTemplate = Boolean(name);
  const selectedTemplate = hasTemplate ? createTemplates[name] : null;
  const orderEnabled = !selectedTemplate || selectedTemplate.saashup_enabled !== false;

  updateTemplateCreatorEmail(selectedTemplate);
  if (loadTemplateBtn) loadTemplateBtn.disabled = !hasTemplate;
  if (deleteTemplateBtn) deleteTemplateBtn.disabled = !hasTemplate;
  if (!orderTemplateBtn) return;

  orderTemplateBtn.disabled = hasTemplate && !orderEnabled;
  orderTemplateBtn.textContent = hasTemplate && !orderEnabled ? "Template disabled" : (hasTemplate ? "Order template" : "Select template to order");
  orderTemplateBtn.title = hasTemplate && !orderEnabled ? "This template is disabled for orders" : (hasTemplate ? "Open the order page for this template" : "Select a template before ordering");
  orderTemplateBtn.classList.toggle("btn-primary", hasTemplate && orderEnabled);
  orderTemplateBtn.classList.toggle("btn-danger-outline", !hasTemplate || !orderEnabled);
  if (saveAllTemplatesBtn) saveAllTemplatesBtn.disabled = !Object.keys(createTemplates).length;
}

function visibleConfigProfileName(exceptName = "") {
  return Object.entries(knownProfileEntries())
    .find(([name, profile]) => name !== exceptName && (profile?.saashup_visible === true || profile?.saashup_default === true))?.[0] || "";
}

function updateTemplateCreatorEmail(template) {
  if (!templateCreatorEmail || !templateCreatorEmailWrap) return;

  const email = String(template?.creator_email || "").trim();
  templateCreatorEmail.value = email;
  templateCreatorEmail.title = email ? `Template creator: ${email}` : "Template creator email";
  templateCreatorEmail.disabled = !template;
  templateCreatorEmailWrap.classList.toggle("hidden", !isTemplateAction());
}

function updateConfigDefaultControl() {
  if (!configDefaultInput || !configDefaultWrap) return;

  const profileName = fieldValue("config_name") || fieldValue("config_profile") || currentConfigProfile || "";
  const profile = profileName ? knownProfileEntries()[profileName] : null;
  configDefaultInput.checked = profile?.saashup_visible === true || profile?.saashup_default === true;
  configDefaultInput.disabled = false;
  configDefaultInput.title = "Show this profile on public pages.";
  configDefaultWrap.classList.toggle("hidden", currentAction !== "config");
}

function markVisibleConfig(profileName) {
  Object.keys(configProfiles).forEach((name) => {
    if (profileName && name === profileName) configProfiles[name].saashup_visible = true;
  });
}

function deletedProfiles() {
  try {
    const deleted = JSON.parse(localStorage.getItem("deleted_config_profiles") || "[]");
    return Array.isArray(deleted) ? deleted : [];
  } catch {
    return [];
  }
}

function rememberDeletedProfile(profile) {
  const deleted = new Set(deletedProfiles());
  if (profile) deleted.add(profile);
  localStorage.setItem("deleted_config_profiles", JSON.stringify([...deleted]));
}

function forgetDeletedProfile(profile) {
  const deleted = new Set(deletedProfiles());
  if (profile) deleted.delete(profile);
  localStorage.setItem("deleted_config_profiles", JSON.stringify([...deleted]));
}

function applyDeletedProfileFilter(profiles) {
  const deleted = new Set(deletedProfiles());
  return Object.fromEntries(Object.entries(profiles || {}).filter(([name]) => !deleted.has(name)));
}

function persistProfiles() {
  if (isClientPage) return;
  localStorage.setItem("config_profiles", JSON.stringify(configProfiles));
  if (currentConfigProfile) {
    localStorage.setItem("current_config_profile", currentConfigProfile);
  } else {
    localStorage.removeItem("current_config_profile");
  }
}

function profileCredentials(name = currentConfigProfile) {
  const profile = knownProfileEntries()[name] || {};
  return {
    profile: name,
    netbox: profile.netbox || "",
    token: profile.token || "",
    proxy: profile.proxy || "",
    netbox_configured: Boolean(profile.netbox || profile.netbox_configured),
    token_configured: Boolean(profile.token || profile.token_configured),
    proxy_configured: Boolean(profile.proxy || profile.proxy_configured),
    domain: profile.domain || "",
    tag: profile.tag || "",
    enrollment_limit: enrollmentLimitValue(profile),
    owner_env_var: ownerEnvVarValue(profile.owner_env_var),
    cloudflare_filter: checkboxValue(profile.cloudflare_filter, true),
    parallel_upgrade: checkboxValue(profile.parallel_upgrade, false),
    smtp_config: smtpConfigValue(profile),
    smtp_configured: Boolean(profile.smtp_config || profile.smtp_configured),
    branding: profile.branding || "",
  };
}

function profileHasNetBoxCredentials(credentials = selectedProfileCredentials()) {
  return Boolean((credentials.netbox && credentials.token) || (credentials.netbox_configured && credentials.token_configured));
}

function normalizeMaxInstances(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;

  return Math.min(100, Math.max(0, Math.floor(number)));
}

function normalizeImagesToKeep(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 2;

  return Math.min(3, Math.max(1, Math.floor(number)));
}

function enrollmentLimitValue(profile = {}) {
  return normalizeMaxInstances(profile.enrollment_limit ?? profile.max_templates ?? profile.max_instances);
}

function normalizeImportedProfiles(profiles = {}) {
  return Object.fromEntries(Object.entries(plainObject(profiles)).map(([name, profile]) => {
    const normalized = plainObject(profile);
    if (normalized.enrollment_limit === undefined) {
      const legacyLimit = normalized.max_templates ?? normalized.max_instances;
      if (legacyLimit !== undefined) normalized.enrollment_limit = normalizeMaxInstances(legacyLimit);
    }
    delete normalized.max_templates;
    return [name, normalized];
  }));
}

function templateMaxInstancesValue(template = {}) {
  return normalizeMaxInstances(template.max_instances);
}

function templateImagesToKeepValue(template = {}) {
  return normalizeImagesToKeep(template.images_to_keep);
}

async function orderLimitForProfile(profile = "") {
  const query = new URLSearchParams();
  const profileName = String(profile || selectedProfileCredentials().profile || currentConfigProfile || "").trim();
  if (profileName) query.set("profile", profileName);
  if (orderTemplateName) query.set("template", orderTemplateName);
  if (orderRedirectTarget) query.set("pending", orderRedirectTarget);
  const response = await fetch(`/order/limit?${query.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function enrollLimitForProfile(_profile, { ownerOnly = true } = {}) {
  const query = new URLSearchParams();
  if (!ownerOnly) query.set("owner_only", "false");
  const response = await fetch(`/enroll/limit?${query.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function selectedProfileCredentials() {
  const selected = configProfileSelect?.value || currentConfigProfile || "";
  return profileCredentials(selected);
}

function updateProfileOptions() {
  if (!configProfileSelect) return;

  const profileNames = knownProfileNames();

  if (!profileNames.includes(currentConfigProfile)) {
    currentConfigProfile = profileNames[0] || "";
  }

  const names = profileNames.length ? profileNames : [""];

  configProfileSelect.replaceChildren(...names.map((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = profileLabel(name);
    return option;
  }));

  configProfileSelect.value = currentConfigProfile;
  updateReportProfileOptions();
  updateConfigDefaultControl();
  updateFormTitleBadge();
  updateTestConnectionButtonLabel();
}

function updateFormTitleBadge(actionName = currentAction) {
  if (!formTitleBadge) return;

  const isConfig = actionName === "config";
  const isTemplate = actionName === "template";
  formTitleBadge.classList.toggle("hidden", !isConfig && !isTemplate);
  if (!isConfig && !isTemplate) return;

  const count = isConfig ? knownProfileNames().length : Object.keys(createTemplates).length;
  const label = isConfig
    ? `${count} config profile${count === 1 ? "" : "s"}`
    : `${count} template${count === 1 ? "" : "s"}`;
  formTitleBadge.textContent = String(count);
  formTitleBadge.title = label;
  formTitleBadge.setAttribute("aria-label", label);
}

function updateReportProfileOptions() {
  if (!reportProfileSelect) return;

  const profileNames = knownProfileNames();
  const fallbackProfile = currentConfigProfile || profileNames[0] || "";
  const currentValue = reportProfileSelect.value || fallbackProfile;
  const names = profileNames.length ? profileNames : [""];

  reportProfileSelect.replaceChildren();
  names.forEach((name) => {
    reportProfileSelect.appendChild(new Option(profileLabel(name), name));
  });

  reportProfileSelect.value = names.includes(currentValue)
    ? currentValue
    : names[0];
}

function hexColorValue(value) {
  const hex = String(value || "").trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(hex) ? hex : "";
}

function httpUrlValue(value) {
  const url = String(value || "").trim();
  return /^https?:\/\/\S+$/i.test(url) ? url : "";
}

function brandBadgeLabel(url) {
  try {
    return new URL(url).hostname || "Website";
  } catch {
    return "Website";
  }
}

let defaultDocumentTitle = "";

function brandedDocumentTitle(customerName) {
  if (isEnrollPage) return `Enroll ${customerName}`;
  if (isCatalogPage) return `${customerName} Catalog`;
  return `Order ${customerName}`;
}

function hexToRgb(hex) {
  return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, "0")).join("")}`;
}

function mixHexColors(hex, targetHex, amount) {
  const from = hexToRgb(hex);
  const to = hexToRgb(targetHex);
  return rgbToHex(from.map((channel, index) => channel + (to[index] - channel) * amount));
}

function brandThemeCss(primary, secondary, withGradient) {
  const primaryDark = mixHexColors(primary, "#000000", 0.22);
  const [r, g, b] = hexToRgb(primary);
  const darkThemePrimary = mixHexColors(primary, "#ffffff", 0.35);
  let css = `:root { --primary: ${primary}; --primary-dark: ${primaryDark}; --primary-rgb: ${r}, ${g}, ${b}; }\n`
    + `html[data-theme="dark"] { --primary: ${darkThemePrimary}; --primary-dark: ${primary}; --primary-rgb: ${hexToRgb(darkThemePrimary).join(", ")}; }\n`;
  if (withGradient) {
    const [sr, sg, sb] = hexToRgb(secondary || primaryDark);
    css += "body.order-page, body.enroll-page, body.catalog-page { background-image: "
      + `linear-gradient(160deg, rgba(${r}, ${g}, ${b}, 0.20), transparent 55%), `
      + `radial-gradient(circle at bottom right, rgba(${sr}, ${sg}, ${sb}, 0.18), transparent 34rem); }\n`;
  }
  return css;
}

function applyProfileBranding(profile = {}) {
  if (!isClientPage) return;
  const brandLogo = String(profile.brand_logo || "").trim();
  const brandBackground = String(profile.brand_background || "").trim();
  const brandWelcome = String(profile.brand_welcome || "").trim();
  const brandPrimary = hexColorValue(profile.brand_primary);
  const brandSecondary = hexColorValue(profile.brand_secondary);

  let brandThemeStyle = document.getElementById("brandThemeStyle");
  if (brandPrimary && !brandThemeStyle) {
    brandThemeStyle = document.createElement("style");
    brandThemeStyle.id = "brandThemeStyle";
    document.head.appendChild(brandThemeStyle);
  }
  if (brandThemeStyle) {
    brandThemeStyle.textContent = brandPrimary ? brandThemeCss(brandPrimary, brandSecondary, !brandBackground) : "";
  }

  if (brandLogo) {
    document.body.style.setProperty("--brand-watermark", `url("${encodeURI(brandLogo)}")`);
    document.body.classList.add("brand-watermark");
  } else {
    document.body.classList.remove("brand-watermark");
    document.body.style.removeProperty("--brand-watermark");
  }

  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    if (favicon.dataset.defaultHref === undefined) favicon.dataset.defaultHref = favicon.getAttribute("href") || "";
    favicon.href = brandLogo || favicon.dataset.defaultHref;
  }

  const customerName = String(savedConfig.customer_name || "").trim();
  if (!defaultDocumentTitle) defaultDocumentTitle = document.title;
  document.title = customerName ? brandedDocumentTitle(customerName) : defaultDocumentTitle;
  if (brandBackground) {
    document.body.style.setProperty("--brand-bg-image", `url("${encodeURI(brandBackground)}")`);
    document.body.classList.add("brand-bg");
  } else {
    document.body.classList.remove("brand-bg");
    document.body.style.removeProperty("--brand-bg-image");
  }

  const welcomeEl = document.getElementById("brandWelcome");
  if (welcomeEl) {
    welcomeEl.textContent = brandWelcome;
    welcomeEl.classList.toggle("hidden", !brandWelcome);
  }

  const brandUrl = httpUrlValue(profile.brand_url);
  const brandBadge = document.querySelector(".top-left-bar .brand-badge");
  if (brandBadge) {
    if (brandBadge.dataset.defaultHref === undefined) brandBadge.dataset.defaultHref = brandBadge.getAttribute("href") || "";
    brandBadge.setAttribute("href", brandUrl || brandBadge.dataset.defaultHref);
    const badgeImage = brandBadge.querySelector("img");
    if (badgeImage) {
      if (badgeImage.dataset.defaultSrc === undefined) badgeImage.dataset.defaultSrc = badgeImage.getAttribute("src") || "";
      badgeImage.src = brandLogo || badgeImage.dataset.defaultSrc;
    }
    brandBadge.classList.toggle("brand-badge-custom", Boolean(brandLogo));
    if (brandLogo) brandBadge.setAttribute("aria-label", brandBadgeLabel(brandUrl));
    else brandBadge.removeAttribute("aria-label");
  }

  const brandFooter = String(profile.brand_footer || "").trim();
  const footerBrand = document.querySelector("[data-brand-footer]");
  if (footerBrand) {
    if (footerBrand.dataset.defaultText === undefined) footerBrand.dataset.defaultText = footerBrand.textContent;
    footerBrand.textContent = brandFooter || footerBrand.dataset.defaultText;
  }

  cachePageBranding({
    themeCss: brandThemeStyle?.textContent || "",
    logo: brandLogo,
    background: brandBackground,
    welcome: brandWelcome,
    url: brandUrl,
    footer: brandFooter,
    customerName,
  });
}

function cachePageBranding(entry) {
  try {
    if (Object.values(entry).some((value) => value)) {
      localStorage.setItem("saashup_page_branding", JSON.stringify(entry));
    } else {
      localStorage.removeItem("saashup_page_branding");
    }
  } catch {}
}

const brandPaletteState = { url: "", colors: [] };

function updateBrandColorPreviews() {
  [["brand_primary", "brandPrimaryPreview"], ["brand_secondary", "brandSecondaryPreview"]].forEach(([name, previewId]) => {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    const hex = hexColorValue(fieldValue(name));
    preview.style.backgroundColor = hex || "transparent";
    preview.classList.toggle("brand-color-preview-empty", !hex);
  });
}

function renderBrandSwatches(colors) {
  [["brandPrimarySwatches", "brand_primary"], ["brandSecondarySwatches", "brand_secondary"]].forEach(([containerId, fieldName]) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    colors.forEach(({ name, hex }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "brand-swatch";
      button.style.backgroundColor = hex;
      button.title = `${name} ${hex}`;
      button.setAttribute("aria-label", `Use ${name} ${hex}`);
      button.addEventListener("click", () => {
        setFieldValue(fieldName, hex);
        updateBrandColorPreviews();
        updateProfileSyncWarning();
      });
      container.appendChild(button);
    });
    container.classList.toggle("hidden", !colors.length);
  });
}

async function extractBrandPaletteFromImage(image) {
  if (!image || typeof Vibrant === "undefined") return;
  try {
    const palette = await Vibrant.from(image).getPalette();
    const colors = ["Vibrant", "DarkVibrant", "LightVibrant", "Muted", "DarkMuted"]
      .map((name) => ({ name, swatch: palette[name] }))
      .filter(({ swatch }) => swatch)
      .map(({ name, swatch }) => ({ name, hex: hexColorValue(typeof swatch.getHex === "function" ? swatch.getHex() : swatch.hex) }))
      .filter(({ hex }) => hex);
    brandPaletteState.colors = colors;
    renderBrandSwatches(colors);
    if (!colors.length) return;
    if (!hexColorValue(fieldValue("brand_primary"))) setFieldValue("brand_primary", colors[0].hex);
    if (!hexColorValue(fieldValue("brand_secondary")) && colors[1]) setFieldValue("brand_secondary", colors[1].hex);
    updateBrandColorPreviews();
    updateProfileSyncWarning();
  } catch {
    renderBrandSwatches([]);
    setNotice("Color extraction from the logo failed", "error");
  }
}

const BRAND_IMAGE_MAX_BYTES = 1024 * 1024;
const brandUploadKinds = {
  logo: {
    field: "brand_logo",
    maxWidth: 1000,
    maxHeight: 1000,
    fileInputId: "brandLogoFile",
    uploadBtnId: "brandLogoUploadBtn",
    removeBtnId: "brandLogoRemoveBtn",
    previewId: "brandLogoPreviewImg",
    uploadKey: "logo_upload",
    removeKey: "logo_remove",
  },
  background: {
    field: "brand_background",
    maxWidth: 2560,
    maxHeight: 1440,
    fileInputId: "brandBackgroundFile",
    uploadBtnId: "brandBackgroundUploadBtn",
    removeBtnId: "brandBackgroundRemoveBtn",
    previewId: "brandBackgroundPreviewImg",
    uploadKey: "background_upload",
    removeKey: "background_remove",
  },
};
const brandUploadState = {
  logo: { data: "", remove: false },
  background: { data: "", remove: false },
};

function loadBrandImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable image"));
    };
    image.src = url;
  });
}

async function processBrandImageFile(file, { maxWidth, maxHeight }) {
  const { image, url } = await loadBrandImageElement(file);
  try {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error("unreadable image");
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.85, 0.75, 0.6, 0.45]) {
      const dataUrl = canvas.toDataURL("image/webp", quality);
      const base64 = dataUrl.split(",")[1] || "";
      if (!dataUrl.startsWith("data:image/webp")) throw new Error("WebP encoding is not supported by this browser");
      if (Math.ceil(base64.length * 3 / 4) <= BRAND_IMAGE_MAX_BYTES) {
        return { base64, dataUrl, image };
      }
    }
    throw new Error("image is still over 1MB after compression");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function updateBrandUploadWidget(kindName) {
  const kind = brandUploadKinds[kindName];
  const preview = document.getElementById(kind.previewId);
  const removeBtn = document.getElementById(kind.removeBtnId);
  if (!preview || !removeBtn) return;

  const pending = brandUploadState[kindName];
  const storedUrl = fieldValue(kind.field).trim();
  const shownUrl = pending.data ? `data:image/webp;base64,${pending.data}` : (pending.remove ? "" : storedUrl);
  preview.src = shownUrl || "";
  preview.classList.toggle("hidden", !shownUrl);
  removeBtn.classList.toggle("hidden", !shownUrl);
}

function resetBrandUploads() {
  Object.keys(brandUploadState).forEach((kindName) => {
    brandUploadState[kindName] = { data: "", remove: false };
    const input = document.getElementById(brandUploadKinds[kindName].fileInputId);
    if (input) input.value = "";
    updateBrandUploadWidget(kindName);
  });
}

async function handleBrandImageSelection(kindName) {
  const kind = brandUploadKinds[kindName];
  const input = document.getElementById(kind.fileInputId);
  const file = input?.files?.[0];
  if (!file) return;

  try {
    const { base64, image } = await processBrandImageFile(file, kind);
    brandUploadState[kindName] = { data: base64, remove: false };
    updateBrandUploadWidget(kindName);
    if (kindName === "logo") await extractBrandPaletteFromImage(image);
  } catch (error) {
    input.value = "";
    setNotice(`Image processing failed: ${error.message || "unknown error"}`, "error");
  }
}

let savedBrandings = {};
let savedBrandingLimit = Infinity;
let brandingsLoaded = false;

const brandingFieldNames = ["brand_logo", "brand_primary", "brand_secondary", "brand_background", "brand_welcome", "brand_url", "brand_footer"];

function updateBrandingOptions() {
  const names = Object.keys(savedBrandings).sort((a, b) => a.localeCompare(b));
  const brandingSelect = field("branding_select");
  if (brandingSelect) {
    const canCreateBranding = names.length < savedBrandingLimit;
    const selected = brandingSelect.value;
    brandingSelect.innerHTML = "";
    if (canCreateBranding) brandingSelect.appendChild(new Option("New branding…", ""));
    names.forEach((name) => brandingSelect.appendChild(new Option(name, name)));
    brandingSelect.value = names.includes(selected) ? selected : (canCreateBranding ? "" : names[0] || "");
  }
  const profileBrandingSelect = field("profile_branding");
  if (profileBrandingSelect) {
    const selected = profileBrandingSelect.value;
    profileBrandingSelect.innerHTML = "";
    profileBrandingSelect.appendChild(new Option("SaaShup", ""));
    names.forEach((name) => profileBrandingSelect.appendChild(new Option(name, name)));
    profileBrandingSelect.value = names.includes(selected) ? selected : "";
  }
}

async function loadBrandings({ force = false } = {}) {
  if (brandingsLoaded && !force) return;
  try {
    const response = await fetch("/admin/brandings", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = plainObject(await response.json());
    savedBrandings = plainObject(data.brandings);
    savedBrandingLimit = Number.isInteger(data.limit) && data.limit >= 0 ? data.limit : Infinity;
    brandingsLoaded = true;
  } catch {
    savedBrandings = {};
  }
  updateBrandingOptions();
  setFieldValue("profile_branding", profileCredentials(currentConfigProfile).branding);
}

function applyBrandingToFields(name = "") {
  const branding = plainObject(savedBrandings[name]);
  setFieldValue("branding_name", name);
  brandingFieldNames.forEach((fieldName) => setFieldValue(fieldName, branding[fieldName] || ""));
  renderBrandSwatches([]);
  updateBrandColorPreviews();
  resetBrandUploads();
}

function profileBrandingData(name = currentConfigProfile) {
  const profile = plainObject(knownProfileEntries()[name]);
  const branding = plainObject(savedBrandings[String(profile.branding || "").trim()]);
  return Object.keys(branding).length ? branding : profile;
}

let orderButtonModalTemplate = "";
let orderButtonModalProfile = "";

function openOrderButtonModal(templateName, profileName = "") {
  orderButtonModalTemplate = String(templateName || "").trim();
  orderButtonModalProfile = String(profileName || "").trim();
  const hideNavigation = document.getElementById("embed_hide_navigation");
  if (hideNavigation) hideNavigation.checked = false;
  updateBrandButtonSnippet();
  document.getElementById("orderButtonModal")?.classList.remove("hidden");
}

function closeOrderButtonModal() {
  document.getElementById("orderButtonModal")?.classList.add("hidden");
}

function updateBrandButtonSnippet() {
  const snippetField = document.getElementById("brandButtonSnippet");
  const preview = document.getElementById("brandButtonPreview");
  if (!snippetField && !preview) return;

  const profile = (orderButtonModalProfile || selectedProfileCredentials().profile || currentConfigProfile || "").trim();
  const template = orderButtonModalTemplate;
  const brandingData = profileBrandingData(profile);
  const primary = hexColorValue(brandingData.brand_primary) || "#246bfe";
  const primaryDark = mixHexColors(primary, "#000000", 0.22);
  const [r, g, b] = hexToRgb(primary);
  const label = template ? `Order ${template}` : "Order now";

  const params = new URLSearchParams();
  if (template) params.set("template", template);
  if (fieldChecked("embed_hide_navigation", false)) params.set("navigation", "false");
  const query = params.toString();
  const url = `${window.location.origin}/order${query ? `?${query}` : ""}`;

  const style = [
    "display:inline-block",
    "padding:13px 26px",
    "border-radius:12px",
    `background:${primary}`,
    "color:#ffffff",
    "font:700 16px/1.2 Inter,ui-sans-serif,system-ui,sans-serif",
    "text-decoration:none",
    `box-shadow:0 8px 18px rgba(${r}, ${g}, ${b}, 0.25)`,
    `border:1px solid ${primaryDark}`,
  ].join(";");

  const snippet = `<a href="${url}" target="_blank" rel="noopener" style="${style}">${escapeHtml(label)}</a>`;
  if (snippetField) snippetField.value = snippet;
  if (preview) preview.innerHTML = snippet;
}

async function copyBrandButtonSnippet() {
  const snippetField = document.getElementById("brandButtonSnippet");
  const snippet = snippetField?.value || "";
  if (!snippet) return;
  try {
    await navigator.clipboard.writeText(snippet);
    setNotice("Order button snippet copied", "success");
  } catch {
    snippetField.select();
    document.execCommand("copy");
    setNotice("Order button snippet copied", "success");
  }
}

async function saveBranding() {
  const name = (fieldValue("branding_name") || fieldValue("branding_select") || "").trim();
  if (!name) {
    setNotice("Branding name is required", "error");
    return;
  }
  for (const colorField of ["brand_primary", "brand_secondary"]) {
    const value = fieldValue(colorField).trim();
    if (value && !hexColorValue(value)) {
      setNotice(`${colorField === "brand_primary" ? "Primary" : "Secondary"} color must be a hex value like #246bfe`, "error");
      return;
    }
  }
  const brandUrl = fieldValue("brand_url").trim();
  if (brandUrl && !httpUrlValue(brandUrl)) {
    setNotice("Website link must start with http:// or https://", "error");
    return;
  }
  const payload = { name };
  ["brand_primary", "brand_secondary", "brand_welcome", "brand_url", "brand_footer"].forEach((fieldName) => {
    payload[fieldName] = fieldValue(fieldName).trim();
  });
  Object.entries(brandUploadKinds).forEach(([kindName, kind]) => {
    const pending = brandUploadState[kindName];
    if (pending.data) payload[kind.uploadKey] = pending.data;
    else if (pending.remove) payload[kind.removeKey] = true;
  });

  try {
    const response = await fetch("/admin/brandings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const detail = (await response.json().catch(() => ({}))).error;
      throw new Error(detail || `HTTP ${response.status}`);
    }
    const saved = await response.json();
    savedBrandings[saved.name] = plainObject(saved.branding);
    updateBrandingOptions();
    setFieldValue("branding_select", saved.name);
    applyBrandingToFields(saved.name);
    setNotice(`Branding "${saved.name}" saved`, "success");
  } catch (error) {
    setNotice(`Branding save failed: ${error.message || "unknown error"}`, "error");
  }
}

async function deleteBranding() {
  const name = fieldValue("branding_select").trim();
  if (!name) {
    setNotice("Select a saved branding to delete", "error");
    return;
  }
  if (!confirm(`Delete branding "${name}"? Profiles using it will fall back to the default look.`)) return;

  try {
    const response = await fetch(`/admin/brandings/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    delete savedBrandings[name];
    updateBrandingOptions();
    applyBrandingToFields("");
    await loadSavedConfig();
    setNotice(`Branding "${name}" deleted`, "success");
  } catch (error) {
    setNotice(`Branding delete failed: ${error.message || "unknown error"}`, "error");
  }
}

function applyProfileToFields(name = currentConfigProfile, { syncNetwork = true } = {}) {
  currentConfigProfile = name || "";
  const credentials = profileCredentials(currentConfigProfile);

  setFieldValue("config_profile", currentConfigProfile);
  setFieldValue("config_name", currentConfigProfile);
  setFieldValue("customer_name", savedConfig.customer_name || "");
  setFieldValue("netbox", credentials.netbox);
  setFieldValue("token", credentials.token);
  setFieldValue("proxy", credentials.proxy);
  setFieldValue("domain", credentials.domain);
  setFieldValue("tag", credentials.tag);
  setFieldValue("max_instances", "1");
  setFieldValue("images_to_keep", "2");
  setFieldValue("enrollment_limit", credentials.enrollment_limit);
  setFieldValue("owner_env_var", credentials.owner_env_var);
  setFieldValue("cloudflare_filter", credentials.cloudflare_filter);
  setFieldValue("parallel_upgrade", credentials.parallel_upgrade);
  setFieldValue("smtp_config", credentials.smtp_config);
  setFieldValue("profile_branding", credentials.branding);
  applyProfileBranding(knownProfileEntries()[currentConfigProfile] || {});
  if (isTemplateAction()) applyRegistryDefaultSecret();
  persistProfiles();
  if (syncNetwork) syncCreateNetwork();
  updateProfileSyncWarning();
  updateTestEmailVisibility();
  updateConfigDefaultControl();
  updateTestConnectionButtonLabel();
}

function currentSmtpConfigValue() {
  if (currentAction === "config") return fieldValue("smtp_config");
  return selectedProfileCredentials().smtp_config || "";
}

function updateTestEmailVisibility() {
  if (!testEmailBtn) return;
  const hasSmtp = Boolean(currentSmtpConfigValue());
  const visible = currentAction === "config" && hasSmtp;
  testEmailBtn.classList.toggle("hidden", !visible);
  if (!visible) return;

  const ownerReady = Boolean(mailSettings.owner_email_configured);
  testEmailBtn.disabled = !ownerReady;
  testEmailBtn.title = ownerReady
    ? "Send a test notification email"
    : "Set APP_OWNER_EMAIL to enable test emails";
}

async function loadRegistryDefaultSecret() {
  if (isOrderPage || isCatalogPage) return;
  if (isEnrollPage && !currentAuthUser?.admin) return;
  if (registryWebhookDefaultLoaded) return;
  registryWebhookDefaultLoaded = true;

  try {
    const response = await fetch("/registry-webhook-secret", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    registryWebhookDefaultSecret = data.default_secret || data.secret || "";
  } catch {
    registryWebhookDefaultSecret = "";
  }

  applyRegistryDefaultSecret();
}

function applyRegistryDefaultSecret() {
  if (!isTemplateAction() || !registryWebhookSecretInput || registryWebhookSecretInput.value || !registryWebhookDefaultSecret) return;
  registryWebhookSecretInput.value = registryWebhookDefaultSecret;
}

function registryWebhookSecretValue() {
  const value = fieldValue("registry_webhook_secret");
  if (value === registryWebhookDefaultSecret) return "";
  return value;
}

function credentialsQuery({ includeTag = false } = {}) {
  let credentials = selectedProfileCredentials();
  if (!credentials.profile) {
    const knownProfiles = Object.keys(knownProfileEntries()).sort((a, b) => a.localeCompare(b));
    const fallbackProfile = visibleConfigProfileName() || (knownProfiles[0] || "");
    if (fallbackProfile) {
      credentials = profileCredentials(fallbackProfile);
    }
  }

  if (!credentials.profile) return null;

  const query = new URLSearchParams({
    profile: credentials.profile,
    config_profile: credentials.profile,
  });

  if (includeTag) {
    query.set("tag", credentials.tag);
  }

  return query;
}

function shouldFilterRefreshByTag() {
  return isCreateFormAction() || currentAction === "recreate" || currentAction === "restart" || currentAction === "delete";
}

function setTestButtonState(state = "default") {
  if (!testBtn) return;

  testBtn.classList.toggle("btn-success", state === "success");
  testBtn.classList.toggle("btn-danger", state === "error");
  testBtn.classList.toggle("btn-primary", state === "default");
}

function updateTestConnectionButtonLabel() {
  if (!testBtn) return;

  const profile = currentConfigProfile || configProfileSelect?.value || "";
  const label = profile ? `Test connection: ${profile}` : "Test connection: no profile";
  testBtn.textContent = label;
  testBtn.title = label;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function reportStatIcon(kind) {
  const icons = {
    hosts: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v6H5z"></path><path d="M5 14h14v6H5z"></path><path d="M8 7h.01M8 17h.01M12 10v4"></path></svg>',
    images: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7l8 4 8-4z"></path><path d="m4 12 8 4 8-4"></path><path d="m4 17 8 4 8-4"></path></svg>',
    containers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18v10H3z"></path><path d="M7 7v10M12 7v10M17 7v10"></path></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  };

  return icons[kind] || "";
}

function reportStat(kind, value, label) {
  return `
    <span class="report-stat" data-report-stat="${kind}">
      <span class="report-stat-icon">${reportStatIcon(kind)}</span>
      <span class="report-stat-copy">
        <strong>${Number(value || 0)}</strong>
        <small>${escapeHtml(label)}</small>
      </span>
    </span>
  `;
}

function renderReportStats(totalHosts = 0, totalImages = 0, totalContainers = 0, totalUsers = 0) {
  if (!reportSummary) return;

  reportSummary.innerHTML = [
    reportStat("hosts", totalHosts, totalHosts === 1 ? "Host" : "Hosts"),
    reportStat("images", totalImages, totalImages === 1 ? "Image" : "Images"),
    reportStat("containers", totalContainers, totalContainers === 1 ? "Container" : "Containers"),
    reportStat("users", totalUsers, totalUsers === 1 ? "User" : "Users"),
  ].join("");
}

function reportSummaryHasStats() {
  return Boolean(reportSummary?.querySelector("[data-report-stat]"));
}

function renderReportLoadingRow() {
  if (!reportTableBody) return;

  reportTableBody.innerHTML = `
    <tr>
      <td colspan="4" class="report-loading-cell">
        <span class="report-loader" aria-hidden="true"></span>
        <span>Loading image report...</span>
      </td>
    </tr>
  `;
}

function renderReportHeader(columns) {
  if (!reportTableHead) return;

  reportTableHead.innerHTML = `
    <tr>
      ${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
    </tr>
  `;
}

function renderImageReportRows(rows) {
  renderReportHeader(["Config", "Image", "Version", "Containers"]);
  reportTableBody?.closest("table")?.classList.remove("report-users");
  if (!reportTableBody) return;

  if (!rows.length) {
    reportTableBody.innerHTML = '<tr><td colspan="4">No images found for this selection.</td></tr>';
    return;
  }

  reportTableBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.profile || "Default")}</td>
      <td>${escapeHtml(row.image)}</td>
      <td>${escapeHtml(row.version)}</td>
      <td>${Number(row.containers || 0)}</td>
    </tr>
  `).join("");
}

function renderUserReportRows(users) {
  renderReportHeader(["User", "Config", "Containers", "What they have"]);
  reportTableBody?.closest("table")?.classList.add("report-users");
  if (!reportTableBody) return;

  if (!users.length) {
    reportTableBody.innerHTML = '<tr><td colspan="4">No user ownership found for this selection.</td></tr>';
    return;
  }

  reportTableBody.innerHTML = users.map((user) => `
    <tr>
      <td>${escapeHtml(user.user)}</td>
      <td>${escapeHtml((user.profiles || []).join(", ") || "Default")}</td>
      <td>${Number(user.containers || 0)}</td>
      <td>
        <div class="report-user-assets">
          ${(user.items || []).length
            ? user.items.map((item) => {
              const image = [item.image, item.version].filter(Boolean).join(":");
              return `<span>${escapeHtml(item.container || "container")}${image ? ` - ${escapeHtml(image)}` : ""}</span>`;
            }).join("")
            : '<span>No instance details available</span>'}
        </div>
      </td>
    </tr>
  `).join("");
}

function renderReportTable(data) {
  const rows = Array.isArray(data?.rows) ? data.rows : [];
  const users = Array.isArray(data?.users) ? data.users : [];
  if (currentReportView === "users") {
    renderUserReportRows(users);
    return;
  }

  renderImageReportRows(rows);
}

function renderReport(data) {
  const rows = Array.isArray(data?.rows) ? data.rows : [];
  const totalHosts = Number(data?.total_hosts || 0);
  const totalImages = Number(data?.total_images ?? rows.length);
  const totalContainers = Number(data?.total_containers ?? rows.reduce((total, row) => total + Number(row.containers || 0), 0));
  const totalUsers = Number(data?.total_users || 0);

  lastReportData = data;
  renderReportStats(totalHosts, totalImages, totalContainers, totalUsers);
  renderReportTable(data);
}

function setReportView(view) {
  currentReportView = view === "users" ? "users" : "images";
  reportViewButtons.forEach((button) => {
    const active = button.dataset.reportView === currentReportView;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  if (lastReportData) renderReportTable(lastReportData);
}

async function refreshImageReport() {
  if (!reportProfileSelect || !refreshReportBtn) return;

  updateReportProfileOptions();
  const profile = reportProfileSelect.value || "";
  const query = new URLSearchParams({ profile });
  const credentials = profileCredentials(profile);
  query.set("config_profile", credentials.profile);
  if (credentials.tag) query.set("tag", credentials.tag);
  const profiles = plainObject(knownProfileEntries());
  if (Object.keys(profiles).length) {
    query.set("profiles", JSON.stringify(profiles));
  }

  refreshReportBtn.disabled = true;
  if (!reportSummaryHasStats()) renderReportStats();
  reportSummary?.classList.remove("is-error");
  renderReportLoadingRow();

  try {
    const response = await fetch(`/report/images?${query.toString()}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    renderReport(await response.json());
    setNotice("Image report loaded", "success");
  } catch {
    reportSummary?.classList.add("is-error");
    if (reportTableBody) reportTableBody.innerHTML = '<tr><td colspan="4">Report failed. Check the selected config and NetBox connection.</td></tr>';
    setNotice("Image report failed", "error");
  } finally {
    refreshReportBtn.disabled = false;
  }
}

function renderEnvironmentVariables(variables) {
  if (!environmentList || !environmentSummary) return;

  const entries = Array.isArray(variables) ? variables : [];
  environmentSummary.textContent = `${entries.length} environment ${entries.length === 1 ? "variable" : "variables"}`;
  environmentList.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No environment variables found.";
    environmentList.appendChild(empty);
    return;
  }

  entries.forEach(({ name, value }) => {
    const row = document.createElement("label");
    row.className = "environment-row";

    const label = document.createElement("span");
    label.className = "environment-name";
    label.textContent = String(name || "");

    const input = document.createElement("input");
    input.className = "environment-value";
    input.type = "text";
    input.readOnly = true;
    input.value = String(value ?? "");
    input.setAttribute("aria-label", `${String(name || "Environment variable")} value`);

    row.append(label, input);
    environmentList.appendChild(row);
  });
}

async function loadEnvironmentVariables({ force = false } = {}) {
  if (!environmentCard || (!force && environmentLoaded)) return;

  if (refreshEnvironmentBtn) refreshEnvironmentBtn.disabled = true;
  if (environmentSummary) {
    environmentSummary.classList.remove("is-error");
    environmentSummary.textContent = "Loading environment...";
  }

  try {
    const response = await fetch("/admin/environment", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderEnvironmentVariables(data.variables);
    environmentLoaded = true;
  } catch {
    environmentLoaded = false;
    environmentSummary?.classList.add("is-error");
    if (environmentSummary) environmentSummary.textContent = "Environment failed to load";
    environmentList?.replaceChildren();
    setNotice("Environment failed to load", "error");
  } finally {
    if (refreshEnvironmentBtn) refreshEnvironmentBtn.disabled = false;
  }
}

function formatLogLine(line) {
  const text = line.replace(/&nbsp;/g, " ").trim();
  if (!text) return "";

  const match = text.match(/^(.{24})\s+([A-Z_]+)\s*:\s*(.*)$/);
  if (!match) {
    return `<div class="log-row"><span></span><strong>LOG</strong><span>${escapeHtml(text)}</span><span></span></div>`;
  }

  const [, time, action, rest] = match;
  const statusMatch = rest.match(/\s(\d{3})$/);
  const status = statusMatch ? statusMatch[1] : "";
  const message = status ? rest.slice(0, -status.length).trim() : rest;

  return [
    '<div class="log-row">',
    `<span>${escapeHtml(time.trim())}</span>`,
    `<strong>${escapeHtml(action)}</strong>`,
    `<span>${escapeHtml(message)}</span>`,
    `<span>${escapeHtml(status)}</span>`,
    '</div>',
  ].join("");
}

function formatLogs(logs) {
  const rows = String(logs || "")
    .split(/<br\s*\/?>/i)
    .map(formatLogLine)
    .filter(Boolean);

  return rows.length ? rows.join("") : "&nbsp;<br>";
}

function envRows() {
  return Array.from(envList?.querySelectorAll(".env-row") || []);
}

function repeatRows(list, selector) {
  return Array.from(list?.querySelectorAll(selector) || []);
}

function updateRepeatRemoveButtons(rows, removeSelector) {
  rows.forEach((row) => {
    const button = row.querySelector(removeSelector);
    if (button) button.disabled = rows.length === 1;
  });
}

function updateEnvRemoveButtons() {
  envRows().forEach((row) => {
    const button = row.querySelector(".env-remove");
    if (button) button.disabled = false;
  });
}

function updateLabelRemoveButtons() {
  repeatRows(labelList, ".repeat-row").forEach((row) => {
    const button = row.querySelector(".repeat-remove");
    if (button) button.disabled = false;
  });
}

function updatePortRemoveButtons() {
  updateRepeatRemoveButtons(repeatRows(portList, ".repeat-row"), ".repeat-remove");
}

function updateVolumeRemoveButtons() {
  repeatRows(volumeList, ".repeat-row").forEach((row) => {
    const button = row.querySelector(".repeat-remove");
    if (button) button.disabled = false;
  });
}

function updateBindRemoveButtons() {
  repeatRows(bindList, ".repeat-row").forEach((row) => {
    const button = row.querySelector(".repeat-remove");
    if (button) button.disabled = false;
  });
}

function loggingRow() {
  return loggingList?.querySelector(".logging-row") || null;
}

function isLoggingVisible() {
  return Boolean(loggingRow() && !loggingRow().classList.contains("hidden"));
}

function syncLoggingControls() {
  const row = loggingRow();
  const wrapper = loggingList?.closest("[data-field]");
  const fieldVisible = Boolean(wrapper && !wrapper.classList.contains("hidden"));
  const rowVisible = Boolean(row && !row.classList.contains("hidden"));

  row?.querySelectorAll("input, button").forEach((control) => {
    control.disabled = !fieldVisible || !rowVisible;
  });
  if (addLoggingBtn) addLoggingBtn.disabled = !fieldVisible || rowVisible;
}

function setLoggingRow(template = null) {
  const row = loggingRow();
  if (!row) return;

  const enabled = Boolean(template);
  row.classList.toggle("hidden", !enabled);

  if (enabled) {
    const options = normalizeLogDriverOptions(template.log_driver_options || template.log_options || template.logging_options);
    setFieldValue("log_driver", Object.hasOwn(template, "log_driver") ? template.log_driver : defaultLogDriver);
    setFieldValue("log_syslog_address", options["syslog-address"]);
    setFieldValue("log_syslog_tag", options.tag);
  } else {
    setFieldValue("log_driver", "");
    setFieldValue("log_syslog_address", "");
    setFieldValue("log_syslog_tag", "");
  }

  syncLoggingControls();
}

function addEnvRow(key = "", value = "") {
  if (!envList) return;

  const isFirstRow = envRows().length === 0;
  const row = document.createElement("div");
  row.className = "env-row";
  row.innerHTML = `
    <input type="text" name="var_env_key" placeholder="APP_ENV" aria-label="Environment variable name">
    <input type="text" name="var_env_value" placeholder="production" aria-label="Environment variable value">
    <button type="button" class="icon-btn env-remove" aria-label="Remove environment variable">&times;</button>
  `;

  const keyInput = row.querySelector('[name="var_env_key"]');
  const valueInput = row.querySelector('[name="var_env_value"]');
  if (isFirstRow) {
    keyInput.id = "var_env_key";
    valueInput.id = "var_env_value";
  }
  keyInput.value = key;
  valueInput.value = value;
  envList.appendChild(row);
  updateEnvRemoveButtons();
}

function addLabelRow(key = "", value = "") {
  if (!labelList) return;

  const isFirstRow = repeatRows(labelList, ".repeat-row").length === 0;
  const row = document.createElement("div");
  row.className = "repeat-row";
  row.innerHTML = `
    <input type="text" name="label_key" placeholder="traefik.enable" aria-label="Label key">
    <input type="text" name="label_value" placeholder="true" aria-label="Label value">
    <button type="button" class="icon-btn repeat-remove" aria-label="Remove label">&times;</button>
  `;

  const keyInput = row.querySelector('[name="label_key"]');
  const valueInput = row.querySelector('[name="label_value"]');
  if (isFirstRow) {
    keyInput.id = "label_key";
    valueInput.id = "label_value";
  }
  keyInput.value = key;
  valueInput.value = value;
  labelList.appendChild(row);
  updateLabelRemoveButtons();
}

function addVolumeRow(source = "", name = "") {
  if (!volumeList) return;

  const isFirstRow = repeatRows(volumeList, ".repeat-row").length === 0;
  const row = document.createElement("div");
  row.className = "repeat-row";
  row.innerHTML = `
    <input type="text" name="volume_source" placeholder="/app/data" aria-label="Volume source path">
    <input type="text" name="volume_name" placeholder="instance-data" aria-label="Volume name" readonly>
    <button type="button" class="icon-btn repeat-remove" aria-label="Remove volume">&times;</button>
  `;

  const sourceInput = row.querySelector('[name="volume_source"]');
  const nameInput = row.querySelector('[name="volume_name"]');
  if (isFirstRow) {
    sourceInput.id = "volume_source";
    nameInput.id = "volume_name";
  }
  sourceInput.value = source;
  nameInput.value = name;
  volumeList.appendChild(row);
  syncVolumeNames();
  updateVolumeRemoveButtons();
}

function addBindRow(hostPath = "", containerPath = "", readOnly = false) {
  if (!bindList) return;

  const isFirstRow = repeatRows(bindList, ".repeat-row").length === 0;
  const row = document.createElement("div");
  row.className = "repeat-row bind-row";
  row.innerHTML = `
    <input type="text" name="bind_host_path" placeholder="/var/run/docker.sock" aria-label="Bind host path">
    <input type="text" name="bind_container_path" placeholder="/var/run/docker.sock" aria-label="Bind container path">
    <label class="mini-check mini-toggle" aria-label="Bind read only">
      <input type="checkbox" name="bind_read_only" value="true">
      <span>RO</span>
    </label>
    <button type="button" class="icon-btn repeat-remove" aria-label="Remove bind">&times;</button>
  `;

  const hostInput = row.querySelector('[name="bind_host_path"]');
  const containerInput = row.querySelector('[name="bind_container_path"]');
  const readOnlyInput = row.querySelector('[name="bind_read_only"]');
  if (isFirstRow) {
    hostInput.id = "bind_host_path";
    containerInput.id = "bind_container_path";
    readOnlyInput.id = "bind_read_only";
  }
  hostInput.value = hostPath;
  containerInput.value = containerPath;
  readOnlyInput.checked = readOnly === true || readOnly === "true" || readOnly === "ro";
  bindList.appendChild(row);
  updateBindRemoveButtons();
}

function setPortValue(value = "") {
  setFieldValue("port_value", value);
  updatePortRemoveButtons();
}

function clearEnvRows() {
  envRows().forEach((row) => row.remove());
  updateEnvRemoveButtons();
}

function clearRepeatRows(list, rowSelector, fields, updateButtons) {
  const rows = repeatRows(list, rowSelector);

  rows.slice(1).forEach((row) => row.remove());
  fields.forEach((name) => setFieldValue(name, ""));
  updateButtons();
}

function clearLabelRows() {
  repeatRows(labelList, ".repeat-row").forEach((row) => row.remove());
  updateLabelRemoveButtons();
}

function clearVolumeRows() {
  repeatRows(volumeList, ".repeat-row").forEach((row) => row.remove());
  syncVolumeNames();
  updateVolumeRemoveButtons();
}

function clearBindRows() {
  repeatRows(bindList, ".repeat-row").forEach((row) => row.remove());
  updateBindRemoveButtons();
}

function clearPortRows() {
  setPortValue("");
}

function setNotice(message, type = "info", autoClear = true) {
  const notif = document.getElementById("notif");
  if (!notif) return;

  notif.textContent = message;
  notif.className = "notice";
  notif.classList.remove("hidden");

  if (type === "success") {
    notif.style.backgroundColor = "#dcfce7";
    notif.style.borderColor = "#bbf7d0";
    notif.style.color = "#166534";
  } else if (type === "error") {
    notif.style.backgroundColor = "#fee2e2";
    notif.style.borderColor = "#fecaca";
    notif.style.color = "#991b1b";
  } else {
    notif.style.backgroundColor = "#e0f2fe";
    notif.style.borderColor = "#bae6fd";
    notif.style.color = "#075985";
  }

  if (noticeTimeout) clearTimeout(noticeTimeout);

  if (autoClear && message !== "Welcome !") {
    noticeTimeout = setTimeout(() => {
      setNotice("Welcome !", "info", false);
    }, 4000);
  }
}

function hideNotice() {
  const notif = document.getElementById("notif");
  if (!notif) return;
  notif.classList.add("hidden");
}

function setOrderStatus(message, type = "success", reason = "") {
  if (!orderStatus) return;

  orderStatus.className = `order-status ${type}`;
  orderStatus.dataset.reason = reason;
  orderStatus.replaceChildren(document.createTextNode(message));
}

function clearOrderStatus(reason = "") {
  if (!orderStatus) return;
  if (reason && orderStatus.dataset.reason !== reason) return;

  orderStatus.className = "order-status hidden";
  orderStatus.dataset.reason = "";
  orderStatus.replaceChildren();
}

function safeNavigationUrl(value, fallback = "/") {
  const url = String(value || "").trim();
  if (!url) return fallback;
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return url;
  } catch {
    return fallback;
  }

  return fallback;
}

function orderHomeUrl() {
  return safeNavigationUrl();
}

function setOrderActionStatus(messageText, type, reason) {
  if (!orderStatus) return;

  const message = document.createElement("span");
  message.textContent = messageText;
  orderStatus.className = `order-status ${type}`;
  orderStatus.dataset.reason = reason;
  orderStatus.replaceChildren(message);
}

function setOrderDeleteStatus(instance) {
  setOrderActionStatus(`Delete requested for ${instance}.`, "success", "delete-requested");
}

function orderLimitMessage(limit) {
  const max = Number(limit?.max || 0);
  return `You have reached your maximum of ${max} instance${max === 1 ? "" : "s"}.`;
}

function setOrderLimitStatus(limit) {
  setOrderActionStatus(orderLimitMessage(limit), "error", "limit-reached");
}

function setOrderBlockedStatus(message, reason) {
  setOrderActionStatus(message, "error", reason);
}

function setSubmitValidationError(message) {
  if (isOrderPage) setOrderActionStatus(message, "error", "validation-error");
  else setNotice(message, "error");
  if (isEnrollPage) updateEnrollSubmitState({ notify: false });
}

function orderCanRequestMessage(limit) {
  const remaining = Number(limit?.remaining || 0);
  if (remaining > 1) return `You can request ${remaining} more instances for this config.`;
  return "You can request another instance for this config.";
}

function prepareNextOrderRequest() {
  if (!isOrderPage) return;

  const entry = createTemplateEntry(orderTemplateName);
  const templateDnsPath = dnsParts(entry?.template?.dns_name).path;
  setFieldValue("instance", "");
  setFieldValue("dns_name", "");
  generatedCreateInstanceName = "";
  generatedCreateDnsName = "";
  ensureRandomCreateInstanceName();
  if (templateDnsPath) {
    const dnsName = `${createDnsName()}${templateDnsPath}`;
    setFieldValue("dns_name", dnsName);
    generatedCreateDnsName = dnsName;
  }
  if (submitBtn) submitBtn.disabled = false;
}

function normalizedOrderInstanceStatus(item) {
  const status = String(item?.status || "ready").toLowerCase();
  return ["creating", "deleting", "failed", "ready", "recorded"].includes(status) ? status : "ready";
}

function isPendingOrderInstance(item) {
  return ["creating", "deleting"].includes(normalizedOrderInstanceStatus(item));
}

function orderInstanceStatusControl(item, index) {
  const status = normalizedOrderInstanceStatus(item);
  const instance = escapeHtml(item.instance || "instance");

  if (status === "creating" || status === "deleting") {
    const label = status === "deleting" ? "Instance is being deleted" : "Instance is being created";
    return `<span class="order-instance-status order-instance-status-${status}" title="${label}" aria-label="${label}">↻</span>`;
  }

  if (status === "failed") {
    return '<span class="order-instance-status order-instance-status-failed" title="Instance creation failed" aria-label="Instance creation failed">!</span>';
  }

  return `
    <span class="order-instance-actions">
      ${orderInstanceOpenButton(item)}
      <button type="button" class="icon-btn icon-btn-danger order-instance-delete" data-order-instance-delete="${index}" title="Delete ${instance}" aria-label="Delete ${instance}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
      </button>
    </span>
  `;
}

function orderInstanceStatusText(item) {
  const status = normalizedOrderInstanceStatus(item);
  if (status === "creating") return "Creating";
  if (status === "deleting") return "Deleting";
  if (status === "failed") return "Failed";
  if (status === "recorded") return "Recorded";
  return "Ready";
}

function orderInstanceStatusTextClass(item) {
  return `order-instance-state order-instance-state-${normalizedOrderInstanceStatus(item)}`;
}

function refreshPendingProgressState(limit, instances) {
  if (!orderRedirectTarget) {
    orderPendingProgressActive = false;
    orderPendingFailed = false;
    return null;
  }
  const targetHost = orderInstanceTargetHost(orderRedirectTarget);
  const progress = limit?.pending_progress
    || (Array.isArray(instances) ? instances : []).find((item) => item?.progress && orderInstanceMatchesTarget(item, targetHost))?.progress
    || null;
  orderPendingFailed = Boolean(progress?.failed);
  orderPendingProgressActive = Boolean(progress) && !progress.failed;
  if (orderPendingProgressActive) orderLastProgressStep = Math.max(orderLastProgressStep, Number(progress.step) || 0);
  return orderPendingProgressActive ? progress : null;
}

function mappedOrderInstancesForRender(instances) {
  const redirectTargetHost = orderRedirectTarget ? orderInstanceTargetHost(orderRedirectTarget) : "";
  const redirectElapsed = orderRedirectSince ? Date.now() - orderRedirectSince : 0;
  const redirectGraceActive = orderRedirectTarget && orderRedirectSince && !orderPendingFailed
    && (orderPendingProgressActive || redirectElapsed < 60 * 1000);
  const mapped = (Array.isArray(instances) ? instances : []).map((item) => {
    if (orderDeletingInstances.has(item?.instance)) return { ...item, status: "deleting" };
    if (redirectGraceActive
      && normalizedOrderInstanceStatus(item) === "failed"
      && orderInstanceMatchesTarget(item, redirectTargetHost)) {
      return { ...item, status: "creating" };
    }
    return item;
  });
  if (orderRedirectTarget && !mapped.some((item) => orderInstanceMatchesTarget(item, redirectTargetHost))) {
    mapped.push({
      instance: orderRedirectTarget,
      template: orderRedirectTemplateName || orderTemplateName,
      image: fieldValue("image"),
      version: fieldValue("version"),
      status: "creating",
      source: "local-pending",
    });
  }
  return mapped;
}

async function refreshOrderInstanceStatuses() {
  if (!isOrderPage || !orderInstances) return;

  try {
    const limit = await orderLimitForProfile(selectedProfileCredentials().profile);
    const instances = Array.isArray(limit.instances) ? limit.instances : [];
    const visibleInstances = new Set(instances.map((item) => item?.instance).filter(Boolean));
    Array.from(orderDeletingInstances).forEach((instance) => {
      if (!visibleInstances.has(instance)) orderDeletingInstances.delete(instance);
    });
    const pendingProgress = refreshPendingProgressState(limit, instances);
    const mappedInstances = mappedOrderInstancesForRender(instances);
    renderOrderInstances(mappedInstances, limit);
    if (orderRedirectTarget) updateOrderProgress(pendingProgress);
    else if (!orderRedirectCountdownActive) updateOrderProgress(null);
    maybeRedirectToReadyInstance();
    const hasCreating = orderInstanceCards.some((item) => normalizedOrderInstanceStatus(item) === "creating");
    const hasOrderUsage = Number(limit.used || 0) > 0 || instances.length > 0;
    if (hasOrderUsage && !hasCreating && !orderRedirectCountdownActive && orderStatus?.dataset.reason === "order-requested") {
      if (limit.reached) setOrderLimitStatus(limit);
      else {
        prepareNextOrderRequest();
        showOrderActions();
        setOrderStatus(orderCanRequestMessage(limit), "success", "request-available");
      }
    }
  } catch {
    // Keep the current cards visible if a background refresh fails.
  }
}

function syncOrderStatusPolling() {
  if (!isOrderPage) return;
  const hasPending = orderInstanceCards.some(isPendingOrderInstance) || Boolean(orderRedirectTarget);

  if (!hasPending && orderStatusPollTimer) {
    clearInterval(orderStatusPollTimer);
    orderStatusPollTimer = null;
    return;
  }

  if (hasPending && !orderStatusPollTimer) {
    orderStatusPollTimer = setInterval(refreshOrderInstanceStatuses, 3000);
  }
}

async function refreshEnrollmentInstanceStatuses() {
  if (!isEnrollPage || !enrollInstances) return;

  try {
    await refreshEnrollLimit({ showLoading: false, updateNotice: false });
  } catch {
    // Keep the current cards visible if a background refresh fails.
  }
}

function syncEnrollmentStatusPolling() {
  if (!isEnrollPage) return;
  const hasPending = enrollmentCards.some(isPendingOrderInstance);

  if (!hasPending && enrollmentStatusPollTimer) {
    clearInterval(enrollmentStatusPollTimer);
    enrollmentStatusPollTimer = null;
    return;
  }

  if (hasPending && !enrollmentStatusPollTimer) {
    enrollmentStatusPollTimer = setInterval(refreshEnrollmentInstanceStatuses, 3000);
  }
}

function renderOrderInstances(instances = orderInstanceCards, limit = orderInstanceLimit) {
  if (!orderInstances) return;

  orderInstanceCards = Array.isArray(instances) ? instances : [];
  orderInstanceLimit = {
    max: Number(limit?.max || 0),
    used: Number(limit?.used ?? orderInstanceCards.length),
    totalUsed: Number(limit?.total_used ?? orderInstanceCards.length),
  };

  if (!orderInstanceCards.length) {
    orderInstances.classList.add("hidden");
    orderInstances.replaceChildren();
    syncOrderStatusPolling();
    return;
  }

  const maxText = orderTemplateName && orderInstanceLimit.max > 0 ? ` / ${orderInstanceLimit.max}` : "";
  const countValue = orderTemplateName ? (orderInstanceLimit.used || orderInstanceCards.length) : (orderInstanceLimit.totalUsed || orderInstanceCards.length);
  const countClass = `order-instances-count${orderTemplateName && orderInstanceLimit.max > 0 && countValue >= orderInstanceLimit.max ? " limit-reached" : ""}`;
  orderInstances.classList.remove("hidden");
  orderInstances.innerHTML = `
    <div class="order-instances-header">
      <p class="eyebrow">Your instances</p>
      <span class="${countClass}">${countValue}${maxText}</span>
    </div>
    <div class="order-instance-grid">
      ${orderInstanceCards.map((item, index) => `
        <article class="order-instance-card" data-order-instance-card="${index}">
          <span class="order-instance-copy">
            <strong>${escapeHtml(item.template || item.image || "SaaShup instance")}</strong>
            <small>${escapeHtml(item.instance || "Instance requested")}</small>
            <small class="${orderInstanceStatusTextClass(item)}">${orderInstanceStatusText(item)}</small>
          </span>
          ${orderInstanceStatusControl(item, index)}
        </article>
      `).join("")}
    </div>
  `;
  syncOrderStatusPolling();
}

function renderEnrollmentInstances(instances = enrollmentCards, limit = enrollmentLimit) {
  if (!enrollInstances) return;

  enrollmentCards = Array.isArray(instances) ? instances : [];
  enrollmentLimit = {
    max: Number(limit?.max || 0),
    used: Number(limit?.used ?? enrollmentCards.length),
    reached: Boolean(limit?.reached),
  };

  if (!enrollmentCards.length) {
    enrollInstances.classList.add("hidden");
    enrollInstances.replaceChildren();
    syncEnrollmentStatusPolling();
    return;
  }

  const displayCards = enrollmentCards;
  const maxText = enrollmentLimit.max > 0 ? ` / ${enrollmentLimit.max}` : "";
  const countClass = `order-instances-count${enrollmentLimit.reached ? " limit-reached" : ""}`;
  enrollInstances.classList.remove("hidden");
  enrollInstances.innerHTML = `
    <div class="order-instances-header">
      <p class="eyebrow">Your images</p>
      <span class="${countClass}">${enrollmentLimit.used || enrollmentCards.length}${maxText}</span>
    </div>
    <div class="order-instance-grid">
      ${displayCards.map((item, index) => `
        <article class="order-instance-card" data-enroll-instance-card="${index}">
          <span class="order-instance-copy">
            ${isEnrollmentTemplateCard(item) ? enrollmentTemplateTitle(item) : orderInstanceNameLink(item.instance, item.dns_name)}
            <small>${escapeHtml(item.image || "SaaShup template")}</small>
            <small class="${orderInstanceStatusTextClass(item)}">${orderInstanceStatusText(item)}</small>
          </span>
          ${isEnrollmentTemplateTerminal(item) ? `
            <span class="order-instance-actions">
              ${isEnrollmentTemplateReady(item) ? `
                <button type="button" class="icon-btn order-template-copy" data-order-template-copy="${escapeHtml(item.instance)}" data-order-template-profile="${escapeHtml(item.profile || item.config_profile || "")}" title="Copy order button HTML" aria-label="Copy order button HTML for ${escapeHtml(item.instance)}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M5 15V7a2 2 0 0 1 2-2h8"></path></svg>
                </button>
                <button type="button" class="icon-btn template-webhook-copy" data-template-webhook-copy="${escapeHtml(item.instance)}" title="Copy webhook URL" aria-label="Copy webhook URL for ${escapeHtml(item.instance)}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.9 5.03"></path><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07l1.22-1.22"></path></svg>
                </button>
              ` : ""}
              <button type="button" class="icon-btn icon-btn-danger order-instance-delete" data-enroll-template-delete="${escapeHtml(item.instance)}" title="${escapeHtml(enrollTemplateDeleteTitle(item))}" aria-label="${escapeHtml(enrollTemplateDeleteTitle(item))}" ${enrollTemplateCanDelete(item) ? "" : "disabled"}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
              </button>
            </span>
          ` : ""}
        </article>
      `).join("")}
    </div>
  `;
  syncEnrollmentStatusPolling();
}

function isEnrollmentTemplateCard(item) {
  return item?.source === "template" || item?.source === "netbox-template" || item?.source === "netbox-config-context";
}

function isEnrollmentTemplateReady(item) {
  return isEnrollmentTemplateCard(item) && normalizedOrderInstanceStatus(item) === "ready";
}

function isEnrollmentTemplateTerminal(item) {
  return isEnrollmentTemplateCard(item) && ["ready", "failed"].includes(normalizedOrderInstanceStatus(item));
}

function enrollTemplateCanDelete(item) {
  const hasTemplateSource = item?.source === "template" || item?.source === "netbox-template" || item?.source === "netbox-config-context";
  return hasTemplateSource && ["ready", "failed"].includes(normalizedOrderInstanceStatus(item)) && Number(item?.instance_count || 0) <= 0;
}

function enrollTemplateDeleteTitle(item) {
  const name = item?.instance || "template";
  if (Number(item?.instance_count || 0) > 0) return `${name} is used by ${Number(item.instance_count)} instance${Number(item.instance_count) === 1 ? "" : "s"}`;
  if (enrollTemplateCanDelete(item)) return `Delete ${name}`;
  return "Delete unavailable for this template source";
}

function enrollmentTemplateNameLink(item) {
  const name = String(item?.instance || "").trim();
  if (!name) return "<strong>SaaShup template</strong>";

  const href = orderTemplateUrl(name);
  if (!href) return `<strong>${escapeHtml(name)}</strong>`;

  return `<a class="order-instance-link" href="${escapeHtml(href)}">${escapeHtml(name)}</a>`;
}

function enrollmentTemplateTitle(item) {
  const count = Number(item?.instance_count || 0);
  const badgeLabel = `${count} instance${count === 1 ? "" : "s"}`;
  return `
    <span class="enroll-template-title">
      ${enrollmentTemplateNameLink(item)}
      <span class="enroll-template-count" title="${escapeHtml(badgeLabel)}" aria-label="${escapeHtml(badgeLabel)}">${count}</span>
    </span>
  `;
}

function catalogImageVersion(item) {
  const image = String(item?.image || "").trim();
  const version = String(item?.version || "").trim();
  if (image && version) return `${image}:${version}`;
  return image || version || "Image unavailable";
}

function catalogTemplateUrl(item) {
  const name = String(item?.instance || "").trim();
  return name ? orderTemplateUrl(name) : "";
}

function catalogSourceLabel(source) {
  return ({
    "netbox-config-context": "Catalog",
    "netbox-template": "Template",
    template: "Template",
  }[String(source || "")] || "Template");
}

function catalogStatusBadge(item) {
  const status = normalizedOrderInstanceStatus(item);
  return `<span class="catalog-status catalog-status-${status}">${orderInstanceStatusText(item)}</span>`;
}

function catalogSearchText(item, profile) {
  return [
    item?.instance,
    item?.image,
    item?.version,
    orderInstanceStatusText(item),
    catalogSourceLabel(item?.source),
    catalogItemProfile(item, profile),
  ].join(" ").toLowerCase();
}

function catalogItemProfile(item, fallbackProfile = "") {
  return String(item?.config_profile || item?.profile || fallbackProfile || "").trim() || "default";
}

function sortedCatalogItems(items) {
  const sort = catalogSort?.value || "name";
  const statusOrder = { ready: 0, creating: 1, recorded: 2, failed: 3, deleting: 4 };
  return [...items].sort((left, right) => {
    if (sort === "image") return catalogImageVersion(left).localeCompare(catalogImageVersion(right), undefined, { sensitivity: "base" });
    if (sort === "usage") return Number(right?.instance_count || 0) - Number(left?.instance_count || 0)
      || String(left?.instance || "").localeCompare(String(right?.instance || ""), undefined, { sensitivity: "base" });
    if (sort === "status") return (statusOrder[normalizedOrderInstanceStatus(left)] ?? 99) - (statusOrder[normalizedOrderInstanceStatus(right)] ?? 99)
      || String(left?.instance || "").localeCompare(String(right?.instance || ""), undefined, { sensitivity: "base" });
    return String(left?.instance || "").localeCompare(String(right?.instance || ""), undefined, { sensitivity: "base" });
  });
}

function renderCatalogItems(items = catalogCards, limit = catalogLimit) {
  if (!catalogList) return;

  catalogCards = Array.isArray(items) ? items : [];
  catalogLimit = limit || {};
  const fallbackProfile = String(catalogLimit.profile || selectedProfileCredentials().profile || visibleConfigProfileName() || "").trim() || "default";
  const query = String(catalogSearch?.value || "").trim().toLowerCase();
  const visibleItems = sortedCatalogItems(query
    ? catalogCards.filter((item) => catalogSearchText(item, fallbackProfile).includes(query))
    : catalogCards);

  if (!catalogCards.length) {
    catalogList.innerHTML = '<div class="catalog-empty">No visible enrolled images found.</div>';
    return;
  }

  if (!visibleItems.length) {
    catalogList.innerHTML = '<div class="catalog-empty">No catalog images match your search.</div>';
    return;
  }

  catalogList.innerHTML = `
    <div class="catalog-grid">
      ${visibleItems.map((item) => {
        const name = String(item?.instance || "").trim() || "SaaShup template";
        const href = catalogTemplateUrl(item);
        const profile = catalogItemProfile(item, fallbackProfile);
        const title = href
          ? `<a href="${escapeHtml(href)}">${escapeHtml(name)}</a>`
          : `<strong>${escapeHtml(name)}</strong>`;
        return `
          <article class="catalog-card">
            <div>
              <p class="catalog-card-title">${title}</p>
              <p class="catalog-card-image">${escapeHtml(catalogImageVersion(item))}</p>
              <p class="catalog-card-detail">
                <span>${escapeHtml(profile)}</span>
                <span>${escapeHtml(catalogSourceLabel(item?.source))}</span>
              </p>
            </div>
            <div class="catalog-card-meta">
              ${catalogStatusBadge(item)}
              <span>${Number(item?.instance_count || 0)} instance${Number(item?.instance_count || 0) === 1 ? "" : "s"}</span>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

async function refreshCatalog() {
  if (!isCatalogPage || !catalogList) return;

  catalogList.innerHTML = '<div class="catalog-empty">Loading catalog...</div>';
  try {
    const limit = await enrollLimitForProfile("", { ownerOnly: false });
    renderCatalogItems(limit.instances, limit);
  } catch {
    catalogList.innerHTML = '<div class="catalog-empty catalog-empty-error">Catalog unavailable.</div>';
  }
}

async function deleteEnrollTemplate(name) {
  const templateName = String(name || "").trim();
  if (!templateName) return;
  if (!confirm(`Delete enrolled template "${templateName}"?`)) return;

  const previousCards = enrollmentCards;
  const previousLimit = enrollmentLimit;
  const nextCards = previousCards.filter((item) => String(item?.instance || "").trim().toLowerCase() !== templateName.toLowerCase());
  if (nextCards.length !== previousCards.length) {
    renderEnrollmentInstances(nextCards, {
      ...previousLimit,
      used: Math.max(0, Number(previousLimit.used || previousCards.length) - (previousCards.length - nextCards.length)),
      reached: false,
    });
  }

  try {
    const query = new URLSearchParams();
    const profile = selectedProfileCredentials().profile;
    if (profile) query.set("profile", profile);
    const response = await fetch(`/enroll/template/${encodeURIComponent(templateName)}${query.toString() ? `?${query.toString()}` : ""}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || `Delete failed (${response.status})`);
    }
    await refreshEnrollLimit();
    setNotice(`Template "${templateName}" deleted`, "success");
  } catch (error) {
    renderEnrollmentInstances(previousCards, previousLimit);
    await refreshEnrollLimit({ showLoading: false, updateNotice: false });
    setNotice(error.message || "Template delete failed", "error");
  }
}

function orderInstanceNameLink(instance, hrefTarget = "") {
  const name = String(instance || "").trim();

  if (!name) {
    return "<strong>Instance requested</strong>";
  }

  const target = String(hrefTarget || name).trim();
  const host = target.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  const href = `https://${host}`;

  return `<a class="order-instance-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>`;
}

function orderInstanceHref(item) {
  const target = String(item?.dns_name || item?.instance || "").trim();
  if (!target) return "";
  const host = target.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  if (!host) return "";
  const protocol = window.location.protocol === "http:" ? "http:" : "https:";
  return `${protocol}//${host}`;
}

function orderInstanceOpenButton(item) {
  const href = orderInstanceHref(item);
  if (!href) return "";
  const label = escapeHtml(`Open ${item.instance || "instance"}`);
  return `
    <a class="icon-btn order-instance-open" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" title="${label}" aria-label="${label}">
      <span>Open</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7"></path><path d="M9 7h8v8"></path><path d="M5 5v14h14"></path></svg>
    </a>
  `;
}

function addOrderInstanceCard(instance) {
  const next = [
    ...orderInstanceCards,
    {
      instance,
      template: orderTemplateName,
      image: fieldValue("image"),
      version: fieldValue("version"),
      status: "creating",
    },
  ];
  renderOrderInstances(next, {
    ...orderInstanceLimit,
    used: Math.max(Number(orderInstanceLimit.used || 0) + 1, next.length),
  });
  window.setTimeout(refreshOrderInstanceStatuses, 250);
}

async function deleteOrderInstance(index) {
  const item = orderInstanceCards[index];
  if (!item?.instance) return;
  if (!confirm(`Delete instance "${item.instance}"?`)) return;
  hideOrderActions();

  const credentials = selectedProfileCredentials();

  const body = new URLSearchParams({
    instance: item.instance,
    netbox: credentials.netbox,
    token: credentials.token,
    proxy: credentials.proxy,
    domain: credentials.domain,
    tag: credentials.tag,
    profile: credentials.profile,
    config_profile: credentials.profile,
    order_request: "true",
  });

  const response = await fetch("/delete", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok && response.status !== 202) {
    let message = `Delete request failed (${response.status})`;
    const data = await response.json().catch(() => ({}));
    if (data && data.detail) {
      message = `Delete failed: ${data.detail}`;
    }
    setOrderStatus(message, "error");
    return;
  }

  orderDeletingInstances.add(item.instance);
  const next = orderInstanceCards.map((card, itemIndex) => (
    itemIndex === index ? { ...card, status: "deleting" } : card
  ));
  renderOrderInstances(next, orderInstanceLimit);
  setOrderDeleteStatus(item.instance);
  window.setTimeout(refreshOrderInstanceStatuses, 250);
}

function hideOrderActions() {
  orderActions?.classList.add("hidden");
}

function showOrderActions() {
  orderActions?.classList.remove("hidden");
}

function hidePublicImageForm(message = publicImageDisabledMessage()) {
  form?.classList.add("hidden");
  if (submitBtn) {
    submitBtn.classList.add("hidden");
    submitBtn.hidden = true;
    submitBtn.disabled = true;
    submitBtn.style.display = "none";
  }

  if (isOrderPage) {
    hideOrderActions();
    setOrderStatus(message, "error", "public-image-disabled");
  } else if (isEnrollPage) {
    setNotice(message, "error", false);
  }
}

function updatePublicImageAccess() {
  if (!isEnrollPage) return;
  if (!canCreatePublicImage()) {
    hidePublicImageForm();
  } else if (isEnrollPage) {
    updateEnrollSubmitState({ notify: false });
  }
}

function hideOrderLoading() {
  orderLoading?.classList.add("hidden");
}

function setOrderLoadingText(message) {
  const text = orderLoading?.querySelector(".order-loading-text");
  if (text) text.textContent = message;
}

function showOrderRedirectLoading(fqdn) {
  setOrderLoadingText(`Creating ${fqdn} — you will be redirected when it is ready`);
  orderLoading?.classList.remove("hidden");
}

function hideOrderRedirectLoading() {
  setOrderLoadingText("Loading instances");
  updateOrderProgress(null);
  orderLoading?.classList.add("hidden");
}

let orderRedirectCountdownActive = false;

function startOrderRedirectCountdown(target, href) {
  orderRedirectCountdownActive = true;
  updateOrderProgress({ step: 5, total: 5, label: "Ready", done: true });
  let remaining = 3;
  const tick = () => {
    if (remaining === 0) {
      window.location.assign(href);
      return;
    }
    setOrderLoadingText(`${target} is ready — redirecting in ${remaining}…`);
    remaining -= 1;
    window.setTimeout(tick, 1000);
  };
  tick();
}

function updateOrderProgress(progress) {
  const wrapper = document.getElementById("orderProgress");
  const fill = document.getElementById("orderProgressFill");
  const label = document.getElementById("orderProgressLabel");
  if (!wrapper || !fill || !label) return;

  const step = Number(progress?.step || 0);
  const total = Number(progress?.total || 0);
  if (!step || !total) {
    wrapper.classList.add("hidden");
    fill.style.width = "0";
    label.textContent = "";
    return;
  }

  wrapper.classList.remove("hidden");
  fill.style.width = progress.done ? "100%" : `${Math.round(((step - 0.5) / total) * 100)}%`;
  label.textContent = progress.done ? (progress.label || "Ready") : `Step ${step}/${total} — ${progress.label || ""}`;
}

function persistOrderRedirect() {
  try {
    if (orderRedirectTarget) {
      sessionStorage.setItem("saashup_pending_order", JSON.stringify({ target: orderRedirectTarget, since: orderRedirectSince, step: orderLastProgressStep, template: orderRedirectTemplateName }));
    } else {
      sessionStorage.removeItem("saashup_pending_order");
    }
  } catch {}
}

function restorePendingOrderRedirect() {
  if (!isOrderPage) return;
  try {
    const stored = JSON.parse(sessionStorage.getItem("saashup_pending_order") || "null");
    const target = String(stored?.target || "").trim();
    const since = Number(stored?.since || 0);
    if (!target || !since || Date.now() - since > 10 * 60 * 1000) {
      sessionStorage.removeItem("saashup_pending_order");
      return;
    }
    const storedTemplate = String(stored?.template || "").trim();
    if (storedTemplate && orderTemplateName && storedTemplate !== orderTemplateName) return;
    orderRedirectTarget = target;
    orderRedirectSince = since;
    orderLastProgressStep = Number(stored?.step || 0);
    orderRedirectTemplateName = storedTemplate;
    showOrderRedirectLoading(target);
  } catch {}
}

function orderInstanceTargetHost(value) {
  return String(value || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

function orderInstanceMatchesTarget(item, targetHost) {
  const dns = orderInstanceTargetHost(item?.dns_name);
  const name = String(item?.instance || "").trim().toLowerCase();
  return (dns && dns === targetHost) || name === targetHost || (name && targetHost.startsWith(`${name}.`));
}

function abandonOrderRedirect(message, reason) {
  const target = orderRedirectTarget;
  orderRedirectTarget = "";
  persistOrderRedirect();
  hideOrderRedirectLoading();
  setOrderStatus(message.replace("%s", target), "error", reason);
}

function maybeRedirectToReadyInstance() {
  if (!orderRedirectTarget) return;

  const elapsed = orderRedirectSince ? Date.now() - orderRedirectSince : 0;
  if (elapsed > 10 * 60 * 1000) {
    abandonOrderRedirect("%s is taking longer than expected — it will appear in your instances once ready.", "order-slow");
    return;
  }

  if (orderPendingFailed) {
    abandonOrderRedirect("Instance creation failed for %s.", "order-failed");
    return;
  }

  const targetHost = orderInstanceTargetHost(orderRedirectTarget);
  const match = orderInstanceCards.find((item) => orderInstanceMatchesTarget(item, targetHost) && item?.source !== "local-pending");
  if (!match) {
    if (!orderPendingProgressActive && orderLastProgressStep < 5 && elapsed > 90 * 1000) {
      abandonOrderRedirect("Instance creation failed for %s.", "order-failed");
    }
    return;
  }

  const status = normalizedOrderInstanceStatus(match);
  if (status === "creating" || status === "deleting") return;

  if (status === "failed") {
    if (orderPendingProgressActive || elapsed < 60 * 1000) return;
    abandonOrderRedirect("Instance creation failed for %s.", "order-failed");
    return;
  }

  const target = orderRedirectTarget;
  orderRedirectTarget = "";
  persistOrderRedirect();
  const href = orderInstanceHref(match);
  if (href) {
    startOrderRedirectCountdown(target, href);
    return;
  }
  hideOrderRedirectLoading();
}

function showEnrollLoading() {
  if (!isEnrollPage) return;
  document.body?.classList.add("enroll-loading-active");
  hideNotice();
  orderLoading?.classList.remove("hidden");
  form?.classList.add("hidden");
  enrollInstances?.classList.add("hidden");
}

function hideEnrollLoading() {
  if (!isEnrollPage) return;
  document.body?.classList.remove("enroll-loading-active");
  orderLoading?.classList.add("hidden");
}

function setLogsExpanded(expanded) {
  logsCard?.classList.toggle("fullscreen", expanded);

  if (logsFullscreenBtn) {
    logsFullscreenBtn.textContent = expanded ? "×" : "⛶";
    logsFullscreenBtn.setAttribute("aria-pressed", expanded ? "true" : "false");
  }
}

function collapseLogs() {
  setLogsExpanded(false);
}

function setAction(actionName, { skipAutoRefresh = false } = {}) {
  const config = actions[actionName];
  if (!config || !form) return;

  if (isEnrollPage && actionName === "create" && !canCreatePublicImage()) {
    hidePublicImageForm();
    return;
  }

  collapseLogs();

  currentAction = actionName;
  localStorage.setItem("current_action", currentAction);
  updateTestConnectionButtonLabel();

  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.getElementById(config.menu)?.classList.add("active");

  form.action = config.endpoint;
  form.method = config.method;
  form.classList.toggle("operate-form", actionName === "restart");
  form.classList.toggle("delete-form", actionName === "delete");

  if (formTitle) formTitle.textContent = config.title;
  updateFormTitleBadge(actionName);
  if (formDescription) formDescription.textContent = config.description;
  submitBtn.textContent = isEnrollPage && actionName === "create" ? "Enroll image" : config.submitLabel;
  submitBtn.className = config.buttonClass;
  submitBtn.classList.toggle("hidden", actionName === "delete" || actionName === "template" || enrollSubmitInProgress);
  submitBtn.hidden = Boolean(enrollSubmitInProgress);
  submitBtn.style.display = enrollSubmitInProgress ? "none" : "";
  submitBtn.name = actionName === "restart" ? "restart_mode" : "";
  submitBtn.value = actionName === "restart" ? "image" : "";

  deleteConfigBtn?.classList.toggle("hidden", actionName !== "config");
  deleteBrandingBtn?.classList.toggle("hidden", actionName !== "branding");
  if (actionName === "branding") {
    loadBrandings().then(() => applyBrandingToFields(fieldValue("branding_select")));
  }
  updateTestEmailVisibility();
  exportConfigBtn?.classList.toggle("hidden", actionName !== "config");
  importConfigBtn?.classList.toggle("hidden", actionName !== "config");
  clearCacheBtn?.classList.toggle("hidden", actionName !== "config");
  clearBtn?.classList.toggle("hidden", actionName === "config" || actionName === "environment" || actionName === "report" || actionName === "workflow");
  dockerRunBtn?.classList.toggle("hidden", actionName !== "template");
  templateSelect?.classList.toggle("hidden", actionName !== "template");
  if (isCreateFormAction(actionName)) syncTemplateActions();
  else updateTemplateCreatorEmail(null);
  updateConfigDefaultControl();
  loadTemplateBtn?.classList.toggle("hidden", actionName !== "template");
  if (loadTemplateBtn) loadTemplateBtn.textContent = "Load template";
  orderTemplateBtn?.classList.toggle("hidden", actionName !== "template");
  saveTemplateBtn?.classList.toggle("hidden", actionName !== "template");
  saveAllTemplatesBtn?.classList.toggle("hidden", actionName !== "template");
  deleteTemplateBtn?.classList.toggle("hidden", actionName !== "template");
  restartInstanceBtn?.classList.toggle("hidden", actionName !== "restart");
  if (restartInstanceBtn) restartInstanceBtn.disabled = actionName !== "restart";
  deleteInstanceBtn?.classList.toggle("hidden", actionName !== "delete");
  deleteImageBtn?.classList.toggle("hidden", actionName !== "delete");
  refreshInstancesBtn?.classList.toggle("hidden", isCreateFormAction(actionName));
  if (refreshInstancesBtn && isCreateFormAction(actionName)) refreshInstancesBtn.disabled = true;
  formCard?.classList.toggle("hidden", actionName === "environment" || actionName === "report" || actionName === "workflow");
  environmentCard?.classList.toggle("hidden", actionName !== "environment");
  reportCard?.classList.toggle("hidden", actionName !== "report");
  workflowCard?.classList.toggle("hidden", actionName !== "workflow");

  const visibleFields = new Set(config.fields);

  document.querySelectorAll("[data-field]").forEach((wrapper) => {
    const name = wrapper.dataset.field;
    const visible = visibleFields.has(name);
    wrapper.classList.toggle("hidden", !visible);

    wrapper.querySelectorAll("input, select, textarea, button").forEach((control) => {
      control.disabled = !visible;
    });
  });
  syncLoggingControls();

  if (refreshInstancesBtn && visibleFields.has("instance") && !isCreateFormAction(actionName)) {
    refreshInstancesBtn.disabled = false;
  }
  if (refreshImagesBtn && visibleFields.has("image")) {
    refreshImagesBtn.disabled = false;
  }
  const imageInput = field("image");
  if (imageInput) imageInput.readOnly = actionName === "create";

  if (!skipAutoRefresh && !isEnrollPage && !isOrderPage) syncCreateNetwork();
  syncCreateVersion();
  updateRemoveOldImagesState();
  ensureRandomCreateInstanceName();
  syncCreateDnsName();
  if (!skipAutoRefresh && isCreateFormAction(actionName) && imageRecords.length === 0) {
    refreshImages({ notify: false });
  }
  if (!skipAutoRefresh && actionName === "delete" && imageRecords.length === 0) {
    refreshImages({ notify: false });
  }
  if (isCreateFormAction(actionName) && !isOrderPage && !isEnrollPage && !isCatalogPage) {
    loadRegistryDefaultSecret();
  }
  if (actionName === "report") {
    updateReportProfileOptions();
    refreshImageReport();
  }
  if (actionName === "environment") {
    loadEnvironmentVariables();
  }
  if (actionName === "workflow") {
    updateWorkflowOptions();
  }
  updateEnvRemoveButtons();
  updateLabelRemoveButtons();
  updatePortRemoveButtons();
  updateVolumeRemoveButtons();
  updateRestartButtons();
  updateRemoveOldImagesState();
  updateOperateControls();
}

function updateRestartButtons() {
  if (isEnrollPage) {
    updateEnrollSubmitState({ notify: false });
    if (restartInstanceBtn) restartInstanceBtn.disabled = true;
    return;
  }

  if (currentAction !== "restart") {
    submitBtn.disabled = false;
    if (restartInstanceBtn) restartInstanceBtn.disabled = true;
    return;
  }

  submitBtn.disabled = false;
  if (restartInstanceBtn) restartInstanceBtn.disabled = false;
}

function selectedOperateAction() {
  const value = fieldValue("operate_action");
  return operateActionLabels[value] ? value : "restart";
}

function updateOperateControls() {
  if (currentAction !== "restart") return;
  if (!fieldValue("operate_action")) setFieldValue("operate_action", "restart");

  if (restartInstanceBtn) restartInstanceBtn.textContent = "Operate instance";
  submitBtn.textContent = "Operate image";
}

function clearActionFields() {
  const preserved = new Set(configFields);
  templateVersionOverride = "";
  templateNetworkOverride = "";
  generatedCreateDnsName = "";

  for (const name of allFieldNames) {
    if (preserved.has(name)) continue;
    setFieldValue(name, "");
  }
  setFieldValue("traefik", true);
  setFieldValue("all_hosts", false);

  clearEnvRows();
  clearLabelRows();
  clearPortRows();
  clearVolumeRows();
  clearBindRows();
  setLoggingRow({ log_driver: defaultLogDriver, log_driver_options: defaultLogDriverOptions });
  if (!isEnrollPage && !isOrderPage) {
    syncCreateNetwork();
  }
  syncCreateVersion();
  ensureRandomCreateInstanceName();
  syncCreateDnsName({ force: true });
  if (currentAction === "restart") setFieldValue("operate_action", "restart");
  updateRestartButtons();
  updateOperateControls();
  setNotice("Form cleared", "success");
}

function openDockerRunModal() {
  if (!dockerRunModal || !dockerRunInput) return;

  if (isEnrollPage) setAction("create", { skipAutoRefresh: true });
  else if (!isTemplateAction()) setAction("template");
  updateImportProfileOptions();
  setImportTab("run");
  dockerRunInput.value = "";
  if (dockerComposeInput) dockerComposeInput.value = "";
  if (templateExportFile) templateExportFile.value = "";
  updateTemplateExportFileName();
  dockerRunModal.classList.remove("hidden");
  dockerRunInput.focus();
}

function closeDockerRunModal() {
  dockerRunModal?.classList.add("hidden");
}

function enrollSetImportedSummary(source) {
  if (!isEnrollPage) return;

  const image = fieldValue("image");
  const version = fieldValue("version");
  const instance = fieldValue("instance");
  const network = fieldValue("network");
  const port = fieldValue("port_value");
  const parts = [
    source,
    instance ? `instance ${instance}` : "",
    image ? `${image}${version ? `:${version}` : ""}` : "",
    network ? `network ${network}` : "",
    port ? `port ${port}` : "",
  ].filter(Boolean);

  if (enrollSummary) {
    enrollSummary.textContent = parts.join(" - ");
    enrollSummary.classList.remove("hidden");
  }
  if (submitBtn) submitBtn.disabled = !(image && port);
}

function validateEnrollComposeText(composeText, { notify = true } = {}) {
  const serviceCount = dockerComposeServiceCount(composeText);
  if (serviceCount > 1) {
    if (notify) setNotice(enrollMultiComposeNotice, "error", false);
    return false;
  }

  if (!composeText.trim()) {
    if (notify) {
      const notice = document.getElementById("notif");
      if (enrollComposeNotices.includes(notice?.textContent || "")) {
        setNotice(enrollImportNotice, "info", false);
      }
    }
    return false;
  }

  const templates = parseDockerCompose(composeText);
  if (serviceCount !== 1 || templates.length !== 1) {
    if (notify) setNotice("Compose services with images are required", "error", false);
    return false;
  }

  if (!templates[0].template.ports?.[0]?.value) {
    if (notify) setNotice("Compose service must expose one port.", "error", false);
    return false;
  }

  if (!templates[0].template.version) {
    if (notify) setNotice("Compose service image version is required", "error", false);
    return false;
  }

  if (String(templates[0].template.version).trim().toLowerCase() === "latest") {
    if (notify) setNotice("Compose service image version cannot be latest", "error", false);
    return false;
  }

  if (templates[0].template.binds?.length) {
    if (notify) setNotice("Bind mounts are not allowed for enrollment. Use a named Docker volume like myimage-data:/data.", "error", false);
    return false;
  }

  if (notify) {
    const notice = document.getElementById("notif");
    if (enrollComposeNotices.includes(notice?.textContent || "")) {
      setNotice(enrollImportNotice, "info", false);
    }
  }
  return true;
}

function validateEnrollRunText(runText, { notify = true } = {}) {
  const serviceCount = dockerComposeServiceCount(runText);
  if (serviceCount > 1) {
    if (notify) setNotice(enrollMultiComposeNotice, "error", false);
    return false;
  }

  if (serviceCount === 1) return validateEnrollComposeText(runText, { notify });

  if (!runText.trim()) {
    if (notify) {
      const notice = document.getElementById("notif");
      if ([enrollMultiComposeNotice, ...enrollDockerRunNotices].includes(notice?.textContent || "")) {
        setNotice(enrollImportNotice, "info", false);
      }
    }
    return false;
  }

  const parsed = parseDockerRun(runText);
  const invalidVersion = String(parsed.version || "").trim().toLowerCase() === "latest";
  const hasBindMount = parsed.binds.length > 0;
  const valid = Boolean(parsed.image && parsed.ports[0]?.value && parsed.version && !invalidVersion && !hasBindMount);
  if (!valid && notify) {
    const missingImage = !parsed.image;
    const missingPort = !parsed.ports[0]?.value;
    let message = "Docker run image version is required";
    if (missingImage && missingPort) message = "Docker run image and port are required";
    else if (missingImage) message = "Docker run image is required";
    else if (missingPort) message = "Docker run port is required";
    else if (invalidVersion) message = "Docker run image version cannot be latest";
    else if (hasBindMount) message = "Bind mounts are not allowed for enrollment. Use a named Docker volume like myimage-data:/data.";
    setNotice(message, "error", false);
  } else if (valid && notify) {
    const notice = document.getElementById("notif");
    if ([enrollMultiComposeNotice, ...enrollDockerRunNotices].includes(notice?.textContent || "")) {
      setNotice(enrollImportNotice, "info", false);
    }
  }
  return valid;
}

function dockerRunTextFromFirstCommand(value = "") {
  const text = String(value || "");
  const match = text.match(/docker\s+run(?:\s|$)/i);
  return match ? text.slice(match.index) : text;
}

function normalizeDockerRunInput() {
  if (!dockerRunInput) return "";
  const normalized = dockerRunTextFromFirstCommand(dockerRunInput.value);
  if (normalized !== dockerRunInput.value) {
    dockerRunInput.value = normalized;
  }
  return normalized;
}

function handleDockerRunInput() {
  normalizeDockerRunInput();
  updateEnrollSubmitState();
}

function enrollImageVersionAllowed(image = "", version = "") {
  const imageParts = splitImageRef(image);
  const resolvedVersion = String(version || imageParts.version || "").trim();
  if (!resolvedVersion) return { ok: false, message: "Docker run image version is required" };
  if (resolvedVersion.toLowerCase() === "latest") return { ok: false, message: "Docker run image version cannot be latest" };
  return { ok: true, version: resolvedVersion };
}

function updateEnrollSubmitState({ notify = true } = {}) {
  if (!isEnrollPage) return true;
  if (!canCreatePublicImage()) {
    hidePublicImageForm();
    return false;
  }

  const valid = currentImportTab === "compose"
    ? validateEnrollComposeText(dockerComposeInput?.value || "", { notify })
    : validateEnrollRunText(dockerRunInput?.value || "", { notify });
  const available = !enrollmentLimit.reached;
  if (submitBtn) submitBtn.disabled = !valid || !available;
  if (dockerRunInput) dockerRunInput.disabled = !available;
  if (dockerComposeInput) dockerComposeInput.disabled = !available;
  importTabButtons.forEach((button) => {
    button.disabled = !available;
  });
  return valid && available;
}

function setEnrollCheckingImage(checking) {
  if (!isEnrollPage) return;
  if (checking) setNotice("Checking image", "info", false);
  if (submitBtn) {
    submitBtn.disabled = checking || submitBtn.disabled;
    submitBtn.hidden = Boolean(enrollSubmitInProgress);
    submitBtn.style.display = enrollSubmitInProgress ? "none" : "";
  }
}

function setEnrollSubmitInProgress(inProgress) {
  if (!isEnrollPage || !submitBtn) return;
  enrollSubmitInProgress = inProgress;
  submitBtn.classList.toggle("hidden", inProgress);
  submitBtn.hidden = inProgress;
  submitBtn.style.display = inProgress ? "none" : "";
  if (inProgress) submitBtn.setAttribute("aria-hidden", "true");
  else submitBtn.removeAttribute("aria-hidden");
  submitBtn.disabled = inProgress || submitBtn.disabled;
}

async function refreshEnrollLimit({ showLoading = true, updateNotice = true } = {}) {
  if (!isEnrollPage) return null;

  if (showLoading) showEnrollLoading();

  try {
    const limit = await enrollLimitForProfile(selectedProfileCredentials().profile);
    renderEnrollmentInstances(limit.instances, limit);
    form?.classList.toggle("hidden", Boolean(limit.reached));
    if (updateNotice && limit.reached) hideNotice();
    else if (updateNotice && !dockerRunInput?.value && !dockerComposeInput?.value) setNotice(enrollImportNotice, "info", false);
    updateEnrollSubmitState({ notify: false });
    hideEnrollLoading();
    return limit;
  } catch {
    hideEnrollLoading();
    form?.classList.remove("hidden");
    updateEnrollSubmitState({ notify: false });
    return null;
  }
}

function applyEnrollProfileSelection() {
  if (!isEnrollPage || !importProfileSelect) return;
  applyProfileToFields(importProfileSelect.value || currentConfigProfile, { syncNetwork: false });
  refreshEnrollLimit();
}

function configureEnrollDefaultConfig() {
  if (!isEnrollPage) return false;

  const sessionProfile = sessionProfileName();
  const profileName = (Object.hasOwn(knownProfileEntries(), sessionProfile) ? sessionProfile : "")
    || visibleConfigProfileName();
  updateImportProfileOptions();
  if (importProfileSelect) importProfileSelect.value = profileName;
  if (profileName && currentConfigProfile !== profileName) applyProfileToFields(profileName, { syncNetwork: false });

  if (!profileName) {
    hideEnrollLoading();
    form?.classList.add("hidden");
    setNotice("You cannot deploy a new SaaS yet. Ask an administrator to make a config visible.", "error", false);
    return false;
  }

  return true;
}

function setImportTab(tabName) {
  currentImportTab = ["compose", "export"].includes(tabName) ? tabName : "run";
  importTabButtons.forEach((button) => {
    const active = button.dataset.importTab === currentImportTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  importPanels.forEach((panel) => panel.classList.toggle("hidden", panel.dataset.importPanel !== currentImportTab));
  updateEnrollSubmitState();
  if (currentImportTab === "run") dockerRunInput?.focus();
  else if (currentImportTab === "compose") dockerComposeInput?.focus();
  else templateExportFile?.focus();
}

function updateTemplateExportFileName() {
  if (!templateExportFileName) return;
  const fileName = templateExportFile?.files?.[0]?.name || "";
  templateExportFileName.textContent = fileName || "JSON file from Export all templates";
}

function openProfileHelp(key) {
  const help = profileFieldHelp[key];
  if (!help || !profileHelpModal || !profileHelpTitle || !profileHelpBody) return;

  profileHelpTitle.textContent = help.title;
  profileHelpBody.textContent = key === "registry_webhook_secret"
    ? registryWebhookHelpBody(help.body)
    : help.body;
  profileHelpModal.classList.remove("hidden");
  profileHelpOkBtn?.focus();
}

function registryWebhookHelpBody(body) {
  const profile = selectedProfileCredentials().profile || "";
  const template = selectedTemplateName();
  const secret = fieldValue("registry_webhook_secret") || registryWebhookDefaultSecret || "";
  const profileSegment = profile ? encodeURIComponent(profile) : "<config-profile>";
  const templateSegment = template ? encodeURIComponent(template) : "<template>";
  const secretSegment = secret ? `/${encodeURIComponent(secret)}` : "";
  const webhookUrl = `${window.location.origin}/registry-webhook/${profileSegment}/${templateSegment}${secretSegment}`;
  return `${body}\n\nRegistry webhook URL:\n${webhookUrl}\n\nAdd ?images_to_keep=1, 2 or 3 to the URL to override this template's "Images to keep" setting for that webhook.`;
}

function closeProfileHelp() {
  profileHelpModal?.classList.add("hidden");
}

function togglePasswordVisibility(input, button, label) {
  if (!input || !button) return;

  const visible = input.type === "text";
  input.type = visible ? "password" : "text";
  button.setAttribute("aria-pressed", visible ? "false" : "true");
  button.setAttribute("aria-label", `${visible ? "Show" : "Hide"} ${label}`);
  button.title = `${visible ? "Show" : "Hide"} ${label}`;
}

function tokenizeDockerRun(command) {
  const tokens = [];
  let current = "";
  let quote = "";
  let escaped = false;

  for (const char of String(command || "").replace(/\\\r?\n/g, " ")) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (quote) {
      if (char === quote) quote = "";
      else current += char;
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) tokens.push(current);
  return tokens;
}

function splitOptionValue(token) {
  const index = token.indexOf("=");
  return index === -1 ? [token, ""] : [token.slice(0, index), token.slice(index + 1)];
}

function splitImageRef(ref) {
  ref = String(ref || "").trim();
  const composeDefault = ref.match(/^\$\{[^}:]+:?-([^}]+)\}$/);
  if (composeDefault) ref = composeDefault[1].trim();
  const slashIndex = ref.lastIndexOf("/");
  const colonIndex = ref.lastIndexOf(":");

  if (colonIndex > slashIndex) {
    return {
      image: ref.slice(0, colonIndex),
      version: ref.slice(colonIndex + 1),
    };
  }

  return { image: ref, version: "" };
}

function defaultTemplateNameFromImage(image = "") {
  const imageName = splitImageRef(image).image;
  const parts = String(imageName || "").split("/").filter(Boolean);
  return (parts.at(-1) || imageName || "").trim();
}

function valueText(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    return value.version || value.tag || value.name || value.display || value.label || value.value || "";
  }

  return String(value);
}

function parsePublishPort(value) {
  const port = String(value || "").split(":").pop().replace(/\/.*$/, "");
  return /^\d+$/.test(port) ? port : "";
}

function parseDockerMount(value) {
  const entries = {};
  String(value || "").split(",").forEach((part) => {
    const [key, entryValue = ""] = splitOptionValue(part);
    if (key) entries[key] = entryValue || "true";
  });

  const type = entries.type || "";
  const source = entries.source || entries.src || "";
  const target = entries.target || entries.dst || entries.destination || "";
  if (!source || !target) return null;

  if (type === "bind" || isBindSource(source)) {
    return { kind: "bind", host_path: source, container_path: target, read_only: entries.readonly === "true" || entries.ro === "true" };
  }
  return { kind: "volume", name: source, source: target };
}

function parseDockerRun(command) {
  const tokens = tokenizeDockerRun(command);
  const parsed = { env: [], labels: [], ports: [], volumes: [], binds: [] };
  let i = 0;

  if (tokens[i] === "docker") i += 1;
  if (tokens[i] === "run" || tokens[i] === "container") i += 1;
  if (tokens[i] === "run") i += 1;

  while (i < tokens.length) {
    const token = tokens[i];

    if (!token.startsWith("-")) {
      const imageRef = token;
      const imageParts = splitImageRef(imageRef);
      parsed.image = imageParts.image;
      parsed.version = imageParts.version;
      break;
    }

    const [option, inlineValue] = splitOptionValue(token);
    const readValue = () => {
      if (inlineValue) return inlineValue;
      i += 1;
      return tokens[i] || "";
    };

    if (option === "--name") {
      parsed.instance = readValue();
    } else if (option === "--network" || option === "--net") {
      parsed.network = readValue();
    } else if (option === "--log-driver") {
      parsed.log_driver = readValue();
    } else if (option === "--log-opt") {
      const [key, value] = splitOptionValue(readValue());
      if (key) parsed.log_driver_options = { ...plainObject(parsed.log_driver_options), [key]: value };
    } else if (option === "-e" || option === "--env") {
      const [key, value] = splitOptionValue(readValue());
      if (key) parsed.env.push({ key, value });
    } else if (option === "-l" || option === "--label") {
      const [key, value] = splitOptionValue(readValue());
      if (key) parsed.labels.push({ key, value });
    } else if (option === "-v" || option === "--volume") {
      const parts = readValue().split(":");
      if (parts.length >= 2) {
        const readOnly = parts.includes("ro");
        if (isBindSource(parts[0])) parsed.binds.push({ host_path: parts[0], container_path: parts[1], read_only: readOnly });
        else parsed.volumes.push({ name: parts[0], source: parts[1] });
      }
    } else if (option === "--mount") {
      const mount = parseDockerMount(readValue());
      if (mount?.kind === "bind") parsed.binds.push({ host_path: mount.host_path, container_path: mount.container_path, read_only: mount.read_only });
      else if (mount?.kind === "volume") parsed.volumes.push({ name: mount.name, source: mount.source });
    } else if (option === "-p" || option === "--publish") {
      const port = parsePublishPort(readValue());
      if (port && parsed.ports.length === 0) parsed.ports.push({ value: port });
    } else if (option === "--restart" || option === "--hostname" || option === "--user" || option === "-u" || option === "-w" || option === "--workdir" || option === "--entrypoint" || option === "--pull" || option === "--env-file" || option === "--add-host" || option === "--dns") {
      readValue();
    }

    i += 1;
  }

  applySaashupTemplateLabels(parsed);
  return parsed;
}

function isBindSource(value) {
  const text = String(value || "");
  return text.startsWith("/") || text.startsWith("./") || text.startsWith("../") || text.startsWith("~");
}

function stripYamlComment(value) {
  let quote = "";
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (quote) {
      if (char === quote && value[i - 1] !== "\\") quote = "";
      continue;
    }
    if (char === "'" || char === '"') quote = char;
    else if (char === "#") return value.slice(0, i);
  }
  return value;
}

function yamlIndent(line) {
  return (line.match(/^\s*/) || [""])[0].replace(/\t/g, "  ").length;
}

function yamlScalar(value) {
  value = stripYamlComment(String(value || "")).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return value;
}

function splitYamlInlineList(value) {
  value = yamlScalar(value);
  if (!value.startsWith("[") || !value.endsWith("]")) return [];
  const items = [];
  let current = "";
  let quote = "";
  for (const char of value.slice(1, -1)) {
    if (quote) {
      if (char === quote) quote = "";
      current += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }
    if (char === ",") {
      if (current.trim()) items.push(yamlScalar(current));
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) items.push(yamlScalar(current));
  return items;
}

function parseComposePair(value) {
  value = yamlScalar(value);
  const equal = value.indexOf("=");
  if (equal >= 0) return { key: value.slice(0, equal), value: value.slice(equal + 1) };
  const colon = value.indexOf(":");
  if (colon >= 0) return { key: yamlScalar(value.slice(0, colon)), value: yamlScalar(value.slice(colon + 1)) };
  return value ? { key: value, value: "" } : null;
}

function parseComposePairs(inlineValue, blockLines) {
  const inlineItems = splitYamlInlineList(inlineValue);
  if (inlineItems.length) return inlineItems.map(parseComposePair).filter(Boolean);

  const pairs = [];
  blockLines.forEach(({ text }) => {
    const line = stripYamlComment(text).trim();
    if (!line) return;
    if (line.startsWith("- ")) {
      const pair = parseComposePair(line.slice(2));
      if (pair) pairs.push(pair);
      return;
    }
    const pair = parseComposePair(line);
    if (pair) pairs.push(pair);
  });
  return pairs;
}

function labelBoolean(value, defaultValue = false) {
  const text = String(value ?? "").trim().replace(/;+$/, "").toLowerCase();
  if (!text) return defaultValue;
  if (["1", "true", "yes", "on", "enabled"].includes(text)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(text)) return false;
  return defaultValue;
}

function applySaashupTemplateLabels(template) {
  const runtimeLabels = [];
  const runtimeEnv = [];

  (template.labels || []).forEach((label) => {
    const key = String(label.key || "").trim();
    const value = String(label.value ?? "").trim();
    const normalized = key.toLowerCase();

    if (normalized === "saashup_traefik") {
      template.traefik = labelBoolean(value, true);
      return;
    }

    if (normalized === "saashup_dns") {
      template.dns_name = value;
      return;
    }

    if (normalized === "saashup_enabled") {
      template.saashup_enabled = labelBoolean(value, true);
      return;
    }

    runtimeLabels.push(label);
  });

  (template.env || []).forEach((entry) => {
    const key = String(entry.key || "").trim();
    const value = String(entry.value ?? "").trim();
    runtimeEnv.push(entry);
  });

  template.labels = runtimeLabels;
  if (Array.isArray(template.env)) template.env = runtimeEnv;
  return template;
}

function normalizeLogDriverOptions(options = {}, fallback = defaultLogDriverOptions) {
  const data = plainObject(options);
  return {
    ...fallback,
    ...Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value ?? "")])),
  };
}

function templateLogDriverOptions(template = {}) {
  return normalizeLogDriverOptions(template.log_driver_options || template.log_options || template.logging_options);
}

function normalizeCreateTemplate(template) {
  const normalized = { ...plainObject(template) };
  normalized.labels = Array.isArray(normalized.labels) ? normalized.labels.map((label) => ({ ...plainObject(label) })) : [];
  normalized.saashup_enabled = checkboxValue(normalized.saashup_enabled, true);
  normalized.max_instances = templateMaxInstancesValue(normalized);
  normalized.images_to_keep = templateImagesToKeepValue(normalized);
  normalized.log_driver = String(Object.hasOwn(normalized, "log_driver") ? normalized.log_driver : defaultLogDriver).trim();
  normalized.log_driver_options = normalized.log_driver ? templateLogDriverOptions(normalized) : {};
  return applySaashupTemplateLabels(normalized);
}

function isTemplateRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
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

function templateLooksLikeTemplate(template) {
  if (!isTemplateRecord(template)) return false;
  if (looksLikeWorkflowRecord(template)) return false;
  if (Object.hasOwn(template, "delete_volumes")) return false;

  const valueKeys = [
    "image",
    "version",
    "max_instances",
    "images_to_keep",
    "network",
    "log_driver",
    "log_driver_options",
    "log_options",
    "logging_options",
    "ports",
    "labels",
    "env",
    "binds",
    "volumes",
    "dns_name",
    "traefik",
    "instance",
    "port_value",
  ];
  if (!Object.keys(template).some((key) => valueKeys.includes(key))) return false;

  return valueKeys.some((key) => {
    const value = template[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "boolean") return true;
    return false;
  });
}

function templateLooksLikeTemplateLegacy(template) {
  if (!isTemplateRecord(template)) return false;
  if (looksLikeWorkflowRecord(template)) return false;
  if (Object.hasOwn(template, "delete_volumes")) return false;

  const legacyValueKeys = ["image", "source", "config_profile", "profile", "version", "max_instances", "images_to_keep", "network", "creator_email"];
  return Object.keys(template).some((key) => legacyValueKeys.includes(key));
}

function looksLikeWorkflowRecord(value) {
  if (!isTemplateRecord(value)) return false;
  return Object.hasOwn(value, "steps") || Object.hasOwn(value, "delete_volumes");
}

function normalizeCreateTemplates(templates) {
  const entries = Object.entries(plainObject(templates));
  const normalizedStrict = Object.fromEntries(
    entries
      .filter(([name, template]) => (
        typeof name === "string" &&
        name.trim() &&
        !templateCatalogReservedKeys.has(name.trim().toLowerCase()) &&
        templateLooksLikeTemplate(template)
      ))
      .map(([name, template]) => [name, normalizeCreateTemplate(template)]),
  );
  if (Object.keys(normalizedStrict).length) return normalizedStrict;

  return Object.fromEntries(
    entries
      .filter(([name, template]) => (
        typeof name === "string" &&
        name.trim() &&
        !templateCatalogReservedKeys.has(name.trim().toLowerCase()) &&
        templateLooksLikeTemplateLegacy(template)
      ))
      .map(([name, template]) => [name, normalizeCreateTemplate(template)]),
  );
}

function normalizeCreateWorkflows(workflows) {
  return Object.fromEntries(
    Object.entries(plainObject(workflows))
      .filter(([key, workflow]) => {
        if (typeof key !== "string" || !key.trim() || !isTemplateRecord(workflow)) return false;
        return looksLikeWorkflowRecord(workflow);
      })
      .map(([key, workflow]) => {
      const normalized = { ...plainObject(workflow) };
      const workflowKey = String(normalized.id || key).trim();
      normalized.id = workflowKey || key;
      normalized.steps = Array.isArray(normalized.steps)
        ? normalized.steps.map((step) => {
          if (typeof step === "string") return { template: step, enabled: true };
          const normalizedStep = { ...plainObject(step) };
          normalizedStep.enabled = normalizedStep.enabled !== false;
          if (normalizedStep.template_data) normalizedStep.template_data = normalizeCreateTemplate(normalizedStep.template_data);
          return normalizedStep;
        })
        : [];
      return [workflowKey || key, normalized];
    }),
  );
}

function templateCatalogFromPayload(payload, fallback = {}) {
  const data = plainObject(payload);
  const hasCatalogShape = Object.hasOwn(data, "templates") || Object.hasOwn(data, "workflows");
  return {
    templates: normalizeCreateTemplates(hasCatalogShape ? plainObject(data.templates) : data),
    workflows: normalizeCreateWorkflows(hasCatalogShape ? plainObject(data.workflows) : plainObject(fallback.workflows)),
  };
}

function parseComposeList(inlineValue, blockLines) {
  const inlineItems = splitYamlInlineList(inlineValue);
  if (inlineItems.length) return inlineItems;
  if (inlineValue && yamlScalar(inlineValue)) return [yamlScalar(inlineValue)];

  const items = [];
  blockLines.forEach(({ text }) => {
    const line = stripYamlComment(text).trim();
    if (!line) return;
    if (line.startsWith("- ")) items.push(yamlScalar(line.slice(2)));
    else if (line.endsWith(":")) items.push(yamlScalar(line.slice(0, -1)));
  });
  return items;
}

function parseComposePorts(inlineValue, blockLines) {
  return parseComposeList(inlineValue, blockLines)
    .map(parsePublishPort)
    .filter(Boolean)
    .slice(0, 1)
    .map((value) => ({ value }));
}

function parseComposeVolumes(inlineValue, blockLines) {
  return parseComposeList(inlineValue, blockLines)
    .map((value) => {
      const parts = String(value).split(":");
      return parts.length >= 2 ? { name: yamlScalar(parts[0]), source: yamlScalar(parts[1]) } : null;
    })
    .filter(Boolean);
}

function splitComposeMounts(inlineValue, blockLines) {
  const mounts = parseComposeList(inlineValue, blockLines)
    .map((value) => {
      const parts = String(value).split(":");
      if (parts.length < 2) return null;
      const source = yamlScalar(parts[0]);
      const target = yamlScalar(parts[1]);
      const readOnly = parts.slice(2).includes("ro");
      return isBindSource(source)
        ? { type: "bind", host_path: source, container_path: target, read_only: readOnly }
        : { type: "volume", name: source, source: target };
    })
    .filter(Boolean);

  return {
    volumes: mounts.filter((item) => item.type === "volume").map(({ type, ...item }) => item),
    binds: mounts.filter((item) => item.type === "bind").map(({ type, ...item }) => item),
  };
}

function parseComposeLogging(blockLines) {
  const logging = { log_driver_options: {} };
  let optionsIndent = null;

  blockLines.forEach(({ indent, text }) => {
    const line = stripYamlComment(text).trim();
    if (!line) return;

    const match = line.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!match) return;
    const [, key, value] = match;

    if (key === "driver") {
      logging.log_driver = yamlScalar(value);
      return;
    }

    if (key === "options") {
      optionsIndent = indent;
      return;
    }

    if (optionsIndent !== null && indent > optionsIndent) {
      logging.log_driver_options[key] = yamlScalar(value);
    }
  });

  if (!Object.keys(logging.log_driver_options).length) delete logging.log_driver_options;
  return logging;
}

function parseComposeService(lines, serviceIndent, profileName = selectedProfileCredentials().profile) {
  const template = {
    config_profile: profileName,
    traefik: true,
    network: fieldValue("network"),
    image: "",
    version: "",
    env: [],
    labels: [],
    ports: [],
    volumes: [],
    binds: [],
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!stripYamlComment(raw).trim()) continue;
    const indent = yamlIndent(raw);
    const match = raw.trim().match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!match || indent <= serviceIndent) continue;

    const [, key, inlineValue] = match;
    const blockLines = [];
    let next = i + 1;
    while (next < lines.length && (!stripYamlComment(lines[next]).trim() || yamlIndent(lines[next]) > indent)) {
      blockLines.push({ indent: yamlIndent(lines[next]), text: lines[next] });
      next += 1;
    }
    i = next - 1;

    if (key === "image") {
      const imageParts = splitImageRef(yamlScalar(inlineValue));
      template.image = imageParts.image;
      template.version = imageParts.version;
    } else if (key === "container_name") {
      template.instance = yamlScalar(inlineValue);
    } else if (key === "networks") {
      template.network = parseComposeList(inlineValue, blockLines)[0] || template.network;
    } else if (key === "environment" || key === "env") {
      template.env = parseComposePairs(inlineValue, blockLines);
    } else if (key === "labels") {
      template.labels = parseComposePairs(inlineValue, blockLines);
    } else if (key === "ports") {
      template.ports = parseComposePorts(inlineValue, blockLines);
    } else if (key === "volumes") {
      const mounts = splitComposeMounts(inlineValue, blockLines);
      template.volumes = mounts.volumes;
      template.binds = mounts.binds;
    } else if (key === "logging") {
      Object.assign(template, parseComposeLogging(blockLines));
    }
  }

  applySaashupTemplateLabels(template);
  return template.image ? template : null;
}

function composeWorkflowName(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const match = lines
    .map((line) => stripYamlComment(line).trim().match(/^name:\s*(.+)$/))
    .find(Boolean);
  return match ? yamlScalar(match[1]) : "compose";
}

function workflowFromTemplateEntries(templates, profileName = selectedProfileCredentials().profile || "", name = "templates", enableTemplateOrders = true, order = []) {
  const workflowKey = workflowStorageKey(profileName, name);
  return {
    key: workflowKey,
    workflow: {
      name,
      config_profile: profileName,
      steps: orderedTemplateEntries(templates, order).map(([templateName, template]) => ({
        template: templateName,
        template_data: { ...template, saashup_enabled: enableTemplateOrders },
        enabled: true,
      })),
      created_at: new Date().toISOString(),
    },
  };
}

function templateOrderFromPayload(payload) {
  const data = plainObject(payload);
  const order = data.template_order || data.templateOrder || data.order;
  return Array.isArray(order) ? order.map((item) => String(item || "").trim()).filter(Boolean) : [];
}

function orderedTemplateEntries(templates, order = []) {
  const normalized = normalizeCreateTemplates(templates);
  const seen = new Set();
  const entries = [];

  order.forEach((name) => {
    if (!Object.hasOwn(normalized, name) || seen.has(name)) return;
    seen.add(name);
    entries.push([name, normalized[name]]);
  });

  Object.entries(normalized).forEach(([name, template]) => {
    if (seen.has(name)) return;
    seen.add(name);
    entries.push([name, template]);
  });

  return entries;
}

function parseDockerCompose(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const servicesIndex = lines.findIndex((line) => stripYamlComment(line).trim() === "services:");
  if (servicesIndex === -1) return [];

  const servicesIndent = yamlIndent(lines[servicesIndex]);
  const templates = [];
  for (let i = servicesIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!stripYamlComment(line).trim()) continue;
    const indent = yamlIndent(line);
    if (indent <= servicesIndent) break;

    const match = line.trim().match(/^([A-Za-z0-9_.-]+):\s*$/);
    if (!match) continue;

    const serviceName = match[1];
    const block = [];
    let next = i + 1;
    while (next < lines.length && (!stripYamlComment(lines[next]).trim() || yamlIndent(lines[next]) > indent)) {
      block.push(lines[next]);
      next += 1;
    }
    const template = parseComposeService(block, indent, importProfileSelect?.value || selectedProfileCredentials().profile);
    if (template) templates.push({ name: serviceName, template });
    i = next - 1;
  }

  return templates;
}

function dockerComposeServiceCount(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const servicesIndex = lines.findIndex((line) => stripYamlComment(line).trim() === "services:");
  if (servicesIndex === -1) return 0;

  const servicesIndent = yamlIndent(lines[servicesIndex]);
  let serviceIndent = null;
  let count = 0;
  for (let i = servicesIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!stripYamlComment(line).trim()) continue;
    const indent = yamlIndent(line);
    if (indent <= servicesIndent) break;
    if (!line.trim().match(/^([A-Za-z0-9_.-]+):\s*$/)) continue;

    if (serviceIndent === null) serviceIndent = indent;
    if (indent === serviceIndent) count += 1;
  }

  return count;
}

function setRepeatRows(items, clearFn, addFn, selectors) {
  clearFn();

  if (!items.length) return;

  if (!field(selectors.key)) {
    items.forEach((item) => {
      addFn(item.key ?? item.source ?? "", item.value ?? item.name ?? "");
    });
    return;
  }

  const first = items[0];
  setFieldValue(selectors.key, first.key ?? first.source ?? "");
  setFieldValue(selectors.value, first.value ?? first.name ?? "");

  items.slice(1).forEach((item) => {
    addFn(item.key ?? item.source ?? "", item.value ?? item.name ?? "");
  });
}

function setBindRows(items = []) {
  clearBindRows();
  if (!items.length) return;

  items.forEach((item) => {
    addBindRow(
      item.host_path ?? item.host ?? item.key ?? "",
      item.container_path ?? item.container ?? item.value ?? "",
      item.read_only ?? item.readonly ?? false,
    );
  });
}

function repeatValues(list, rowSelector, keyName, valueName) {
  return repeatRows(list, rowSelector)
    .map((row) => ({
      key: row.querySelector(`[name="${keyName}"]`)?.value || "",
      value: row.querySelector(`[name="${valueName}"]`)?.value || "",
    }))
    .filter((item) => item.key || item.value);
}

function duplicateRowKeys(list, rowSelector, keyName) {
  const seen = new Set();
  const duplicates = new Set();
  repeatRows(list, rowSelector).forEach((row) => {
    const key = String(row.querySelector(`[name="${keyName}"]`)?.value || "").trim();
    if (!key) return;
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  });
  return [...duplicates];
}

function markDuplicateRows(list, rowSelector, keyName, keys = []) {
  repeatRows(list, rowSelector).forEach((row) => {
    const input = row.querySelector(`[name="${keyName}"]`);
    const duplicate = keys.includes(String(input?.value || "").trim());
    row.classList.toggle("row-duplicate", duplicate);
    if (duplicate) input?.setAttribute("aria-invalid", "true");
    else input?.removeAttribute("aria-invalid");
  });
}

function clearDuplicateRows() {
  markDuplicateRows(envList, ".env-row", "var_env_key");
  markDuplicateRows(labelList, ".repeat-row", "label_key");
}

function showConfigConflict(conflict) {
  clearDuplicateRows();
  if (conflict.code === "duplicate_env_var") markDuplicateRows(envList, ".env-row", "var_env_key", conflict.keys || []);
  if (conflict.code === "duplicate_label") markDuplicateRows(labelList, ".repeat-row", "label_key", conflict.keys || []);
}

// Mirrors containerConfigConflict in lib/docker.js so duplicates are caught before /create runs.
function repeatKeyConflict() {
  const envKeys = duplicateRowKeys(envList, ".env-row", "var_env_key");
  if (envKeys.length) {
    return {
      code: "duplicate_env_var",
      detail: `Duplicate environment variable${envKeys.length === 1 ? "" : "s"}: ${envKeys.join(", ")}`,
      keys: envKeys,
    };
  }
  const labelKeys = duplicateRowKeys(labelList, ".repeat-row", "label_key");
  if (labelKeys.length) {
    return {
      code: "duplicate_label",
      detail: `Duplicate label${labelKeys.length === 1 ? "" : "s"}: ${labelKeys.join(", ")}`,
      keys: labelKeys,
    };
  }
  return null;
}

function portValues() {
  return repeatRows(portList, ".repeat-row")
    .map((row) => ({ value: row.querySelector('[name="port_value"]')?.value || "" }))
    .filter((item) => item.value)
    .slice(0, 1);
}

function volumeValues() {
  return repeatRows(volumeList, ".repeat-row")
    .map((row) => ({ key: row.querySelector('[name="volume_source"]')?.value || "" }))
    .filter((item) => item.key);
}

function bindValues() {
  return repeatRows(bindList, ".repeat-row")
    .map((row) => ({
      host_path: row.querySelector('[name="bind_host_path"]')?.value || "",
      container_path: row.querySelector('[name="bind_container_path"]')?.value || "",
      read_only: row.querySelector('[name="bind_read_only"]')?.checked || false,
    }))
    .filter((item) => item.host_path && item.container_path);
}

function prepareBindReadOnlyForFormData() {
  const inputs = repeatRows(bindList, ".repeat-row")
    .map((row) => row.querySelector('[name="bind_read_only"]'))
    .filter(Boolean);
  const states = inputs.map((input) => ({ input, checked: input.checked, value: input.value }));
  inputs.forEach((input) => {
    input.value = input.checked ? "true" : "false";
    input.checked = true;
  });
  return () => {
    states.forEach(({ input, checked, value }) => {
      input.checked = checked;
      input.value = value;
    });
  };
}

function currentCreateTemplate() {
  const credentials = selectedProfileCredentials();
  const existingTemplate = createTemplates[selectedTemplateName()] || {};
  const logDriver = isLoggingVisible() ? fieldValue("log_driver").trim() : "";

  return {
    config_profile: credentials.profile,
    ...(existingTemplate.instance ? { instance: existingTemplate.instance } : {}),
    ...(existingTemplate.dns_name ? { dns_name: existingTemplate.dns_name } : {}),
    traefik: fieldChecked("traefik", true),
    all_hosts: existingTemplate.all_hosts ?? false,
    saashup_enabled: existingTemplate.saashup_enabled ?? true,
    max_instances: normalizeMaxInstances(fieldValue("max_instances")),
    images_to_keep: normalizeImagesToKeep(fieldValue("images_to_keep")),
    registry_webhook_secret: registryWebhookSecretValue(),
    network: fieldValue("network"),
    log_driver: logDriver,
    log_driver_options: logDriver ? normalizeLogDriverOptions({
      "syslog-address": fieldValue("log_syslog_address").trim() || defaultLogDriverOptions["syslog-address"],
      tag: fieldValue("log_syslog_tag").trim() || defaultLogDriverOptions.tag,
    }) : {},
    image: fieldValue("image"),
    version: fieldValue("version") || existingTemplate.version,
    ...(templateCreatorEmailWrap && !templateCreatorEmailWrap.classList.contains("hidden") && !templateCreatorEmail?.disabled
      ? { creator_email: templateCreatorEmail?.value.trim() || "" }
      : {}),
    env: repeatValues(envList, ".env-row", "var_env_key", "var_env_value"),
    labels: repeatValues(labelList, ".repeat-row", "label_key", "label_value"),
    ports: portValues(),
    volumes: volumeValues(),
    binds: bindValues(),
  };
}

function applyCreateTemplate(template) {
  if (!template) return;
  template = normalizeCreateTemplate(template);

  if (!isCreateFormAction()) setAction("template");

  const templateProfile = template.config_profile || template.profile || "";
  const switchesProfile = Boolean(templateProfile && templateProfile !== currentConfigProfile && Object.hasOwn(configProfiles, templateProfile));
  if (templateProfile && Object.hasOwn(configProfiles, templateProfile)) {
    applyProfileToFields(templateProfile);
    imageRecords = [];
    replaceOptions(imageOptions, []);
    replaceOptions(oldVersionOptions, []);
    replaceOptions(restartVersionOptions, []);
  }

  setFieldValue("network", template.network || fieldValue("network"));
  setFieldValue("traefik", template.traefik ?? true);
  setLoggingRow(template.log_driver ? template : null);
  setFieldValue("all_hosts", template.all_hosts ?? false);
  setFieldValue("saashup_enabled", template.saashup_enabled ?? true);
  setFieldValue("max_instances", templateMaxInstancesValue(template));
  setFieldValue("images_to_keep", templateImagesToKeepValue(template));
  setFieldValue("registry_webhook_secret", template.registry_webhook_secret || template.dockerhub_webhook_secret || "");
  applyRegistryDefaultSecret();
  templateNetworkOverride = template.network || "";
  templateVersionOverride = template.version || "";
  generatedCreateInstanceName = "";
  generatedCreateDnsName = "";
  setFieldValue("instance", "");
  setFieldValue("dns_name", "");
  if (currentAction === "create") ensureRandomCreateInstanceName();
  else syncCreateDnsName({ force: true });
  setFieldValue("image", template.image || "");
  syncCreateVersion();
  if (template.version) setFieldValue("version", template.version);
  setRepeatRows(template.env || [], clearEnvRows, addEnvRow, { key: "var_env_key", value: "var_env_value" });
  setRepeatRows(template.labels || [], clearLabelRows, addLabelRow, { key: "label_key", value: "label_value" });
  setPortValue((template.ports || [])[0]?.value || "");
  setRepeatRows(template.volumes || [], clearVolumeRows, addVolumeRow, { key: "volume_source", value: "volume_name" });
  syncVolumeNames();
  setBindRows(template.binds || []);
}

async function saveCreateTemplate() {
  if (!isTemplateAction()) setAction("template");

  const conflict = repeatKeyConflict();
  showConfigConflict(conflict || {});
  if (conflict) {
    setNotice(conflict.detail, "error");
    return;
  }

  const suggested = selectedTemplateName();
  const name = (prompt("Template name", suggested) || "").trim();
  if (!name) return;

  const template = currentCreateTemplate();
  const owner = templateNameOwnedByOtherProfile(name, template.config_profile);
  if (owner) {
    setNotice(`Template "${name}" already exists in profile "${owner}"`, "error");
    return;
  }

  const previousTemplates = { ...createTemplates };
  createTemplates[name] = template;

  try {
    const savedCatalog = templateCatalogFromPayload(await persistCreateTemplates());
    createTemplates = savedCatalog.templates;
    createWorkflows = savedCatalog.workflows;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
    updateTemplateOptions(name);
    setNotice(`Template "${name}" saved`, "success");
  } catch (error) {
    createTemplates = previousTemplates;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    updateTemplateOptions();
    setNotice(error.code === "template_name_taken" ? error.message : "Template save failed", "error");
  }
}

function templateExportPayload() {
  return {
    type: "saashup-template-export",
    version: 1,
    exported_at: new Date().toISOString(),
    templates: normalizeCreateTemplates(createTemplates),
    template_order: Object.keys(normalizeCreateTemplates(createTemplates)),
    workflows: normalizeCreateWorkflows(createWorkflows),
  };
}

function exportAllCreateTemplates() {
  const count = Object.keys(createTemplates).length;
  if (!count) {
    setNotice("No templates to export", "error");
    return;
  }

  const date = new Date().toISOString().slice(0, 10);
  downloadJson(`saashup-templates-${date}.json`, templateExportPayload());
  setNotice(`${count} template${count === 1 ? "" : "s"} exported`, "success");
}

async function deleteSelectedTemplate() {
  const name = selectedTemplateName();
  if (!name || !createTemplates[name]) {
    setNotice("Select a template first", "error");
    return;
  }

  if (!confirm(`Delete template "${name}"?`)) return;

  const previousTemplates = { ...createTemplates };
  delete createTemplates[name];

  try {
    const savedCatalog = templateCatalogFromPayload(await persistCreateTemplates());
    createTemplates = savedCatalog.templates;
    createWorkflows = savedCatalog.workflows;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
    updateTemplateOptions();
    setNotice(`Template "${name}" deleted`, "success");
  } catch {
    createTemplates = previousTemplates;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    updateTemplateOptions(name);
    setNotice("Template delete failed", "error");
  }
}

async function loadSelectedTemplate() {
  const name = selectedTemplateName();
  if (!name || !createTemplates[name]) {
    setNotice("Select a template first", "error");
    return;
  }

  if (templateSelect) templateSelect.value = name;
  if (createTemplateSelect) createTemplateSelect.value = name;
  applyCreateTemplate(createTemplates[name]);
  if (fieldValue("image") && !fieldValue("version")) {
    await refreshImages({ notify: false });
    syncCreateVersion();
  }
  setNotice(`Template "${name}" loaded`, "success");
}

function openSelectedTemplateOrder() {
  const name = templateSelect?.value || "";
  if (!name) {
    setNotice("Select a template first", "error");
    return;
  }

  if (createTemplates[name]?.saashup_enabled === false) {
    setNotice(`Template "${name}" is disabled for orders`, "error");
    return;
  }

  window.location.href = `/order?template=${encodeURIComponent(name)}`;
}

function orderTemplateUrl(name) {
  const templateName = String(name || "").trim();
  if (!templateName) return "";
  const query = new URLSearchParams({ template: templateName });
  return `${window.location.origin}/order?${query.toString()}`;
}


function enrolledTemplateEntry(name) {
  const requested = String(name || "").trim().toLowerCase();
  return enrollmentCards.find((item) => String(item?.instance || "").trim().toLowerCase() === requested) || null;
}

function templateWebhookUrl(name) {
  const templateName = String(name || "").trim();
  if (!templateName) return "";

  const entry = enrolledTemplateEntry(templateName);
  const profile = String(entry?.config_profile || entry?.profile || selectedProfileCredentials().profile || visibleConfigProfileName() || "").trim();
  if (!profile) return "";

  const secret = String(entry?.registry_webhook_secret || entry?.dockerhub_webhook_secret || registryWebhookDefaultSecret || "").trim();
  if (!secret) return "";
  return `${window.location.origin}/registry-webhook/${encodeURIComponent(profile)}/${encodeURIComponent(templateName)}/${encodeURIComponent(secret)}`;
}

function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.top = "-1000px";
  document.body.appendChild(input);
  input.select();

  try {
    document.execCommand("copy");
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  } finally {
    input.remove();
  }
}

function createTemplateEntry(name) {
  if (!name) return null;
  if (createTemplates[name]) return { name, template: createTemplates[name] };

  const match = Object.keys(createTemplates)
    .find((templateName) => templateName.toLowerCase() === name.toLowerCase());

  return match ? { name: match, template: createTemplates[match] } : null;
}

async function applyOrderTemplate({ reveal = true } = {}) {
  setAction("create", { skipAutoRefresh: true });

  const entry = createTemplateEntry(orderTemplateName);
  if (!entry) {
    if (!orderTemplateName) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Yes";
      hideOrderActions();
      await refreshOrderInstanceStatuses();
      if (!orderInstanceCards.length) setOrderBlockedStatus("No instances found", "template-unavailable");
      return false;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Yes";
    hideOrderActions();
    setOrderBlockedStatus(`Template "${orderTemplateName}" not found`, "template-unavailable");
    return false;
  }

  if (entry.template.saashup_enabled === false) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Yes";
    hideOrderActions();
    setOrderBlockedStatus(`Template "${entry.name}" is disabled for orders`, "template-disabled");
    return false;
  }

  const orderTemplateProfile = String(entry.template.config_profile || entry.template.profile || "").trim();
  if (orderTemplateProfile && Object.hasOwn(knownProfileEntries(), orderTemplateProfile)) {
    if (orderTemplateProfile !== currentConfigProfile) applyProfileToFields(orderTemplateProfile, { syncNetwork: false });
    try {
      sessionStorage.setItem("saashup_profile", orderTemplateProfile);
    } catch {}
  }

  if (reveal) showOrderActions();
  const templateDnsPath = dnsParts(entry.template.dns_name).path;
  applyCreateTemplate(entry.template);
  setFieldValue("instance", "");
  setFieldValue("dns_name", "");
  generatedCreateDnsName = "";
  ensureRandomCreateInstanceName();
  syncCreateDnsName({ force: true });
  if (templateDnsPath) {
    const dnsName = `${createDnsName()}${templateDnsPath}`;
    setFieldValue("dns_name", dnsName);
    generatedCreateDnsName = dnsName;
  }
  submitBtn.textContent = "Yes";

  if (templateSelect) {
    updateTemplateOptions(entry.name);
  }

  const templateVersion = String(entry.template.version || "").trim();
  if (templateVersion) {
    setFieldValue("version", templateVersion);
  } else {
    const templateProfile = String(entry.template.config_profile || entry.template.profile || "").trim();
    const hadProfile = selectedProfileCredentials().profile;
    if (!hadProfile && templateProfile) applyProfileToFields(templateProfile, { syncNetwork: false });

    if (await refreshImages({ notify: false })) {
      syncCreateVersion();
    }
  }

  if (!fieldValue("network") && !isOrderPage) {
    syncCreateNetwork();
  }

  try {
    const limit = await orderLimitForProfile(selectedProfileCredentials().profile);
    refreshPendingProgressState(limit, limit.instances);
    renderOrderInstances(mappedOrderInstancesForRender(limit.instances), limit);
    if (limit.reached) {
      hideOrderActions();
      const stillCreating = Boolean(orderRedirectTarget)
        || orderInstanceCards.some((item) => normalizedOrderInstanceStatus(item) === "creating");
      if (!stillCreating) setOrderLimitStatus(limit);
      return false;
    }
  } catch {
    // The create endpoint enforces the limit; keep the order page usable if this check fails.
  }

  return true;
}

async function applyDockerComposeFile(text) {
  const composeText = text ?? dockerComposeInput?.value ?? "";
  if (isEnrollPage && dockerComposeServiceCount(composeText) > 1) {
    setNotice(enrollMultiComposeNotice, "error");
    return false;
  }

  const templates = parseDockerCompose(composeText);
  if (!templates.length) {
    setNotice("Compose services with images are required", "error");
    return false;
  }

  if (isEnrollPage) {
    const first = templates[0];
    if (!first.template.ports?.[0]?.value) {
      setNotice("Compose service must expose one port.", "error");
      return false;
    }
    if (!first.template.version) {
      setNotice("Compose service image version is required", "error");
      return false;
    }
    if (String(first.template.version).trim().toLowerCase() === "latest") {
      setNotice("Compose service image version cannot be latest", "error");
      return false;
    }
    applyCreateTemplate(first.template);
    if (!fieldValue("network") && !isEnrollPage && !isOrderPage) syncCreateNetwork();
    enrollSetImportedSummary(`Compose service ${first.name} imported`);
    const limit = await refreshEnrollLimit({ showLoading: false });
    if (limit?.reached) return false;
    setNotice(`Compose service "${first.name}" imported`, "success");
    return true;
  }

  const previousTemplates = { ...createTemplates };
  const previousWorkflows = { ...createWorkflows };
  const enableTemplateOrders = importTemplateOrdersInput?.checked !== false;
  templates.forEach(({ name, template }) => {
    createTemplates[name] = { ...template, saashup_enabled: enableTemplateOrders };
  });
  if (createWorkflowInput?.checked) {
    const workflowName = composeWorkflowName(composeText);
    const workflowProfileName = importProfileSelect?.value || selectedProfileCredentials().profile || "";
    const workflowKey = workflowStorageKey(workflowProfileName, workflowName);
    createWorkflows[workflowKey] = {
      name: workflowName,
      config_profile: workflowProfileName,
      steps: templates.map(({ name, template }) => ({
        template: name,
        template_data: { ...template, saashup_enabled: enableTemplateOrders },
        enabled: true,
      })),
      created_at: new Date().toISOString(),
    };
  }

  try {
    await persistCreateTemplates();
    updateTemplateOptions(templates[0].name);
    if (createWorkflowInput?.checked) {
      const workflowName = composeWorkflowName(composeText);
      const workflowProfileName = importProfileSelect?.value || selectedProfileCredentials().profile || "";
      updateWorkflowOptions(workflowStorageKey(workflowProfileName, workflowName));
    } else {
      updateWorkflowOptions("");
    }
    closeDockerRunModal();
    setNotice(`${templates.length} compose template${templates.length === 1 ? "" : "s"} imported`, "success");
    return true;
  } catch {
    createTemplates = previousTemplates;
    createWorkflows = previousWorkflows;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
    updateTemplateOptions();
    updateWorkflowOptions();
    setNotice("Compose import failed", "error");
    return false;
  }
}

function templateCatalogFromExportPayload(payload) {
  const data = plainObject(payload);
  if (data.type === "saashup-template-export" || data.type === "saashup-config-export") return templateCatalogFromPayload(data);
  if (data.templates && typeof data.templates === "object" && !Array.isArray(data.templates)) return templateCatalogFromPayload(data);
  return {
    templates: normalizeCreateTemplates(data),
    workflows: {},
  };
}

async function applyTemplateExportFile() {
  const file = templateExportFile?.files?.[0];
  if (!file) {
    setNotice("Select a template export first", "error");
    return false;
  }

  const previousTemplates = { ...createTemplates };
  const previousWorkflows = { ...createWorkflows };
  const shouldCreateWorkflow = exportCreateWorkflowInput?.checked !== false;
  const enableTemplateOrders = exportImportTemplateOrdersInput?.checked !== false;

  try {
    const payload = JSON.parse(await file.text());
    const { templates: importedTemplates, workflows: importedWorkflows } = templateCatalogFromExportPayload(payload);
    const importedTemplateOrder = templateOrderFromPayload(payload);
    const count = Object.keys(importedTemplates).length;
    const workflowCount = Object.keys(importedWorkflows).length;
    let effectiveWorkflowCount = shouldCreateWorkflow ? workflowCount : 0;
    if (!count && !effectiveWorkflowCount) {
      setNotice("Template export is empty", "error");
      return false;
    }

    createTemplates = {
      ...createTemplates,
      ...Object.fromEntries(
        Object.entries(importedTemplates).map(([name, template]) => [
          name,
          { ...template, saashup_enabled: enableTemplateOrders },
        ]),
      ),
    };
    if (shouldCreateWorkflow) {
      const workflowEntries = Object.entries(importedWorkflows);
      if (!workflowEntries.length && count) {
        const generated = workflowFromTemplateEntries(importedTemplates, selectedProfileCredentials().profile || "", "templates", enableTemplateOrders, importedTemplateOrder);
        workflowEntries.push([generated.key, generated.workflow]);
        effectiveWorkflowCount = 1;
      }
      createWorkflows = {
        ...createWorkflows,
        ...Object.fromEntries(
          workflowEntries.map(([key, workflow]) => [
            key,
            {
              ...workflow,
              steps: Array.isArray(workflow.steps)
                ? workflow.steps.map((step) => ({
                  ...step,
                  template_data: step?.template_data
                    ? { ...step.template_data, saashup_enabled: enableTemplateOrders }
                    : step?.template_data,
                }))
                : [],
            },
          ]),
        ),
      };
    } else {
      createWorkflows = { ...createWorkflows };
    }
    const savedCatalog = templateCatalogFromPayload(await persistCreateTemplates());
    createTemplates = savedCatalog.templates;
    createWorkflows = savedCatalog.workflows;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
    updateTemplateOptions(Object.keys(importedTemplates).sort((a, b) => a.localeCompare(b))[0] || "");
    const selectedWorkflow = shouldCreateWorkflow ? (Object.keys(createWorkflows).sort((a, b) => a.localeCompare(b))[0] || "") : "";
    updateWorkflowOptions(selectedWorkflow);
    closeDockerRunModal();
    setNotice(
      `${count} template${count === 1 ? "" : "s"} and ${effectiveWorkflowCount} workflow${effectiveWorkflowCount === 1 ? "" : "s"} imported from export`,
      "success",
    );
    return true;
  } catch {
    createTemplates = previousTemplates;
    createWorkflows = previousWorkflows;
    localStorage.setItem("create_templates", JSON.stringify(createTemplates));
    localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
    updateTemplateOptions();
    updateWorkflowOptions();
    setNotice("Template export import failed", "error");
    return false;
  }
}

async function applyDockerRunCommand() {
  if (currentImportTab === "export") {
    return applyTemplateExportFile();
  }

  if (currentImportTab === "compose") {
    return applyDockerComposeFile();
  }

  const runText = normalizeDockerRunInput();
  if (dockerComposeServiceCount(runText)) {
    return applyDockerComposeFile(runText);
  }

  const parsed = parseDockerRun(runText);
  const currentNetwork = fieldValue("network");

  if (!parsed.image) {
    setNotice("Docker run image is required", "error");
    return false;
  }

  if (isEnrollPage) {
    const versionCheck = enrollImageVersionAllowed(parsed.image, parsed.version);
    if (!versionCheck.ok) {
      setNotice(versionCheck.message, "error");
      return false;
    }
  }

  if (isEnrollPage) setAction("create", { skipAutoRefresh: true });
  else if (!isTemplateAction()) setAction("template");
  templateNetworkOverride = "";
  templateVersionOverride = parsed.version || "";
  generatedCreateDnsName = "";
  if (parsed.network && isTraefikNetwork(parsed.network)) {
    setFieldValue("network", parsed.network);
  } else {
    setFieldValue("network", currentNetwork || "");
  }

  if (!fieldValue("network") && isEnrollPage) {
    const fallbackNetwork = await defaultEnrollNetwork();
    if (fallbackNetwork) setFieldValue("network", fallbackNetwork);
  }
  if (parsed.traefik !== undefined) setFieldValue("traefik", parsed.traefik);
  if (parsed.instance) setFieldValue("instance", parsed.instance);
  syncCreateDnsName({ force: true });
  if (parsed.dns_name) {
    setFieldValue("dns_name", parsed.dns_name);
    generatedCreateDnsName = parsed.dns_name;
  }
  setFieldValue("image", parsed.image);
  syncCreateVersion();
  if (parsed.version) setFieldValue("version", parsed.version);
  setLoggingRow(parsed.log_driver ? parsed : { log_driver: defaultLogDriver, log_driver_options: defaultLogDriverOptions });

  setRepeatRows(parsed.env, clearEnvRows, addEnvRow, { key: "var_env_key", value: "var_env_value" });
  setRepeatRows(parsed.labels, clearLabelRows, addLabelRow, { key: "label_key", value: "label_value" });
  setPortValue(parsed.ports[0]?.value || "");
  setRepeatRows(parsed.volumes, clearVolumeRows, addVolumeRow, { key: "volume_source", value: "volume_name" });
  setBindRows(parsed.binds);

  closeDockerRunModal();
  enrollSetImportedSummary("Docker run imported");
  if (isEnrollPage) {
    const limit = await refreshEnrollLimit({ showLoading: false });
    if (limit?.reached) return false;
  }
  setNotice("Docker run imported", "success");
  return true;
}

function loadSavedConfig() {
  const configEndpoint = (!isOrderPage && !isEnrollPage && !isCatalogPage) ? "/admin/config" : "/config";
  return fetch(configEndpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      const usesPublicConfig = isEnrollPage || isOrderPage || isCatalogPage;
      const localProfiles = usesPublicConfig ? {} : applyDeletedProfileFilter(storedProfiles());
      if (!data) {
        serverConfigProfiles = {};
        configProfiles = localProfiles;
        updateProfileOptions();
        applyProfileToFields(currentConfigProfile, { syncNetwork: !isOrderPage && !isEnrollPage });
        return {};
      }

      savedConfig = data;
      const serverProfiles = applyDeletedProfileFilter(parseProfiles(data.profiles));
      serverConfigProfiles = { ...serverProfiles };
      configProfiles = usesPublicConfig ? { ...serverProfiles } : { ...localProfiles, ...serverProfiles };

      const profile = String(data.profile || data.config_profile || "").trim();
      if (profile && !deletedProfiles().includes(profile) && Object.hasOwn(serverProfiles, profile)) {
        const storedProfile = localStorage.getItem("current_config_profile") || "";
        const storedProfileSynced = Object.hasOwn(serverProfiles, storedProfile);
        currentConfigProfile = (isClientPage || !storedProfileSynced) ? profile : storedProfile;
      }
      if (isClientPage) {
        const sessionProfile = sessionProfileName();
        if (sessionProfile && Object.hasOwn(serverProfiles, sessionProfile) && !deletedProfiles().includes(sessionProfile)) {
          currentConfigProfile = sessionProfile;
        }
      }

      updateProfileOptions();
      applyProfileToFields(currentConfigProfile, { syncNetwork: !isOrderPage && !isEnrollPage });
      ensureRandomCreateInstanceName();
      return data;
    })
    .catch(() => {
      serverConfigProfiles = {};
      configProfiles = (isEnrollPage || isOrderPage) ? {} : applyDeletedProfileFilter(storedProfiles());
      updateProfileOptions();
      applyProfileToFields(currentConfigProfile, { syncNetwork: !isOrderPage && !isEnrollPage });
      ensureRandomCreateInstanceName();
      return {};
    });
}

async function test() {
  let { netbox, token, proxy } = selectedProfileCredentials();
  let credentials = selectedProfileCredentials();

  if (!netbox || !token) {
    const config = await loadSavedConfig();
    const refreshedCredentials = selectedProfileCredentials();
    credentials = refreshedCredentials;
    netbox = netbox || refreshedCredentials.netbox || "";
    token = token || refreshedCredentials.token || "";
    proxy = proxy || refreshedCredentials.proxy || "";
  }

  if (!netbox || !token) {
    const refreshedCredentials = selectedProfileCredentials();
    if (profileHasNetBoxCredentials(refreshedCredentials)) {
      netbox = netbox || "";
      token = token || "";
      proxy = proxy || "";
    }
  }

  if ((!netbox || !token) && !profileHasNetBoxCredentials(selectedProfileCredentials())) {
    setTestButtonState("error");
    setNotice("Save NetBox URL and token for this profile first", "error");
    return;
  }

  setTestButtonState("default");
  try {
    const response = await fetch("/test", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile: credentials.profile,
        config_profile: credentials.profile,
        netbox,
        token,
        proxy,
      }),
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text };
    }

    if (response.ok && (data["status"] || data["netbox-version"] || data["netbox-full-version"])) {
      setTestButtonState("success");
      setNotice("Connection successful", "success");
      return;
    }

    const detail = data.detail || data.error || data.message || data.payload || text || `HTTP ${response.status}`;
    setTestButtonState("error");
    setNotice(`Connection failed: ${String(detail).slice(0, 160)}`, "error", false);
  } catch (error) {
    setTestButtonState("error");
    setNotice(`Connection failed: ${error.message || "request error"}`, "error", false);
  }
}

async function testEmail() {
  const credentials = selectedProfileCredentials();
  const smtp_config = fieldValue("smtp_config") || credentials.smtp_config || "";

  if (!smtp_config && !credentials.smtp_configured) {
    setNotice("SMTP config is required", "error");
    return;
  }

  if (!mailSettings.owner_email_configured) {
    setNotice("APP_OWNER_EMAIL is not configured", "error");
    return;
  }

  testEmailBtn.disabled = true;
  try {
    const response = await fetch("/test-email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile: credentials.profile,
        config_profile: credentials.profile,
        smtp_config,
      }),
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text };
    }

    if (!response.ok) {
      const detail = typeof data?.detail === "string" ? data.detail : String(text || `HTTP ${response.status}`);
      throw new Error(detail || `HTTP ${response.status}`);
    }
    setNotice("Test email sent", "success");
  } catch (error) {
    const msg = String(error.message || "request error");
    const hint = msg.includes("origin_bad_gateway")
      ? "Cloudflare returned origin_bad_gateway. This usually means the app could not complete the SMTP request." 
      : msg;
    setNotice(`Test email failed: ${hint.slice(0, 180)}`, "error", false);
  } finally {
    testEmailBtn.disabled = false;
  }
}

async function saveConfig() {
  const previousSubmitText = submitBtn?.textContent || "Save config";
  const profile = (fieldValue("config_name") || fieldValue("config_profile") || "").trim();
  const customer_name = fieldValue("customer_name").trim();
  const netbox = fieldValue("netbox");
  const token = fieldValue("token");
  const proxy = fieldValue("proxy");
  const domain = normalizeDomain(fieldValue("domain"));
  const tag = fieldValue("tag").trim();
  const enrollment_limit = normalizeMaxInstances(fieldValue("enrollment_limit"));
  const owner_env_var = ownerEnvVarValue(fieldValue("owner_env_var"));
  const cloudflare_filter = fieldChecked("cloudflare_filter", true);
  const parallel_upgrade = fieldChecked("parallel_upgrade", false);
  const smtp_config = fieldValue("smtp_config");
  const saashup_visible = Boolean(configDefaultInput?.checked);
  const branding = fieldValue("profile_branding").trim();
  const existingCredentials = profileCredentials(profile);
  const hasExistingNetBoxCredentials = profileHasNetBoxCredentials(existingCredentials);

  if (!profile) {
    setNotice("Profile name is required", "error");
    return;
  }

  if ((!netbox || !token) && !hasExistingNetBoxCredentials) {
    setNotice("NetBox URL and token are required", "error");
    return;
  }

  if (!tag) {
    setNotice("Tag is required", "error");
    return;
  }

  const duplicateProfile = duplicateProfileScopeName(profile, netbox, tag);
  if (duplicateProfile) {
    setNotice(`Profile "${profileLabel(duplicateProfile)}" already uses this NetBox URL and tag`, "error");
    return;
  }

  forgetDeletedProfile(profile);
  setFieldValue("tag", tag);
  setFieldValue("enrollment_limit", enrollment_limit);
  setFieldValue("owner_env_var", owner_env_var);
  configProfiles[profile] = {
    ...(netbox ? { netbox } : {}),
    ...(token ? { token } : {}),
    ...(proxy ? { proxy } : {}),
    ...(smtp_config ? { smtp_config } : {}),
    netbox_configured: Boolean(netbox || existingCredentials.netbox_configured),
    token_configured: Boolean(token || existingCredentials.token_configured),
    proxy_configured: Boolean(proxy || existingCredentials.proxy_configured),
    smtp_configured: Boolean(smtp_config || existingCredentials.smtp_configured),
    domain,
    tag,
    enrollment_limit,
    owner_env_var,
    cloudflare_filter,
    parallel_upgrade,
    ...(saashup_visible ? { saashup_visible: true } : {}),
    ...(branding ? { branding } : {}),
  };
  if (saashup_visible) markVisibleConfig(profile);
  currentConfigProfile = profile;
  updateProfileOptions();
  persistProfiles();

  const params = new URLSearchParams({
    netbox,
    token,
    proxy,
    customer_name,
    domain,
    tag,
    enrollment_limit: String(enrollment_limit),
    owner_env_var,
    cloudflare_filter: cloudflare_filter ? "true" : "false",
    smtp_config,
    profile,
    config_profile: profile,
    profiles: JSON.stringify(configProfiles),
  });

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("btn-loading");
      submitBtn.textContent = "Saving config";
    }
    const response = await fetch(`/webhook?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    savedConfig = { customer_name, netbox, token, proxy, domain, tag, enrollment_limit, owner_env_var, cloudflare_filter, parallel_upgrade, smtp_config, profile, profiles: configProfiles };
    serverConfigProfiles = { ...configProfiles };
    applyProfileToFields(profile);
    try {
      await loadCreateTemplates({ useCache: false });
      setNotice(`Config "${profileLabel(profile)}" saved (${response.status})`, "success");
    } catch {
      setNotice(`Config "${profileLabel(profile)}" saved, templates refresh failed`, "error");
    }
  } catch {
    setNotice("Config save failed", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-loading");
      submitBtn.textContent = previousSubmitText;
    }
  }
}

async function deleteConfig() {
  const profile = (fieldValue("config_profile") || currentConfigProfile || "").trim();

  if (!configProfiles[profile] && !fieldValue("netbox") && !fieldValue("token")) {
    setNotice("No config to delete", "error");
    return;
  }

  if (!confirm(`Delete config "${profileLabel(profile)}"?`)) {
    return;
  }

  const customer_name = fieldValue("customer_name").trim() || savedConfig.customer_name || "";
  delete configProfiles[profile];
  rememberDeletedProfile(profile);
  const remainingProfiles = Object.keys(configProfiles).sort((a, b) => a.localeCompare(b));

  try {
    if (remainingProfiles.length === 0) {
      currentConfigProfile = "";
      savedConfig = { customer_name };
      persistProfiles();
      updateProfileOptions();
      setFieldValue("config_name", "");
      setFieldValue("customer_name", customer_name);
      setFieldValue("netbox", "");
      setFieldValue("token", "");
      setFieldValue("proxy", "");
      setFieldValue("domain", "");
      setFieldValue("tag", "");
      setFieldValue("max_instances", "1");
      setFieldValue("images_to_keep", "2");
      setFieldValue("enrollment_limit", "1");
      setFieldValue("owner_env_var", "SAASHUP_OWNER");
      setFieldValue("cloudflare_filter", true);
      setFieldValue("parallel_upgrade", false);
      setFieldValue("smtp_config", "");

      const params = new URLSearchParams({
        netbox: "",
        token: "",
        proxy: "",
        customer_name,
        domain: "",
        tag: "",
        enrollment_limit: "1",
        owner_env_var: "SAASHUP_OWNER",
        cloudflare_filter: "true",
        smtp_config: "",
        profile: "",
        config_profile: "",
        profiles: "{}",
      });

      const response = await fetch(`/webhook?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      serverConfigProfiles = {};
      setNotice(`Config "${profileLabel(profile)}" deleted (${response.status})`, "success");
      return;
    }

    currentConfigProfile = remainingProfiles[0];
    persistProfiles();
    updateProfileOptions();
    applyProfileToFields(currentConfigProfile);

    const credentials = profileCredentials(currentConfigProfile);
    const params = new URLSearchParams({
      netbox: credentials.netbox,
      token: credentials.token,
      proxy: credentials.proxy,
      customer_name,
      domain: credentials.domain,
      tag: credentials.tag,
      enrollment_limit: String(credentials.enrollment_limit),
      owner_env_var: credentials.owner_env_var,
      cloudflare_filter: credentials.cloudflare_filter ? "true" : "false",
      smtp_config: credentials.smtp_config,
      profile: currentConfigProfile,
      config_profile: currentConfigProfile,
      profiles: JSON.stringify(configProfiles),
    });

    const response = await fetch(`/webhook?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    savedConfig = { ...credentials, customer_name, profiles: configProfiles };
    serverConfigProfiles = { ...configProfiles };
    updateProfileOptions();
    applyProfileToFields(currentConfigProfile);
    setNotice(`Config "${profileLabel(profile)}" deleted (${response.status})`, "success");
  } catch {
    setNotice("Config delete failed", "error");
  }
}

function workflowVolumeName(instance, index) {
  const suffix = index === 0 ? "data" : `data-${index + 1}`;
  return `${String(instance || "instance").split(".")[0]}-${suffix}`;
}

function appendWorkflowPairs(body, items, keyField, valueField, keyNames = ["key"], valueNames = ["value"]) {
  items.forEach((item) => {
    const key = keyNames.map((name) => item?.[name]).find((value) => value !== undefined) || "";
    const value = valueNames.map((name) => item?.[name]).find((entry) => entry !== undefined) || "";
    body.append(keyField, key);
    body.append(valueField, value);
  });
}

function createTemplateVolumeName(volume, index, instanceName, template, templateName) {
  const explicitName = volume.name ?? volume.value;
  if (!explicitName) return workflowVolumeName(instanceName, index);

  const generatedTemplateNames = new Set([
    workflowVolumeName("instance", index),
    workflowVolumeName(templateName, index),
  ]);
  if (template.instance) generatedTemplateNames.add(workflowVolumeName(template.instance, index));

  return generatedTemplateNames.has(String(explicitName)) ? workflowVolumeName(instanceName, index) : explicitName;
}

function workflowCreateBody(template, templateName) {
  template = normalizeCreateTemplate(template);
  const profileName = template.config_profile || template.profile || currentConfigProfile || "";
  const credentials = profileCredentials(profileName);
  if (!profileHasNetBoxCredentials(credentials)) throw new Error(`Config "${profileLabel(profileName)}" is missing NetBox URL or token`);

  const instanceName = String(template.instance || templateName || "").trim();
  const hasTraefik = checkboxValue(template.traefik, true);
  const body = new URLSearchParams({
    config_profile: profileName,
    netbox: credentials.netbox,
    token: credentials.token,
    proxy: credentials.proxy,
    domain: credentials.domain,
    tag: credentials.tag,
    max_instances: String(templateMaxInstancesValue(template)),
    enrollment_limit: String(credentials.enrollment_limit),
    owner_env_var: credentials.owner_env_var,
    profile: credentials.profile,
    network: template.network || "",
    traefik: hasTraefik ? "true" : "false",
    all_hosts: template.all_hosts ? "true" : "false",
    instance: instanceName,
    dns_name: hasTraefik ? dnsNameFqdn(template.dns_name || instanceName, credentials.domain) : "",
    image: template.image || "",
    version: template.version || "",
    cloudflare_filter: credentials.cloudflare_filter ? "true" : "false",
  });
  if (template.log_driver) {
    body.set("log_driver", template.log_driver);
    body.set("log_driver_options", JSON.stringify(templateLogDriverOptions(template)));
  }

  appendWorkflowPairs(body, template.env || [], "var_env_key", "var_env_value", ["key", "var_name", "name"], ["value"]);
  appendWorkflowPairs(body, template.labels || [], "label_key", "label_value", ["key"], ["value"]);
  (template.ports || []).slice(0, 1).forEach((port) => body.append("port_value", port.value || port.key || ""));
  (template.volumes || []).forEach((volume, index) => {
    const source = volume.source ?? volume.key ?? "";
    if (!source) return;
    body.append("volume_source", source);
    body.append("volume_name", createTemplateVolumeName(volume, index, instanceName, template, templateName));
  });
  (template.binds || []).forEach((bind) => {
    const hostPath = bind.host_path ?? bind.host ?? bind.key ?? "";
    const containerPath = bind.container_path ?? bind.container ?? bind.value ?? "";
    if (!hostPath || !containerPath) return;
    body.append("bind_host_path", hostPath);
    body.append("bind_container_path", containerPath);
    body.append("bind_read_only", bind.read_only || bind.readonly ? "true" : "false");
  });
  return body;
}

function clearBodyKeys(body, keys) {
  keys.forEach((key) => body.delete(key));
}

function appendCreateTemplateBody(body, template, templateName = "") {
  template = normalizeCreateTemplate(template);
  const instanceName = String(body.get("instance") || template.instance || templateName || "").trim();
  const versionOverride = String(body.get("version") || "").trim();
  const templateKeys = [
    "network", "log_driver", "log_driver_options", "log_syslog_address", "log_syslog_tag", "traefik", "saashup_enabled", "max_instances", "images_to_keep", "registry_webhook_secret",
    "image", "version", "var_env_key", "var_env_value", "label_key", "label_value", "port_value",
    "volume_source", "volume_name", "bind_host_path", "bind_container_path", "bind_read_only",
  ];
  clearBodyKeys(body, templateKeys);
  body.set("network", template.network || "");
  if (template.log_driver) {
    body.set("log_driver", template.log_driver);
    body.set("log_driver_options", JSON.stringify(templateLogDriverOptions(template)));
  }
  body.set("traefik", template.traefik === false ? "false" : "true");
  body.set("saashup_enabled", template.saashup_enabled === false ? "false" : "true");
  body.set("max_instances", String(templateMaxInstancesValue(template)));
  body.set("images_to_keep", String(templateImagesToKeepValue(template)));
  body.set("registry_webhook_secret", template.registry_webhook_secret || template.dockerhub_webhook_secret || "");
  body.set("image", template.image || "");
  body.set("version", versionOverride || template.version || "");
  appendWorkflowPairs(body, template.env || [], "var_env_key", "var_env_value", ["key", "var_name", "name"], ["value"]);
  appendWorkflowPairs(body, template.labels || [], "label_key", "label_value", ["key"], ["value"]);
  (template.ports || []).slice(0, 1).forEach((port) => body.append("port_value", port.value || port.key || ""));
  (template.volumes || []).forEach((volume, index) => {
    const source = volume.source ?? volume.key ?? "";
    if (!source) return;
    body.append("volume_source", source);
    body.append("volume_name", createTemplateVolumeName(volume, index, instanceName, template, templateName));
  });
  (template.binds || []).forEach((bind) => {
    const hostPath = bind.host_path ?? bind.host ?? bind.key ?? "";
    const containerPath = bind.container_path ?? bind.container ?? bind.value ?? "";
    if (!hostPath || !containerPath) return;
    body.append("bind_host_path", hostPath);
    body.append("bind_container_path", containerPath);
    body.append("bind_read_only", bind.read_only || bind.readonly ? "true" : "false");
  });
}

function workflowDeleteBody(template, templateName) {
  template = normalizeCreateTemplate(template);
  const profileName = template.config_profile || template.profile || currentConfigProfile || "";
  const credentials = profileCredentials(profileName);
  if (!profileHasNetBoxCredentials(credentials)) throw new Error(`Config "${profileLabel(profileName)}" is missing NetBox URL or token`);

  const image = String(template.image || "").trim();
  if (!image) throw new Error(`Template "${templateName}" is missing an image name for delete`);
  return new URLSearchParams({
    config_profile: profileName,
    netbox: credentials.netbox,
    token: credentials.token,
    proxy: credentials.proxy,
    domain: credentials.domain,
    tag: credentials.tag,
    profile: credentials.profile,
    image,
    delete_mode: "image",
    delete_volumes: workflowDeleteVolumesInput?.checked ? "true" : "false",
  });
}

function workflowUpgradeBody(template, templateName) {
  template = normalizeCreateTemplate(template);
  const profileName = template.config_profile || template.profile || currentConfigProfile || "";
  const credentials = profileCredentials(profileName);
  if (!profileHasNetBoxCredentials(credentials)) throw new Error(`Config "${profileLabel(profileName)}" is missing NetBox URL or token`);

  const image = String(template.image || "").trim();
  if (!image) throw new Error(`Template "${templateName}" is missing an image name for upgrade`);
  const version = String(template.version || "").trim();
  if (!version) throw new Error(`Template "${templateName}" is missing a target version for upgrade`);

  return new URLSearchParams({
    config_profile: profileName,
    netbox: credentials.netbox,
    token: credentials.token,
    proxy: credentials.proxy,
    domain: credentials.domain,
    tag: credentials.tag,
    profile: credentials.profile,
    image,
    oldversion: template.oldversion || template.old_version || "",
    version,
    clean_name: "false",
    remove_old_images: "false",
  });
}

function workflowPaintFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
}

function workflowMinimumStatusDelay(action) {
  return action === "delete" ? new Promise((resolve) => window.setTimeout(resolve, 350)) : Promise.resolve();
}

function workflowAction() {
  return ["create", "upgrade", "delete"].includes(workflowActionSelect?.value) ? workflowActionSelect.value : "create";
}

function workflowActionEndpoint(action) {
  if (action === "delete") return "/delete";
  if (action === "upgrade") return "/recreate";
  return "/create";
}

function workflowActionBody(action, template, templateName) {
  if (action === "delete") return workflowDeleteBody(template, templateName);
  if (action === "upgrade") return workflowUpgradeBody(template, templateName);
  return workflowCreateBody(template, templateName);
}

function workflowActionProgressLabel(action) {
  if (action === "delete") return "Deleting";
  if (action === "upgrade") return "Upgrading";
  return "Running";
}

function workflowActionNotice(action, workflowName) {
  const label = workflowOptionLabel(workflowName);
  if (action === "delete") return `Workflow "${label}" delete requested`;
  if (action === "upgrade") return `Workflow "${label}" upgrade requested`;
  return `Workflow "${label}" requested`;
}

async function runWorkflow() {
  const workflowName = workflowSelect?.value || "";
  const action = workflowAction();
  const workflow = selectedWorkflow();
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];
  const enabledSteps = steps.map((step, index) => ({ step, index })).filter(({ step }) => workflowStepEnabled(step));
  const runSteps = action === "delete" ? [...enabledSteps].reverse() : enabledSteps;
  if (!steps.length || !enabledSteps.length) {
    setNotice("Select a workflow first", "error");
    return;
  }

  runWorkflowBtn.disabled = true;
  deleteWorkflowBtn.disabled = true;
  await clearLogs({ notify: false });
  workflowStepStatuses = Object.fromEntries(steps.map((_, index) => [index, "pending"]));
  renderWorkflow();

  try {
    for (let runIndex = 0; runIndex < runSteps.length; runIndex += 1) {
      const { step, index } = runSteps[runIndex];
      const templateName = workflowStepName(step);
      const template = workflowStepTemplate(step);
      if (action === "create" && !template.image) throw new Error(`Template "${templateName}" is missing`);
      if (action === "upgrade" && (!template.image || !template.version)) throw new Error(`Template "${templateName}" is missing image or version for upgrade`);
      if (action === "delete" && !Object.keys(template).length) throw new Error(`Template "${templateName}" is missing`);

      workflowStepStatuses[index] = "running";
      renderWorkflow();
      workflowSummary.textContent = `${workflowActionProgressLabel(action)} ${runIndex + 1}/${enabledSteps.length}: ${templateName}`;
      await workflowPaintFrame();
      const minimumStatusDelay = workflowMinimumStatusDelay(action);
      const body = workflowActionBody(action, template, templateName);
      body.set("wait", "true");
      const response = await fetch(workflowActionEndpoint(action), {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      await minimumStatusDelay;
      if (!response.ok) throw new Error(`Template "${templateName}" failed (${response.status})`);
      workflowStepStatuses[index] = "done";
      renderWorkflow();
    }
    setNotice(workflowActionNotice(action, workflowName), "success");
    workflowSummary.textContent = `${enabledSteps.length} ${action} step${enabledSteps.length === 1 ? "" : "s"} requested`;
  } catch (error) {
    const failedIndex = steps.findIndex((_, index) => workflowStepStatuses[index] === "running");
    if (failedIndex !== -1) workflowStepStatuses[failedIndex] = "failed";
    setNotice(error.message || "Workflow failed", "error", false);
    renderWorkflow();
  } finally {
    runWorkflowBtn.disabled = false;
    deleteWorkflowBtn.disabled = false;
  }
}

function deleteWorkflow() {
  const name = workflowSelect?.value || "";
  if (!name || !createWorkflows[name]) {
    setNotice("Select a workflow first", "error");
    return;
  }
  const label = workflowOptionLabel(name);
  if (!confirm(`Delete workflow "${label}"?`)) return;

  delete createWorkflows[name];
  localStorage.setItem("create_workflows", JSON.stringify(createWorkflows));
  markWorkflowCatalogDirty();
  updateWorkflowOptions();
  setNotice(`Workflow "${label}" deleted locally`, "success");
}

function setWorkflowStepEnabled(index, enabled) {
  const workflow = selectedWorkflow();
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];
  if (!steps[index]) return;
  if (typeof steps[index] === "string") steps[index] = { template: steps[index] };
  steps[index].enabled = enabled;
  workflowStepStatuses = {};
  persistSelectedWorkflow();
  markWorkflowCatalogDirty();
  renderWorkflow();
}

function removeWorkflowStep(index) {
  const workflow = selectedWorkflow();
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];
  if (!steps[index]) return;
  const name = workflowStepName(steps[index]) || "workflow step";
  workflow.steps = steps.filter((_, stepIndex) => stepIndex !== index);
  workflowStepStatuses = {};
  persistSelectedWorkflow();
  markWorkflowCatalogDirty();
  renderWorkflow();
  setNotice(`Workflow task "${name}" removed locally`, "success");
}

async function submitAction(config, submitter) {
  syncVolumeNames();

  const restoreBindReadOnly = prepareBindReadOnlyForFormData();
  const body = new URLSearchParams(new FormData(form));
  restoreBindReadOnly();
  const credentials = selectedProfileCredentials();
  let createdInstanceFqdn = "";

  if (isEnrollPage && !canCreatePublicImage()) {
    hidePublicImageForm();
    return;
  }

  if (!isOrderPage && !isEnrollPage && !profileHasNetBoxCredentials(credentials)) {
    setNotice("Save NetBox URL and token for this profile first", "error");
    return;
  }

  body.set("netbox", credentials.netbox);
  body.set("token", credentials.token);
  body.set("proxy", credentials.proxy);
  body.set("domain", credentials.domain);
  body.set("tag", credentials.tag);
  body.set("max_instances", String(normalizeMaxInstances(body.get("max_instances"))));
  if (body.has("images_to_keep")) body.set("images_to_keep", String(normalizeImagesToKeep(body.get("images_to_keep"))));
  body.set("enrollment_limit", String(credentials.enrollment_limit));
  body.set("owner_env_var", credentials.owner_env_var);
  body.set("profile", credentials.profile);
  if (isOrderPage) {
    body.set("order_request", "true");
    body.set("order_template", orderTemplateName);
  }
  if (isEnrollPage) {
    body.set("enroll_request", "true");
    const versionCheck = enrollImageVersionAllowed(body.get("image"), body.get("version"));
    if (!versionCheck.ok) {
      submitBtn.disabled = false;
      setNotice(versionCheck.message, "error");
      return;
    }
    const templateName = selectedTemplateName() || body.get("template_name") || defaultTemplateNameFromImage(body.get("image"));
    if (templateName) body.set("template_name", templateName);
  }

  if (currentAction === "create") {
    const templateName = selectedTemplateName() || orderTemplateName || "";
    const templateEntry = createTemplateEntry(templateName);
    if (templateEntry) appendCreateTemplateBody(body, templateEntry.template, templateEntry.name);
    const hasTraefik = String(body.get("traefik") ?? "true") !== "false";
    const instanceName = String(body.get("instance") || "").trim();
    let rawDnsName = body.get("dns_name") || instanceName;
    const orderTemplateDnsPath = isOrderPage ? dnsParts(createTemplateEntry(orderTemplateName)?.template?.dns_name).path : "";
    if (orderTemplateDnsPath && !dnsParts(rawDnsName).path) rawDnsName = `${rawDnsName}${orderTemplateDnsPath}`;
    const dnsName = hasTraefik ? dnsNameFqdn(rawDnsName, credentials.domain) : "";
    body.set("instance", instanceName);
    body.set("dns_name", dnsName);
    body.set("cloudflare_filter", credentials.cloudflare_filter ? "true" : "false");
    body.set("traefik", hasTraefik ? "true" : "false");
    setFieldValue("instance", instanceName);
    setFieldValue("dns_name", dnsName);
    createdInstanceFqdn = hasTraefik ? dnsName : instanceName;
  }

  if (submitter?.name) {
    body.set(submitter.name, submitter.value);
  }

  const request = {
    method: config.method.toUpperCase(),
    headers: { Accept: "application/json" },
  };

  if (request.method !== "GET") {
    request.headers["Content-Type"] = "application/x-www-form-urlencoded";
    request.body = body.toString();
  }

  if (!isOrderPage && !isEnrollPage) {
    await clearLogs({ notify: false });
  }

  const endpoint = request.method === "GET" ? `${config.endpoint}?${body.toString()}` : config.endpoint;
  if (isOrderPage || isEnrollPage) submitBtn.disabled = true;
  if (isEnrollPage) form?.classList.add("hidden");

  const response = await fetch(endpoint, request);
  if (isOrderPage) {
    if (response.status === 202) {
      hideOrderActions();
      addOrderInstanceCard(createdInstanceFqdn);
      orderRedirectTarget = createdInstanceFqdn;
      orderRedirectSince = Date.now();
      orderLastProgressStep = 0;
      orderRedirectTemplateName = orderTemplateName;
      persistOrderRedirect();
      showOrderRedirectLoading(createdInstanceFqdn);
      if (orderStatus) {
        orderStatus.className = "order-status hidden";
        orderStatus.dataset.reason = "order-requested";
        orderStatus.replaceChildren();
      }
    } else {
      const text = await response.text();
      let detail = "";

      try {
        const data = text ? JSON.parse(text) : {};
        detail = data.detail || data.error || data.message || "";
        showConfigConflict(data);
      } catch {
        detail = text;
      }

      submitBtn.disabled = false;
      setOrderStatus(detail || `Installation request failed (${response.status})`, "error");
    }
    return;
  }

  if (isEnrollPage) {
    if (response.status === 200 || response.status === 202) {
      await refreshEnrollLimit({ showLoading: false });
      setNotice(`Enrollment recorded for ${createdInstanceFqdn || fieldValue("instance")}.`, "success");
    } else {
      const text = await response.text();
      let detail = "";

      try {
        const data = text ? JSON.parse(text) : {};
        detail = data.detail || data.error || data.message || "";
        showConfigConflict(data);
      } catch {
        detail = text;
      }

      submitBtn.disabled = false;
      form?.classList.remove("hidden");
      setEnrollSubmitInProgress(false);
      setNotice(detail || `Creation request failed (${response.status})`, "error");
    }
    return;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    showConfigConflict(data);
    if (data.code === "duplicate_env_var" || data.code === "duplicate_label") {
      setNotice(data.detail, "error", false);
      return;
    }
  }

  const type = response.ok ? "success" : "error";
  const result = response.ok ? "requested" : "failed";

  setNotice(`${config.title} ${result} (${response.status})`, type);
}

function instanceNameFromItem(item) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";

  return item.instance || item.display || item.name || "";
}

async function refreshInstances() {
  if (!instanceOptions || !refreshInstancesBtn) return;
  const query = credentialsQuery({ includeTag: shouldFilterRefreshByTag() });

  if (!query) {
    setNotice("Save NetBox URL and token for this profile first", "error");
    return;
  }

  if (currentAction === "delete" || currentAction === "restart") {
    setFieldValue("instance", "");
    updateRestartButtons();
  }

  refreshInstancesBtn.disabled = true;

  try {
    const data = await loadInstances(query, { force: true });
    const instances = Array.from(new Set((Array.isArray(data) ? data : [])
      .map(instanceNameFromItem)
      .filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));

    instanceOptions.replaceChildren(...instances.map((name) => {
      const option = document.createElement("option");
      option.value = name;
      return option;
    }));

    setNotice(`Loaded ${instances.length} instances`, "success");
  } catch {
    setNotice("Instance refresh failed", "error");
  } finally {
    refreshInstancesBtn.disabled = false;
  }
}

function imageNameFromItem(item) {
  if (typeof item === "string") return splitImageRef(item).image;
  if (!item || typeof item !== "object") return "";

  const name = valueText(item.name);
  if (name) return splitImageRef(name).image;

  return splitImageRef(valueText(item.display)).image || "";
}

function imageVersionFromItem(item) {
  if (typeof item === "string") return splitImageRef(item).version;
  if (!item || typeof item !== "object") return "";

  return valueText(item.version)
    || valueText(item.tag)
    || splitImageRef(valueText(item.display)).version
    || splitImageRef(valueText(item.name)).version
    || "";
}

function normalizeVersion(value) {
  return String(value || "").trim().replace(/^[^\d]*/, "");
}

function compareVersionsDesc(left, right) {
  const leftParts = normalizeVersion(left).split(/[^\d]+/).filter(Boolean).map(Number);
  const rightParts = normalizeVersion(right).split(/[^\d]+/).filter(Boolean).map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const diff = (rightParts[index] || 0) - (leftParts[index] || 0);
    if (diff) return diff;
  }

  return right.localeCompare(left, undefined, { numeric: true, sensitivity: "base" });
}

function replaceOptions(datalist, values) {
  if (!datalist) return;

  datalist.replaceChildren(...values.map((value) => {
    const option = document.createElement("option");
    option.value = value;
    return option;
  }));
}

function updateOldVersionOptions() {
  const image = fieldValue("image");
  const versions = versionsForImage(image);

  const restartVersion = field("restart_version");
  if (restartVersion?.value && !versions.includes(restartVersion.value)) {
    restartVersion.value = "";
  }

  replaceOptions(oldVersionOptions, versions);
  replaceOptions(restartVersionOptions, versions);
  syncCreateVersion();
  updateRestartButtons();
  updateSelectedVersionContainerNotice();
}

function versionsForImage(image) {
  const imageRef = splitImageRef(image);
  const requestedImage = imageRef.image;
  if (imageRef.version) return [imageRef.version];

  return Array.from(new Set(imageRecords
    .filter((item) => imageNameFromItem(item) === requestedImage)
    .map(imageVersionFromItem)
    .filter(Boolean)))
    .sort(compareVersionsDesc);
}

async function readRegistryLookupPayload(response) {
  const text = await response.text().catch(() => "");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text.trim() };
  }
}

async function verifyEnrollImageAvailable() {
  const image = fieldValue("image");
  const version = fieldValue("version");
  const imageRef = splitImageRef(image);
  const requestedImage = imageRef.image;
  const requestedVersion = String(version || imageRef.version || "").trim();

  setEnrollCheckingImage(true);

  try {
    const query = new URLSearchParams({ image: `${requestedImage}:${requestedVersion}` });
    const response = await fetch(`/registry/lookup?${query.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const data = await readRegistryLookupPayload(response);

    if (!response.ok) {
      setNotice(data.detail || `Image registry check failed (${response.status})`, "error", false);
      return false;
    }

    if (!data.exists) {
      setNotice(`Image ${requestedImage}:${requestedVersion} was not found in the provider registry.`, "error", false);
      return false;
    }

    if (enrollSummary) {
      enrollSummary.textContent = `Image found - ${requestedImage}:${requestedVersion}`;
      enrollSummary.classList.remove("hidden");
    }
    setNotice(`Image found - ${requestedImage}:${requestedVersion}`, "success", false);
    return true;
  } finally {
    setEnrollCheckingImage(false);
  }
}

function highestVersionForImage(image = fieldValue("image")) {
  return versionsForImage(image)[0] || "";
}

function syncCreateVersion() {
  const version = field("version");
  if (!version) return;

  const templateSelected = Boolean(selectedTemplateName());
  version.readOnly = currentAction === "create" && !templateSelected;
  if (!isCreateFormAction()) return;

  if (templateVersionOverride) {
    setFieldValue("version", templateVersionOverride);
    return;
  }

  setFieldValue("version", highestVersionForImage());
}

async function ensureCreateVersion() {
  if (!isCreateFormAction() || !fieldValue("image") || fieldValue("version")) return;

  syncCreateVersion();
  if (fieldValue("version")) return;

  if (imageRecords.length === 0 || !fieldValue("version")) {
    await refreshImages({ notify: false });
    syncCreateVersion();
  }
}

function selectedVersionForCount() {
  if (currentAction === "recreate") return fieldValue("oldversion");
  if (currentAction === "restart") return fieldValue("restart_version");
  return "";
}

async function updateSelectedVersionContainerNotice() {
  if (currentAction !== "recreate" && currentAction !== "restart") return;

  const image = fieldValue("image");
  const version = selectedVersionForCount();
  const requestId = ++containerCountRequestId;

  if (!image || !version) return;

  const query = credentialsQuery({ includeTag: shouldFilterRefreshByTag() });
  if (!query) return;

  query.set("image", image);
  query.set("version", version);

  try {
    const response = await fetch(`/containers-count?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (requestId !== containerCountRequestId) return;

    const count = Number(data.count || 0);
    const label = count === 1 ? "container uses" : "containers use";
    setNotice(`${count} ${label} ${image}:${version}`, "info", false);
  } catch {
    if (requestId === containerCountRequestId) {
      setNotice("Container count failed", "error");
    }
  }
}

function updateRemoveOldImagesState() {
  const checkbox = field("remove_old_images");
  if (!checkbox) return;

  const oldVersion = fieldValue("oldversion").trim();
  const newVersion = fieldValue("version").trim();
  const blocked = currentAction !== "recreate" || (oldVersion && newVersion && oldVersion === newVersion);

  checkbox.disabled = blocked;
  checkbox.title = blocked && currentAction === "recreate"
    ? "Old images cannot be removed when old version is the same as the new version."
    : "";
  if (blocked) checkbox.checked = false;
}

async function refreshImages({ notify = true } = {}) {
  if (!imageOptions || !refreshImagesBtn) return;
  const query = credentialsQuery({ includeTag: shouldFilterRefreshByTag() });

  if (!query) {
    if (notify) setNotice("Save NetBox URL and token for this profile first", "error");
    return false;
  }

  if (currentAction === "recreate" || currentAction === "restart") {
    setFieldValue("image", "");
    setFieldValue("oldversion", "");
    setFieldValue("restart_version", "");
    updateRestartButtons();
    updateRemoveOldImagesState();
  }

  refreshImagesBtn.disabled = true;

  try {
    const response = await fetch(`/images?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    imageRecords = Array.isArray(data) ? data : [];

    const images = Array.from(new Set(imageRecords
      .map(imageNameFromItem)
      .filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));

    replaceOptions(imageOptions, images);
    updateOldVersionOptions();
    if (notify) setNotice(`Loaded ${images.length} images`, "success");
    return true;
  } catch {
    if (notify) setNotice("Image refresh failed", "error");
    return false;
  } finally {
    refreshImagesBtn.disabled = false;
  }
}

async function getLogs() {
  try {
    const response = await fetch("logs");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const logs = await response.text();
    if (logsPollFailed) {
      logsPollFailed = false;
      const notif = document.getElementById("notif");
      if (notif?.textContent === logsPollFailureNotice) setNotice("Welcome !", "info", false);
    }
    if (logs !== lastLogsHtml) {
      lastLogsHtml = logs;
      document.getElementById("logs").innerHTML = formatLogs(logs);
    }
  } catch (err) {
    console.error("Error fetching logs:", err);
    if (!logsPollFailed) {
      logsPollFailed = true;
      setNotice(logsPollFailureNotice, "error", false);
    }
  }
}

async function clearLogs({ notify = true } = {}) {
  try {
    const response = await fetch("/logs", {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    lastLogsHtml = "";
    document.getElementById("logs").innerHTML = "&nbsp;<br>";
    if (notify) setNotice(`Logs cleared (${response.status})`, "success");
    return true;
  } catch {
    if (notify) setNotice("Clear logs failed", "error");
    return false;
  }
}

document.querySelectorAll("[data-action]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setAction(link.dataset.action);
  });
});

envList?.addEventListener("click", (event) => {
  const button = event.target.closest(".env-remove");
  if (!button || button.disabled) return;

  button.closest(".env-row")?.remove();
  updateEnvRemoveButtons();
});

addEnvBtn?.addEventListener("click", () => {
  addEnvRow();
  envRows().at(-1)?.querySelector("input")?.focus();
});

loggingList?.addEventListener("click", (event) => {
  const button = event.target.closest(".repeat-remove");
  if (!button || button.disabled) return;

  setLoggingRow(null);
});

addLoggingBtn?.addEventListener("click", () => {
  setLoggingRow({ log_driver: defaultLogDriver, log_driver_options: defaultLogDriverOptions });
  loggingRow()?.querySelector("input")?.focus();
});

labelList?.addEventListener("click", (event) => {
  const button = event.target.closest(".repeat-remove");
  if (!button || button.disabled) return;

  button.closest(".repeat-row")?.remove();
  updateLabelRemoveButtons();
});

addLabelBtn?.addEventListener("click", () => {
  addLabelRow();
  repeatRows(labelList, ".repeat-row").at(-1)?.querySelector("input")?.focus();
});

volumeList?.addEventListener("click", (event) => {
  const button = event.target.closest(".repeat-remove");
  if (!button || button.disabled) return;

  button.closest(".repeat-row")?.remove();
  syncVolumeNames();
  updateVolumeRemoveButtons();
});

envList?.addEventListener("input", (event) => {
  if (event.target.matches('[name="var_env_key"]')) markDuplicateRows(envList, ".env-row", "var_env_key");
});

labelList?.addEventListener("input", (event) => {
  if (event.target.matches('[name="label_key"]')) markDuplicateRows(labelList, ".repeat-row", "label_key");
});

volumeList?.addEventListener("input", (event) => {
  if (event.target.matches('[name="volume_source"]')) syncVolumeNames();
});

addVolumeBtn?.addEventListener("click", () => {
  addVolumeRow();
  repeatRows(volumeList, ".repeat-row").at(-1)?.querySelector("input")?.focus();
});

bindList?.addEventListener("click", (event) => {
  const button = event.target.closest(".repeat-remove");
  if (!button || button.disabled) return;

  button.closest(".repeat-row")?.remove();
  updateBindRemoveButtons();
});

addBindBtn?.addEventListener("click", () => {
  addBindRow();
  repeatRows(bindList, ".repeat-row").at(-1)?.querySelector("input")?.focus();
});

form?.addEventListener("submit", async (event) => {
  const config = actions[currentAction];
  event.preventDefault();
  if (isEnrollPage) setEnrollSubmitInProgress(true);

  if (currentAction === "config") {
    saveConfig();
    return;
  }

  if (currentAction === "branding") {
    saveBranding();
    return;
  }

  if (isEnrollPage) {
    const imported = await applyDockerRunCommand();
    if (!imported) {
      setEnrollSubmitInProgress(false);
      updateEnrollSubmitState({ notify: false });
      return;
    }
  }

  if (currentAction === "template") {
    setSubmitValidationError("Use Save template to store template changes");
    return;
  }

  if (currentAction === "restart" && event.submitter?.value === "instance" && !fieldValue("instance")) {
    setSubmitValidationError("Instance name is required");
    return;
  }

  if (currentAction === "restart" && event.submitter?.value === "image") {
    if (!fieldValue("image")) {
      setSubmitValidationError("Image name is required");
      return;
    }

    if (!fieldValue("restart_version")) {
      setSubmitValidationError("Version is required");
      return;
    }
  }

  if (currentAction === "delete" && event.submitter?.value === "image" && !fieldValue("image")) {
    setSubmitValidationError("Image name is required");
    return;
  }

  if (currentAction === "delete" && event.submitter?.value !== "image" && !fieldValue("instance")) {
    setSubmitValidationError("Instance name is required");
    return;
  }

  const selectedCreateTemplate = currentAction === "create" ? createTemplateEntry(selectedTemplateName() || orderTemplateName || "") : null;

  if (currentAction === "create" && !isEnrollPage && !selectedCreateTemplate) {
    setSubmitValidationError("Select a template first");
    return;
  }

  if (currentAction === "create" && !(fieldValue("network") || selectedCreateTemplate?.template?.network)) {
    setSubmitValidationError("Network is required");
    return;
  }

  if (currentAction === "create" && !(fieldValue("image") || selectedCreateTemplate?.template?.image)) {
    setSubmitValidationError("Image name is required");
    return;
  }

  const selectedTemplatePort = selectedCreateTemplate?.template?.ports?.[0]?.value || selectedCreateTemplate?.template?.ports?.[0]?.key;
  if (currentAction === "create" && !(fieldValue("port_value") || selectedTemplatePort)) {
    setSubmitValidationError("Service port is required");
    return;
  }

  const createHasTraefik = selectedCreateTemplate?.template?.traefik ?? fieldChecked("traefik", true);
  const createDomain = selectedProfileCredentials().domain;
  if (currentAction === "create" && createHasTraefik && (!isOrderPage || Boolean(createDomain)) && !isFqdn(dnsParts(dnsNameFqdn(fieldValue("dns_name") || fieldValue("instance"), createDomain)).host)) {
    setSubmitValidationError("DNS name must be a fully qualified domain name");
    return;
  }

  if (currentAction === "create" && !(fieldValue("version") || selectedCreateTemplate?.template?.version)) {
    await ensureCreateVersion();

    if (!fieldValue("version") && !selectedCreateTemplate?.template?.version) {
      setSubmitValidationError("Version not found for this image");
      return;
    }
  }

  if (currentAction === "create") {
    const conflict = repeatKeyConflict();
    showConfigConflict(conflict || {});
    if (conflict) {
      setSubmitValidationError(conflict.detail);
      return;
    }
  }

  const confirmMessage = currentAction === "delete" && event.submitter?.value === "image"
    ? "Delete all instances using this image?"
    : config?.confirm;
  if (confirmMessage && !confirm(confirmMessage)) {
    return;
  }

  if (isEnrollPage && shouldVerifyEnrollImageAvailability()) {
    const imageAvailable = await verifyEnrollImageAvailable();
    if (!imageAvailable) {
      setEnrollSubmitInProgress(false);
      updateEnrollSubmitState({ notify: false });
      return;
    }
  }

  submitAction(config, event.submitter).catch(() => {
    if (isOrderPage || isEnrollPage) {
      submitBtn.disabled = false;
      if (isOrderPage) setOrderStatus("Installation request failed", "error");
      else {
        form?.classList.remove("hidden");
        setEnrollSubmitInProgress(false);
        setNotice("Creation request failed", "error");
      }
      return;
    }

    setNotice(`${config.title} failed`, "error");
  });
});

testBtn?.addEventListener("click", test);
testEmailBtn?.addEventListener("click", testEmail);
refreshEnvironmentBtn?.addEventListener("click", () => loadEnvironmentVariables({ force: true }));
deleteConfigBtn?.addEventListener("click", deleteConfig);
exportConfigBtn?.addEventListener("click", exportPortableConfig);
importConfigBtn?.addEventListener("click", importPortableConfigFile);
importConfigFile?.addEventListener("change", importPortableConfig);
clearBtn?.addEventListener("click", clearActionFields);
dockerRunBtn?.addEventListener("click", openDockerRunModal);
tokenToggle?.addEventListener("click", () => togglePasswordVisibility(field("token"), tokenToggle, "NetBox token"));
registryWebhookSecretToggle?.addEventListener("click", () => togglePasswordVisibility(registryWebhookSecretInput, registryWebhookSecretToggle, "registry webhook password"));
smtpConfigToggle?.addEventListener("click", () => togglePasswordVisibility(field("smtp_config"), smtpConfigToggle, "SMTP config"));
form?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-profile-help]");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();
  openProfileHelp(button.dataset.profileHelp);
});
form?.addEventListener("keydown", (event) => {
  const button = event.target.closest("[data-profile-help]");
  if (!button || (event.key !== "Enter" && event.key !== " ")) return;

  event.preventDefault();
  event.stopPropagation();
  openProfileHelp(button.dataset.profileHelp);
});
profileHelpCloseBtn?.addEventListener("click", closeProfileHelp);
profileHelpOkBtn?.addEventListener("click", closeProfileHelp);
saveTemplateBtn?.addEventListener("click", saveCreateTemplate);
saveAllTemplatesBtn?.addEventListener("click", exportAllCreateTemplates);
deleteTemplateBtn?.addEventListener("click", deleteSelectedTemplate);
loadTemplateBtn?.addEventListener("click", loadSelectedTemplate);
orderTemplateBtn?.addEventListener("click", openSelectedTemplateOrder);
logoutBtn?.addEventListener("click", logout);
clearCacheBtn?.addEventListener("click", clearLocalCache);
sidebarToggle?.addEventListener("click", () => {
  setSidebarCollapsed(!appShell?.classList.contains("sidebar-collapsed"));
});
adminMenuToggle?.addEventListener("click", () => {
  setAdminMobileMenuOpen(!document.body?.classList.contains("admin-menu-open"));
});
adminSidebar?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest(".nav-item")) setAdminMobileMenuOpen(false);
});
refreshReportBtn?.addEventListener("click", refreshImageReport);
reportProfileSelect?.addEventListener("change", refreshImageReport);
workflowSelect?.addEventListener("change", () => {
  workflowStepStatuses = {};
  renderWorkflow();
});
workflowActionSelect?.addEventListener("change", () => {
  workflowStepStatuses = {};
  renderWorkflow();
});
workflowTableBody?.addEventListener("change", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const checkbox = target?.closest("[data-workflow-step-enabled]");
  if (!checkbox) return;
  setWorkflowStepEnabled(Number(checkbox.dataset.workflowStepEnabled), checkbox.checked);
});
workflowTableBody?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target?.closest("[data-workflow-step-delete]");
  if (!button) return;
  removeWorkflowStep(Number(button.dataset.workflowStepDelete));
});
workflowTableBody?.addEventListener("pointerdown", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const handle = target?.closest("[data-workflow-step-drag]");
  if (!(handle instanceof HTMLElement) || event.button !== 0) return;

  const row = handle.closest("[data-workflow-step-index]");
  if (!(row instanceof HTMLElement)) return;
  event.preventDefault();
  workflowDragIndex = Number(row.dataset.workflowStepIndex);
  workflowPointerDrag = { pointerId: event.pointerId, fromIndex: workflowDragIndex };
  row.classList.add("workflow-step-dragging");
  handle.setPointerCapture?.(event.pointerId);
});
workflowTableBody?.addEventListener("mousedown", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const handle = target?.closest("[data-workflow-step-drag]");
  if (!(handle instanceof HTMLElement) || event.button !== 0) return;

  const row = handle.closest("[data-workflow-step-index]");
  if (!(row instanceof HTMLElement)) return;
  event.preventDefault();
  workflowDragIndex = Number(row.dataset.workflowStepIndex);
  workflowMouseDrag = { fromIndex: workflowDragIndex };
  row.classList.add("workflow-step-dragging");
});
document.addEventListener("pointermove", (event) => {
  if (!workflowPointerDrag || workflowPointerDrag.pointerId !== event.pointerId) return;
  event.preventDefault();
  markWorkflowDropTarget(workflowStepRowAtPoint(event.clientX, event.clientY));
});
document.addEventListener("pointerup", async (event) => {
  if (!workflowPointerDrag || workflowPointerDrag.pointerId !== event.pointerId) return;
  const fromIndex = workflowPointerDrag.fromIndex;
  const row = workflowStepRowAtPoint(event.clientX, event.clientY);
  const toIndex = row instanceof HTMLElement ? Number(row.dataset.workflowStepIndex) : fromIndex;
  clearWorkflowDragState();
  await moveWorkflowStep(fromIndex, toIndex);
});
document.addEventListener("pointercancel", (event) => {
  if (!workflowPointerDrag || workflowPointerDrag.pointerId !== event.pointerId) return;
  clearWorkflowDragState();
});
document.addEventListener("mousemove", (event) => {
  if (!workflowMouseDrag) return;
  event.preventDefault();
  markWorkflowDropTarget(workflowStepRowAtPoint(event.clientX, event.clientY));
});
document.addEventListener("mouseup", async (event) => {
  if (!workflowMouseDrag) return;
  const fromIndex = workflowMouseDrag.fromIndex;
  const row = workflowStepRowAtPoint(event.clientX, event.clientY);
  const toIndex = row instanceof HTMLElement ? Number(row.dataset.workflowStepIndex) : fromIndex;
  clearWorkflowDragState();
  await moveWorkflowStep(fromIndex, toIndex);
});
workflowTableBody?.addEventListener("dragstart", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target?.closest("[data-workflow-step-drag]")) {
    event.preventDefault();
    return;
  }

  const row = target.closest("[data-workflow-step-index]");
  if (!(row instanceof HTMLElement) || !event.dataTransfer) return;
  workflowDragIndex = Number(row.dataset.workflowStepIndex);
  row.classList.add("workflow-step-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(workflowDragIndex));
});
workflowTableBody?.addEventListener("dragover", (event) => {
  if (workflowDragIndex === null) return;
  const target = event.target instanceof Element ? event.target : null;
  const row = target?.closest("[data-workflow-step-index]");
  if (!(row instanceof HTMLElement)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  markWorkflowDropTarget(row);
});
workflowTableBody?.addEventListener("dragleave", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const row = target?.closest("[data-workflow-step-index]");
  if (!row || (event.relatedTarget instanceof Node && row.contains(event.relatedTarget))) return;
  row.classList.remove("workflow-step-drop-target");
});
workflowTableBody?.addEventListener("drop", async (event) => {
  if (workflowDragIndex === null) return;
  const target = event.target instanceof Element ? event.target : null;
  const row = target?.closest("[data-workflow-step-index]");
  if (!(row instanceof HTMLElement)) return;
  event.preventDefault();
  const fromIndex = Number(event.dataTransfer?.getData("text/plain") || workflowDragIndex);
  const toIndex = Number(row.dataset.workflowStepIndex);
  clearWorkflowDragState();
  await moveWorkflowStep(fromIndex, toIndex);
});
workflowTableBody?.addEventListener("dragend", clearWorkflowDragState);
runWorkflowBtn?.addEventListener("click", runWorkflow);
saveWorkflowBtn?.addEventListener("click", saveWorkflowCatalog);
deleteWorkflowBtn?.addEventListener("click", deleteWorkflow);
reportViewButtons.forEach((button) => {
  button.addEventListener("click", () => setReportView(button.dataset.reportView));
});
templateSelect?.addEventListener("change", () => {
  if (createTemplateSelect) createTemplateSelect.value = templateSelect.value;
  syncTemplateActions();
  if (templateSelect.value) loadSelectedTemplate();
});
createTemplateSelect?.addEventListener("change", () => {
  if (templateSelect) templateSelect.value = createTemplateSelect.value;
  syncTemplateActions();
  syncCreateVersion();
  if (createTemplateSelect.value) loadSelectedTemplate();
});
dockerRunApplyBtn?.addEventListener("click", applyDockerRunCommand);
dockerRunCancelBtn?.addEventListener("click", closeDockerRunModal);
dockerRunCloseBtn?.addEventListener("click", closeDockerRunModal);
dockerRunInput?.addEventListener("input", handleDockerRunInput);
dockerComposeInput?.addEventListener("input", updateEnrollSubmitState);
catalogSearch?.addEventListener("input", () => renderCatalogItems());
catalogSort?.addEventListener("change", () => renderCatalogItems());
templateExportFile?.addEventListener("change", updateTemplateExportFileName);
importTabButtons.forEach((button) => {
  button.addEventListener("click", () => setImportTab(button.dataset.importTab));
});
importProfileSelect?.addEventListener("change", applyEnrollProfileSelection);
dockerRunModal?.addEventListener("click", (event) => {
  if (event.target === dockerRunModal) closeDockerRunModal();
});
profileHelpModal?.addEventListener("click", (event) => {
  if (event.target === profileHelpModal) closeProfileHelp();
});
document.addEventListener("click", (event) => {
  if (!document.body?.classList.contains("admin-menu-open")) return;
  const target = event.target instanceof Element ? event.target : null;
  if (target && (adminSidebar?.contains(target) || adminMenuToggle?.contains(target))) return;
  setAdminMobileMenuOpen(false);
});
refreshInstancesBtn?.addEventListener("click", refreshInstances);
refreshImagesBtn?.addEventListener("click", refreshImages);
["brand_primary", "brand_secondary"].forEach((name) => {
  field(name)?.addEventListener("input", updateBrandColorPreviews);
});
templateSelect?.addEventListener("change", updateBrandButtonSnippet);
document.getElementById("embed_hide_navigation")?.addEventListener("change", updateBrandButtonSnippet);
document.getElementById("brandButtonSnippet")?.addEventListener("input", () => {
  const preview = document.getElementById("brandButtonPreview");
  if (preview) preview.innerHTML = document.getElementById("brandButtonSnippet").value;
});
document.getElementById("copyBrandButtonBtn")?.addEventListener("click", copyBrandButtonSnippet);
field("branding_select")?.addEventListener("change", () => applyBrandingToFields(fieldValue("branding_select")));
deleteBrandingBtn?.addEventListener("click", deleteBranding);
Object.entries(brandUploadKinds).forEach(([kindName, kind]) => {
  document.getElementById(kind.uploadBtnId)?.addEventListener("click", () => document.getElementById(kind.fileInputId)?.click());
  document.getElementById(kind.fileInputId)?.addEventListener("change", () => handleBrandImageSelection(kindName));
  document.getElementById(kind.removeBtnId)?.addEventListener("click", () => {
    brandUploadState[kindName] = { data: "", remove: true };
    const input = document.getElementById(kind.fileInputId);
    if (input) input.value = "";
    updateBrandUploadWidget(kindName);
  });
});
configFields.forEach((name) => {
  const control = field(name);
  control?.addEventListener("input", () => {
    updateProfileSyncWarning();
    if (name === "smtp_config") updateTestEmailVisibility();
  });
  control?.addEventListener("change", () => {
    updateProfileSyncWarning();
    if (name === "smtp_config") updateTestEmailVisibility();
  });
});
configProfileSelect?.addEventListener("change", () => {
  applyProfileToFields(configProfileSelect.value);
  ensureRandomCreateInstanceName();
  imageRecords = [];
  templateVersionOverride = "";
  templateNetworkOverride = "";
  generatedCreateDnsName = "";
  setFieldValue("image", "");
  setFieldValue("version", "");
  replaceOptions(imageOptions, []);
  replaceOptions(oldVersionOptions, []);
  replaceOptions(restartVersionOptions, []);
  syncCreateVersion();
  syncCreateDnsName({ force: true });

  if (isTemplateAction()) {
    refreshImages({ notify: false });
  }
});
field("network")?.addEventListener("input", () => {
  templateNetworkOverride = "";
});
field("network")?.addEventListener("change", () => {
  templateNetworkOverride = "";
});
field("image")?.addEventListener("input", () => {
  templateVersionOverride = "";
  updateOldVersionOptions();
});
field("config_name")?.addEventListener("input", updateConfigDefaultControl);
field("image")?.addEventListener("change", () => {
  templateVersionOverride = "";
  updateOldVersionOptions();
});
field("image")?.addEventListener("change", () => {
  ensureCreateVersion();
});
field("oldversion")?.addEventListener("input", () => {
  updateSelectedVersionContainerNotice();
  updateRemoveOldImagesState();
});
field("version")?.addEventListener("input", () => {
  if (isCreateFormAction() && selectedTemplateName()) templateVersionOverride = fieldValue("version");
  updateRemoveOldImagesState();
});
field("restart_version")?.addEventListener("input", updateRestartButtons);
field("restart_version")?.addEventListener("input", updateSelectedVersionContainerNotice);
field("operate_action")?.addEventListener("change", updateOperateControls);
field("instance")?.addEventListener("input", () => {
  updateRestartButtons();
  syncCreateDnsName();
  syncVolumeNames();
});
field("dns_name")?.addEventListener("input", () => {
  generatedCreateDnsName = fieldValue("dns_name");
});
field("traefik")?.addEventListener("change", () => syncCreateDnsName({ force: !fieldValue("dns_name") }));
logsFullscreenBtn?.addEventListener("click", () => {
  setLogsExpanded(!logsCard?.classList.contains("fullscreen"));
});
clearLogsBtn?.addEventListener("click", clearLogs);
orderCancelBtn?.addEventListener("click", () => {
  window.location.href = orderHomeUrl();
});
orderInstances?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-order-instance-delete]");
  if (!button) return;
  deleteOrderInstance(Number(button.dataset.orderInstanceDelete)).catch(() => {
    setOrderStatus("Delete request failed", "error");
  });
});
enrollInstances?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-enroll-template-delete]");
  if (deleteButton && !deleteButton.disabled) {
    deleteEnrollTemplate(deleteButton.dataset.enrollTemplateDelete || "");
    return;
  }

  const button = event.target.closest("[data-order-template-copy]");
  if (!button) return;

  openOrderButtonModal(button.dataset.orderTemplateCopy || "", button.dataset.orderTemplateProfile || "");
});
document.getElementById("orderButtonCloseBtn")?.addEventListener("click", closeOrderButtonModal);
enrollInstances?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-template-webhook-copy]");
  if (!button) return;

  const templateName = button.dataset.templateWebhookCopy || "";
  const url = templateWebhookUrl(templateName);
  if (!url) {
    setNotice("Webhook URL unavailable", "error");
    return;
  }

  copyTextToClipboard(url)
    .then(() => setNotice(`Webhook URL copied for "${templateName}"`, "success"))
    .catch(() => setNotice(url, "info", false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body?.classList.contains("admin-menu-open")) {
    setAdminMobileMenuOpen(false);
  }
  if (event.key === "Escape" && !dockerRunModal?.classList.contains("hidden")) {
    closeDockerRunModal();
  }
  if (event.key === "Escape" && !profileHelpModal?.classList.contains("hidden")) {
    closeProfileHelp();
  }
  if (event.key === "Escape" && !document.getElementById("orderButtonModal")?.classList.contains("hidden")) {
    closeOrderButtonModal();
  }
});
window.addEventListener("pageshow", () => {
  if (isEnrollPage) updateEnrollSubmitState({ notify: false });
});

window.parseDockerRun = parseDockerRun;
window.isFqdn = isFqdn;
window.instanceFqdn = instanceFqdn;

function finishAppBoot() {
  document.body?.classList.remove("app-booting");
  appBootLoader?.classList.add("hidden");
  appShell?.removeAttribute("aria-busy");
}

async function initializePage() {
  try {
    initializeSidebar();
    renderCachedAuthUser();
    applyNavigationVisibility();
    const authReady = loadAuthUser();
    if (isClientPage) await authReady;
    if (!isClientPage) {
      await loadMailSettings();
      loadBrandings();
    }
    await loadSavedConfig();
    if (isOrderPage || isCatalogPage) {
      const sessionProfile = sessionProfileName();
      const profileName = (Object.hasOwn(knownProfileEntries(), sessionProfile) ? sessionProfile : "")
        || visibleConfigProfileName() || currentConfigProfile;
      if (profileName) applyProfileToFields(profileName, { syncNetwork: !isOrderPage });
    }
    if (!isEnrollPage && !isCatalogPage) await loadCreateTemplates({ useCache: !isOrderPage });
    updateTemplateOptions();
    setAction(currentAction, { skipAutoRefresh: isOrderPage || isEnrollPage });
    if (isEnrollPage) {
      const canEnroll = configureEnrollDefaultConfig();
      if (canEnroll) {
        setImportTab("run");
        await loadRegistryDefaultSecret();
        await refreshEnrollLimit();
        if (submitBtn) {
          submitBtn.textContent = "Enroll image";
          updateEnrollSubmitState({ notify: false });
        }
      }
    }
    if (!isOrderPage && !isEnrollPage && !isCatalogPage && currentAction === "report") refreshImageReport();

    if (isOrderPage) {
      hideOrderActions();
      restorePendingOrderRedirect();
      const orderReady = await applyOrderTemplate({ reveal: false });
      if (orderRedirectTarget) showOrderRedirectLoading(orderRedirectTarget);
      else hideOrderLoading();
      if (orderReady && !orderRedirectTarget) showOrderActions();
    } else if (isCatalogPage) {
      await refreshCatalog();
    } else if (actionFromUrl) {
      setNotice(actionFromUrl, "success");

      const actionKey = actionFromUrl.split(" ")[0].toLowerCase();
      if (actions[actionKey]) setAction(actionKey);

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(window.history.state, "", cleanUrl);
    }

    if (!isOrderPage && !isCatalogPage) await authReady;

    if (!isOrderPage && !isEnrollPage && !isCatalogPage) {
      getLogs();
      setInterval(getLogs, 3000);
    }
  } finally {
    finishAppBoot();
  }
}

initializePage();
