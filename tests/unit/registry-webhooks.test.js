const { registerRegistryWebhookRoutes } = require("../../api/registry-webhooks");

function createRoute(overrides = {}) {
  let handler;
  const app = {
    post: vi.fn((paths, fn) => {
      handler = fn;
    }),
  };
  const deps = {
    imagesToKeepValue: (value) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return 2;
      return Math.min(3, Math.max(1, Math.floor(number)));
    },
    logLine: vi.fn(),
    recreateContainers: vi.fn().mockResolvedValue(true),
    registryWebhookAllowed: vi.fn(() => true),
    registryWebhookEvents: vi.fn(() => [{ image: "saashup/tile", tag: "v2.0.0" }]),
    registryWebhookTemplates: vi.fn(() => []),
    imageNameFromRef: vi.fn((value) => String(value || "").split("@")[0].split(":")[0].toLowerCase()),
    sendImageUpgradeEmail: vi.fn().mockResolvedValue(undefined),
    sendOrderReadyEmail: vi.fn().mockResolvedValue(undefined),
    selectedProfileConfig: vi.fn(() => ({ smtp_config: "smtp.example.com:587" })),
    templatesForRequest: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
  registerRegistryWebhookRoutes(app, deps);
  return { deps, handler };
}

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function request(body = {}, profile = "prod", query = {}) {
  return { body, params: { profile }, query, originalUrl: `/registry-webhook/${profile}/hook-secret` };
}

