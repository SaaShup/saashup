const { test, expect, fs, openAdmin, appVersion, packageJson } = require("./fixtures");

test("root page shows the catalog account bar and extensionless admin", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".catalog-eyebrow")).toHaveText("Image catalog");
  await expect(page.locator(".top-left-bar .brand-badge")).toContainText("SaaShup");
  await expect(page.locator(".top-left-bar .brand-badge img")).toHaveAttribute("src", "saashup_logo.svg");
  await expect(page.getByRole("navigation", { name: "Account pages" }).getByRole("link", { name: "My instances" })).toHaveAttribute("href", "/order");
  await expect(page.getByRole("navigation", { name: "Account pages" }).getByRole("link", { name: "My images" })).toHaveAttribute("href", "/enroll");
  await expect(page.getByRole("navigation", { name: "Account pages" }).getByRole("link", { name: "Catalog" })).toHaveAttribute("href", "/catalog");
  await expect(page.locator("[data-app-version]")).toHaveText(appVersion);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.locator("#form-title")).toHaveText("Config");
  await expect(page.locator("[data-app-version]")).toHaveText(appVersion);
});

test("config tab starts without a forced default profile", async ({ page }) => {
  await openAdmin(page, {});

  await expect(page.locator("#form-title")).toHaveText("Config");
  await expect(page.locator("#formTitleBadge")).toHaveText("0");
  await expect(page.locator("#formTitleBadge")).toHaveAttribute("aria-label", "0 config profiles");
  await expect(page.locator("#config_profile")).toHaveValue("");
  await expect(page.locator("#config_profile option")).toHaveText("No config saved");
  await expect(page.locator("#profileSyncWarning")).toBeHidden();
  await expect(page.locator("#config_name")).toHaveValue("");
  await expect(page.locator("#netbox")).toHaveValue("");
  await expect(page.locator("#token")).toHaveValue("");
  await expect(page.locator("#token")).toHaveAttribute("type", "password");
  await expect(page.locator("#tag")).toHaveAttribute("required");
  await page.locator("#tokenToggle").click();
  await expect(page.locator("#token")).toHaveAttribute("type", "text");
  await expect(page.locator("#tokenToggle")).toHaveAttribute("aria-label", "Hide NetBox token");
  await page.locator("#tokenToggle").click();
  await expect(page.locator("#token")).toHaveAttribute("type", "password");
  await expect(page.locator('[data-field="registry_webhook_secret"]')).toBeHidden();
  await expect(page.locator("#smtp_config")).toHaveAttribute("type", "password");
  await page.locator("#smtpConfigToggle").click();
  await expect(page.locator("#smtp_config")).toHaveAttribute("type", "text");
  await expect(page.locator("#smtpConfigToggle")).toHaveAttribute("aria-label", "Hide SMTP config");
  await page.locator("#smtpConfigToggle").click();
  await expect(page.locator("#smtp_config")).toHaveAttribute("type", "password");
  await page.getByRole("link", { name: "Template" }).click();
  await expect(page.locator('[data-field="registry_webhook_secret"]')).toBeVisible();
  await expect(page.locator("#registry_webhook_secret")).toHaveValue("hook-secret");
  await expect(page.locator("#registry_webhook_secret")).toHaveAttribute("type", "password");
  await expect(page.locator("#registry_webhook_secret")).toHaveAttribute("placeholder", "Empty uses env default");
  await page.locator("#registryWebhookSecretToggle").click();
  await expect(page.locator("#registry_webhook_secret")).toHaveAttribute("type", "text");
  await expect(page.locator("#registryWebhookSecretToggle")).toHaveAttribute("aria-label", "Hide registry webhook password");
  await page.locator("#registryWebhookSecretToggle").click();
  await expect(page.locator("#registry_webhook_secret")).toHaveAttribute("type", "password");
  await page.locator('[data-profile-help="registry_webhook_secret"]').click();
  await expect(page.locator("#profileHelpTitle")).toHaveText("Registry webhook password");
  await expect(page.locator("#profileHelpBody")).toContainText("Registry webhook URL:");
  await expect(page.locator("#profileHelpBody")).toContainText(`${new URL(page.url()).origin}/registry-webhook/<config-profile>/<template>/hook-secret`);
  await page.locator("#profileHelpOkBtn").click();
  await page.getByRole("link", { name: "Profiles" }).click();
  await expect(page.locator('[data-field="registry_webhook_secret"]')).toBeHidden();
  await expect(page.locator("#domain")).toHaveValue("");
  await expect(page.locator("#tag")).toHaveValue("");
  await expect(page.locator("#enrollment_limit")).toHaveValue("1");
  await expect(page.locator("#owner_env_var")).toHaveValue("SAASHUP_OWNER");
  await expect(page.locator("#cloudflare_filter")).toBeChecked();
  await expect(page.locator("#parallel_upgrade")).not.toBeChecked();
  await page.locator('[data-profile-help="parallel_upgrade"]').click();
  await expect(page.locator("#profileHelpTitle")).toHaveText("Parallel upgrade");
  await expect(page.locator("#profileHelpBody")).toContainText("different Docker hosts at the same time");
  await page.locator("#profileHelpOkBtn").click();
  await page.locator('[data-field="netbox"] .field-label').click({ position: { x: 4, y: 8 } });
  await expect(page.locator("#profileHelpModal")).toBeHidden();
  await page.locator('[data-profile-help="netbox"]').click();
  await expect(page.locator("#profileHelpTitle")).toHaveText("NetBox URL");
  await expect(page.locator("#profileHelpBody")).toContainText("base URL of the NetBox instance");
  await page.locator("#profileHelpOkBtn").click();
  await expect(page.locator("#profileHelpModal")).toBeHidden();
  await page.getByRole("link", { name: "Upgrade" }).click();
  await page.locator('[data-profile-help="remove_old_images"]').click();
  await expect(page.locator("#profileHelpTitle")).toHaveText("Remove old images");
  await expect(page.locator("#profileHelpBody")).toContainText("after all containers using that old image have recreated successfully");
  await page.locator("#profileHelpOkBtn").click();
  await page.getByRole("link", { name: "Delete" }).click();
  await page.locator('[data-profile-help="delete_volumes"]').click();
  await expect(page.locator("#profileHelpTitle")).toHaveText("Delete volumes");
  await expect(page.locator("#profileHelpBody")).toContainText("Leave it off to keep data volumes");
  await page.locator("#profileHelpOkBtn").click();
  await page.getByRole("link", { name: "Profiles" }).click();
  await expect(page.locator("#deleteConfigBtn")).toBeVisible();
  await expect(page.locator("#clearBtn")).toBeHidden();
  await expect(page.locator("#dockerRunBtn")).toBeHidden();
  await expect(page.locator("#saveTemplateBtn")).toBeHidden();
});

