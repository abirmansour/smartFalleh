import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Chip,
    Modal,
    Backdrop,
    Fade,
    IconButton,
    TextField,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button
} from '@mui/material';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import './listeAgriculteursJury.css';

const ListAgriculteursJury = () => {
    const [agriculteurs, setAgriculteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAgriculteur, setSelectedAgriculteur] = useState(null);
    const [demande, setDemande] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [validationModalOpen, setValidationModalOpen] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    const [validationData, setValidationData] = useState({
        nom: '',
        prenom: '',
        referenceVache: '',
        nombreVaches: '',
        notes: '',
        eligible: 'non',
        touched: {}
    });

    useEffect(() => {
        const fetchAgriculteurs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Filter users to only include those with role 'agriculteur'
                const agriculteurs = response.data.filter(user => user.role === 'agriculteur');
                setAgriculteurs(agriculteurs);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching agriculteurs:', err);
                setError('Erreur lors du chargement des agriculteurs');
                setLoading(false);
            }
        };

        fetchAgriculteurs();
    }, []);

    const handleViewDetails = async (agriculteur) => {
        setSelectedAgriculteur(agriculteur);
        setOpenModal(true);

        console.log('Fetching demand for email:', agriculteur.email);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/demandes/email/${encodeURIComponent(agriculteur.email)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            console.log('Demand response:', response.data);

            if (response.data) {
                setDemande({
                    ...response.data,
                    // Ensure we have fallback values for all required fields
                    email: response.data.email || agriculteur.email,
                    telephone: response.data.telephone || agriculteur.telephone,
                    adresse: response.data.adresse || agriculteur.adresse,
                    nom: response.data.nom || agriculteur.nom,
                    prenom: response.data.prenom || agriculteur.prenom
                });
            } else {
                console.warn('No demande data found for email:', agriculteur.email);
                setDemande(null);
            }
        } catch (error) {
            console.error('Error fetching demande:', error);
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', error.response.data);
            }
            setDemande(null);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAgriculteur(null);
        setDemande(null);
    };

    const handleOpenValidation = async (agriculteur) => {
        try {
            setSelectedAgriculteur(agriculteur);
            setIsValidating(true);
            
            // Fetch demande data if not already loaded
            if (!demande || demande.email !== agriculteur.email) {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/demandes/email/${encodeURIComponent(agriculteur.email)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
                setDemande(response.data);
            }
            
            setValidationData({
                ...validationData,
                nom: agriculteur.nom || '',
                prenom: agriculteur.prenom || '',
                referenceVache: '',
                nombreVaches: '',
                notes: '',
                eligible: 'non'
            });
            
            setValidationModalOpen(true);
        } catch (error) {
            console.error('Error loading demande:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de charger les détails de la demande',
            });
        } finally {
            setIsValidating(false);
        }
    };

    const handleValidationSubmit = async () => {
        console.log('Validation button clicked');
        console.log('Selected agriculteur:', selectedAgriculteur);
        console.log('Current demande:', demande);

        if (!selectedAgriculteur || !demande?.uid) {
            console.error('Missing selectedAgriculteur or demande.uid');
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de valider: informations manquantes',
            });
            return;
        }

        // Mark all fields as touched to show validation errors
        setValidationData(prev => ({
            ...prev,
            touched: {
                referenceVache: true,
                nombreVaches: true,
                eligible: true,
                ...prev.touched
            }
        }));

        // Check if any required fields are empty
        if (!validationData.referenceVache || 
            !validationData.nombreVaches ) {
            return; // Validation will be shown by the fields themselves
        }

        // Validate nombreVaches is a positive number
        const nombreVaches = parseInt(validationData.nombreVaches, 10);
        if (isNaN(nombreVaches) || nombreVaches <= 0) {
            return; // Field validation will show the error
        }

        try {
            const token = localStorage.getItem('token');
            console.log('Sending update request...');
            const response = await axios.put(
                `http://localhost:3000/demandes/${demande.uid}`,
                {
                    referenceVache: validationData.referenceVache.trim(),
                    validateNombreVaches: nombreVaches,
                    notes: validationData.notes?.trim() || '',
                    eligible: validationData.eligible === 'oui',
                    statut: 'Validé',
                    validatedAt: new Date().toISOString(),
                    validatedBy: 'jury'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Update response:', response.data);
            
            // Close the modal first
            setValidationModalOpen(false);

            // Just close the modal on success

            await Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'La validation a été enregistrée avec succès.',
                confirmButtonColor: '#3085d6',
            });
            // Refresh the demandes data
            const demandeResponse = await axios.get(
                `http://localhost:3000/demandes/email/${encodeURIComponent(selectedAgriculteur.email)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (demandeResponse.data) {
                setDemande({
                    ...demandeResponse.data,
                    email: selectedAgriculteur.email,
                    telephone: selectedAgriculteur.telephone,
                    adresse: selectedAgriculteur.adresse,
                    nom: selectedAgriculteur.nom,
                    prenom: selectedAgriculteur.prenom
                });
            }

        } catch (error) {
            console.error('Error updating demande:', error);
            let errorMessage = 'Une erreur est survenue lors de la validation.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: errorMessage,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValidationData(prev => ({
            ...prev,
            [name]: value,
            touched: {
                ...prev.touched,
                [name]: true
            }
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="error-message">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <div className="liste-agriculteurs">
            <Typography variant="h4" gutterBottom>
                Liste des Agriculteurs
            </Typography>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow key="header">
                            <TableCell key="index">#</TableCell>
                            <TableCell key="photo">Photo</TableCell>
                            <TableCell key="name">Nom Complet</TableCell>
                            <TableCell key="email">Email</TableCell>
                            <TableCell key="phone">Téléphone</TableCell>
                            <TableCell key="address">Adresse</TableCell>
                            <TableCell key="status">Statut</TableCell>
                            <TableCell key="date">Date d'inscription</TableCell>
                            <TableCell key="actions">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agriculteurs.map((agriculteur, index) => {
                            const rowKey = agriculteur._id || `row-${index}`;
                            return (
                                <TableRow key={rowKey} hover>
                                    <TableCell key={`${rowKey}-index`}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell key="photo" sx={{ p: 1 }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {`${agriculteur.prenom?.charAt(0) || ''}${agriculteur.nom?.charAt(0) || ''}`.toUpperCase()}
                                        </Box>
                                    </TableCell>
                                    <TableCell key={`${rowKey}-name`}>
                                        {`${agriculteur.prenom} ${agriculteur.nom}`}
                                    </TableCell>
                                    <TableCell key={`${rowKey}-email`}>
                                        {agriculteur.email}
                                    </TableCell>
                                    <TableCell key={`${rowKey}-phone`}>
                                        {agriculteur.telephone || 'Non spécifié'}
                                    </TableCell>
                                    <TableCell key={`${rowKey}-address`}>
                                        {agriculteur.adresse || 'Non spécifiée'}
                                    </TableCell>
                                    <TableCell key={`${rowKey}-status`}>
                                        <Chip
                                            label={agriculteur.statut || 'En attente'}
                                            color={
                                                agriculteur.statut === 'actif' ? 'success' :
                                                    agriculteur.statut === 'en_attente' ? 'warning' : 'default'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell key={`${rowKey}-date`}>
                                        {new Date(agriculteur.createdAt).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell key={`${rowKey}-actions`}>
                                        <Box display="flex" gap={1}>
                                            <IconButton
                                                key={`${rowKey}-view`}
                                                color="primary"
                                                onClick={() => handleViewDetails(agriculteur)}
                                                title="Voir les détails"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                key={`${rowKey}-docs`}
                                                color="secondary"
                                                onClick={() => handleOpenValidation(agriculteur)}
                                                title="Valider les documents"
                                            >
                                                <DescriptionIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {agriculteurs.length === 0 && (
                <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                        Aucun agriculteur trouvé
                    </Typography>
                </Box>
            )}

            {/* Validation Modal */}
            <Modal
                open={validationModalOpen}
                onClose={() => setValidationModalOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={validationModalOpen}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6">Validation des Documents</Typography>
                            <IconButton onClick={() => setValidationModalOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    name="nom"
                                    value={validationData.nom}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Prénom"
                                    name="prenom"
                                    value={validationData.prenom}
                                    disabled
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Référence vache"
                                name="referenceVache"
                                value={validationData.referenceVache}
                                onChange={handleInputChange}
                                required
                                error={!validationData.referenceVache && !!validationData.touched?.referenceVache}
                                helperText={!validationData.referenceVache && validationData.touched?.referenceVache ? 'Ce champ est requis' : ''}
                                onBlur={() => setValidationData(prev => ({
                                    ...prev,
                                    touched: { ...prev.touched, referenceVache: true }
                                }))}
                            />

                            <TextField
                                fullWidth
                                type="number"
                                label="Nombre de vaches sur le terrain"
                                name="nombreVaches"
                                value={validationData.nombreVaches}
                                onChange={handleInputChange}
                                inputProps={{ min: 1 }}
                                required
                                error={(!validationData.nombreVaches || parseInt(validationData.nombreVaches) <= 0) && validationData.touched?.nombreVaches}
                                helperText={
                                    validationData.touched?.nombreVaches && 
                                    (!validationData.nombreVaches 
                                        ? 'Ce champ est requis' 
                                        : parseInt(validationData.nombreVaches) <= 0 
                                            ? 'Le nombre doit être supérieur à zéro' 
                                            : '')
                                }
                                onBlur={() => setValidationData(prev => ({
                                    ...prev,
                                    touched: { ...prev.touched, nombreVaches: true }
                                }))}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Notes"
                                name="notes"
                                value={validationData.notes}
                                onChange={handleInputChange}
                            />

                            <Box>
                                <FormLabel component="legend">Éligible *</FormLabel>
                                <RadioGroup
                                    row
                                    name="eligible"
                                    value={validationData.eligible}
                                    onChange={handleInputChange}
                                    onBlur={() => setValidationData(prev => ({
                                        ...prev,
                                        touched: { ...prev.touched, eligible: true }
                                    }))}
                                >
                                    <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                                    <FormControlLabel value="non" control={<Radio />} label="Non" />
                                </RadioGroup>
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setValidationModalOpen(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleValidationSubmit}
                                    disabled={isValidating || !demande?.uid}
                                >
                                    {isValidating ? 'Chargement...' : 'Valider'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Modal for Agriculteur Details */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    className: 'modal-backdrop'
                }}
            >
                <Fade in={openModal}>
                    <Box className="agriculteur-modal">
                        <Box className="modal-header">
                            <Typography variant="h6" component="h2">
                                Détails de l'Agriculteur
                            </Typography>
                            <IconButton onClick={handleCloseModal} size="small" className="modal-close-button">
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {selectedAgriculteur && (
                            <Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '2rem',
                                            mr: 2
                                        }}
                                    >
                                        {`${selectedAgriculteur.prenom?.charAt(0) || ''}${selectedAgriculteur.nom?.charAt(0) || ''}`.toUpperCase()}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" component="div">
                                            {`${selectedAgriculteur.prenom} ${selectedAgriculteur.nom}`}
                                        </Typography>
                                        <Chip
                                            label={selectedAgriculteur.statut || 'En attente'}
                                            color={
                                                selectedAgriculteur.statut === 'actif' ? 'success' :
                                                    selectedAgriculteur.statut === 'en_attente' ? 'warning' : 'default'
                                            }
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                    {/* First Column */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                                            Informations Personnelles
                                        </Typography>
                                        <Box className="agriculteur-2">
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Email:</strong> {demande?.email || 'Non spécifié'}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Téléphone:</strong> {demande?.telephone || 'Non spécifié'}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Adresse:</strong> {demande?.adresse || 'Non spécifié'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Second Column */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                                            Détails de la Demande
                                        </Typography>
                                        {demande ? (
                                            <Box className="agriculteur-2">
                                                <Typography variant="subtitle1" gutterBottom>
                                                    <strong>Superficie:</strong> {demande.superficieFerme ? `${demande.superficieFerme} hectares` : 'Non spécifiée'}
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    <strong>Nombre de vaches:</strong> {demande.nombreVaches || 'Non spécifié'}
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    <strong>Région:</strong> {demande.region || selectedAgriculteur.region || 'Non spécifiée'}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                Aucune demande trouvée pour cet agriculteur.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );

};

export default ListAgriculteursJury;