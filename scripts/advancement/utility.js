import { info } from "../settings.js";

export const htmlTag = ([name, value]) => `<span class="tag">${name}: <strong>${value}</strong></span>`;

export const levelName = (level) => {
  if (isNaN(level)) return "Any";
  return globalThis.CONFIG.DND5E.spellLevels[level];
};

export const getMaxSlotLevel = (classItem, levels) => {
  const { DND5E: { SPELL_SLOT_TABLE }, Actor: { documentClass: Actor5e }} = globalThis.CONFIG;

  const maxSpellLevel = SPELL_SLOT_TABLE[SPELL_SLOT_TABLE.length-1].length;
  const progression = { pact: 0, slot: 0 };
  const spells = {};
  let spellcasting = classItem.spellcasting;

  if (!isNaN(levels)) {
    spellcasting.levels = levels;
  }

  Actor5e.computeClassProgression(progression, classItem, { spellcasting });
  Actor5e.prepareSpellcastingSlots(spells, spellcasting.type, progression);

  if (spellcasting.type === "pact") return spells.pact.level;

  for (let i = 0; i <= maxSpellLevel; i++ ) {
    if (!spells[`spell${i+1}`]?.max) { return i; }
  }

  info(`Unable to determine spell level for class ${classItem.identifier}, using max-level`);
  return maxSpellLevel;
};