test("environment menu shows read-only server environment variables", async ({ page }) => {
  await openAdmin(page, {
    profile: "production",
    config_profile: "production",
    profiles: JSON.stringify({
      production: { netbox: "https://netbox.example.com", token: "secret", tag: "prod" },
    }),
  });

  await expect(page.locator(".nav .nav-label").nth(0)).toHaveText("Environment");
  await expect(page.locator(".nav .nav-label").nth(1)).toHaveText("Branding");
  await expect(page.locator(".nav .nav-label").nth(2)).toHaveText("Profiles");

  await page.getByRole("link", { name: "Environment" }).click();

  await expect(page.locator("#environmentCard")).toBeVisible();
  await expect(page.locator(".form-card")).toBeHidden();
  await expect(page.locator("#testBtn")).toBeVisible();
  await expect(page.locator("#testBtn")).toHaveText("Test connection: production");
  await expect(page.locator("#environmentSummary")).toHaveText("2 environment variables");
  await expect(page.locator(".environment-row").first().locator(".environment-name")).toHaveText("NODE_ENV");
  await expect(page.locator(".environment-row").first().locator(".environment-value")).toHaveValue("production");
  await expect(page.locator(".environment-row").first().locator(".environment-value")).toHaveAttribute("readonly", "");
  await expect(page.locator(".environment-row").nth(1).locator(".environment-name")).toHaveText("PUBLIC_IMAGE");
  await expect(page.locator(".environment-row").nth(1).locator(".environment-value")).toHaveValue("false");

  await page.getByRole("link", { name: "Profiles" }).click();
  await expect(page.locator("#environmentCard")).toBeHidden();
  await expect(page.locator(".form-card")).toBeVisible();
  await expect(page.locator("#testBtn")).toBeVisible();
  await expect(page.locator("#testBtn")).toHaveText("Test connection: production");
});

