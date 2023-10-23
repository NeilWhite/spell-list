const addonId = "spell-list";


const mapDict = (type) => (acc, c) => {
  acc[c] = { label: `SPELL-LIST.${type}.${c}` }
  return acc;
}

const classes = [ "artificer", "cleric", "druid", "paladin", "ranger", "warlock" ];
const subclasses = [ "fish" ];

const CONFIG = {
  casters: {
    class: classes.reduce(mapDict("class"), {}),
    subclass: subclasses.reduce(mapDict("subclass"), {})
  }
};

const L = (text) => game.i18n.localize(text);

const preLoc = (dict, path) => {
  for (const name in dict) dict[name][path] = L(dict[name][path])
};

Hooks.on("ready", () => {
  preLoc(CONFIG.casters.class, "label");
  preLoc(CONFIG.casters.subclass, "label");
});


const buildCheckbox = (name, detail, data) => {
  return `<label class="checkbox">
    <input type="checkbox" name="flags.${addonId}.${name}" ${data.flags[addonId][name] ? "checked" : ""} />
    ${ detail.label }
  </label>`;
}

Hooks.on("renderItemSheet", (itemSheet, html, { data }) => {

  if (data.type !== "spell") return;

  const element = html.find('select[name="system.preparation.mode"]').parent().parent();

  if (element){
    if (!data.flags[addonId]) foundry.utils.setProperty(data, `flags.${addonId}`, {});

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
});
