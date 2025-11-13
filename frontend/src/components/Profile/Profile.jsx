import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateProfileModal from "./updateProfile";
import "./ProfilePage.css";
import userImg from "../../assets/user.png"
const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      axios
        .get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userId, token]);

  if (!user) return <p className="loading">Chargement...</p>;

  return (
    <div className="profile-container">
      <div className="cover-section">
       
      </div>

      <div className="profile-header">
        <div className="avatar-box">
          <img
            src={userImg} 
            alt="avatar"
          />
         
        </div>

        <div className="info-header">
          <h2>{user.nom} {user.prenom}</h2>
          <p className="role">{user.role || "UI/UX Designer @Spotify"}</p>
          <p className="location">📍 {user.adresse || "Sylhet, Bangladesh"}</p>
        </div>
      </div>

      <div className="profile-details">
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Téléphone:</strong> {user.telephone || "—"}</div>
        <div><strong>Adresse:</strong> {user.adresse || "—"}</div>
        <div><strong>État:</strong> {user.etat}</div>
      </div>

      <button className="update-btn" onClick={() => setShowModal(true)}>
        Modifier le profil
      </button>

      {showModal && (
        <UpdateProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
};

export default Profile;
