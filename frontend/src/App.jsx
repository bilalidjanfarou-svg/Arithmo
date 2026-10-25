
import { useState } from "react";
import "./App.css";

function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState("addition");
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [explications, setExplications] = useState([]);
  const [historique, setHistorique] = useState([]);
  
  function expliquerCalcul(a, b, operation, resultat) {
    switch (operation) {
      case "addition":
        return [
          `On additionne ${a} et ${b}.`,
          `${a} + ${b} = ${resultat}`,
          "On regroupe les deux nombres pour obtenir leur somme.",
        ];

      case "soustraction":
        return [
          `On soustrait ${b} de ${a}.`,
          `${a} - ${b} = ${resultat}`,
          "Le résultat est la différence entre les deux nombres.",
        ];

      case "multiplication":
        return [
          `On multiplie ${a} par ${b}.`,
          `${a} × ${b} = ${resultat}`,
          "La multiplication correspond à une addition répétée lorsque les nombres sont entiers positifs.",
        ];

      case "division":
        return [
          `On divise ${a} par ${b}.`,
          `${a} ÷ ${b} = ${resultat}`,
          "Le résultat indique combien vaut le quotient de cette division.",
        ];

      case "modulo":
        if (Number.isInteger(a) && Number.isInteger(b) && b !== 0) {
          const diviseur = Math.abs(b);
          const quotient = Math.floor(a / diviseur);
          const reste = ((a % diviseur) + diviseur) % diviseur;

          return [
            `On divise ${a} par ${diviseur}.`,
            `${a} = ${diviseur} × ${quotient} + ${reste}`,
            `Le reste de la division euclidienne est ${reste}.`,
          ];
        }
      
        return [
          `On calcule le reste de ${a} modulo ${b}.`,
          `${a} % ${b} = ${resultat}`,
          "Le modulo représente le reste selon la convention de calcul utilisée.",
        ];

      default:
        return ["Aucune explication disponible."];


    }
  }

  

  async function effectuerCalcul(e) {
    e.preventDefault();
    setErreur("");
    setResultat(null);

    if (a.trim() === "" || b.trim() === "") {
      setErreur("Veuillez saisir les deux nombres.");
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch(
        "http://127.0.0.1:8000/api/calculs/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            a: Number(a),
            b: Number(b),
            operation,
          }),
        }
      );

      const donnees = await reponse.json();

      if (!reponse.ok) {
        throw new Error(donnees.erreur || "Une erreur est survenue.");
      }

      setResultat(donnees.resultat);
      setHistorique((ancienHistorique) => [
  {
    a: Number(a),
    b: Number(b),
    operation,
    resultat: donnees.resultat,
  },
  ...ancienHistorique,
]);
      setExplications(
      expliquerCalcul(
        Number(a),
        Number(b),
        operation,
        donnees.resultat
  )
);
    } catch (error) {
      setErreur(
        error.message === "Failed to fetch"
          ? "Impossible de joindre le serveur. Vérifiez que Django fonctionne."
          : error.message
      );
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="/">
          <span className="logo-icon">A</span>
          Arithmo<span className="logo-point">.</span>
        </a>

        <span className="nav-label">Apprendre les mathématiques</span>
      </header>

      <main className="main-content">
        <section className="hero">
          <span className="eyebrow">TON ESPACE MATHÉMATIQUE</span>
          <h1>
            Les maths, <span>autrement.</span>
          </h1>
          <p>
            Calcule, explore et comprends les mathématiques
            une étape à la fois.
          </p>
        </section>

        <section className="calculator">
          <div className="calculator-heading">
            <div>
              <span className="section-label">OUTIL DE CALCUL</span>
              <h2>Calculatrice</h2>
            </div>
            <div className="calculator-icon">∑</div>
          </div>

          <form onSubmit={effectuerCalcul}>
            <div className="fields">
              <label>
                Premier nombre
                <input
                  type="number"
                  step="any"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  placeholder="Ex. 17"
                />
              </label>

              <label>
                Deuxième nombre
                <input
                  type="number"
                  step="any"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  placeholder="Ex. 5"
                />
              </label>
            </div>

            <label className="operation-label">
              Choisir une opération
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <option value="addition">Addition (+)</option>
                <option value="soustraction">Soustraction (−)</option>
                <option value="multiplication">Multiplication (×)</option>
                <option value="division">Division (÷)</option>
                <option value="modulo">Modulo (%)</option>
              </select>
            </label>

            <button className="calculate-button" type="submit" disabled={chargement}>
              {chargement ? "Calcul en cours..." : "Calculer le résultat"}
              {!chargement && <span> →</span>}
            </button>
          </form>

          {erreur && (
            <div className="error-message" role="alert">
              {erreur}
            </div>
          )}

          
          {resultat !== null && (
            <div className="result-box" aria-live="polite">
              <span className="section-label">RÉSULTAT</span>

              <p className="result-number">{resultat}</p>

              <p className="result-description">
                Ton calcul a été effectué avec succès.
              </p>

              <div className="explanation">
                <h3>Comprendre le calcul</h3>

                <ol>
                  {explications.map((etape, index) => (
                    <li key={index}>{etape}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </section>

        
        <section className="history">
          <div className="history-heading">
            <div>
              <span className="section-label">TES PRÉCÉDENTS CALCULS</span>
              <h2>Historique</h2>
            </div>

            {historique.length > 0 && (
              <button
                className="clear-history"
                type="button"
                onClick={() => setHistorique([])}
              >
                Effacer
              </button>
            )}
          </div>

          {historique.length === 0 ? (
            <p className="empty-history">
              Tes calculs apparaîtront ici au fur et à mesure.
            </p>
          ) : (
            <div className="history-list">
              {historique.map((calcul, index) => {
                const symboles = {
                  addition: "+",
                  soustraction: "−",
                  multiplication: "×",
                  division: "÷",
                  modulo: "%",
                };

                return (
                  <div className="history-item" key={index}>
                    <div>
                      <p className="history-operation">
                        {calcul.a} {symboles[calcul.operation]} {calcul.b}
                      </p>
                      <span className="history-type">
                        {calcul.operation}
                      </span>
                    </div>

                    <strong>= {calcul.resultat}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="features">
          <article className="feature-card">
            <span className="feature-icon">✦</span>
            <h3>Comprendre</h3>
            <p>Apprends à comprendre les concepts mathématiques.</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">⌘</span>
            <h3>Pratiquer</h3>
            <p>Entraîne-toi avec des calculs et des exercices.</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">∞</span>
            <h3>Progresser</h3>
            <p>Avance progressivement vers des notions plus avancées.</p>
          </article>
        </section>
      </main>

      <footer>
        <p>Arithmo © 2026 — Les mathématiques à ta portée.</p>
      </footer>
    </div>
  );
}

export default App;
