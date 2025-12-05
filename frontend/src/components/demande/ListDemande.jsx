import React, { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import "./ListDemande.css";

export default function ListDemande() {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
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
        const data = await res.json();
        setDemandes(data);
        setFilteredDemandes(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching demandes:", err);
        setError("Erreur lors du chargement des demandes");
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [token]);

  const handleValidate = async (demande) => {
  const result = await Swal.fire({
    title: 'Confirmer la validation',
    text: `Voulez-vous vraiment valider la demande de ${demande.prenom} ${demande.nom} ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, valider',
    cancelButtonText: 'Annuler',
  });

  if (result.isConfirmed) {
    try {
      // 1. Create user from demande
      const userData = {
        nom: demande.nom,
        prenom: demande.prenom,
        email: demande.email,
        telephone: demande.telephone,
        adresse: demande.adresse,
        region: demande.region,
        superficieFerme: demande.superficieFerme,
        nombreVaches: demande.nombreVaches,
        role: demande.role.toLowerCase(),
        // Add required fields that might be missing
        password: 'Default@123', // Temporary password, user should change it
        etat: 'active'
      };

      console.log('Creating user with data:', userData); // Debug log

      // 2. Create user in the database
      const response = await axios.post('http://localhost:3000/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('User created:', response.data); // Debug log

      // 3. Update UI - remove the validated demand
      setDemandes(prev => prev.filter(d => d.id !== demande.id));
      setFilteredDemandes(prev => prev.filter(d => d.id !== demande.id));

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'L\'utilisateur a été créé avec succès.',
      });

    } catch (error) {
      console.error('Error validating demande:', error);
      let errorMessage = 'Une erreur est survenue lors de la validation de la demande.';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez vérifier les logs du serveur.';
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        html: `
          <div>
            <p>${errorMessage}</p>
          </div>
        `,
      });
    }
  }
}; // end of ahndle validate

const handleReject = async (demande) => {
  const result = await Swal.fire({
    title: 'Confirmer le rejet',
    text: `Voulez-vous vraiment rejeter la demande de ${demande.prenom} ${demande.nom} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, rejeter',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc3545',
  });

  if (result.isConfirmed) {
    try {
      // Just remove from UI since we don't have a delete endpoint
      setDemandes(prev => prev.filter(d => d.id !== demande.id));
      setFilteredDemandes(prev => prev.filter(d => d.id !== demande.id));

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'La demande a été rejetée avec succès.',
      });

    } catch (error) {
      console.error('Error rejecting demande:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors du rejet de la demande.',
      });
    }
  }
};

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

  if (loading) {
    return <div className="loading">Chargement des demandes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="listdemande-container">
      <h2>Liste des Demandes d'Inscription</h2>
      {/* Add filter and reset buttons */}
    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      <button 
        onClick={handleFilter} 
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Filtrer (vaches &gt; 20)
      </button>
      <button 
        onClick={handleReset} 
        style={{
          padding: '8px 16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Réinitialiser
      </button>
    </div>
      {filteredDemandes.length === 0 ? (
        <p>Aucune demande trouvée.</p>
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
              <div className="listdemande-actions">
                <button 
                  className="validate-btn"
                  onClick={() => handleValidate(demande)}
                >
                  Valider
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(demande)}
                >
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}