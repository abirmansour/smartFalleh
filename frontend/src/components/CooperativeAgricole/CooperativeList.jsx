import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./CooperativeList.css";

export default function CooperativeList() {
  const [coops, setCoops] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState(null);
  const [formData, setFormData] = useState({
    gouvernorat: "",
    telephone: "",
    adresse: "",
  });
  const [error, setError] = useState("");

  const API = "http://localhost:3000/cooperatives";
  const token = localStorage.getItem("token");

  // جلب القائمة
  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setCoops(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setError("Erreur lors du chargement des coopératives.");
        setCoops([]);
      });
  }, []);

  const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

  const openAddForm = () => {
    setIsEditMode(false);
    setSelectedCoop(null);
    setFormData({ gouvernorat: "", telephone: "", adresse: "" });
    setShowForm(true);
  };

  const openEditForm = (coop) => {
    setIsEditMode(true);
    setSelectedCoop(coop);
    setFormData({
      gouvernorat: coop.gouvernorat || "",
      telephone: coop.telephone || "",
      adresse: coop.adresse || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (coop) => {
    const result = await Swal.fire({
      title: "Supprimer?",
      text: coop.nom,
      icon: "warning",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;

    fetch(`${API}/${coop.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setCoops(coops.filter(c => c.id !== coop.id));
        Swal.fire("Supprimé!", "La coopérative a été supprimée.", "success");
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Erreur", "Impossible de supprimer la coopérative.", "error");
      });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      nom: `Cooperative Agricole ${formData.gouvernorat}`,
      gouvernorat: formData.gouvernorat,
      telephone: formData.telephone,
      adresse: formData.adresse,
      responsable: null,
    };

    const method = isEditMode ? "PATCH" : "POST";
    const url = isEditMode ? `${API}/${selectedCoop.id}` : API;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (isEditMode) {
          setCoops(coops.map(c => c.id === data.id ? data : c));
          Swal.fire("Modifié!", "La coopérative a été modifiée avec succès.", "success");
        } else {
          setCoops([...coops, data]);
          Swal.fire("Ajouté!", "La coopérative a été ajoutée avec succès.", "success");
        }
        setShowForm(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Erreur", "Impossible d'enregistrer la coopérative.", "error");
      });
  };

  return (
    <div className="coop-container">
      <div className="coop-header">
        <h2>Coopératives Agricoles 🌱</h2>
        <button className="coop-add-btn" onClick={openAddForm}>+ Ajouter</button>
      </div>

      {error && <div className="coop-error">{error}</div>}

      <div className="coop-grid">
        {Array.isArray(coops) && coops.map(coop => (
          <div key={coop.id} className="coop-card">
            <div className="coop-avatar">
              <div className="coop-initials">{coop.nom?.charAt(0)}</div>
            </div>
            <div className="coop-info">
              <h3>{coop.nom}</h3>
              <p>Responsable: {coop.responsable || "Non effectif"}</p>
              <p>Gouvernorat: {coop.gouvernorat}</p>
              <p>Téléphone: {coop.telephone}</p>
              <p>Adresse: {coop.adresse}</p>
            </div>
            <div className="coop-menu-container">
              <button className="coop-menu-btn" onClick={() => toggleMenu(coop.id)}>⋮</button>
              {menuOpen === coop.id && (
                <div className="coop-menu-dropdown">
                  <button className="coop-menu-item" onClick={() => openEditForm(coop)}>Modifier</button>
                  <button className="coop-menu-item delete" onClick={() => handleDelete(coop)}>Supprimer</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="coop-modal-overlay">
          <div className="coop-modal">
            <h3>{isEditMode ? "Modifier Coop" : "Ajouter Coop"}</h3>
            <form onSubmit={handleSave}>
              <input
                name="gouvernorat"
                placeholder="Gouvernorat"
                value={formData.gouvernorat}
                onChange={handleChange}
                required
              />
              <input
                name="telephone"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleChange}
              />
              <input
                name="adresse"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
              <div className="coop-modal-actions">
                <button type="submit" className="coop-save-btn">{isEditMode ? "Sauvegarder" : "Ajouter"}</button>
                <button type="button" className="coop-cancel-btn" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
