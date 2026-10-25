
import { useState } from "react";
import "./App.css";

function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState("addition");
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

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