test("admin config load prefers server credentials over stale local profile cache", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("config_profiles", JSON.stringify({
      production: {
        domain: "stale.example.com",
        tag: "stale",
        netbox_configured: true,
        token_configured: true,
      },
    }));
    localStorage.setItem("current_config_profile", "production");
  });

  await openAdmin(page, {
    profile: "production",
    config_profile: "production",
    profiles: JSON.stringify({
      production: {
        netbox: "https://netbox.example.com",
        token: "server-secret",
        proxy: "http://proxy.example.com",
        domain: "apps.example.com",
        tag: "production",
        enrollment_limit: 2,
        owner_env_var: "OWNER_EMAIL",
      },
    }),
  });

  await expect(page.locator("#config_profile")).toHaveValue("production");
  await expect(page.locator("#netbox")).toHaveValue("https://netbox.example.com");
  await expect(page.locator("#token")).toHaveValue("server-secret");
  await expect(page.locator("#proxy")).toHaveValue("http://proxy.example.com");
  await expect(page.locator("#domain")).toHaveValue("apps.example.com");
  await expect(page.locator("#tag")).toHaveValue("production");
  await expect(page.locator("#enrollment_limit")).toHaveValue("2");
  await expect(page.locator("#owner_env_var")).toHaveValue("OWNER_EMAIL");
});

test("config profile requires a tag before saving", async ({ page }) => {
  let webhookRequests = 0;
  await page.route("**/webhook?**", async (route) => {
    webhookRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });

  await openAdmin(page, {});
  await expect(page.locator("#tag")).toHaveAttribute("required");
  await page.locator("#config_name").fill("production");
  await page.locator("#netbox").fill("https://netbox.example.com");
  await page.locator("#token").fill("secret");
  await page.locator("#tag").fill("   ");
  await page.locator("#submitBtn").click();

  await expect(page.locator("#notif")).toContainText("Tag is required");
  expect(webhookRequests).toBe(0);
  const localProfiles = await page.evaluate(() => JSON.parse(localStorage.getItem("config_profiles") || "{}"));
  expect(localProfiles).toEqual({});
});

test("config profile prevents duplicate netbox url and tag", async ({ page }) => {
  let webhookRequests = 0;
  await page.route("**/webhook?**", async (route) => {
    webhookRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });

  await openAdmin(page, {});
  await page.evaluate(() => {
    localStorage.setItem("config_profiles", JSON.stringify({
      production: {
        netbox: "https://netbox.example.com/",
        token: "secret",
        tag: "Prod",
      },
    }));
    localStorage.setItem("current_config_profile", "production");
  });
  await page.reload();

  await page.locator("#config_name").fill("staging");
  await page.locator("#netbox").fill("https://NETBOX.example.com");
  await page.locator("#token").fill("secret");
  await page.locator("#tag").fill("prod");
  await page.locator("#submitBtn").click();

  await expect(page.locator("#notif")).toContainText('Profile "production" already uses this NetBox URL and tag');
  expect(webhookRequests).toBe(0);
  const localProfiles = await page.evaluate(() => JSON.parse(localStorage.getItem("config_profiles") || "{}"));
  expect(localProfiles.staging).toBeUndefined();

  await page.locator("#config_name").fill("");
  await page.locator("#config_profile").selectOption("production");
  await page.locator("#domain").fill("apps.example.com");
  await page.locator("#submitBtn").click();
  await expect(page.locator("#notif")).toContainText('Config "production" saved');
  expect(webhookRequests).toBe(1);
});