describe("registry webhook route helper", () => {
  test("falls back to local webhook templates and order ready sender", async () => {
    const { deps, handler } = createRoute({
      templatesForRequest: undefined,
      sendImageUpgradeEmail: undefined,
      registryWebhookTemplates: vi.fn(() => [
        { name: "Tile", template: { image: "saashup/tile", dns_name: "tile.example.com", creator_email: "creator@example.com" } },
      ]),
    });
    const res = response();

    handler(request(), res);

    expect(res.statusCode).toBe(202);
    await vi.waitFor(() => expect(deps.sendOrderReadyEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        image: "saashup/tile",
        from_version: "",
        to_version: "v2.0.0",
        version: "v2.0.0",
        instance: "tile.example.com",
      }),
      "creator@example.com",
    ));
    expect(deps.registryWebhookTemplates).toHaveBeenCalledWith("prod", "saashup/tile");
  });

  test("filters async templates and skips templates without recipients", async () => {
    const { deps, handler } = createRoute({
      templatesForRequest: vi.fn().mockResolvedValue({
        Empty: { image: "saashup/tile", creator_email: "" },
        ProfileAlias: { profile: "prod", image: "saashup/tile:v1.0.0", creator_email: "profile@example.com" },
        NamedFallback: { image: "saashup/tile", version: "v1.0.0", creator_email: "name@example.com" },
        OtherProfile: { config_profile: "dev", image: "saashup/tile", creator_email: "dev@example.com" },
        OtherImage: { image: "saashup/other", creator_email: "other@example.com" },
      }),
    });

    handler(request(), response());

    await vi.waitFor(() => expect(deps.sendImageUpgradeEmail).toHaveBeenCalledTimes(2));
    expect(deps.sendImageUpgradeEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from_version: "",
        instance: "ProfileAlias",
      }),
      "profile@example.com",
    );
    expect(deps.sendImageUpgradeEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from_version: "v1.0.0",
        instance: "NamedFallback",
      }),
      "name@example.com",
    );
  });

  test("handles empty profile and image fallbacks while filtering templates", async () => {
    const { deps, handler } = createRoute({
      registryWebhookEvents: vi.fn(() => [{ image: "", tag: "v2.0.0" }]),
      templatesForRequest: vi.fn().mockResolvedValue({
        EmptyImage: { creator_email: "empty@example.com" },
      }),
    });

    handler(request({}, ""), response());

    await vi.waitFor(() => expect(deps.sendImageUpgradeEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        image: "",
        instance: "EmptyImage",
      }),
      "empty@example.com",
    ));
    expect(deps.imageNameFromRef).toHaveBeenCalledWith("");
  });

  test("passes the profile parallel_upgrade option to recreateContainers", async () => {
    const { deps, handler } = createRoute({
      selectedProfileConfig: vi.fn(() => ({ tag: "tile", parallel_upgrade: true })),
    });

    handler(request(), response());

    await vi.waitFor(() => expect(deps.recreateContainers).toHaveBeenCalledWith({
      tag: "tile",
      parallel_upgrade: true,
      image: "saashup/tile",
      version: "v2.0.0",
      clean_name: false,
      remove_old_images: true,
      images_to_keep: 2,
    }));
    expect(deps.selectedProfileConfig).toHaveBeenCalledWith({ profile: "prod" });
  });

  test("overrides images_to_keep from the webhook query string", async () => {
    const { deps, handler } = createRoute({
      selectedProfileConfig: vi.fn(() => ({ tag: "tile" })),
    });

    handler(request({}, "prod", { images_to_keep: "1" }), response());

    await vi.waitFor(() => expect(deps.recreateContainers).toHaveBeenCalledWith(expect.objectContaining({
      remove_old_images: true,
      images_to_keep: 1,
    })));
  });

  test("sources images_to_keep from the matching template when no query override is given", async () => {
    const { deps, handler } = createRoute({
      templatesForRequest: vi.fn().mockResolvedValue({
        Tile: { image: "saashup/tile", images_to_keep: 3 },
      }),
    });

    handler(request(), response());

    await vi.waitFor(() => expect(deps.recreateContainers).toHaveBeenCalledWith(expect.objectContaining({
      remove_old_images: true,
      images_to_keep: 3,
    })));
  });

  test("rejects invalid webhook secrets before starting async work", async () => {
    const { deps, handler } = createRoute({
      registryWebhookAllowed: vi.fn(() => false),
    });
    const res = response();

    handler(request(), res);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ detail: "invalid webhook secret" });
    expect(deps.recreateContainers).not.toHaveBeenCalled();
    expect(deps.sendImageUpgradeEmail).not.toHaveBeenCalled();
  });

  test("logs default smtp error text when upgrade email rejection has no message", async () => {
    const { deps, handler } = createRoute({
      sendImageUpgradeEmail: vi.fn().mockRejectedValue({}),
      templatesForRequest: vi.fn().mockResolvedValue({
        Tile: { image: "saashup/tile", creator_email: "creator@example.com" },
      }),
    });

    handler(request(), response());

    await vi.waitFor(() => expect(deps.logLine).toHaveBeenCalledWith(
      "EMAIL : ready notification failed for creator@example.com smtp error",
    ));
  });

  test("does not notify when only latest tags arrive or recreate is not ready", async () => {
    const latest = createRoute({
      registryWebhookEvents: vi.fn(() => [{ image: "saashup/tile", tag: "latest" }]),
      templatesForRequest: vi.fn().mockResolvedValue({
        Tile: { image: "saashup/tile", creator_email: "creator@example.com" },
      }),
    });

    latest.handler(request(), response());
    await new Promise((resolve) => setImmediate(resolve));
    expect(latest.deps.recreateContainers).not.toHaveBeenCalled();
    expect(latest.deps.sendImageUpgradeEmail).not.toHaveBeenCalled();

    const notReady = createRoute({
      recreateContainers: vi.fn().mockResolvedValue(false),
      templatesForRequest: vi.fn().mockResolvedValue({
        Tile: { image: "saashup/tile", creator_email: "creator@example.com" },
      }),
    });

    notReady.handler(request(), response());
    await vi.waitFor(() => expect(notReady.deps.recreateContainers).toHaveBeenCalled());
    await new Promise((resolve) => setImmediate(resolve));
    expect(notReady.deps.sendImageUpgradeEmail).not.toHaveBeenCalled();
  });

  test("audits registry webhook call with its profile and events", async () => {
    const { deps, handler } = createRoute();

    handler(request({ repository: { repo_name: "saashup/tile" }, push_data: { tag: "v2.0.0" } }), response());

    expect(deps.logLine).toHaveBeenCalledWith('REGISTRY_WEBHOOK : received profile=prod url=/registry-webhook/prod/hook-secret events=1 images=saashup/tile:v2.0.0 body={"repository":{"repo_name":"saashup/tile"},"push_data":{"tag":"v2.0.0"}}');
  });

  test("audits a refused registry webhook when secret is invalid", async () => {
    const { deps, handler } = createRoute({ registryWebhookAllowed: vi.fn(() => false) });
    const res = response();

    handler({ body: { repository: { repo_name: "saashup/tile" } }, params: { profile: "prod" }, originalUrl: "/registry-webhook/prod/saashup-secret%20" }, res);

    expect(res.statusCode).toBe(403);
    expect(deps.logLine).toHaveBeenCalledWith(
      'REGISTRY_WEBHOOK : rejected profile=prod reason=invalid-secret url=/registry-webhook/prod/saashup-secret%20 events=1 images=saashup/tile:v2.0.0 body={"repository":{"repo_name":"saashup/tile"}}',
    );
  });

  test("audits ignored registry webhook calls, keeping the body when no event was read", async () => {
    const latest = createRoute({ registryWebhookEvents: vi.fn(() => [{ image: "saashup/tile", tag: "latest" }]) });
    latest.handler(request(), response());
    expect(latest.deps.logLine).toHaveBeenCalledWith("REGISTRY_WEBHOOK : ignored profile=prod reason=latest-tag url=/registry-webhook/prod/hook-secret events=1 images=saashup/tile:latest body={}");

    const unreadable = createRoute({ registryWebhookEvents: vi.fn(() => []) });
    unreadable.handler(request({ unexpected: "something" }), response());
    expect(unreadable.deps.logLine).toHaveBeenCalledWith('REGISTRY_WEBHOOK : received profile=prod url=/registry-webhook/prod/hook-secret events=0 images=none body={"unexpected":"something"}');
    expect(unreadable.deps.logLine).toHaveBeenCalledWith('REGISTRY_WEBHOOK : ignored profile=prod reason=no-events url=/registry-webhook/prod/hook-secret events=0 images=none body={"unexpected":"something"}');
  });

  test("logs when the async registry webhook recreate flow fails", async () => {
    const { deps, handler } = createRoute({
      recreateContainers: vi.fn().mockRejectedValue(new Error("registry exploded")),
    });

    handler(request(), response());

    await vi.waitFor(() => expect(deps.logLine).toHaveBeenCalledWith("REGISTRY_WEBHOOK : failed registry exploded"));
  });
});
