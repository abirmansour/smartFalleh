// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import "./ListAgriculteur.css";
// import agriculteurImg from "../../assets/agriculteur.png"
// export default function ListAgriculteur() {
//   const [agriculteurs, setAgriculteurs] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedAgri, setSelectedAgri] = useState(null);
//   const [newAgri, setNewAgri] = useState({
//     nom: "",
//     prenom: "",
//     email: "",
//     password: "Temp@123",
//     telephone: "",
//     adresse: "",
//   });

//   // 🔄 Charger les agriculteurs depuis le backend
//   useEffect(() => {
//     const fetchAgriculteurs = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:3000/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setAgriculteurs(data.filter((u) => u.role === "agriculteur"));
//     };
//     fetchAgriculteurs();
//   }, []);

//   // ➕ Ajouter un nouvel agriculteur
//   const handleAddAgriculteur = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch("http://localhost:3000/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...newAgri,
//           role: "agriculteur",
//         }),
//       });

//       if (!res.ok) throw new Error("Erreur création utilisateur");

//       Swal.fire({
//         icon: "success",
//         title: "✅ Succès",
//         text: `Agriculteur ajouté et email envoyé à ${newAgri.email}`,
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       setShowForm(false);
//       setNewAgri({
//         nom: "",
//         prenom: "",
//         email: "",
//         password: "Temp@123",
//         telephone: "",
//         adresse: "",
//       });

//       const updatedRes = await fetch("http://localhost:3000/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedData = await updatedRes.json();
//       setAgriculteurs(updatedData.filter((u) => u.role === "agriculteur"));
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         icon: "error",
//         title: "❌ Échec",
//         text: "Impossible d’ajouter l’agriculteur.",
//       });
//     }
//   };

//   // ✏️ Ouvrir modal de modification
//   const handleEdit = (agri) => {
//     setIsEditMode(true);
//     setSelectedAgri(agri);
//     setNewAgri({
//       nom: agri.nom,
//       prenom: agri.prenom,
//       email: agri.email,
//       telephone: agri.telephone,
//       adresse: agri.adresse,
//       password: "Temp@123",
//     });
//     setShowForm(true);
//   };

//   // 💾 Sauvegarder modification
//   const handleSaveEdit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`http://localhost:3000/users/${selectedAgri.uid}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newAgri),
//       });

//       if (!res.ok) throw new Error("Erreur modification utilisateur");

//       Swal.fire({
//         icon: "success",
//         title: "✅ Modifié avec succès !",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setShowForm(false);
//       setIsEditMode(false);
//       setSelectedAgri(null);

//       const updatedRes = await fetch("http://localhost:3000/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedData = await updatedRes.json();
//       setAgriculteurs(updatedData.filter((u) => u.role === "agriculteur"));
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         icon: "error",
//         title: "❌ Échec de la modification",
//       });
//     }
//   };

//   // 🗑️ Supprimer un agriculteur
//   const handleDelete = async (uid) => {
//     const confirmation = await Swal.fire({
//       title: "Êtes-vous sûr ?",
//       text: "Cette action est irréversible.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Oui, supprimer",
//       cancelButtonText: "Annuler",
//     });

//     if (!confirmation.isConfirmed) return;

//     const token = localStorage.getItem("token");

//     await fetch(`http://localhost:3000/users/${uid}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     Swal.fire({
//       icon: "success",
//       title: "🗑️ Supprimé !",
//       text: "L’agriculteur a été supprimé.",
//       timer: 1500,
//       showConfirmButton: false,
//     });

//     setAgriculteurs(agriculteurs.filter((a) => a.uid !== uid));
//   };

//   return (
//     <div className="list-agriculteur-container">
     
//       {/* ===== Section d'en-tête ===== */}
//       <div className="agricul-header-section">
//         <p className="breadcrumbAG">Maison | Agriculteurs</p>
//         <h1 className="main-titleAG">Nos Agriculteurs</h1>
//         <p className="subtitle">Gestion des Agriculteurs</p>
//       </div>
//        <div className="agri-header">
//         <button
//           className="add-btn-agri"
//           onClick={() => {
//             setIsEditMode(false);
//             setShowForm(true);
//           }}
//         >
//           + Ajouter Agriculteur
//         </button>
          
//         </div>

      
    

//       {/* 🧾 Liste des agriculteurs */}
//       <div className="list-agriculteur-cards">
//         {agriculteurs.map((agri) => (
//           <div key={agri.uid} className="list-agriculteur-card">
           

