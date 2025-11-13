import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./JuryListPage.css";

export default function JuryList() {
  const [jurys, setJurys] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJury, setSelectedJury] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });
   const openAddForm = () => {
    setIsEditMode(false);
    setSelectedJury(null);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      goujou: "",
      password: "Temp@123",
      role: "jury",
    });
    setShowForm(true);
    setMenuOpen(null);
  };
  // Fetch jurys
  useEffect(() => {
    const fetchJurys = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setJurys(data.filter(u => u.role === "jury"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchJurys();
  }, []);

  const toggleMenu = (uid) => {
    setMenuOpen(menuOpen === uid ? null : uid);
  };

  const openEditForm = (jury) => {
    setIsEditMode(true);
    setSelectedJury(jury);
    setFormData({
      nom: jury.nom,
      prenom: jury.prenom,
      email: jury.email,
      telephone: jury.telephone || "",
      adresse: jury.adresse || "",
    });
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = async (jury) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous supprimer ${jury.nom} ${jury.prenom} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d4c2a",
      cancelButtonColor: "#ffd66b",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/users/${jury.uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setJurys(jurys.filter(j => j.uid !== jury.uid));
      Swal.fire("Supprimé!", "Le jury a été supprimé.", "success");
    }
    setMenuOpen(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const url = isEditMode
      ? `http://localhost:3000/users/${selectedJury.uid}`
      : "http://localhost:3000/users";

    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Erreur d’enregistrement");
    const saved = await res.json();

    if (isEditMode) {
      setJurys((prev) =>
        prev.map((j) => (j.uid === selectedJury.uid ? { ...j, ...formData } : j))
      );
      Swal.fire("Succès", "Jury modifié avec succès !", "success");
    } else {
      setJurys((prev) => [...prev, saved]);
      Swal.fire("Succès", "Jury ajouté avec succès !", "success");
    }

    setShowForm(false);
    setIsEditMode(false);
    setSelectedJury(null);
  } catch (err) {
    console.error(err);
    Swal.fire("Erreur", "Impossible d’enregistrer le jury", "error");
  }
};


  return (
    <div className="jury-container">
        {/* ===== Section d'en-tête ===== */}
      <div className="agricul-header-section">
        <p className="breadcrumbAG">Maison | Jurys</p>
        <h1 className="main-titleAG">Nos Jurys</h1>
        <p className="subtitle">Gestion des Jurys</p>
      </div>
       <div className="agri-header">
          <button
  className="add-btn-agri"
  onClick={openAddForm}
>
  + Ajouter Jury
</button>


          
        </div>


      <div className="jury-grid">
        {jurys.map(jury => (
          <div key={jury.uid} className="jury-card">
            <div className="jury-avatar">
              <div className="jury-initials">{jury.nom?.charAt(0)}</div>
            </div>

            <div className="jury-info">
              <div className="name-row">
                <span className="nom">{jury.nom}</span>
                <span className="prenom">{jury.prenom}</span>
              </div>
              <p className="jury-email">{jury.email}</p>
              <p className="jury-tel">{jury.telephone}</p>
              <p className="jury-adr">{jury.adresse}</p>
            </div>

            <div className="menu-container">
              <button className="menu-btn" onClick={() => toggleMenu(jury.uid)}>⋮</button>
              {menuOpen === jury.uid && (
                <div className="menu-dropdown">
                  <button className="menu-item" onClick={() => openEditForm(jury)}>Modifier</button>
                  <button className="menu-item delete" onClick={() => handleDelete(jury)}>Supprimer</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditMode ? "Modifier le jury" : "Ajouter un jury"}</h3>
            <form onSubmit={handleSave} className="modal-formJ">
              <div className="form-row">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  required
  disabled={isEditMode}
/>

              <input
                type="text"
                name="telephone"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="adresse"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit" className="save-btn">Sauvegarder</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
