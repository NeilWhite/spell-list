import { info } from "../settings.js";

export const htmlTag = ([name, value]) => `<span class="tag">${name}: <strong>${value}</strong></span>`;

export const levelName = (level) => {
  if (isNaN(level)) return "Any";
  return globalThis.CONFIG.DND5E.spellLevels[level];
};

export const getMaxSlotLevel = (classItem) => {
  const { DND5E: { SPELL_SLOT_TABLE }, Actor: { documentClass: Actor5e }} = globalThis.CONFIG;

  const maxSpellLevel = SPELL_SLOT_TABLE[SPELL_SLOT_TABLE.length-1].length;
  const progression = { pact: 0, slot: 0 };
  const spells = {};
  const { type } = classItem.spellcasting;

  Actor5e.computeClassProgression(progression, classItem);
  Actor5e.prepareSpellcastingSlots(spells, type, progression);

  if (type === "pact") return spells.pact.level;

  for (let i = 0; i <= maxSpellLevel; i++ ) {
    info({ n: spells[`spell${i}`], n1: spells[`spell${i+1}`] });

    if (!spells[`spell${i+1}`]?.max) { return i; }
  }

  info(`Unable to determine spell level for class ${classItem.identifier}, using max-level`);
  return maxSpellLevel;
};
