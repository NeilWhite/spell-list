import { Settings, info } from "./settings.js";

export class Api {
  static async getList(listName, level, andBelow = false) {
    info(`Querying List: ${listName} [level: ${level}, ${andBelow}]`);
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

    info(`Queried List: ${listName} [found: ${result.length}]`);
    return result;
  }

  static async getLists(lists, level, range = false) {
    info("Querying Multiple Lists:", lists);
    const result = [];

    for (const list of lists) {
      result.push(...(await Api.getList(list, level, range)).map(v => v.uuid));
    }

    info(`Query Multiple Outcome: ${result.length}`);
    return result;
  }
}
