import { Settings } from "./settings.js";

export class Api {
  static async getList(listName, level, andBelow = false) {
    const op = SearchFilter.OPERATORS;

    const result = [];

    for (const packId of Settings.include) {
      const pack = game.packs.get(packId);
      await pack.getIndex({ fields: [ "system.level", "flags.spell-list" ]});

      result.push(...pack.search({
        filters: [
          { field: "type", value: "spell" },
          { field: "system.level", value: level, operator: andBelow ? op.LESS_THAN_EQUAL : op.EQUALS },
          { field: `flags.spell-list.${listName}`, value: true }
        ]
      }));
    }

    return result;
  }
}
