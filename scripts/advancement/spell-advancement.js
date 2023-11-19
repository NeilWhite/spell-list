import { SpellChoiceConfig, SpellChoiceConfigurationData } from "./spell-choice-config.js";
import { SpellChoiceFlow } from "./spell-choice-flow.js";
import { L, MODULE_NAME } from "../config.js";
import * as utility from "./utility.js";

export class SpellChoiceAdvancement extends dnd5e.documents.advancement.ItemChoiceAdvancement {
  static get metadata() {
    return foundry.utils.mergeObject(super.metadata, {
      title: L("SPELL-LIST.advancement.spellChoice.title"),
      hint: L("SPELL-LIST.advancement.spellChoice.hint"),
      icon: `modules/${MODULE_NAME}/svg/hand-holding-magic-solid.svg`,
      validItemTypes: new Set(["class", "subclass"]),
      dataModels: {
        configuration: SpellChoiceConfigurationData
      },
      apps: {
        config: SpellChoiceConfig,
        flow: SpellChoiceFlow
      }
    });
  }

  _validateItemType(item) {
    return super._validateItemType(item, { type: "spell" });
  }

  titleForLevel(level) {
    const { choices } = this.configuration;
    let total = 0;
    for (let i = 0; i <= level; i++) total += (choices[i] ?? 0);
    return `${this.title}: <strong>${total}</strong>`;
  }

  summaryForLevel() {
    const { restriction, includeSubclass, list } = this.configuration;

    const sections = {
      "List": list,
      "Subclass": includeSubclass,
      "Level": utility.levelName(restriction.level),
    };

    return Object.entries(sections).filter(([,v]) => !!v).map(utility.htmlTag).join("");
  }
}
