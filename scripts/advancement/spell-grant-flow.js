import { Api } from "../api.js";
import * as utility from "./utility.js";
import { MODULE_NAME } from "../config.js";

export class SpellGrantFlow extends dnd5e.applications.advancement.ItemGrantFlow {
  listSpells = null;

  async getContext() {
    let { list, includeSubclass } = this.advancement.configuration;
    if (!list || list === "") list = this.advancement.item.system.identifier;

    if (!this.listSpells) {
      const listNames = [ list ];

      const level = utility.getMaxSlotLevel(this.item, this.level);

      if (includeSubclass && this.item.subclass) {
        listNames.push(this.item.subclass.system.identifier);
      }

      const flag = this.item.parent?.getFlag(MODULE_NAME, list);
      if (flag) {
        listNames.push(flag);
      }

      const listResult = (await Api.getLists(listNames, level, false));
      const currentSpells = this.item?.parent?.items?.filter(v => v.type === "spell") ?? [];

      const finalList = new Set(listResult);
      for (const current of currentSpells) {
        if (current.flags.dnd5e?.sourceId) finalList.delete(current.flags.dnd5e?.sourceId);
      }

      this.listSpells = finalList;
    }

    return {
      optional: false,
      items: await Promise.all(this.listSpells.map(uuid => fromUuid(uuid)))
    };
  }
}
