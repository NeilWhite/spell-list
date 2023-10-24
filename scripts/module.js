import { CONFIG, preLoc } from "./config.js";
import { Api } from "./api.js";
import { renderItemSheetHook } from "./item-form.js";
import { registerSettings } from "./settings.js";
import { SpellChoiceAdvancement } from "./spell-advancement.js";

Hooks.on("init", () => {
  globalThis.CONFIG.SpellList = Api;

  registerSettings();

  globalThis.CONFIG.DND5E.advancementTypes.SpellChoice = SpellChoiceAdvancement;
});

Hooks.on("ready", () => {
  preLoc(CONFIG.casters.class, "label");
  preLoc(CONFIG.casters.subclass, "label");

     Hooks.on("renderItemSheet", renderItemSheetHook);
});
