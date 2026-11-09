const fs = require("fs");
const path = require("path");

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
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

function defaultState() {
  return {
    config: {},
    templates: {},
    workflows: {},
    users: {},
    logs: "",
  };
}

function compactStateForWrite(state) {
  const next = { ...plainObject(state) };
  ["templates", "workflows", "brandings", "users"].forEach((key) => {
    if (!Object.keys(plainObject(next[key])).length) delete next[key];
  });
  delete next.order_counts;
  delete next.order_instances;
  delete next.enrollment_counts;
  delete next.enrollment_instances;
  return next;
}

function createStateStore(dataPath) {
  const stateFile = path.join(dataPath, "app-state.json");
  const legacyContextFile = path.join(dataPath, "context", "global", "global.json");

  function migrateLegacyState() {
    const legacy = readJson(legacyContextFile, {});
    if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) return defaultState();
    return {
      config: plainObject(legacy.config),
      templates: plainObject(legacy.templates),
      workflows: plainObject(legacy.workflows),
      logs: typeof legacy.logs === "string" ? legacy.logs : "",
    };
  }

  function readState() {
    const state = fs.existsSync(stateFile) ? readJson(stateFile, defaultState()) : migrateLegacyState();
    return { ...defaultState(), ...plainObject(state) };
  }

  function writeState(mutator) {
    const state = readState();
    const next = typeof mutator === "function" ? mutator(state) || state : mutator;
    writeJson(stateFile, compactStateForWrite({ ...defaultState(), ...plainObject(next) }));
    return next;
  }

  function logLine(message) {
    writeState((state) => {
      state.logs = `${new Date().toISOString()} ${message}<br>${state.logs || ""}`;
      return state;
    });
  }

  return { readState, writeState, logLine, stateFile, legacyContextFile };
}

module.exports = {
  createStateStore,
  compactStateForWrite,
  defaultState,
  parseProfiles,
  plainObject,
  readJson,
  writeJson,
};
