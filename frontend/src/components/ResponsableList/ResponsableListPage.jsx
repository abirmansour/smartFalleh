import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./ResponsableListPage.css";

export default function ResponsableListPage() {
  const [responsables, setResponsables] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedResp, setSelectedResp] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "Temp@123",
    cooperativeId: "",
    role: "responsable",
  });

  const token = localStorage.getItem("token");

  // --- جلب البيانات ---
  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResponsables(data.filter((u) => u.role === "responsable"));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCoops = async () => {
      try {
        const res = await fetch("http://localhost:3000/cooperatives", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCooperatives(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResponsables();
    fetchCoops();
  }, [token]);

  const toggleMenu = (uid) => setMenuOpen(menuOpen === uid ? null : uid);

  const openAddForm = () => {
    setIsEditMode(false);
    setSelectedResp(null);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      password: "Temp@123",
      cooperativeId: "",
      role: "responsable",
    });
    setShowForm(true);
    setMenuOpen(null);
  };

  const openEditForm = (resp) => {
    setIsEditMode(true);
    setSelectedResp(resp);
    setFormData({
      nom: resp.nom,
      prenom: resp.prenom,
      email: resp.email,
      password: "Temp@123",
      cooperativeId: resp.cooperative?.uid || "",
      role: "responsable",
    });
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = async (resp) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous supprimer ${resp.nom} ${resp.prenom} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d4c2a",
      cancelButtonColor: "#ffd66b",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      await fetch(`http://localhost:3000/users/${resp.uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponsables(responsables.filter((r) => r.uid !== resp.uid));
      Swal.fire("Supprimé!", "Le responsable a été supprimé.", "success");
    }
    setMenuOpen(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode
        ? `http://localhost:3000/users/${selectedResp.uid}`
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

      if (!res.ok) throw new Error("Erreur sauvegarde");

      const data = await res.json();

      if (isEditMode) {
        setResponsables(
          responsables.map((r) => (r.uid === data.uid ? data : r))
        );
        Swal.fire("Modifié!", "Le responsable a été modifié.", "success");
      } else {
        setResponsables([...responsables, data]);
        Swal.fire("Ajouté!", "Le responsable a été ajouté.", "success");
      }

      setShowForm(false);
      setIsEditMode(false);
      setSelectedResp(null);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Erreur",
        "Impossible d'ajouter/modifier le responsable",
        "error"
      );
    }
  };

  return (
    
    
      <div className="resp-container">
        <div>
           <div className="resp-header-section">
        <p className="breadcrumb">Maison | Responsables</p>
        <h1 className="main-title">Nos Responsables</h1>
        <p className="subtitle">Gestion des Responsables</p>
      </div>
        <div className="resp-header">
       
          <button className="resp-add-btn" onClick={openAddForm}>
            + Ajouter Responsable
          </button>
        </div>

        <div className="resp-grid">
        {responsables.map(resp => (
          <div key={resp.uid} className="resp-card">
            <div className="resp-avatar">
              <div className="resp-initials">{resp.nom?.charAt(0)}</div>
            </div>

            <div className="resp-info">
              <div className="name-row">
                <span className="nom">{resp.nom}</span>
                <span className="prenom">{resp.prenom}</span>
              </div>
              <p className="resp-email">{resp.email}</p>
              <p className="resp-tel">{resp.telephone}</p>
              <p className="resp-adr">{resp.adresse}</p>
            </div>

            <div className="menu-container">
              <button className="menu-btn" onClick={() => toggleMenu(resp.uid)}>⋮</button>
              {menuOpen === resp.uid && (
                <div className="menu-dropdown">
                  <button className="menu-item" onClick={() => openEditForm(resp)}>Modifier</button>
                  <button className="menu-item delete" onClick={() => handleDelete(resp)}>Supprimer</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>
                {isEditMode ? "Modifier Responsable" : "Ajouter Responsable"}
              </h3>
              <form onSubmit={handleSave}>
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
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                />

                <select
                  name="cooperativeId"
                  value={formData.cooperativeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner Cooperative</option>
                  {cooperatives.map((c) => (
                    <option key={c.uid} value={c.uid}>
                      {c.nom}
                    </option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {isEditMode ? "Sauvegarder" : "Ajouter"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
