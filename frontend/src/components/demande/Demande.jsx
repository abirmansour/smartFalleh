import React, { useState } from "react";
import "./Demande.css";

export default function AjoutDemande({ onClose }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    region: "",
    superficie: "",
    nombreVaches: "",
    role: "Agriculteur",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          email: formData.email,
          adresse: formData.adresse,
          region: formData.region,
          superficieFerme: formData.superficie,
          nombreVaches: formData.nombreVaches,
          role: formData.role,
        }),
      });

      if (!response.ok) throw new Error("Erreur d’envoi");

      const data = await response.json();
      console.log("✅ Demande créée:", data);
      alert("Demande envoyée avec succès !");
      onClose && onClose();
    } catch (err) {
      setError("Erreur lors de l'envoi de la demande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="demande-container">
      <form className="demande-card" onSubmit={handleSubmit}>
        <div className="demande-header">
          <h2 className="demande-heading">Demande</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="demande-error">{error}</div>}

        <div className="demande-grid">
          <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="demande-input" />
          <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="demande-input" />
          <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" className="demande-input" />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="demande-input" />
<input
  name="nombreVaches"
  type="number"
  value={formData.nombreVaches}
  onChange={(e) =>
    setFormData({ ...formData, nombreVaches: e.target.value || 0 })
  }
  placeholder="Nombre de vaches"
  className="demande-input"
/>
          <input name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" className="demande-input" />
          <input name="region" value={formData.region} onChange={handleChange} placeholder="Région" className="demande-input" />
  <input
  name="superficie"
  type="number"
  step="0.01"
  value={formData.superficie}
  onChange={(e) =>
    setFormData({ ...formData, superficie: e.target.value || 0 })
  }
  placeholder="Superficie de ferme (hectares)"
  className="demande-input"
/>

          <select name="role" value={formData.role} onChange={handleChange} className="demande-input select">
            <option value="Agriculteur">Agriculteur</option>
          </select>
        </div>

        <div className="demande-actions">
          <button type="submit" className="demande-submit" disabled={isLoading}>
            {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </div>
      </form>
    </div>
  );
}
