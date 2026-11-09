const { createUsersHelpers, registerUsersRoutes } = require("../../api/users");

function mockResponse() {
  return {
    body: undefined,
    statusCode: 200,
    json(payload) {
      this.body = payload;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
  };
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function imageNameFromRef(ref) {
  const text = String(ref || "");
  if (!text) return "";
  const slash = text.lastIndexOf("/");
  const colon = text.lastIndexOf(":");
  return colon > slash ? text.slice(0, colon) : text;
}

function imagePartsFromContainer(container, labels) {
  if (labels.image || labels.version) return { image: labels.image || "", version: labels.version || "" };
  return { image: container.image || "", version: container.image_version || "" };
}

function createHarness({ state = {}, containers = [], templates = {} } = {}) {
  let storedState = { users: {}, config: {}, templates, ...state };
  const readState = () => storedState;
  const writeState = (mutator) => {
    const next = typeof mutator === "function" ? mutator(storedState) || storedState : mutator;
    storedState = next;
    return next;
  };

  const defaultDependencies = {
    containerEnvValue: (container, name) => plainObject(container.env)[name] || "",
    dockerHosts: async () => [{ id: 1 }],
    hostIdQuery: async () => ({ host_id: 1 }),
    imageNameFromRef,
    imagePartsFromContainer,
    labelMapFromContainer: (container) => plainObject(container.labels),
    logLine: () => {},
    NetBoxClient: class {
      async list() {
        return containers;
      }
    },
    ownerEnvVarName: () => "SAASHUP_OWNER",
    parseProfiles: (value) => plainObject(value),
    plainObject,
    readState,
    selectedProfileConfig: (query) => ({ netbox: "https://netbox.example", token: "token", tag: "", ...query }),
    visibleProfileNames: () => ["default"],
    writeState,
  };

  const helpers = createUsersHelpers(defaultDependencies);
  const routes = {};
  const app = {
    get(path, ...handlers) {
      routes[`GET ${path}`] = handlers.at(-1);
    },
    put(path, ...handlers) {
      routes[`PUT ${path}`] = handlers.at(-1);
    },
    delete(path, ...handlers) {
      routes[`DELETE ${path}`] = handlers.at(-1);
    },
  };
  registerUsersRoutes(app, { ...helpers, requireAdmin: (_req, _res, next) => next && next() });

  return { helpers, routes, getState: () => storedState };
}

describe("api users", () => {
  test("lists one row per user/template combination, not a single summed total", async () => {
    const { routes } = createHarness({
      containers: [
        { labels: { owner: "Alice@Example.com", name: "tile" } },
        { labels: { owner: "alice@example.com", name: "tile" } },
        { labels: { owner: "alice@example.com", name: "blog" } },
        { env: { SAASHUP_OWNER: "bob@example.com" }, labels: { name: "tile" } },
      ],
    });
    const res = mockResponse();

    await routes["GET /admin/users"]({}, res);

    expect(res.body.users).toEqual([
      { user: "alice@example.com", profiles: ["default"], template: "blog", instances: 1, limitable: true, max_instances: null, template_default_max_instances: null },
      { user: "alice@example.com", profiles: ["default"], template: "tile", instances: 2, limitable: true, max_instances: null, template_default_max_instances: null },
      { user: "bob@example.com", profiles: ["default"], template: "tile", instances: 1, limitable: true, max_instances: null, template_default_max_instances: null },
    ]);
  });

  test("attributes unlabeled containers to a catalog template by matching image and version", async () => {
    const { routes } = createHarness({
      templates: { Tile: { image: "repo/tile", version: "2.0", max_instances: 5 } },
      containers: [
        { env: { SAASHUP_OWNER: "carol@example.com" }, labels: {}, image: "repo/tile", image_version: "2.0" },
      ],
    });
    const res = mockResponse();

    await routes["GET /admin/users"]({}, res);

    expect(res.body.users).toEqual([
      { user: "carol@example.com", profiles: ["default"], template: "Tile", instances: 1, limitable: true, max_instances: null, template_default_max_instances: 5 },
    ]);
  });

  test("falls back to the image:version as a non-limitable row when no template matches", async () => {
    const { routes } = createHarness({
      containers: [
        { env: { SAASHUP_OWNER: "dave@example.com" }, labels: {}, image: "repo/custom", image_version: "9.9" },
      ],
    });
    const res = mockResponse();

    await routes["GET /admin/users"]({}, res);

    expect(res.body.users).toEqual([
      { user: "dave@example.com", profiles: ["default"], template: "repo/custom:9.9", instances: 1, limitable: false, max_instances: null, template_default_max_instances: null },
    ]);
  });

  test("uses the catalog's current max_instances as the default, ignoring any stale per-container label", async () => {
    const { routes } = createHarness({
      templates: { tile: { max_instances: 10 } },
      containers: [
        { labels: { owner: "finn@example.com", name: "tile", max_instances: "1" } },
      ],
    });
    const res = mockResponse();

    await routes["GET /admin/users"]({}, res);

    expect(res.body.users).toEqual([
      { user: "finn@example.com", profiles: ["default"], template: "tile", instances: 1, limitable: true, max_instances: null, template_default_max_instances: 10 },
    ]);
  });

  test("includes a user/template row with a stored limit even without any instance", async () => {
    const { routes } = createHarness({
      state: { users: { "erin@example.com": { templates: { tile: 2 } } } },
      containers: [],
    });
    const res = mockResponse();

    await routes["GET /admin/users"]({}, res);

    expect(res.body.users).toEqual([
      { user: "erin@example.com", profiles: [], template: "tile", instances: 0, limitable: true, max_instances: 2, template_default_max_instances: null },
    ]);
  });

  test("sets a per-user, per-template instance limit without an upper cap (unlimited allowed)", async () => {
    const { routes, getState } = createHarness();
    const res = mockResponse();

    await routes["PUT /admin/users/:email/templates/:template/limit"]({ params: { email: "Frank@Example.com", template: "Tile" }, body: { max_instances: 5000 } }, res);

    expect(res.body).toEqual({ user: "frank@example.com", template: "Tile", max_instances: 5000 });
    expect(getState().users["frank@example.com"]).toEqual({ templates: { tile: 5000 } });
  });

  test("clamps a negative limit to zero", async () => {
    const { routes, getState } = createHarness();
    const res = mockResponse();

    await routes["PUT /admin/users/:email/templates/:template/limit"]({ params: { email: "ivy@example.com", template: "tile" }, body: { max_instances: -5 } }, res);

    expect(res.body).toEqual({ user: "ivy@example.com", template: "tile", max_instances: 0 });
    expect(getState().users["ivy@example.com"]).toEqual({ templates: { tile: 0 } });
  });

  test("clears a per-user, per-template instance limit", async () => {
    const { routes, getState } = createHarness({ state: { users: { "gina@example.com": { templates: { tile: 3, blog: 1 } } } } });
    const res = mockResponse();

    await routes["DELETE /admin/users/:email/templates/:template/limit"]({ params: { email: "gina@example.com", template: "tile" } }, res);

    expect(res.body).toEqual({ user: "gina@example.com", template: "tile", max_instances: null });
    expect(getState().users["gina@example.com"]).toEqual({ templates: { blog: 1 } });
  });

  test("userMaxInstancesOverride is scoped to a specific user/template pair", () => {
    const { helpers } = createHarness({ state: { users: { "henry@example.com": { templates: { tile: 1 } } } } });

    expect(helpers.userMaxInstancesOverride("henry@example.com", "blog")).toBeNull();
    expect(helpers.userMaxInstancesOverride("someone-else@example.com", "tile")).toBeNull();
    expect(helpers.userMaxInstancesOverride("henry@example.com", "tile")).toBe(1);
    expect(helpers.userMaxInstancesOverride("Henry@Example.com", "Tile")).toBe(1);
  });
});
