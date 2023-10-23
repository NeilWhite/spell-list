import { CONFIG, MODULE_NAME, preLoc, L } from "./config.js";
import { Api } from "./api.js";
import { renderItemSheetHook } from "./item-form.js";
import { registerSettings } from "./settings.js";
import { configureAdvancement } from "./spell-advancement.js";

Hooks.on("init", () => {
  globalThis.CONFIG.SpellList = Api;

  registerSettings();
});

Hooks.on("ready", () => {
  preLoc(CONFIG.casters.class, "label");
  preLoc(CONFIG.casters.subclass, "label");

  Hooks.on("renderItemSheet", renderItemSheetHook);

  configureAdvancement(game.system);
});