//             <div className="avatar-placeholder">
//             <img src={agriculteurImg} alt="Agriculteur" />
//             </div>

//             <h3>
//               {agri.nom} {agri.prenom}
//             </h3>
          

//             <div className="info-box">
//               <div className="info-row">
//                 <span>Email :</span>
//                 <strong className="email-text">{agri.email}</strong>
//               </div>
//               <div className="info-row">
//                 <span>Téléphone :</span>
//                 <strong>{agri.telephone || "Non renseigné"}</strong>
//               </div>
//               <div className="info-row">
//                 <span>Adresse :</span>
//                 <strong>{agri.adresse || "Non renseignée"}</strong>
//               </div>
//             </div>

//             <div className="action-buttons">
//               <button className="edit-btn" onClick={() => handleEdit(agri)}>
//                 Modifier
//               </button>
//               <button className="delete-btn" onClick={() => handleDelete(agri.uid)}>
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🧩 Modal Ajouter / Modifier */}
//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>{isEditMode ? "Modifier l'agriculteur" : "Ajouter un agriculteur"}</h3>
//             <form onSubmit={isEditMode ? handleSaveEdit : handleAddAgriculteur}>
//               <input
//                 type="text"
//                 placeholder="Nom"
//                 value={newAgri.nom}
//                 onChange={(e) => setNewAgri({ ...newAgri, nom: e.target.value })}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Prénom"
//                 value={newAgri.prenom}
//                 onChange={(e) => setNewAgri({ ...newAgri, prenom: e.target.value })}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={newAgri.email}
//                 onChange={(e) => setNewAgri({ ...newAgri, email: e.target.value })}
//                 required
//                 disabled={isEditMode}
//               />
//               {!isEditMode && (
//                 <input
//                   type="password"
//                   placeholder="Mot de passe (Temp@123 par défaut)"
//                   value={newAgri.password}
//                   onChange={(e) => setNewAgri({ ...newAgri, password: e.target.value })}
//                 />
//               )}
//               <input
//                 type="text"
//                 placeholder="Téléphone"
//                 value={newAgri.telephone}
//                 onChange={(e) => setNewAgri({ ...newAgri, telephone: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Adresse"
//                 value={newAgri.adresse}
//                 onChange={(e) => setNewAgri({ ...newAgri, adresse: e.target.value })}
//               />

//               <div className="modal-actions">
//                 <button type="submit">
//                   {isEditMode ? "Sauvegarder" : "Ajouter"}
//                 </button>
//                 <button
//                   type="button"
//                   className="cancel-btn"
//                   onClick={() => setShowForm(false)}
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./ListAgriculteurs.css";
import agriculteurImg from "../../assets/agriculteur.png";

