import React, { useEffect, useState } from 'react';
import { getEquipements, deleteEquipement, updateEquipement, createEquipement } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EquipementList.css';

function EquipementList() {
  const [equipements, setEquipements] = useState([]); // Liste des équipements
  const [error, setError] = useState(null); // Gestion des erreurs
  const [newEquipement, setNewEquipement] = useState({ nom: '', description: '' }); // Nouvel équipement
  const [selectedEquipement, setSelectedEquipement] = useState(null); // Équipement sélectionné pour la modification
  const [filter, setFilter] = useState(''); // État pour le filtre

  // Récupérer les équipements au chargement du composant
  useEffect(() => {
    fetchEquipements();
  }, []);

  // Fonction pour récupérer les équipements
  const fetchEquipements = async () => {
    try {
      const data = await getEquipements();
      setEquipements(data);
    } catch (error) {
      setError(error.message);
      toast.error('Erreur lors de la récupération des équipements.');
    }
  };

  // Supprimer un équipement
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?');
    if (!confirmDelete) return;

    try {
      await deleteEquipement(id);
      setEquipements(equipements.filter((equipement) => equipement._id !== id));
      toast.success('Équipement supprimé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'équipement.');
    }
  };

  // Ajouter ou mettre à jour un équipement
  const handleSubmit = async () => {
    if (!newEquipement.nom) {
      toast.warn("Nom de l'équipement requis");
      return;
    }

    try {
      if (selectedEquipement) {
        // Mettre à jour l'équipement
        await updateEquipement(selectedEquipement._id, newEquipement);
        toast.success('Équipement mis à jour avec succès !');
      } else {
        // Créer un nouvel équipement
        await createEquipement(newEquipement);
        toast.success('Équipement ajouté avec succès !');
      }
      setNewEquipement({ nom: '', description: '' }); // Réinitialiser le formulaire
      setSelectedEquipement(null); // Réinitialiser la sélection
      fetchEquipements(); // Rafraîchir la liste des équipements
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la mise à jour de l'équipement.");
    }
  };

  // Sélectionner un équipement pour la modification
  const handleSelectEquipement = (equipement) => {
    setSelectedEquipement(equipement);
    setNewEquipement({ nom: equipement.nom, description: equipement.description });
  };

  // Fonction pour filtrer les équipements
  const filteredEquipements = equipements.filter((equipement) => {
    return (
      equipement.nom.toLowerCase().includes(filter.toLowerCase()) || // Filtre par nom
      equipement.description.toLowerCase().includes(filter.toLowerCase()) // Filtre par description
    );
  });

  return (
    <div className="equipement-form">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Formulaire pour ajouter ou modifier un équipement */}
      <h2>{selectedEquipement ? 'Modifier un équipement' : 'Ajouter un équipement'}</h2>
      <input
        type="text"
        placeholder="Nom"
        value={newEquipement.nom}
        onChange={(e) => setNewEquipement({ ...newEquipement, nom: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newEquipement.description}
        onChange={(e) => setNewEquipement({ ...newEquipement, description: e.target.value })}
      />
      <button onClick={handleSubmit}>
        {selectedEquipement ? 'Mettre à jour' : 'Ajouter'}
      </button>
      {selectedEquipement && (
        <button onClick={() => setSelectedEquipement(null)}>Annuler</button>
      )}

      {/* Champ de saisie pour le filtre */}
      <div className="filter-container">
        <h2>Filtrer les équipements</h2>
        <input
          type="text"
          placeholder="Rechercher par nom ou description"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Liste des équipements */}
      <div className="equipement-list">
        <h2>Liste des Équipements</h2>
        <ul>
          {filteredEquipements.map((equipement) => (
            <li key={equipement._id}>
              <p>{equipement.nom} - {equipement.description}</p>
              <div>
                <button onClick={() => handleSelectEquipement(equipement)}>Modifier</button>
                <button onClick={() => handleDelete(equipement._id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EquipementList;