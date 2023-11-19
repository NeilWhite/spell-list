import { MODULE_NAME } from "../config.js";
import { Api } from "../api.js";

export class SpellChoiceConfigurationData extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      hint: new foundry.data.fields.StringField({ label: "DND5E.AdvancementHint" }),
      choices: new dnd5e.dataModels.fields.MappingField(
        new foundry.data.fields.NumberField(), { hint: "DND5E.AdvancementItemChoiceLevelsHint" }
      ),
      allowDrops: new foundry.data.fields.BooleanField({
        initial: true,
        label: "DND5E.AdvancementConfigureAllowDrops",
        hint: "DND5E.AdvancementConfigureAllowDropsHint"
      }),
      pool: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField(), { label: "DOCUMENT.Items" }),
      includeSubclass: new foundry.data.fields.BooleanField({
        initial: false,
        label: "SPELL-LIST.advancement.spellChoice.subclass.title",
        hint: "SPELL-LIST.advancement.spellChoice.subclass.hint"
      }),
      list: new foundry.data.fields.StringField({
        label: "SPELL-LIST.advancement.spellChoice.override.title",
        hint: "SPELL-LIST.advancement.spellChoice.override.hint"
      }),
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

export class SpellChoiceConfig extends dnd5e.applications.advancement.AdvancementConfig {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "advancement", "item-choice", "spell-list", "two-column"],
      dragDrop: [{ dropSelector: ".drop-target" }],
      dropKeyPath: "pool",
      template: `modules/${MODULE_NAME}/templates/spell-list-choice-config.hbs`,
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
