import { Api } from "./api.js";
import { MODULE_NAME, L } from "./config.js";

class SpellChoiceConfigurationData extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      hint: new foundry.data.fields.StringField({ label: "DND5E.AdvancementHint" }),
      choices: new dnd5e.dataModels.fields.MappingField(
        new foundry.data.fields.NumberField(), { hint: "DND5E.AdvancementItemChoiceLevelsHint" }
      ),
      allowDrops: new foundry.data.fields.BooleanField({
        initial: true, label: "DND5E.AdvancementConfigureAllowDrops",
        hint: "DND5E.AdvancementConfigureAllowDropsHint"
      }),
      pool: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField(), { label: "DOCUMENT.Items" }),
      spell: new foundry.data.fields.EmbeddedDataField(
        dnd5e.dataModels.advancement.SpellConfigurationData,
        { nullable: true, initial: null }
      ),
      restriction: new foundry.data.fields.SchemaField({
        level: new foundry.data.fields.StringField({ label: "DND5E.SpellLevel" }),
      })
    };
  }
}

class SpellChoiceConfig extends dnd5e.applications.advancement.AdvancementConfig {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "advancement", "item-choice", "spell-list", "two-column"],
      dragDrop: [{ dropSelector: ".drop-target" }],
      dropKeyPath: "pool",
      template: `modules/${MODULE_NAME}/templates/spell-choice-config.hbs`,
      width: 540
    });
  }

  async getData(option= {}) {
    const init = super.getData(option);
    const restriction = this.advancement.configuration.restriction;

    let { level, list } = restriction;
    list ??= this.advancement.item.system.identifier;

    const [ nLevel, range ] = isNaN(level)
      ? [ 9, true ]
      : [ Number(level), false ];

    const spells = await Api.getList(list, nLevel, range);
    const result = {
      ...init,
      preview: {
        spells: spells.slice(0, 5),
        total: spells.length
      }
    };

    return result;
  }

  async prepareConfigurationUpdate(configuration) {
    if (configuration.choices) configuration.choices = this.constructor._cleanedObject(configuration.choices);

    return configuration;
  }

  _validateDroppedItem(event, item) {
    this.advancement._validateItemType(item);
  }
}

export const configureAdvancement = ({ id, applications, documents }) => {
  if (id !== "dnd5e") return;

  const DND5E = globalThis.CONFIG.DND5E;

  class SpellChoiceFlow extends applications.advancement.ItemChoiceFlow {

    async getContext() {
      const config = this.advancement.configuration;

      if (!this.pool) {
        const listName = config.restriction.list ?? this.item.system.identifier;
        const [ level, range ] = isNaN(config.restriction.level)
          ? [ 99, true ]
          : [ Number(config.restriction.level), false ];

        const queried = new Set([
          ...(await Api.getList(listName, level, range)).map(v => v.uuid),
          ...config.pool
        ]);

        this.pool = await Promise.all(queried.map(uuid => fromUuid(uuid)));
      }

      return super.getContext();
    }
  }


  class SpellChoiceAdvancement extends documents.advancement.ItemChoiceAdvancement {
    static get metadata() {
      return foundry.utils.mergeObject(super.metadata, {
        title: L("SPELL-LIST.advancement.spellChoice.title"),
        hint: L("SPELL-LIST.advancement.spellChoice.hint"),
        dataModels: { configuration: SpellChoiceConfigurationData },
        apps: {
          config: SpellChoiceConfig,
          flow: SpellChoiceFlow
        }
      });
    }

    _validateItemType(item) {
      return super._validateItemType(item, { type: "spell" });
    }

  }

  DND5E.advancementTypes.SpellChoice = SpellChoiceAdvancement;
};
