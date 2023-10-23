import { MODULE_NAME, L } from "./config.js";

const settings = {
  include: "include-collection"
};

export class Settings {
  static get include() { return game.settings.get(MODULE_NAME, settings.include) }
}

class CollectionSettings extends FormApplication {
  get id() { return `${MODULE_NAME}-collection-settings-menu`; }
  get title() { return L("SPELL-LIST.settings.collection.title"); }
  get template() { return `modules/${MODULE_NAME}/templates/settings.hbs`; }

  async getData() {
    const include = game.settings.get(MODULE_NAME, settings.include);

    const sections = { };

    const getName = ({ packageType, packageName }) => {
      switch (packageType){
        case "world": return L("SPELL-LIST.settings.collection.world");
        case "module": return game.modules.get(packageName)?.title ?? packageName;
        case "system": return game.system?.title || packageType;
        default: return packageName;
      }
    }

    for (const { metadata } of game.packs) {
      if (metadata.type !== "Item") continue;

      const sectionName = metadata.packageName;

      const section = (sections[sectionName] || (sections[sectionName] = { label: getName(metadata), types: [] }));
      section.types.push({ label: metadata.label, value: metadata.id, checked: include.includes(metadata.id) });
    }

    return { sections };
  }

  async _updateObject(event, formData) {
    const result = [];
    for (const [key, value] of Object.entries(formData)) {
      if (value) result.push(key);
    }

    game.settings.set(MODULE_NAME, settings.include, result);
  }
}

export const registerSettings = () => {
  game.settings.register(MODULE_NAME, settings.include, {
    scope: "world",
    type: Array,
    config: false,
    default: [],
    requiresReload: true
  });

  game.settings.registerMenu(MODULE_NAME, L("SPELL-LIST.settings.collection.name"), {
    name: L("SPELL-LIST.settings.collection.name"),
    hint: L("SPELL-LIST.settings.collection.hint"),
    scope: "world",
    config: true,
    type: CollectionSettings,
    label: L("SPELL-LIST.settings.collection.name"),
    restricted: true
  });
}

