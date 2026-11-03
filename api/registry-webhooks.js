const { toLogPayload } = require("../lib/operations");

function registerRegistryWebhookRoutes(app, {
  imagesToKeepValue,
  logLine,
  recreateContainers,
  registryWebhookAllowed,
  registryWebhookEvents,
  registryWebhookTemplates,
  imageNameFromRef,
  sendImageUpgradeEmail,
  sendOrderReadyEmail,
  selectedProfileConfig,
  templatesForRequest,
}) {
  function templateMatchesRegistryWebhook(template, profile, image) {
    const templateProfile = String(template.config_profile || template.profile || profile || "").trim();
    const templateImage = imageNameFromRef(String(template.image || ""));
    const normalizedImage = String(image || "").trim().toLowerCase();
    return templateImage === normalizedImage && (!templateProfile || templateProfile === profile);
  }

  async function notificationTemplates(req, profile, image) {
    if (typeof templatesForRequest !== "function") return registryWebhookTemplates(profile, image);
    const templates = await templatesForRequest(req, profile, { ownerOnly: false });
    return Object.entries(templates)
      .map(([name, template]) => ({ name, template }))
      .filter((entry) => templateMatchesRegistryWebhook(entry.template, profile, image));
  }

  async function sendWebhookReadyNotifications(req, config, profile, event) {
    const templates = await notificationTemplates(req, profile, event.image);
    for (const { name, template } of templates) {
      const recipient = String(template.creator_email || "").trim();
      if (!recipient) continue;
      try {
        const sender = typeof sendImageUpgradeEmail === "function" ? sendImageUpgradeEmail : sendOrderReadyEmail;
        await sender({
          ...config,
          image: event.image,
          from_version: template.version || "",
          to_version: event.tag,
          version: event.tag,
          instance: template.instance || template.dns_name || name,
        }, recipient);
      } catch (error) {
        logLine(`EMAIL : ready notification failed for ${recipient} ${error.message || "smtp error"}`);
      }
    }
  }

  async function webhookImagesToKeep(req, profile, image) {
    if (req.query.images_to_keep !== undefined) return imagesToKeepValue(req.query.images_to_keep);
    const templates = await notificationTemplates(req, profile, image);
    const matching = templates.find(({ template }) => template.images_to_keep !== undefined);
    return imagesToKeepValue(matching?.template.images_to_keep);
  }

  function webhookImages(events) {
    return events.map((event) => `${event.image}:${event.tag}`).join(",") || "none";
  }

  function webhookAudit(req, events, outcome, reason = "") {
    const profile = req.params.profile || "";
    const reasonText = reason ? ` reason=${reason}` : "";
    logLine(`REGISTRY_WEBHOOK : ${outcome} profile=${profile}${reasonText} url=${req.originalUrl || req.url || ""} events=${events.length} images=${webhookImages(events)} body=${toLogPayload(req.body)}`);
  }

  app.post([
    "/registry-webhook/:profile",
    "/registry-webhook/:profile/:secret",
    "/registry-webhook/:profile/:template/:secret",
  ], (req, res) => {
    const events = registryWebhookEvents(req.body);
    webhookAudit(req, events, "received");
    if (!registryWebhookAllowed(req, events)) {
      webhookAudit(req, events, "rejected", "invalid-secret");
      return res.status(403).json({ detail: "invalid webhook secret" });
    }
    res.status(202).json({ status: "accepted" });
    const upgradeEvents = events.filter((event) => event.tag !== "latest");
    if (!upgradeEvents.length) {
      webhookAudit(req, events, "ignored", events.length ? "latest-tag" : "no-events");
      return;
    }
    const config = selectedProfileConfig({ profile: req.params.profile });
    Promise.resolve()
      .then(async () => {
        for (const event of upgradeEvents) {
          const imagesToKeep = await webhookImagesToKeep(req, req.params.profile, event.image);
          const ready = await recreateContainers({ ...config, image: event.image, version: event.tag, clean_name: false, remove_old_images: true, images_to_keep: imagesToKeep });
          if (ready) await sendWebhookReadyNotifications(req, config, req.params.profile, event);
        }
      })
      .catch((error) => logLine(`REGISTRY_WEBHOOK : failed ${error.message}`));
  });
}

module.exports = { registerRegistryWebhookRoutes };
