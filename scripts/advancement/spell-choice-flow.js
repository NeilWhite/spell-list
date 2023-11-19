import { info } from "../settings.js";
import { Api } from "../api.js";
import * as utility from "./utility.js";

export class SpellChoiceFlow extends dnd5e.applications.advancement.ItemChoiceFlow {
  async getLists(level, range, lists) {
    info("Querying List", { lists, level, range });

    const result = [];

    for(const list of lists) {
      result.push(...(await Api.getList(list, level, range)).map(v => v.uuid));
    }

    return result;
  }


  async getContext() {
    const config = this.advancement.configuration;

    if (!this.pool) {
      const listNames = [ config.restriction.list ?? this.item.system.identifier ];

      const [ level, range ] = isNaN(config.restriction.level)
        ? [ utility.getMaxSlotLevel(this.item), true ]
        : [ Number(config.restriction.level), false ];

      if (config.includeSubclass && this.item.subclass) {
        listNames.push(this.item.subclass.name);
      }

      const list = (await this.getLists(level, range, listNames));

      const queried = new Set([ ...list, ...config.pool ]);

      this.pool = (await Promise.all(queried.map(uuid => fromUuid(uuid))));
      this.pool.sort((a,b) => a.name?.localeCompare(b.name));
    }

    return super.getContext();
  }
}
