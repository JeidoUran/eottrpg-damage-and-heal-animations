export class UnionGauge {
  static async renderUnionGauge(value, max) {
    // Supprime la jauge précédente
    document.getElementById("union-resource-bar")?.remove();

    const template_file =
      "modules/eottrpg-utilities/templates/union-gauge.hbs";
    const percent = (value / max) * 100;

    const template_data = {
      barFirstColor: "#0E5C5D",
      barSecondColor: "#00EEFF",
      animation: "img-bubbles",
      value,
      max,
      percent,
    };

    const rendered_html = await foundry.applications.handlebars.renderTemplate(
      template_file,
      template_data
    );

    const wrapper = document.createElement("div");
    wrapper.id = "union-resource-bar";
    wrapper.innerHTML = rendered_html;
    wrapper.classList.add("fade-in");
    document.body.appendChild(wrapper);

    function tryAttachGauge() {
      const gauge = document.getElementById("union-resource-bar");
      const target = document.querySelector(".bg3-hud");

      if (gauge && target) {
        const rect = target.getBoundingClientRect();
        gauge.style.position = "absolute";
        gauge.style.top = `${rect.top - 70}px`;
        gauge.classList.add("appear");
        return true;
      }
      return false;
    }

    if (!tryAttachGauge()) {
      const observer = new MutationObserver(() => {
        if (tryAttachGauge()) observer.disconnect();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  static async displayUnionGauge() {
    const res = window.pr.api
      .resources()
      .resources.find((r) => r.id === "union");
    if (!res) return;
    await this.renderUnionGauge(res.value, res.max_value);
  }

  static async updateUnionGauge(setting, data) {
    if (setting.key == "eottrpg-utilities.union-display" && setting.value == true) {
      this.displayUnionGauge();
    } else {
      document.getElementById("union-resource-bar")?.remove();
    }
    if (setting.key == "fvtt-party-resources.union") {
      const gaugeEnabled = game.settings.get("eottrpg-utilities", "union-display");
      if (!gaugeEnabled) return;
      const res = window.pr.api
        .resources()
        .resources.find((r) => r.id === "union");
      if (!res) return;
      await this.renderUnionGauge(setting.value, res.max_value);
    }
  }
}