test("config profile warns when local profile is not synced to server", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("config_profiles", JSON.stringify({
      local: {
        netbox: "https://netbox.local.test",
        token: "local-secret",
        proxy: "",
        domain: "local.test",
        tag: "LOCAL",
        max_instances: 1,
      },
    }));
    localStorage.setItem("current_config_profile", "local");
  });

  await openAdmin(page, {});

  await expect(page.locator("#config_profile")).toHaveValue("local");
  await expect(page.locator("#profileSyncWarning")).toBeVisible();
  await expect(page.locator("#profileSyncWarning")).toHaveAttribute("aria-label", /exists only in this browser/);
  await expect(page.locator("#profileSyncWarning")).toHaveAttribute("title", /Save config/);
});

test("config profile shows green status when synced to server", async ({ page }) => {
  await openAdmin(page, {
    profile: "production",
    config_profile: "production",
    profiles: JSON.stringify({
      production: {
        netbox: "https://netbox.example.com",
        token: "secret",
        proxy: "",
        domain: "apps.example.com",
        tag: "production",
        max_instances: 1,
      },
    }),
  });

  await expect(page.locator("#config_profile")).toHaveValue("production");
  await expect(page.locator("#profileSyncWarning")).toBeVisible();
  await expect(page.locator("#profileSyncWarning")).toHaveClass(/is-ok/);
  await expect(page.locator("#profileSyncWarning")).toHaveAttribute("aria-label", "Profile synced with server.");
});

test("config profile visible flag allows multiple visible profiles", async ({ page }) => {
  await openAdmin(page, {});

  await page.evaluate(() => {
    localStorage.setItem("config_profiles", JSON.stringify({
      prod: {
        netbox: "https://netbox.example.com",
        token: "secret",
        tag: "prod",
        saashup_default: true,
      },
      staging: {
        netbox: "https://staging-netbox.example.com",
        token: "secret",
        tag: "staging",
      },
      empty: {
        netbox: "https://empty-netbox.example.com",
        token: "secret",
        tag: "empty",
      },
    }));
    localStorage.setItem("current_config_profile", "prod");
  });
  await page.reload();

  await expect(page.locator("#configDefaultWrap")).toBeVisible();
  await page.locator("#config_profile").selectOption("prod");
  await expect(page.locator("#configDefaultInput")).toBeChecked();
  await expect(page.locator("#configDefaultInput")).toBeEnabled();

  await page.locator("#config_profile").selectOption("staging");
  await expect(page.locator("#configDefaultInput")).not.toBeChecked();
  await expect(page.locator("#configDefaultInput")).toBeEnabled();
  await page.locator("#configDefaultInput").check();
  await expect(page.locator("#configDefaultInput")).toBeChecked();

  await page.locator("#config_profile").selectOption("prod");
  await expect(page.locator("#configDefaultInput")).toBeChecked();
  await expect(page.locator("#configDefaultInput")).toBeEnabled();

  await page.evaluate(() => {
    const profiles = JSON.parse(localStorage.getItem("config_profiles"));
    delete profiles.prod.saashup_default;
    delete profiles.prod.saashup_visible;
    localStorage.setItem("config_profiles", JSON.stringify(profiles));
  });
  await page.reload();
  await page.locator("#config_profile").selectOption("empty");
  await expect(page.locator("#configDefaultInput")).not.toBeChecked();
  await expect(page.locator("#configDefaultInput")).toBeEnabled();
});

