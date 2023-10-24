import { CONFIG, MODULE_NAME, L } from "./config.js";

const buildCheckbox = (name, detail, data) => {
  return `<label class="checkbox">
    <input type="checkbox" name="flags.${MODULE_NAME}.${name}" ${data.flags[MODULE_NAME][name] ? "checked" : ""} />
    ${ detail.label }
  </label>`;
};

const buildSection = (name, list, data) => {
  return `<label>${L(name)}</label>` +
    Object.entries(list).map(([k, v]) => buildCheckbox(k, v, data)).join("");
};

export const renderItemSheetHook = (itemSheet, html, { data }) => {
  if (data.type !== "spell") return;

  const element = html.find("select[name=\"system.preparation.mode\"]").parent().parent();

  if (element) {
    if (!data.flags[MODULE_NAME]) foundry.utils.setProperty(data, `flags.${MODULE_NAME}`, {});

    element.after(
      `<h3 class="form-header">${L("SPELL-LIST.name")}</h3>
      <div>
        <div class="form-group stacked spell-list-properties">
          ${buildSection("SPELL-LIST.section.class", CONFIG.casters.class, data)}
          ${buildSection("SPELL-LIST.section.subclass", CONFIG.casters.subclass, data)}
        </div>
      </div>`);
  }
};


