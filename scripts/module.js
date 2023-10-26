import { CONFIG } from "./config.js";
import { Api } from "./api.js";
import { SpellList5eItemSheet } from "./item-form.js";
import { registerSettings } from "./settings.js";
import { SpellChoiceAdvancement, SpellChoiceConfigurationData, SpellChoiceConfig, SpellChoiceFlow } from "./spell-advancement.js";

Hooks.on("init", () => {
  globalThis.CONFIG.SpellList = {
    Api,
    documents: {
      SpellChoiceConfigurationData
    },
    applications: {
      SpellChoiceConfig,
      SpellChoiceFlow
    },
    advancement: {
      SpellChoiceAdvancement
    },
    lists: CONFIG.lists
  };

  registerSettings();
  SpellList5eItemSheet.init();

  globalThis.CONFIG.DND5E.advancementTypes.SpellChoice = SpellChoiceAdvancement;
});

Hooks.on("ready", () => {
});