test("config page can send a test email when smtp and owner email are configured", async ({ page }) => {
  let emailBody = "";
  await page.route("**/mail-settings", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ owner_email_configured: true }),
    });
  });
  await page.route("**/test-email", async (route) => {
    emailBody = route.request().postData() || "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "sent" }),
    });
  });
  await openAdmin(page, {
    profile: "prod",
    config_profile: "prod",
    profiles: JSON.stringify({
      prod: {
        netbox: "https://netbox.example.com",
        token: "secret",
        smtp_config: "mailer:smtp-secret@smtp.example.com:587",
      },
    }),
  });

  await expect(page.locator("#testEmailBtn")).toBeVisible();
  await page.locator("#testEmailBtn").click();
  await expect(page.locator("#notif")).toContainText("Test email sent");
  expect(emailBody).toContain('"smtp_config":"mailer:smtp-secret@smtp.example.com:587"');
});

test("config page exports config only", async ({ page }) => {
  const exportPayload = {
    config: {
      profile: "production",
      profiles: {
        production: {
          netbox: "https://netbox.example.com",
          token: "secret",
          max_instances: 2,
        },
      },
    },
  };

  await page.route("**/portable-config", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(exportPayload),
    });
  });

  await openAdmin(page, {});

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#exportConfigBtn").click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/^saashup-config-\d{4}-\d{2}-\d{2}\.json$/);
  const exported = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
  expect(exported).toMatchObject(exportPayload);
  await expect(page.locator("#notif")).toContainText("Config export ready");
});

test("config page imports config profiles", async ({ page }) => {
  let importedPayload;
  await page.route("**/portable-config", async (route) => {
    importedPayload = JSON.parse(route.request().postData() || "{}");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "imported" }),
    });
  });

  await openAdmin(page, {
    profile: "staging",
    profiles: JSON.stringify({
      staging: {
        netbox: "https://staging-netbox.example.com",
        token: "staging-secret",
        proxy: "",
        domain: "staging.example.com",
        tag: "staging",
        max_instances: 1,
      },
    }),
  }, {
    Existing: {
      image: "saashup/existing",
      version: "v0.1.0",
    },
  });
  await expect(page.locator("#config_profile")).toHaveValue("staging");
  page.on("dialog", (dialog) => dialog.accept());

  const importPayload = {
    config: {
      profile: "production",
      profiles: {
        production: {
          netbox: "https://netbox.example.com",
          token: "secret",
          proxy: "",
          domain: "apps.example.com",
          tag: "production",
          max_instances: 3,
          owner_env_var: "OWNER",
          cloudflare_filter: false,
          parallel_upgrade: true,
        },
      },
    },
  };

  await page.locator("#importConfigFile").setInputFiles({
    name: "saashup-config.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(importPayload)),
  });

  await expect.poll(() => importedPayload).toMatchObject(importPayload);
  await expect(page.locator("#notif")).toContainText("Config import complete");
  await expect(page.locator("#config_profile")).toHaveValue("production");
  await expect(page.locator("#netbox")).toHaveValue("https://netbox.example.com");
  await expect(page.locator("#enrollment_limit")).toHaveValue("3");
  await expect(page.locator("#owner_env_var")).toHaveValue("OWNER");
  await expect(page.locator("#cloudflare_filter")).not.toBeChecked();
  await expect(page.locator("#parallel_upgrade")).toBeChecked();

  const localProfiles = await page.evaluate(() => JSON.parse(localStorage.getItem("config_profiles")));
  const localTemplates = await page.evaluate(() => JSON.parse(localStorage.getItem("create_templates")));
  expect(localProfiles.staging.tag).toBe("staging");
  expect(localProfiles.production.tag).toBe("production");
  expect(localProfiles.production.owner_env_var).toBe("OWNER");
  expect(localProfiles.production.cloudflare_filter).toBe(false);
  expect(localProfiles.production.parallel_upgrade).toBe(true);
  expect(localTemplates.Existing.image).toBe("saashup/existing");
  expect(localTemplates.Guide).toBeUndefined();
});

