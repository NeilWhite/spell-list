import { MODULE_NAME } from "../config.js";
import { Api } from "../api.js";

const { StringField, BooleanField, NumberField, SchemaField, ArrayField, EmbeddedDataField } = foundry.data.fields;
const { MappingField } = dnd5e.dataModels.fields;

export class SpellChoiceConfigurationData extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      hint: new StringField({ label: "DND5E.AdvancementHint" }),
      choices: new MappingField(
        new SchemaField({
          count: new NumberField({integer: true, min: 0}),
          replacement: new BooleanField({label: "DND5E.AdvancementItemChoiceReplacement"})
        }), {
          hint: "DND5E.AdvancementItemChoiceLevelsHint"
        }
      ),
      allowDrops: new BooleanField({
        initial: true,
        label: "DND5E.AdvancementConfigureAllowDrops",
        hint: "DND5E.AdvancementConfigureAllowDropsHint"
      }),
      pool: new ArrayField(
        new SchemaField({
          uuid: new StringField()
        }), {
          label: "DOCUMENT.Items"
        }
      ),
      includeSubclass: new BooleanField({
        initial: false,
        label: "SPELL-LIST.advancement.spellChoice.subclass.title",
        hint: "SPELL-LIST.advancement.spellChoice.subclass.hint"
      }),
      list: new StringField({
        label: "SPELL-LIST.advancement.spellChoice.override.title",
        hint: "SPELL-LIST.advancement.spellChoice.override.hint"
      }),
      spell: new EmbeddedDataField(
        dnd5e.dataModels.advancement.SpellConfigurationData,
        { nullable: true, initial: null }
      ),
      restriction: new SchemaField({
        level: new StringField({ label: "DND5E.SpellLevel" }),
      })
    };
  }

  static migrateData(source) {
    if ( "choices" in source ) Object.entries(source.choices).forEach(([k, c]) => {
      if ( foundry.utils.getType(c) === "number" ) source.choices[k] = { count: c };
    });
    if ( "pool" in source ) {
      source.pool = source.pool.map(i => foundry.utils.getType(i) === "string" ? { uuid: i } : i);
    }
    return source;
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
    let { restriction: { level }, list } = this.advancement.configuration;
    if (!list || list ==="") list = this.advancement.item.system.identifier;

    const [ nLevel, range ] = isNaN(level)
      ? [ 9, true ]
      : [ Number(level), false ];

    const spells = await Api.getList(list, nLevel, range);
    const result = {
      ...init,
      choices: Object.entries(init.levels).reduce((obj, [level, label]) => {
        obj[level] = { label, ...this.advancement.configuration.choices[level] };
        return obj;
      }, {}),
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