export default function ListAgriculteur() {
  const [agriculteurs, setAgriculteurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAgri, setSelectedAgri] = useState(null);
  const [newAgri, setNewAgri] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "Temp@123",
    telephone: "",
    adresse: "",
  });

  // 🔄 Charger les agriculteurs depuis le backend
  useEffect(() => {
    const fetchAgriculteurs = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAgriculteurs(data.filter((u) => u.role === "agriculteur"));
    };
    fetchAgriculteurs();
  }, []);

  // ➕ Ajouter un nouvel agriculteur
  const handleAddAgriculteur = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newAgri,
          role: "agriculteur",
        }),
      });

      if (!res.ok) throw new Error("Erreur création utilisateur");

      Swal.fire({
        icon: "success",
        title: "✅ Succès",
        text: `Agriculteur ajouté et email envoyé à ${newAgri.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setShowForm(false);
      setNewAgri({
        nom: "",
        prenom: "",
        email: "",
        password: "Temp@123",
        telephone: "",
        adresse: "",
      });

      const updatedRes = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setAgriculteurs(updatedData.filter((u) => u.role === "agriculteur"));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "❌ Échec",
        text: "Impossible d’ajouter l’agriculteur.",
      });
    }
  };

  // ✏️ Ouvrir modal de modification
  const handleEdit = (agri) => {
    setIsEditMode(true);
    setSelectedAgri(agri);
    setNewAgri({
      nom: agri.nom,
      prenom: agri.prenom,
      email: agri.email,
      telephone: agri.telephone,
      adresse: agri.adresse,
      password: "Temp@123",
    });
    setShowForm(true);
  };

  // 💾 Sauvegarder modification
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/users/${selectedAgri.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAgri),
      });

      if (!res.ok) throw new Error("Erreur modification utilisateur");

      Swal.fire({
        icon: "success",
        title: "✅ Modifié avec succès !",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowForm(false);
      setIsEditMode(false);
      setSelectedAgri(null);

      const updatedRes = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setAgriculteurs(updatedData.filter((u) => u.role === "agriculteur"));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "❌ Échec de la modification",
      });
    }
  };

  // 🗑️ Supprimer un agriculteur
  const handleDelete = async (uid) => {
    const confirmation = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d4c2a",
      cancelButtonColor: "#ffd66b",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!confirmation.isConfirmed) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/users/${uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire({
      icon: "success",
      title: "🗑️ Supprimé !",
      text: "L’agriculteur a été supprimé.",
      timer: 1500,
      showConfirmButton: false,
    });

    setAgriculteurs(agriculteurs.filter((a) => a.uid !== uid));
  };

  return (
    <div className="list-agriculteur-container">
      {/* ===== Section d'en-tête ===== */}
      <div className="agricul-header-section">
        <p className="breadcrumbAG">Maison | Agriculteurs</p>
        <h1 className="main-titleAG">Nos Agriculteurs</h1>
        <p className="subtitle">Gestion des Agriculteurs</p>
      </div>

      <div className="agri-header">
        <button
          className="add-btn-agri"
          onClick={() => {
            setIsEditMode(false);
            setShowForm(true);
          }}
        >
          + Ajouter Agriculteur
        </button>
      </div>

      {/* 🧾 Liste des agriculteurs */}
      <div className="list-agriculteur-cards">
        {agriculteurs.map((agri) => (
          <div className="list-agriculteur-card">
  <div className="card-top">
    <div className="avatar-wrapper">
      <div className="avatar-circle">
        <img src={agriculteurImg} alt="Agriculteur" />
      </div>
    </div>
  </div>

  <div className="card-content">
    <h3>{agri.nom} {agri.prenom}</h3>
    <div className="info-box">
      <div className="info-row">
        <span>Email :</span>
        <strong className="email-text">{agri.email}</strong>
      </div>
      <div className="info-row">
        <span>Téléphone :</span>
        <strong>{agri.telephone}</strong>
      </div>
      <div className="info-row">
        <span>Adresse :</span>
        <strong>{agri.adresse}</strong>
      </div>
    </div>

    <div className="action-buttons">
    <button className="edit-btn" onClick={() => handleEdit(agri)}>
                Modifier
              </button>
              <button className="delete-btn" onClick={() => handleDelete(agri.uid)}>
                Supprimer
              </button>
    </div>
  </div>
</div>

        ))}
      </div>

      {/* 🧩 Modal Ajouter / Modifier */}
      {showForm && (
        <div className="modal-overlayAG">
  <div className="modalAG">
    <h3>{isEditMode ? "Modifier l'agriculteur" : "Ajouter un agriculteur"}</h3>
    <form
      className="styled-form"
      onSubmit={isEditMode ? handleSaveEdit : handleAddAgriculteur}
    >
      <div className="form-groupAG">
        <label>Nom</label>
        <input
          type="text"
          value={newAgri.nom}
          onChange={(e) => setNewAgri({ ...newAgri, nom: e.target.value })}
          required
        />
      </div>

      <div className="form-groupAG">
        <label>Prénom</label>
        <input
          type="text"
          value={newAgri.prenom}
          onChange={(e) => setNewAgri({ ...newAgri, prenom: e.target.value })}
          required
        />
      </div>

      <div className="form-groupAG">
        <label>Email</label>
        <input
          type="email"
          value={newAgri.email}
          onChange={(e) => setNewAgri({ ...newAgri, email: e.target.value })}
          required
          disabled={isEditMode}
        />
      </div>

      {!isEditMode && (
        <div className="form-groupAG">
          <label>Mot de passe (par défaut Temp@123)</label>
          <input
            type="password"
            value={newAgri.password}
            onChange={(e) => setNewAgri({ ...newAgri, password: e.target.value })}
          />
        </div>
      )}

      <div className="form-groupAG">
        <label>Téléphone</label>
        <input
          type="text"
          value={newAgri.telephone}
          onChange={(e) => setNewAgri({ ...newAgri, telephone: e.target.value })}
        />
      </div>

      <div className="form-groupAG">
        <label>Adresse</label>
        <input
          type="text"
          value={newAgri.adresse}
          onChange={(e) => setNewAgri({ ...newAgri, adresse: e.target.value })}
        />
      </div>

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
  );
}
