Hooks.once("init", () => {
    game.settings.register("eottrpg-utilities", "union-display", {
        name: "UNION.Settings.Display.Name",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
  });
  