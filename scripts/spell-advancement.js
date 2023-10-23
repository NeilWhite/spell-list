import { Api } from "./api.js";
import { L } from "./config.js";

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

  class SpellChoiceConfigurationData extends dataModels.advancement.ItemChoiceConfigurationData {

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
