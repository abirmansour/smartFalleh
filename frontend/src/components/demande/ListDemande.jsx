import React, { useEffect, useState } from "react";
import "./ListDemande.css";

export default function ListDemande() {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]); // 🆕
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const res = await fetch("http://localhost:3000/demandes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          throw new Error("Non autorisé — token invalide ou expiré");
        }

        if (!res.ok) throw new Error("Erreur de chargement");

        const data = await res.json();
        setDemandes(data);
        setFilteredDemandes(data); // 🆕 on garde une copie originale
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDemandes();
    } else {
      setError("Token manquant — veuillez vous reconnecter.");
      setLoading(false);
    }
  }, [token]);

  // 🧩 Fonction pour filtrer les demandes
  const handleFilter = () => {
    const filtered = demandes.filter(
      (d) => Number(d.nombreVaches) > 20 // condition
    );
    setFilteredDemandes(filtered);
  };

  // 🧩 Fonction pour réinitialiser le filtre
  const handleReset = () => {
    setFilteredDemandes(demandes);
  };

  if (loading) return <div className="listdemande-loading">Chargement...</div>;
  if (error) return <div className="listdemande-error">{error}</div>;

  return (
    <div className="listdemande-container">
      <div className="listdemande-header">
        <h2 className="listdemande-title">📋 Liste des Demandes</h2>

        {/* 🆕 les boutons de filtre */}
        <div className="listdemande-actions">
          <button className="filter-btn" onClick={handleFilter}>
            Filtrer les demandes (+20 vaches)
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </div>

      {filteredDemandes.length === 0 ? (
        <p className="listdemande-empty">Aucune demande trouvée</p>
      ) : (
        <div className="listdemande-grid">
          {filteredDemandes.map((demande) => (
            <div key={demande.id} className="demande-card">
              <div className="demande-header">
                <h3>
                  {demande.nom} {demande.prenom}
                </h3>
                <span className="role">{demande.role}</span>
              </div>
              <p><strong>Email:</strong> {demande.email}</p>
              <p><strong>Téléphone:</strong> {demande.telephone}</p>
              <p><strong>Adresse:</strong> {demande.adresse}</p>
              <p><strong>Région:</strong> {demande.region}</p>
              <p><strong>Superficie:</strong> {demande.superficieFerme} ha</p>
              <p><strong>Nombre de vaches:</strong> {demande.nombreVaches}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
