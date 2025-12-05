import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const Rapports = () => {
  const navigate = useNavigate();
  const [cooperative, setCooperative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCooperativeData = async () => {
      try {
        // Get the current user's token and ID
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        
        if (!token || !userId) {
          // Clear any invalid auth data
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          // Redirect to login
          navigate('/login');
          return;
        }
        
        console.log('Fetching responsable data for user ID:', userId);
        
        // Fetch user data using the correct endpoint structure
        console.log('Fetching user data for UID:', userId);
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(err => {
          console.error('Error fetching user data:', {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            config: {
              url: err.config?.url,
              method: err.config?.method,
              headers: err.config?.headers
            }
          });
          throw new Error('Erreur lors de la récupération des données utilisateur');
        });

        if (!response.data) {
          throw new Error('Aucune donnée utilisateur trouvée');
        }

        const responsable = response.data;
        console.log('User data response:', response);
        console.log('Responsable data:', responsable);
        
        // First, try to find the cooperative by responsable's email
        console.log('Searching for cooperative by responsable email...');
        const coopResponse = await axios.get('http://localhost:3000/cooperatives', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(response => {
          // Find cooperative where responsable matches the current user's email
          const coop = response.data.find(c => c.responsable === responsable.email);
          if (!coop) {
            throw new Error('Aucune coopérative trouvée pour ce responsable');
          }
          return { data: coop };
        }).catch(err => {
          console.error('Error finding cooperative:', err);
          throw new Error('Erreur lors de la recherche de la coopérative');
        });

        const cooperativeUid = coopResponse.data.id;
        console.log('Found cooperative:', coopResponse.data);
        
        // Fetch agriculteurs for the cooperative
        console.log('Fetching agriculteurs data...');
        const agriculteursResponse = await axios.get(`http://localhost:3000/agriculteurs/cooperative/${cooperativeUid}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(err => {
          console.error('Error fetching agriculteurs:', err);
          // Continue with empty array if agriculteurs can't be fetched
          return { data: [] };
        });
        
        console.log('Cooperative data:', coopResponse.data);
        console.log('Agriculteurs data:', agriculteursResponse.data);
        
        // Process the data
        const cooperativeData = {
          ...coopResponse.data,
          agriculteurs: agriculteursResponse.data
        };
        
        setCooperative(cooperativeData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
        setLoading(false);
      }
    };

    fetchCooperativeData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6" gutterBottom>
          Erreur
        </Typography>
        <Typography color="error" paragraph>
          {error}
        </Typography>
        <Typography>
          Si le problème persiste, veuillez vous reconnecter ou contacter un administrateur.
        </Typography>
      </Box>
    );
  }

  if (!cooperative) {
    return (
      <Box p={3}>
        <Typography>Aucune donnée disponible pour le moment.</Typography>
      </Box>
    );
  }

  // Calculate total needs across all agriculteurs
  const totalNeeds = cooperative.agriculteurs.reduce((acc, agriculteur) => {
    return acc + (agriculteur.needs?.length || 0);
  }, 0);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord - {cooperative.nom}
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Nombre d'Agriculteurs
              </Typography>
              <Typography variant="h4">
                {cooperative.agriculteurs?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total des Besoins
              </Typography>
              <Typography variant="h4">
                {totalNeeds}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Date de Mise à Jour
              </Typography>
              <Typography variant="body1">
                {new Date().toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Table */}
      <Typography variant="h6" gutterBottom>
        Détail des Agriculteurs et leurs Besoins
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de l'Agriculteur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Besoins</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Date de Demande</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cooperative.agriculteurs?.map((agriculteur) => (
              <React.Fragment key={agriculteur._id}>
                {agriculteur.needs?.length > 0 ? (
                  agriculteur.needs.map((need, index) => (
                    <TableRow key={`${agriculteur._id}-${index}`}>
                      {index === 0 && (
                        <>
                          <TableCell rowSpan={agriculteur.needs.length}>
                            {agriculteur.name}
                          </TableCell>
                          <TableCell rowSpan={agriculteur.needs.length}>
                            {agriculteur.email}
                          </TableCell>
                          <TableCell rowSpan={agriculteur.needs.length}>
                            {agriculteur.phone || 'Non renseigné'}
                          </TableCell>
                        </>
                      )}
                      <TableCell>{need.name}</TableCell>
                      <TableCell>{need.quantity} {need.unit || 'unité(s)'}</TableCell>
                      <TableCell>
                        {new Date(need.requestedDate || new Date()).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>{agriculteur.name}</TableCell>
                    <TableCell>{agriculteur.email}</TableCell>
                    <TableCell>{agriculteur.phone || 'Non renseigné'}</TableCell>
                    <TableCell colSpan={3} align="center">
                      Aucun besoin enregistré
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            {cooperative.agriculteurs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun agriculteur trouvé dans cette coopérative
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Rapports;