test("admin header shows oauth user and logs out through app auth", async ({ page }) => {
  await page.route("**/session/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        name: "Ada Lovelace",
        user: "ada",
        email: "ada@example.com",
      }),
    });
  });

  await openAdmin(page, {});

  await expect(page.locator("#authUser")).toBeVisible();
  await expect(page.locator("#authAvatar")).toHaveText("AL");
  await expect(page.locator("#authName")).toHaveText("Ada Lovelace");
  await expect(page.locator("#authEmail")).toHaveText("ada@example.com");

  await page.locator("#logoutBtn").click();
  await expect(page).toHaveURL("/");
});

test("admin profile clear cache button clears local storage", async ({ page }) => {
  await page.route("**/session/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com" }),
    });
  });

  await openAdmin(page, {});
  await page.evaluate(() => {
    localStorage.setItem("create_templates", JSON.stringify({ Guide: { image: "saashup/guide" } }));
    localStorage.setItem("current_action", "template");
  });
  await expect(page.locator("#clearCacheBtn")).toBeVisible();
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Clear local browser cache");
    await dialog.accept();
  });
  await page.locator("#clearCacheBtn").click();
  await page.waitForLoadState("domcontentloaded");
  await expect.poll(() => page.evaluate(() => ({
    templates: localStorage.getItem("create_templates"),
    action: localStorage.getItem("current_action"),
  }))).toEqual({ templates: null, action: null });
});

