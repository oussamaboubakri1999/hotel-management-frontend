import React, { useEffect, useState } from 'react';
import { getDepartements, deleteDepartement, createDepartement, updateDepartement } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DepartementList.css';

function DepartementList() {
  const [departements, setDepartements] = useState([]); // Liste des départements
  const [newDepartement, setNewDepartement] = useState({ nom: '', description: '' }); // Nouveau département
  const [selectedDepartement, setSelectedDepartement] = useState(null); // Département sélectionné pour la modification
  const [filter, setFilter] = useState(''); // État pour le filtre

  // Récupérer les départements au chargement du composant
  useEffect(() => {
    fetchDepartements();
  }, []);

  // Fonction pour récupérer les départements
  const fetchDepartements = async () => {
    try {
      const response = await getDepartements();
      console.log('Réponse de l\'API (départements) :', response); // Afficher la réponse dans la console

      // Vérifier si la réponse est un tableau
      if (Array.isArray(response)) {
        setDepartements(response); // Utiliser directement la réponse
      } else {
        console.error('La réponse de l\'API n\'est pas un tableau :', response);
        setDepartements([]); // Initialiser avec un tableau vide pour éviter les erreurs
      }
    } catch (error) {
      toast.error('Erreur lors de la récupération des départements.');
    }
  };

  // Supprimer un département
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?');
    if (!confirmDelete) return;

    try {
      await deleteDepartement(id);
      setDepartements(departements.filter((departement) => departement._id !== id));
      toast.success('Département supprimé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la suppression du département.');
    }
  };

  // Ajouter ou mettre à jour un département
  const handleSubmit = async () => {
    if (!newDepartement.nom || !newDepartement.description) {
      toast.warn('Tous les champs sont requis');
      return;
    }

    try {
      if (selectedDepartement) {
        // Mettre à jour le département
        await updateDepartement(selectedDepartement._id, newDepartement);
        toast.success('Département mis à jour avec succès !');
      } else {
        // Créer un nouveau département
        await createDepartement(newDepartement);
        toast.success('Département ajouté avec succès !');
      }
      setNewDepartement({ nom: '', description: '' }); // Réinitialiser le formulaire
      setSelectedDepartement(null); // Réinitialiser la sélection
      fetchDepartements(); // Rafraîchir la liste des départements
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la mise à jour du département.");
    }
  };

  // Sélectionner un département pour la modification
  const handleSelectDepartement = (departement) => {
    setSelectedDepartement(departement);
    setNewDepartement({ nom: departement.nom, description: departement.description });
  };

  // Fonction pour filtrer les départements
  const filteredDepartements = departements.filter((departement) => {
    return (
      departement.nom.toLowerCase().includes(filter.toLowerCase()) || // Filtre par nom
      departement.description.toLowerCase().includes(filter.toLowerCase()) // Filtre par description
    );
  });

  return (
    <div className="departement-container container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Formulaire pour ajouter ou modifier un département */}
      <div className="departement-form">
        <h2>{selectedDepartement ? 'Modifier un département' : 'Ajouter un département'}</h2>
        <input
          type="text"
          placeholder="Nom"
          value={newDepartement.nom}
          onChange={(e) => setNewDepartement({ ...newDepartement, nom: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDepartement.description}
          onChange={(e) => setNewDepartement({ ...newDepartement, description: e.target.value })}
        />
        <button onClick={handleSubmit}>
          {selectedDepartement ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {selectedDepartement && (
          <button onClick={() => setSelectedDepartement(null)}>Annuler</button>
        )}
      </div>

      {/* Champ de saisie pour le filtre */}
      <div className="filter-container">
        <h2>Filtrer les départements</h2>
        <input
          type="text"
          style={{ width: '80%' }}
          placeholder="Rechercher par nom ou description"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Liste des départements */}
      <div className="departement-list">
        <h2>Liste des Départements</h2>
        {Array.isArray(filteredDepartements) && filteredDepartements.length > 0 ? (
          <ul>
            {filteredDepartements.map((departement) => (
              <li key={departement._id}>
                <p>
                  {departement.nom} - {departement.description}
                </p>
                <div>
                  <button onClick={() => handleSelectDepartement(departement)}>Modifier</button>
                  <button onClick={() => handleDelete(departement._id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun département disponible.</p>
        )}
      </div>
    </div>
  );
}

export default DepartementList;
