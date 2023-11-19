import { CONFIG } from "./config.js";
import { Api } from "./api.js";
import { SpellList5eItemSheet } from "./item-form.js";
import { registerSettings } from "./settings.js";
import { SpellChoiceAdvancement } from "./advancement/spell-advancement.js";
import { SpellChoiceConfig, SpellChoiceConfigurationData } from "./advancement/spell-choice-config.js";
import { SpellChoiceFlow } from "./advancement/spell-choice-flow.js";

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


