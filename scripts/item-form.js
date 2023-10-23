import { CONFIG, MODULE_NAME, L } from "./config.js";

const buildCheckbox = (name, detail, data) => {
  return `<label class="checkbox">
    <input type="checkbox" name="flags.${MODULE_NAME}.${name}" ${data.flags[MODULE_NAME][name] ? "checked" : ""} />
    ${ detail.label }
  </label>`;
}

export const renderItemSheetHook = (itemSheet, html, { data }) => {
  if (data.type !== "spell") return;

  const element = html.find('select[name="system.preparation.mode"]').parent().parent();

  if (element){
    if (!data.flags[MODULE_NAME]) foundry.utils.setProperty(data, `flags.${MODULE_NAME}`, {});

    const casterHtml = `<div>
      <div class="form-group stacked">
        <label>${L("SPELL-LIST.section.class")}</label>
        ${Object
          .entries(CONFIG.casters.class)
          .map(([name, detail]) => buildCheckbox(name, detail, data) )
          .join("")
        }
        <label>${L("SPELL-LIST.section.subclass")}</label>
        ${Object
          .entries(CONFIG.casters.subclass)
          .map(([name, detail]) => buildCheckbox(name, detail, data) )
          .join("")
        }
      </div>
    </div>`;

    element.after(
      `<h3 class="form-header">${L("SPELL-LIST.name")}</h3>`,
      casterHtml
    );
  }
};


