const { createTemplateCatalogHelpers } = require("../../lib/template-catalog");

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? JSON.parse(JSON.stringify(value))
    : {};
}

function createHelpers(overrides = {}) {
  return createTemplateCatalogHelpers({
    maxInstancesValue: (value) => Number(value ?? 1),
    imagesToKeepValue: (value) => Number(value ?? 2),
    orderInstanceCountForTemplate: () => 2,
    orderTemplateEnabled: (value) => Boolean(value),
    plainObject,
    ...overrides,
  });
}

describe("template catalog helpers", () => {
  const helpers = createHelpers();

  test("normalizes catalog URLs and builds stable context names", () => {
    const scope = helpers.templateCatalogScope("Prod", { netbox: "https://netbox.example.com/", tag: "Tile" });
    expect(scope.profile).toBe("Prod");
    expect(scope.netbox).toBe("https://netbox.example.com");
    expect(scope.tag).toBe("Tile");
    expect(scope.key).toHaveLength(12);

    const name = helpers.templateCatalogContextName("Prod", { netbox: "https://netbox.example.com/", tag: "Tile" });
    expect(name).toMatch(/^saashup-template-catalog-prod-/);
    expect(name).toContain(scope.key);

    const defaultName = helpers.templateCatalogContextName("!!!", {});
    expect(defaultName).toMatch(/^saashup-template-catalog-default-/);

    const blankName = helpers.templateCatalogContextName("", {});
    expect(blankName).toMatch(/^saashup-template-catalog-default-/);
  });

  test("parses JSON safely and normalizes catalog scope data", () => {
    expect(helpers.plainJsonObject('{"one":1}')).toEqual({ one: 1 });
    expect(helpers.plainJsonObject("not-json")).toEqual({});
    expect(helpers.plainJsonObject({ nested: true })).toEqual({ nested: true });

    const scope = helpers.templateCatalogScope("prod", { netbox: "https://netbox.example.com/", tag: "tile" });
    expect(scope.profile).toBe("prod");
    expect(scope.netbox).toBe("https://netbox.example.com");
    expect(scope.tag).toBe("tile");
  });

  test("extracts catalog data and uses it for template and workflow entries", () => {
    const data = {
      saashup_template_catalog: true,
      saashup_profile: "prod",
      saashup_scope: "ignore",
      saashup_netbox_url: "https://netbox.example.com/",
      saashup_tag: "tile",
      saashup_templates: { nginx: { image: "nginx" } },
      saashup_workflows: { custom: { steps: [] } },
    };
    expect(helpers.configContextCatalogData({ data })).toEqual(data);

    const scope = helpers.templateCatalogScope("prod", { netbox: "https://netbox.example.com/", tag: "tile" });
    const workflowEntries = helpers.workflowEntriesFromConfigContext({ data }, "prod", scope);
    expect(workflowEntries).toEqual([{ name: "custom", workflow: expect.objectContaining({ source: "netbox-config-context" }) }]);

    expect(helpers.configContextCatalogData({ data: { unrelated: true } })).toEqual({});
    expect(helpers.configContextCatalogData({ data: { templates: { nginx: { image: "nginx" } } } })).toEqual({ templates: { nginx: { image: "nginx" } } });
  });

  test("reads template and workflow definitions from config context", () => {
    const data = {
      saashup_templates: { nginx: { image: "nginx" } },
      saashup_workflows: { templates: { name: "templates", steps: [{ template: "nginx" }] } },
    };
    expect(helpers.configContextTemplateDefinitions(data)).toEqual({ nginx: { image: "nginx" } });
    expect(helpers.configContextWorkflowDefinitions(data)).toEqual({ templates: { name: "templates", steps: [{ template: "nginx" }] } });

    const nestedData = { templates: { nginx: { image: "nginx" }, workflows: { test: { steps: [] } } } };
    expect(helpers.configContextTemplateDefinitions(nestedData)).toEqual({ nginx: { image: "nginx" }, workflows: { test: { steps: [] } } });
    expect(helpers.configContextWorkflowDefinitions(nestedData)).toEqual({ test: { steps: [] } });
  });

  test("generates workflow entries from config context only", () => {
    const context = {
      data: {
        saashup_template_catalog: true,
        saashup_profile: "prod",
        saashup_scope: "ignore",
        saashup_netbox_url: "https://netbox.example.com",
        saashup_tag: "tile",
        saashup_templates: { nginx: { image: "nginx" } },
        saashup_workflows: { custom: { steps: [] } },
      },
    };
    const scope = helpers.templateCatalogScope("prod", { netbox: "https://netbox.example.com/", tag: "tile" });
    expect(helpers.workflowEntriesFromConfigContext(context, "prod", scope)).toEqual([{ name: "custom", workflow: expect.objectContaining({ source: "netbox-config-context" }) }]);
  });

  test("builds template entries from config context and preserves creator email", () => {
    const context = {
      data: {
        saashup_template_catalog: true,
        saashup_profile: "prod",
        saashup_scope: "ignore",
        saashup_templates: { nginx: { image: "nginx", max_instances: 3 } },
        creator_email: "owner@example.com",
      },
    };
    const scope = helpers.templateCatalogScope("prod", { netbox: "", tag: "" });
    const entries = helpers.templateEntriesFromConfigContext(context, "prod", scope, {});
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      name: "nginx",
      template: expect.objectContaining({
        creator_email: "owner@example.com",
        source: "netbox-config-context",
        max_instances: 3,
      }),
    });
  });

  test("template entries and workflows ignore invalid or empty names", () => {
    const data = {
      saashup_template_catalog: true,
      saashup_profile: "prod",
      saashup_scope: "ignore",
      saashup_templates: { "": { image: "nginx" }, config: { image: "nginx" } },
    };
    const scope = helpers.templateCatalogScope("prod", { netbox: "", tag: "" });
    expect(helpers.templateEntriesFromConfigContext({ data }, "prod", scope, {})).toEqual([]);
  });

  test("entry builders return no entries for mismatched scope or invalid template-only workflows", () => {
    const scope = helpers.templateCatalogScope("prod", { netbox: "https://netbox.example.com", tag: "tile" });
    const mismatchedData = {
      saashup_template_catalog: true,
      saashup_profile: "other",
      saashup_templates: { nginx: { image: "nginx" } },
    };
    expect(helpers.templateEntriesFromConfigContext({ data: mismatchedData }, "prod", scope, {})).toEqual([]);
    expect(helpers.workflowEntriesFromConfigContext({ data: mismatchedData }, "prod", scope)).toEqual([]);

    const noWorkflowData = {
      saashup_template_catalog: true,
      saashup_profile: "prod",
      saashup_netbox_url: "https://netbox.example.com",
      saashup_tag: "tile",
      saashup_templates: { reserved: { steps: [] }, config: { image: "nginx" } },
    };
    expect(helpers.workflowEntriesFromConfigContext({ data: noWorkflowData }, "prod", scope)).toEqual([]);
  });

  test("configContextMatchesCatalogScope rejects mismatched scope or profile data", () => {
    const scope = helpers.templateCatalogScope("prod", { netbox: "https://netbox.example.com", tag: "tile" });
    expect(helpers.configContextMatchesCatalogScope({}, scope)).toBe(false);
    expect(helpers.configContextMatchesCatalogScope({ saashup_scope: "bad-scope" }, scope)).toBe(false);
    expect(helpers.configContextMatchesCatalogScope({ saashup_profile: "other" }, scope)).toBe(false);
    expect(helpers.configContextMatchesCatalogScope({ saashup_netbox_url: "https://other.example.com" }, scope)).toBe(false);
    expect(helpers.configContextMatchesCatalogScope({ saashup_tag: "other" }, scope)).toBe(false);
  });

  test("configContextMatchesCatalogScope accepts matching scope or profile values", () => {
    const scope = helpers.templateCatalogScope("prod", { netbox: "https://netbox.example.com", tag: "tile" });
    expect(helpers.configContextMatchesCatalogScope({ saashup_scope: scope.key }, scope)).toBe(true);
    expect(helpers.configContextMatchesCatalogScope({ saashup_profile: "prod", saashup_netbox_url: "https://netbox.example.com", saashup_tag: "tile" }, scope)).toBe(true);
  });

  test("workflowEntriesFromConfigContext ignores blank workflow names and falls back to template workflows", () => {
    const scope = helpers.templateCatalogScope("prod", { netbox: "", tag: "" });
    const data = {
      saashup_template_catalog: true,
      saashup_profile: "prod",
      saashup_scope: scope.key,
      saashup_workflows: { "": { steps: [{ template: "nginx" }] } },
      saashup_templates: { nginx: { image: "nginx" } },
    };
    const entries = helpers.workflowEntriesFromConfigContext({ data }, "prod", scope);
    expect(entries).toEqual([{ name: "prod::templates", workflow: expect.objectContaining({ source: "netbox-config-context", steps: [{ template: "nginx", enabled: true }] }) }]);
  });

  test("workflowEntriesFromConfigContext falls back to templates when workflows are not defined", () => {
    const scope = helpers.templateCatalogScope("prod", { netbox: "", tag: "" });
    const data = {
      saashup_template_catalog: true,
      saashup_profile: "prod",
      saashup_scope: scope.key,
      saashup_templates: { nginx: { image: "nginx" } },
    };
    const entries = helpers.workflowEntriesFromConfigContext({ data }, "prod", scope);
    expect(entries).toEqual([{ name: "prod::templates", workflow: expect.objectContaining({ source: "netbox-config-context", steps: [{ template: "nginx", enabled: true }] }) }]);

    const defaultScope = helpers.templateCatalogScope("", { netbox: "", tag: "" });
    const defaultData = {
      saashup_template_catalog: true,
      saashup_scope: defaultScope.key,
      saashup_templates: { nginx: { image: "nginx" } },
    };
    expect(helpers.workflowEntriesFromConfigContext({ data: defaultData }, "", defaultScope)).toEqual([{
      name: "templates",
      workflow: expect.objectContaining({
        config_profile: "",
        source: "netbox-config-context",
        steps: [{ template: "nginx", enabled: true }],
      }),
    }]);
  });

  test("assigns creator emails when merging templates with existing entries", () => {
    const templates = { nginx: { image: "nginx" } };
    const existing = { nginx: { creator_email: "existing@example.com" } };
    expect(helpers.templatesWithCreatorEmails(templates, existing, "owner@example.com")).toEqual({ nginx: { image: "nginx", creator_email: "existing@example.com" } });

    expect(helpers.templatesWithCreatorEmails({ nginx: { image: "nginx" } }, {}, "owner@example.com")).toEqual({ nginx: { image: "nginx", creator_email: "owner@example.com" } });

    expect(helpers.templatesWithCreatorEmails({ nginx: { image: "nginx", creator_email: "explicit@example.com" } }, {}, "owner@example.com")).toEqual({ nginx: { image: "nginx", creator_email: "explicit@example.com" } });
    expect(helpers.templatesWithCreatorEmails({ nginx: { image: "nginx" } }, {}, "")).toEqual({ nginx: { image: "nginx" } });
  });

  test("profilesWithSingleDefault migrates defaults to visible profiles", () => {
    const result = helpers.profilesWithSingleDefault({
      prod: { saashup_default: true, tag: "tile" },
      dev: { saashup_default: true, tag: "guide" },
    });
    expect(result.prod.saashup_visible).toBe(true);
    expect(result.dev.saashup_visible).toBe(true);
    expect(result.prod.saashup_default).toBeUndefined();
    expect(result.dev.saashup_default).toBeUndefined();

    expect(helpers.profilesWithSingleDefault({
      prod: { tag: "tile" },
      dev: { tag: "guide", saashup_default: false },
    })).toEqual({
      prod: { tag: "tile" },
      dev: { tag: "guide" },
    });
  });
});
