export const MODULE_NAME = "spell-list";

export const makeSection = (name, values, resource = true) => {
  if (!values?.length) return undefined;

  return {
    label: `SPELL-LIST.section.${name}`,
    lists: values.reduce((acc, c) => {
      acc[c] = { label: resource ? `SPELL-LIST.${name}.${c}` : c };
      return acc;
    }, {})
  };
};

const classes = [
  "artificer", "bard", "cleric", "druid", "paladin",
  "ranger", "sorcerer", "warlock", "wizard"
];

const subclasses = [
  // // Artificer
  // "alchemist", "armorer", "artillerist", "battle-smith" ,

  // // Cleric
  // "arcana-domain", "blood-domain", "death-domain", "forge-domain", "grave-domain",
  // "knowledge-domain", "life-domain", "light-domain", "moon-domain", "nature-domain",
  // "order-domain", "peace-domain",  "tempest-domain", "trickery-domain", "twilight-domain",
  // "war-domain" ,

  // // Druid
  // "circle-of-wildfire", "circle-of-the-land", "circle-of-spores",

  // // Paladin
  // "oath-of-the-ancients", "oath-of-conquest", "oath-of-the-crown", "oath-of-devotion",
  // "oath-of-glory", "oath-of-the-open-sea", "oath-of-redemption", "oath-of-vengeance",
  // "oath-of-the-watchers", "oathbreaker",

  // Warlock
  "the-archfey", "the-celestial", "the-fathomless", "the-fiend", "the-genie",
  "the-great-old-one", "the-hexblade", "the-undying", "the-undead",
];

export const CONFIG = {
  lists: {
    class: makeSection("class", classes),
    subclass: makeSection("subclass", subclasses)
  }
};

export const L = (text) => game.i18n.localize(text);

export const preLoc = (dict, path) => {
  for (const name in dict) dict[name][path] = L(dict[name][path]);
};
