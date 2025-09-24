// scripts/swap-orders-socket.js
const MODULE_ID = "eottrpg-utilities"; // mets l’ID de TON module ici

Hooks.once("socketlib.ready", () => {
  const socket = socketlib.registerModule(MODULE_ID);
  socket.register("swapOrdersOnActor", swapOrdersOnActor);
});

const LABELS = { atk: "Ordre d'attaque", def: "Ordre de garde" };
const num = (v) => Number.parseFloat(String(v).replace(/[^\-0-9.]/g, "")) || 0;

async function swapOrdersOnActor(actorUuid) {
  const actor = await fromUuid(actorUuid);
  if (!actor) return false;

  let attackorder = actor.effects.find(e => e.name === LABELS.atk);
  let defendorder = actor.effects.find(e => e.name === LABELS.def);

  const updateEffect = async (effect, bonus, isAttackOrder) => {
    const changes = effect.changes?.toObject ? effect.changes.toObject() : effect.changes;
    const updatedChanges = [
      { ...changes[0], value: `${bonus}` },
      {
        ...changes[1],
        value: isAttackOrder
          ? `<b>Ordre d'attaque</b> : Bonus de ${bonus} d'Offense.`
          : `<b>Ordre de garde</b> : Malus de ${bonus} d'Offense contre cette cible.`
      }
    ];
    const remaining = effect.duration?.remaining ?? 0;
    const rounds = effect.duration?.rounds ?? 0;
    const addRounds = Math.min(3 - remaining, 3);
    const payload = { changes: updatedChanges };
    if (!Number.isNaN(addRounds)) payload["duration.rounds"] = rounds + addRounds;
    await effect.update(payload);
  };

  if (attackorder && defendorder) {
    const attackbonus = num(attackorder.changes[0]?.value);
    const defensebonus = num(defendorder.changes[0]?.value);
    await updateEffect(attackorder, `+${defensebonus * -1}`, true);
    await updateEffect(defendorder, `${attackbonus * -1}`, false);
    return true;
  }

  if (attackorder) {
    const attackbonus = num(attackorder.changes[0]?.value);
    // essaie de créer l’effet manquant via Chris’s Premades si dispo
    if (game.modules.get("chris-premades")?.active && chrisPremades?.utils?.effectUtils?.createEffectFromSidebar) {
      await chrisPremades.utils.effectUtils.createEffectFromSidebar(actor, LABELS.def);
    }
    defendorder = actor.effects.find(e => e.name === LABELS.def);
    if (defendorder) {
      const changes = defendorder.changes?.toObject ? defendorder.changes.toObject() : defendorder.changes;
      const updatedChanges = [
        { ...changes[0], value: `${attackbonus * -1}` },
        { ...changes[1], value: `<b>Ordre de garde</b> : Malus de ${attackbonus * -1} d'Offense contre cette cible.` }
      ];
      await defendorder.update({ changes: updatedChanges });
    }
    await attackorder.delete();
    return true;
  }

  if (defendorder) {
    const defensebonus = num(defendorder.changes[0]?.value);
    if (game.modules.get("chris-premades")?.active && chrisPremades?.utils?.effectUtils?.createEffectFromSidebar) {
      await chrisPremades.utils.effectUtils.createEffectFromSidebar(actor, LABELS.atk);
    }
    attackorder = actor.effects.find(e => e.name === LABELS.atk);
    if (attackorder) {
      const changes = attackorder.changes?.toObject ? attackorder.changes.toObject() : attackorder.changes;
      const updatedChanges = [
        { ...changes[0], value: `+${defensebonus * -1}` },
        { ...changes[1], value: `<b>Ordre d'attaque</b> : Bonus de +${defensebonus * -1} d'Offense.` },
        changes[2] ? { ...changes[2], value: `true` } : null,
        changes[3] ? { ...changes[3], value: `every` } : null
      ].filter(Boolean);
      await attackorder.update({ changes: updatedChanges });
    }
    await defendorder.delete();
    return true;
  }

  return false;
}
