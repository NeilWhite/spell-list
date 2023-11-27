import { SpellGrantConfig, SpellGrantConfigurationData } from "./spell-grant-config.js";
import { SpellGrantFlow } from "./spell-grant-flow.js";
import { L, MODULE_NAME } from "../config.js";
import * as utility from "./utility.js";

export class SpellGrantAdvancement extends dnd5e.documents.advancement.ItemGrantAdvancement {
  static get metadata() {
    return foundry.utils.mergeObject(super.metadata, {
      title: L("SPELL-LIST.advancement.spellGrant.title"),
      hint: L("SPELL-LIST.advancement.spellGrant.hint"),
      icon: `modules/${MODULE_NAME}/svg/hand-holding-magic-solid.svg`,
      validItemTypes: new Set(["class", "subclass"]),
      multiLevel: true,
      dataModels: {
        configuration: SpellGrantConfigurationData
      },
      apps: {
        config: SpellGrantConfig,
        flow: SpellGrantFlow
      }
    });
  }

  _validateItemType(item) {
    return super._validateItemType(item, { type: "spell" });
  }

  get levels() {
    const maxLevel = globalThis.CONFIG?.DND5E?.CHARACTER_EXP_LEVELS?.length ?? 20;
    const result = [];
    let previous = 0;
    for (let level = 1; level <= maxLevel; level++) {
      const spellLevel = utility.getMaxSlotLevel(this.item, level);
      if (spellLevel != previous) result.push(level);
      previous = spellLevel;
    }
    return result;
  }

  titleForLevel() {
    return this.title ?? "Learn class spells";
  }

  summaryForLevel(level) {
    const levelNum = Number(level);
    const { includeSubclass, list } = this.configuration;
    const maxLevel = utility.getMaxSlotLevel(this.item, levelNum);

    const sections = {
      "List": list,
      "Subclass": includeSubclass,
      "Level": utility.levelName(maxLevel),
    };

    return Object.entries(sections).filter(([,v]) => !!v).map(utility.htmlTag).join("");
  }

  storagePath(level) {
    return `value.added.${level}`;
  }
}
