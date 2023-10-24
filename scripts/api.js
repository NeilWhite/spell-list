import { Settings } from "./settings.js";

export class Api {
  static async getList(listName, level, andBelow = false) {
    const op = SearchFilter.OPERATORS;

    const result = [];

    for (const packId of Settings.include) {
      const pack = game.packs.get(packId);
      await pack.getIndex({ fields: [ "system.level", "flags.spell-list" ]});

      const makeLevelFilter = () => {
        if (andBelow && level) {
          return { field: "system.level", value: [1, level], operator: op.BETWEEN };
        } else {
          return { field: "system.level", value: Number(level)};
        }
      };

      result.push(...pack.search({
        filters: [
          { field: "type", value: "spell" },
          { field: `flags.spell-list.${listName}`, value: true },
          makeLevelFilter()
        ]
      }));
    }

    return result;
  }
}
