import React, { useEffect, useState } from 'react';
import { getChambres, deleteChambre, updateChambre, createChambre, getEtages } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChambreList.css';

function ChambreList() {
  const [chambres, setChambres] = useState([]);
  const [etages, setEtages] = useState([]);
  const [error, setError] = useState(null);
  const [newChambre, setNewChambre] = useState({ numero: '', type: '', etageId: '', isOccupied: false });
  const [selectedChambre, setSelectedChambre] = useState(null);
  const [filter, setFilter] = useState('');

  const getNumeroEtage = (etageId) => {
    return etageId && etageId.numero ? etageId.numero : 'Non attribué';
  };

  useEffect(() => {
    fetchChambres();
    fetchEtages();
  }, []);

  const fetchChambres = async () => {
    try {
      const response = await getChambres();
      if (response.data && Array.isArray(response.data)) {
        setChambres(response.data);
      } else {
        setChambres([]);
        console.error("Invalid chambre response:", response);
      }
    } catch (error) {
      setError(error.message);
      toast.error('Erreur lors de la récupération des chambres.');
    }
  };

  const fetchEtages = async () => {
    try {
      const response = await getEtages();
      if (Array.isArray(response)) {
        setEtages(response);
      } else {
        setEtages([]);
        console.error("Invalid étage response:", response);
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération des étages.");
    }
  };

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

  const handleSubmit = async () => {
    if (!newChambre.numero || !newChambre.type || !newChambre.etageId) {
      toast.warn('Tous les champs sont requis');
      return;
    }

    try {
      if (selectedChambre) {
        await updateChambre(selectedChambre._id, newChambre);
        toast.success('Chambre mise à jour avec succès !');
      } else {
        // Créer une nouvelle chambre
        await createChambre(newChambre);
        toast.success('Chambre ajoutée avec succès !');
      }
      setNewChambre({ numero: '', type: '', etageId: '', isOccupied: false });
      setSelectedChambre(null);
      fetchChambres();
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la mise à jour de la chambre.");
    }
  };

  const handleSelectChambre = (chambre) => {
    setSelectedChambre(chambre);
    setNewChambre({
      numero: chambre.numero,
      type: chambre.type,
      etageId: chambre.etageId ? chambre.etageId._id : '',
      isOccupied: chambre.isOccupied ?? false,
    });
  };

  const filteredChambres = chambres.filter((chambre) => {
    const numeroMatch = chambre.numero.toString().includes(filter.toLowerCase());
    const typeMatch = chambre.type.toLowerCase().includes(filter.toLowerCase());
    const etageMatch = getNumeroEtage(chambre.etageId).toString().includes(filter.toLowerCase());
    return numeroMatch || typeMatch || etageMatch;
  });

  return (
    <div className="chambre-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Formulaire */}
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
          {etages.map((etage) => (
            <option key={etage._id} value={etage._id}>
              {etage.numero} - {etage.description}
            </option>
          ))}
        </select>

        <div className="toggle-container">
  <label className="switch">
  <input
  type="checkbox"
  id="isOccupied"
  checked={newChambre.isOccupied}
  onChange={(e) => setNewChambre({ ...newChambre, isOccupied: e.target.checked })}
/>
    <span className="slider"></span>
  </label>
  <span className="label-text">Occupée</span>
</div>
  

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
        {filteredChambres.length > 0 ? (
          <ul>
            {filteredChambres.map((chambre) => (
              <li key={chambre._id}>
                <p>
                  {chambre.numero} - {chambre.type} (Étage: {getNumeroEtage(chambre.etageId)})<br />
                  Statut: <strong>{chambre.isOccupied ? 'Occupée' : 'Libre'}</strong>
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
