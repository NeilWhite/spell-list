import { CONFIG } from "./config.js";
import { Api } from "./api.js";
import { SpellList5eItemSheet } from "./item-form.js";
import { registerSettings } from "./settings.js";
import { SpellChoiceAdvancement, SpellChoiceConfig, SpellChoiceConfigurationData, SpellChoiceFlow } from "./advancement/index.js";
import { SpellGrantAdvancement, SpellGrantConfig, SpellGrantConfigurationData, SpellGrantFlow } from "./advancement/index.js";

Hooks.on("init", () => {
  globalThis.CONFIG.SpellList = {
    Api,
    documents: {
      SpellChoiceConfigurationData,
      SpellGrantConfigurationData
    },
    applications: {
      SpellChoiceConfig,
      SpellChoiceFlow,
      SpellGrantConfig,
      SpellGrantFlow
    },
    advancement: {
      SpellChoiceAdvancement,
      SpellGrantAdvancement
    },
    lists: CONFIG.lists
  };

  registerSettings();
  SpellList5eItemSheet.init();

  globalThis.CONFIG.DND5E.advancementTypes.SpellChoice = SpellChoiceAdvancement;
  globalThis.CONFIG.DND5E.advancementTypes.SpellGrant = SpellGrantAdvancement;
});


