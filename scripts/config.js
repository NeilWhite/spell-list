export const MODULE_NAME = "spell-list";

const mapDict = (type) => (acc, c) => {
  acc[c] = { label: `SPELL-LIST.${type}.${c}` };
  return acc;
};

const classes = [
  "artificer", "bard", "cleric", "druid", "paladin",
  "ranger", "sorcerer", "warlock", "wizard"
];

const subclasses = [
  "oath-of-the-watchers"
];

export const CONFIG = {
  casters: {
    class: classes.reduce(mapDict("class"), {}),
    subclass: subclasses.reduce(mapDict("subclass"), {})
  }
};

export const L = (text) => game.i18n.localize(text);

export const preLoc = (dict, path) => {
  for (const name in dict) dict[name][path] = L(dict[name][path]);
};
