Hooks.on('initializeDynamicTokenRingConfig', (ringConfig) => {
    const targetAcquired = new foundry.canvas.tokens.DynamicRingData({
      label: 'Target Acquired',
      effects: {
        RING_PULSE: 'TOKEN.RING.EFFECTS.RING_PULSE',
        RING_GRADIENT: 'TOKEN.RING.EFFECTS.RING_GRADIENT',
        BKG_WAVE: 'TOKEN.RING.EFFECTS.BKG_WAVE',
        INVISIBILITY: 'TOKEN.RING.EFFECTS.INVISIBILITY',
      },
      spritesheet: 'modules/eottrpg-utilities/assets/rings/target-acquired.json',
    });
    ringConfig.addConfig('targetAcquired', targetAcquired);
  });
  