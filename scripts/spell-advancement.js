import { Api } from "./api.js";
import { L } from "./config.js";

class SpellChoiceConfigurationData extends foundry.abstract.DataModle {
  static defineSchema() {
    return {
      hint: new foundry.data.fields.StringField({label: "DND5E.AdvancementHint"}),
      choices: new MappingField(
        new foundry.data.fields.NumberField(),
        {
          hint: "DND5E.AdvancementItemChoiceLevelsHint"
        }),
      allowDrops: new foundry.data.fields.BooleanField({
        initial: true, label: "DND5E.AdvancementConfigureAllowDrops",
        hint: "DND5E.AdvancementConfigureAllowDropsHint"
      }),
      type: new foundry.data.fields.StringField({
        blank: false, nullable: true, initial: null,
        label: "DND5E.AdvancementItemChoiceType", hint: "DND5E.AdvancementItemChoiceTypeHint"
      }),
      pool: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField(), {label: "DOCUMENT.Items"}),
      spell: new foundry.data.fields.EmbeddedDataField(SpellConfigurationData, {nullable: true, initial: null}),
      restriction: new foundry.data.fields.SchemaField({
        type: new foundry.data.fields.StringField({label: "DND5E.Type"}),
        subtype: new foundry.data.fields.StringField({label: "DND5E.Subtype"}),
        level: new foundry.data.fields.StringField({label: "DND5E.SpellLevel"})
      })
    };
  }

}

export const configureAdvancement = ({ id, applications, dataModels, documents }) => {
  if (id !== "dnd5e") return;

  const DND5E = globalThis.CONFIG.DND5E;

  class SpellChoiceFlow extends applications.advancement.ItemChoiceFlow {

    async getContext() {
      if (!this.pool) {
        const config = this.advancement.configuration;
        const _class = this.item.system.identifier;
        const level = Number(config.restriction.level ?? 0);
        const configured = await Promise.all(config.pool.map(uuid => fromUuid(uuid)));
        const queried = await Api.getList(_class, level);

        this.pool = [...configured, ...queried];
      }

      return super.getContext();
    }
  }

  class SpellChoiceConfig extends applications.advancement.ItemChoiceConfig {

  }


  class SpellChoiceAdvancement extends documents.advancement.ItemChoiceAdvancement {
    static get metadata() {
      return foundry.utils.mergeObject(super.metadata, {
        title: L("SPELL-LIST.advancement.spell-choice.title"),
        hint: L("SPELL-LIST.advancement.spell-choice.hint"),
        dataModels: { configuration: SpellChoiceConfigurationData },
        apps: {
          config: SpellChoiceConfig,
          flow: SpellChoiceFlow
        }
      });
    }
  }

  DND5E.advancementTypes.SpellChoice = SpellChoiceAdvancement;
}
