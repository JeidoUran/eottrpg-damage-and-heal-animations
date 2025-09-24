Hooks.on("renderSettings", (app, htmlElement, data) => {
    // Convertir en jQuery si nécessaire
    const html = $(htmlElement);
  
    // Empêcher l'ajout multiple
    if (html.find("#settings-codex").length > 0) return;
  
    // Attendre que game.version soit dispo (parfois tardif au tout début)
    const majorVersion = Number(game.version?.split(".")[0] ?? 0);
  
    if (majorVersion >= 13) {
      // --- Foundry V13+ : structure sidebar → on injecte une nouvelle <section>
      const codexSection = $(`
        <section id="settings-codex" class="codex flexcol">
          <h4 class="divider">${game.i18n.localize("CODEX.Category")}</h4>
        </section>
      `);
  
      const codexButtons = [
        { href: "https://codex.eottrpg.memiroa.com/", label: "CODEX.ViewCodex" },
        { href: "https://codex.eottrpg.memiroa.com/regles/", label: "CODEX.ViewRulesCodex" },
        { href: "https://codex.eottrpg.memiroa.com/regles/races/", label: "CODEX.ViewRaceCodex" },
        { href: "https://codex.eottrpg.memiroa.com/regles/classes/", label: "CODEX.ViewClassCodex" },
        { href: "https://codex.eottrpg.memiroa.com/univers/personnages/", label: "CODEX.ViewCharaCodex" }
      ];
  
      for (const btn of codexButtons) {
        codexSection.append($(`<a class="button" href="${btn.href}" rel="nofollow" target="_blank">
          <i class="fa-solid fa-book-open-cover"></i> ${game.i18n.localize(btn.label)}
        </a>`));
      }
  
      html.find("section.settings.flexcol").after(codexSection);
  
    } else {
      // --- Foundry V12 ou antérieur : injecter dans la liste .settings-list
      const codexCategory = $(`
        <h2>${game.i18n.localize("CODEX.Category")}</h2>
        <div id="settings-codex" class="settings-list"></div>
      `);
  
      html.find('#settings-game').after(codexCategory);
  
      const urls = {
        "CODEX.ViewCodex": "https://codex.eottrpg.memiroa.com/",
        "CODEX.ViewRulesCodex": "https://codex.eottrpg.memiroa.com/regles/",
        "CODEX.ViewRaceCodex": "https://codex.eottrpg.memiroa.com/regles/races/",
        "CODEX.ViewClassCodex": "https://codex.eottrpg.memiroa.com/regles/classes/",
        "CODEX.ViewCharaCodex": "https://codex.eottrpg.memiroa.com/univers/personnages/"
      };
  
      for (const [label, link] of Object.entries(urls)) {
        const $btn = $(`<button data-action="codex">
          <i class="fa-solid fa-book-open-cover"></i> ${game.i18n.localize(label)}
        </button>`);
  
        $btn.on("click", () => {
          try {
            if (window?.process?.versions?.electron && typeof require !== "undefined") {
              const { shell } = require("electron");
              shell.openExternal(link);
            } else {
              window.open(link, "_blank");
            }
          } catch (e) {
            console.warn(`Erreur d'ouverture de lien externe [${link}] :`, e);
            window.open(link, "_blank");
          }
        });
  
        html.find("#settings-codex").append($btn);
      }
    }
  });
  