test("admin sidebar can collapse and expand", async ({ page }) => {
  await page.route("**/mail-settings", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ owner_email_configured: false }),
    });
  });
  await openAdmin(page, {});
  const shell = page.locator(".app-shell");
  const loader = page.locator("#appBootLoader");
  const toggle = page.locator("#sidebarToggle");

  await expect(loader).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/app-booting/);
  await expect(shell).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".sidebar .nav")).toHaveCSS("display", "grid");

  const templateItem = page.locator("#menu_template");
  await templateItem.hover();
  await expect(templateItem).toHaveCSS("background-color", "rgba(255, 255, 255, 0.16)");
  await expect(templateItem).toHaveCSS("border-color", "rgba(255, 255, 255, 0.18)");
  await expect(templateItem).toHaveCSS("transform", /matrix\(1, 0, 0, 1, 3, 0\)/);

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(shell).toHaveClass(/sidebar-collapsed/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#menu_config .nav-label")).toHaveCSS("opacity", "0");

  await page.reload();
  await expect(shell).toHaveClass(/sidebar-collapsed/);

  await toggle.click();
  await expect(shell).not.toHaveClass(/sidebar-collapsed/);
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("metrics endpoint exposes prometheus runtime metrics", async ({ request }) => {
  const response = await request.get("/metrics");
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(body).toContain("# HELP saashup_app_info Application build information.");
  expect(body).toContain('saashup_app_info{name="saashup"');
  expect(body).toContain("saashup_process_uptime_seconds");
  expect(body).toContain('saashup_process_memory_bytes{type="rss"}');
  expect(body).toContain('saashup_http_requests_total{route="/metrics"}');
  expect(body).toContain('saashup_http_requests_total{route="/create"}');
  expect(body).toContain('saashup_http_requests_total{route="/refresh-hosts"}');
  expect(body).toContain('saashup_http_requests_total{route="/delete"}');
  expect(body).toContain('saashup_http_requests_total{route="/restart"}');
  expect(body).toContain('saashup_http_requests_total{route="/recreate"}');
  expect(body).toContain('saashup_http_requests_total{route="/config"}');
  expect(body).toContain('saashup_operation_requests_total{operation="create",status_class="2xx"}');
  expect(body).toContain('saashup_operation_requests_total{operation="refresh",status_class="2xx"}');
  expect(body).toContain('saashup_operation_requests_total{operation="delete",status_class="2xx"}');
  expect(body).toContain('saashup_operation_requests_total{operation="restart",status_class="2xx"}');
  expect(body).toContain('saashup_operation_requests_total{operation="upgrade",status_class="2xx"}');
  expect(body).toContain('saashup_operation_requests_total{operation="config",status_class="2xx"}');
});

test("version endpoint exposes package version", async ({ request }) => {
  const response = await request.get("/version");

  expect(response.status()).toBe(200);
  await expect(response).toBeOK();
  expect(await response.json()).toMatchObject({
    name: packageJson.name,
    version: packageJson.version,
  });
});

test("report menu shows image usage for one config", async ({ page }) => {
  const config = {
    profile: "production",
    config_profile: "production",
    profiles: JSON.stringify({
      production: { netbox: "https://netbox.example.com", token: "secret", tag: "prod" },
      staging: { netbox: "https://netbox.example.com", token: "secret", tag: "stage" },
    }),
  };
  const reportRequests = [];
  let releaseFirstReport;

  await openAdmin(page, config);
  await expect(page.locator(".sidebar .nav-label")).toHaveText([
    "Environment",
    "Branding",
    "Profiles",
    "Template",
    "Create",
    "Upgrade",
    "Operate",
    "Delete",
    "Refresh",
    "Workflows",
    "Reports",
    "Customers",
  ]);
  await expect(page.locator(".sidebar .nav-section-label")).toHaveText([
    "Settings",
    "Operations",
    "Tools",
    "Customers",
  ]);
  await page.route("**/report/images?**", async (route) => {
    const url = new URL(route.request().url());
    reportRequests.push({
      profile: url.searchParams.get("profile"),
      profiles: JSON.parse(url.searchParams.get("profiles") || "{}"),
    });
    if (releaseFirstReport === undefined) {
      await new Promise((resolve) => {
        releaseFirstReport = resolve;
      });
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        profile: url.searchParams.get("profile"),
        total_hosts: 3,
        total_images: 2,
        total_containers: 5,
        total_users: 4,
        rows: [
          { profile: "production", image: "saashup/api", version: "v2.0.1", containers: 3 },
          { profile: "staging", image: "saashup/api", version: "v2.0.0", containers: 2 },
        ],
        users: [
          {
            user: "ada@example.com",
            profiles: ["production"],
            containers: 2,
            images: 1,
            items: [
              { profile: "production", container: "api-a", image: "saashup/api", version: "v2.0.1" },
              { profile: "production", container: "api-b", image: "saashup/api", version: "v2.0.1" },
            ],
          },
        ],
      }),
    });
  });

  await page.locator("#menu_report").click();
  await expect(page.locator("#reportCard")).toBeVisible();
  await expect(page.locator(".form-card")).toBeHidden();
  await expect(page.locator("#reportTableBody")).toContainText("Loading image report...");
  releaseFirstReport();
  await expect(page.locator("#reportProfileSelect option")).toHaveText(["production", "staging"]);

  await page.locator("#reportProfileSelect").selectOption("staging");
  await expect(page.locator('[data-report-stat="hosts"] strong')).toHaveText("3");
  await expect(page.locator('[data-report-stat="hosts"] small')).toHaveText("Hosts");
  await expect(page.locator('[data-report-stat="images"] strong')).toHaveText("2");
  await expect(page.locator('[data-report-stat="containers"] strong')).toHaveText("5");
  await expect(page.locator('[data-report-stat="users"] strong')).toHaveText("4");
  await expect(page.locator('[data-report-stat="users"] small')).toHaveText("Users");
  await expect(page.locator("#reportTableBody tr")).toHaveCount(2);
  await expect(page.locator("#reportTableBody")).toContainText("saashup/api");
  await expect(page.locator("#reportTableBody")).toContainText("v2.0.1");
  await page.getByRole("tab", { name: "Users" }).click();
  await expect(page.locator("#reportTableHead")).toContainText("What they have");
  await expect(page.locator("#reportTableBody")).toContainText("ada@example.com");
  await expect(page.locator("#reportTableBody")).toContainText("api-a - saashup/api:v2.0.1");
  await page.getByRole("tab", { name: "Images" }).click();
  await expect(page.locator("#reportTableHead")).toContainText("Image");
  expect(reportRequests.some((request) => request.profile === "all")).toBe(false);
  expect(reportRequests.at(-1).profiles.production.token).toBe("secret");
  expect(reportRequests.at(-1).profile).toBe("staging");
});

