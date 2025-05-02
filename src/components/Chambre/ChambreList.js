import React, { useEffect, useState } from 'react';
import { getChambres, deleteChambre, updateChambre, createChambre, getEtages } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChambreList.css';

function ChambreList() {
  const [chambres, setChambres] = useState([]); // Initialiser avec un tableau vide
  const [etages, setEtages] = useState([]); // Initialiser avec un tableau vide
  const [error, setError] = useState(null); // Gestion des erreurs
  const [newChambre, setNewChambre] = useState({ numero: '', type: '', etageId: '' }); // Nouvelle chambre
  const [selectedChambre, setSelectedChambre] = useState(null); // Chambre sélectionnée pour la modification
  const [filter, setFilter] = useState(''); // État pour le filtre

  // Fonction utilitaire pour récupérer le numéro de l'étage
  const getNumeroEtage = (etageId) => {
    return etageId && etageId.numero ? etageId.numero : 'Non attribué';
  };

  // Récupérer les chambres et les étages au chargement du composant
  useEffect(() => {
    fetchChambres();
    fetchEtages();
  }, []);

  // Fonction pour récupérer les chambres
  const fetchChambres = async () => {
    try {
      const response = await getChambres();
      console.log('Réponse de l\'API (chambres) :', response); // Afficher la réponse dans la console

      // Vérifier si la réponse contient un tableau de chambres
      if (response.data && Array.isArray(response.data)) {
        setChambres(response.data);
      } else {
        console.error('La réponse de l\'API n\'est pas un tableau :', response);
        setChambres([]); // Initialiser avec un tableau vide pour éviter les erreurs
      }
    } catch (error) {
      setError(error.message);
      toast.error('Erreur lors de la récupération des chambres.');
    }
  };

  // Fonction pour récupérer les étages
  const fetchEtages = async () => {
    try {
      const response = await getEtages();
      console.log('Réponse de l\'API (étages) :', response); // Afficher la réponse dans la console

      // Vérifier si la réponse est un tableau
      if (Array.isArray(response)) {
        setEtages(response); // Utiliser directement la réponse
      } else {
        console.error('La réponse de l\'API n\'est pas un tableau :', response);
        setEtages([]); // Initialiser avec un tableau vide pour éviter les erreurs
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des étages:", error);
      toast.error("Erreur lors de la récupération des étages.");
    }
  };

  // Supprimer une chambre
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?');
    if (!confirmDelete) return;

    try {
      await deleteChambre(id);
      setChambres(chambres.filter((chambre) => chambre._id !== id));
      toast.success('Chambre supprimée avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la chambre.');
    }
  };

  // Ajouter ou mettre à jour une chambre
  const handleSubmit = async () => {
    if (!newChambre.numero || !newChambre.type || !newChambre.etageId) {
      toast.warn('Tous les champs sont requis');
      return;
    }

    try {
      if (selectedChambre) {
        // Mettre à jour la chambre
        await updateChambre(selectedChambre._id, newChambre);
        toast.success('Chambre mise à jour avec succès !');
      } else {
        // Créer une nouvelle chambre
        await createChambre(newChambre);
        toast.success('Chambre ajoutée avec succès !');
      }
      setNewChambre({ numero: '', type: '', etageId: '' }); // Réinitialiser le formulaire
      setSelectedChambre(null); // Réinitialiser la sélection
      fetchChambres(); // Rafraîchir la liste des chambres
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la mise à jour de la chambre.");
    }
  };

  // Sélectionner une chambre pour la modification
  const handleSelectChambre = (chambre) => {
    setSelectedChambre(chambre);
    setNewChambre({ numero: chambre.numero, type: chambre.type, etageId: chambre.etageId ? chambre.etageId._id : '' });
  };

  // Fonction pour filtrer les chambres
  const filteredChambres = chambres.filter((chambre) => {
    const numeroMatch = chambre.numero.toString().includes(filter.toLowerCase());
    const typeMatch = chambre.type.toLowerCase().includes(filter.toLowerCase());
    const etageMatch = getNumeroEtage(chambre.etageId).toString().includes(filter.toLowerCase());
    return numeroMatch || typeMatch || etageMatch;
  });

  return (
    <div className="chambre-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Formulaire pour ajouter ou modifier une chambre */}
      <div className="chambre-form">
        <h2>{selectedChambre ? 'Modifier une chambre' : 'Ajouter une chambre'}</h2>
        <input
          type="number"
          placeholder="Numéro"
          value={newChambre.numero}
          onChange={(e) => setNewChambre({ ...newChambre, numero: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={newChambre.type}
          onChange={(e) => setNewChambre({ ...newChambre, type: e.target.value })}
        />
        <select
          value={newChambre.etageId}
          onChange={(e) => setNewChambre({ ...newChambre, etageId: e.target.value })}
        >
          <option value="">Sélectionner un étage</option>
          {Array.isArray(etages) && etages.map((etage) => (
            <option key={etage._id} value={etage._id}>
              {etage.numero} - {etage.description}
            </option>
          ))}
        </select>
        <button onClick={handleSubmit}>
          {selectedChambre ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {selectedChambre && (
          <button onClick={() => setSelectedChambre(null)}>Annuler</button>
        )}
      </div>

      {/* Champ de saisie pour le filtre */}
      <div className="filter-container">
        <h2>Filtrer les chambres</h2>
        <input
          type="text"
          placeholder="Rechercher par numéro, type ou étage"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Liste des chambres */}
      <div className="chambre-list">
        <h2>Liste des Chambres</h2>
        {Array.isArray(filteredChambres) && filteredChambres.length > 0 ? (
          <ul>
            {filteredChambres.map((chambre) => (
              <li key={chambre._id}>
                <p>
                  {chambre.numero} - {chambre.type} (Étage: {getNumeroEtage(chambre.etageId)})
                </p>
                <div>
                  <button onClick={() => handleSelectChambre(chambre)}>Modifier</button>
                  <button onClick={() => handleDelete(chambre._id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune chambre disponible.</p>
        )}
      </div>
    </div>
  );
}

export default ChambreList;