import { UnionGauge } from "./UnionGauge.js";

Hooks.on("ready", () => {
  const gaugeEnabled = game.settings.get("eottrpg-utilities", "union-display");
  if (gaugeEnabled) UnionGauge.displayUnionGauge();
});

Hooks.on("updateSetting", (setting, data) => {
  if (
    setting.key == "eottrpg-utilities.union-display" ||
    setting.key == "fvtt-party-resources.union"
  )
    UnionGauge.updateUnionGauge(setting, data);
});