test("delete config removes the profile and keeps it gone after reload", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("config_profiles", JSON.stringify({
      production: {
        netbox: "https://netbox.example.com",
        token: "secret",
        proxy: "",
        domain: "apps.example.com",
        tag: "production",
      },
    }));
    localStorage.setItem("current_config_profile", "production");
  });

  let webhookBody = "";
  await page.route("**/webhook?**", async (route) => {
    webhookBody = new URL(route.request().url()).searchParams.toString();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });

  await openAdmin(page, {
    profile: "production",
    netbox: "https://netbox.example.com",
    token: "secret",
    profiles: JSON.stringify({
      production: {
        netbox: "https://netbox.example.com",
        token: "secret",
        proxy: "",
        domain: "apps.example.com",
        tag: "production",
      },
    }),
  });

  await page.on("dialog", (dialog) => dialog.accept());
  await page.locator("#deleteConfigBtn").click();

  await expect(page.locator("#notif")).toContainText('Config "production" deleted');
  await expect(page.locator("#config_profile")).toHaveValue("");
  await expect(page.locator("#config_profile option")).toHaveText("No config saved");
  expect(webhookBody).toContain("profiles=%7B%7D");
  expect(webhookBody).toContain("domain=");

  await page.reload();
  await expect(page.locator("#config_profile")).toHaveValue("");
  await expect(page.locator("#config_profile option")).toHaveText("No config saved");
});

test("saving config refreshes templates for that profile", async ({ page }) => {
  const templateProfiles = [];
  let resolveWebhook;
  const webhookPending = new Promise((resolve) => {
    resolveWebhook = resolve;
  });
  await page.route("**/webhook?**", async (route) => {
    await webhookPending;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/templates") templateProfiles.push(url.searchParams.get("profile") || "");
  });

  await openAdmin(page, {}, {
    Remote: { image: "saashup/remote", version: "v1" },
  });
  await page.evaluate(() => {
    localStorage.setItem("create_templates", JSON.stringify({ Stale: { image: "saashup/stale" } }));
  });

  await page.locator("#config_name").fill("production");
  await page.locator("#netbox").fill("https://netbox.example.com");
  await page.locator("#token").fill("secret");
  await page.locator("#tag").fill("production");
  await page.locator("#submitBtn").click();

  await expect(page.locator("#submitBtn")).toHaveText("Saving config");
  await expect(page.locator("#submitBtn")).toHaveClass(/btn-loading/);
  await expect(page.locator("#submitBtn")).toBeDisabled();
  resolveWebhook();

  await expect(page.locator("#notif")).toContainText('Config "production" saved');
  await expect.poll(() => templateProfiles).toContain("");
  expect(templateProfiles).not.toContain("production");
  await expect(page.locator("#submitBtn")).toHaveText("Save config");
  await expect(page.locator("#submitBtn")).toBeEnabled();
  const localTemplates = await page.evaluate(() => JSON.parse(localStorage.getItem("create_templates")));
  expect(localTemplates.Remote).toMatchObject({ image: "saashup/remote", version: "v1" });
  expect(localTemplates.Stale).toBeUndefined();
});
