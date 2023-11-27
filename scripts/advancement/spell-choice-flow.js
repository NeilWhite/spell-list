import { Api } from "../api.js";
import * as utility from "./utility.js";

export class SpellChoiceFlow extends dnd5e.applications.advancement.ItemChoiceFlow {

  async getContext() {
    let { restriction, list, includeSubclass, pool } = this.advancement.configuration;
    if (!list || list === "") list = this.advancement.item.system.identifier;

    if (!this.pool) {

      const listNames = [ list ];

      const [ level, range ] = isNaN(restriction.level)
        ? [ utility.getMaxSlotLevel(this.item, this.level), true ]
        : [ Number(restriction.level), false ];

      if (includeSubclass && this.item.subclass) {
        listNames.push(this.item.subclass.name);
      }

      const resultList = (await Api.getLists(listNames, level, range));

      const queried = new Set([ ...resultList, ...pool ]);

      this.pool = (await Promise.all(queried.map(uuid => fromUuid(uuid))));
      this.pool.sort((a,b) => a.name?.localeCompare(b.name));
    }

    return super.getContext();
  }
}