import { CONFIG, MODULE_NAME, L, makeSection } from "./config.js";
import { Settings } from "./settings.js";

export class SpellList5eItemSheet {
  constructor(app, html) {
    this.app = app;
    this.item = app.item;
    this.html = html;
  }

  _tabOpen = false;

  static cache = new Map();

  static init() {

    Hooks.on("renderItemSheet", async (app, html, { data }) => {
      if (data.type !== "spell") return;
      if (!data.flags[MODULE_NAME]) foundry.utils.setProperty(data, `flags.${MODULE_NAME}`, {});

      let instance = this.cache.get(app.id);
      if (instance) {
        instance._renderLite();
        if (instance._tabOpen) {
          instance.app._tabs?.[0]?.activate?.("spell-list");
          instance._tabOpen = false;
        }

        return;
      } else {
        instance = new SpellList5eItemSheet(app, html);
        this.cache.set(app.id, instance);
        return instance._renderLite();
      }
    });

    Hooks.on("closeItemSheet", async (app) => {
      if (SpellList5eItemSheet.cache.get(app.id)) {
        return SpellList5eItemSheet.cache.delete(app.id);
      }
    });
  }

  _renderLite() {
    const tab = $(`<a class="item" data-tab="spell-list">${L("SPELL-LIST.name")}</a>`);
    const tabs = this.html.find('.tabs[data-group="primary"]');
    if (!tabs) return;
    tabs.append(tab);

    const body = this.html.find(".sheet-body");
    const tabBody = $('<div class="tab spell-list flexcol" data-group="primary" data-tab="spell-list"></div>');
    body.append(tabBody);
    this.renderContent(tabBody);
  }

  async _renderOptions() {
    return renderTemplate(`/modules/${MODULE_NAME}/templates/spell-list-tab.hbs`, {
      section: {
        ...CONFIG.lists,
        custom: makeSection("custom", Settings.extraLists, false)
      },
      data: this.item.flags[MODULE_NAME],
      dataString: JSON.stringify(this.item.flags[MODULE_NAME])
    });
  }

  async renderContent(container) {
    const html = $(await this._renderOptions());
    container.append(html);
    this.app.setPosition({ height: "auto" });

    this.html.on("click", ".spell-list-tab", () => {
      this._tabOpen = true;
    });
  }
}


