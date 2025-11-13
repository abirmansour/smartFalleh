import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./UpdateProfile.css";

const UpdateProfileModal = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    telephone: user.telephone || "",
    adresse: user.adresse || "",
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `http://localhost:3000/users/${userId}/profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Swal pour succès
      Swal.fire({
        title: "Profil mis à jour !",
        text: "Vos informations ont été enregistrées avec succès.",
        icon: "success",
        confirmButtonColor: "#28a745",
        confirmButtonText: "OK",
      });

      onUpdate(res.data);
      onClose(); // يغلق المودال بعد التحديث
    } catch (err) {
      console.error("❌ erreur:", err.response?.data || err);
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur est survenue lors de la mise à jour du profil.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Réessayer",
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Modifier le profil</h3>
        <form onSubmit={handleSubmit}>
          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" />

          <label>Prénom</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />

          <label>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />

          <label>Adresse</label>
          <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="Adresse" />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">Enregistrer</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
