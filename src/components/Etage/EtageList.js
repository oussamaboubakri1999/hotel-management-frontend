import React, { useEffect, useState } from 'react';
import { getEtages, deleteEtage, updateEtage, createEtage } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EtageList.css';

function EtageList() {
  const [etages, setEtages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEtage, setSelectedEtage] = useState(null);
  const [updateData, setUpdateData] = useState({ numero: '', description: '' });
  const [newEtage, setNewEtage] = useState({ numero: '', description: '' });
  const [filter, setFilter] = useState(''); // État pour le filtre

  useEffect(() => {
    const fetchEtages = async () => {
      try {
        const data = await getEtages();
        setEtages(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchEtages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEtage(id);
      setEtages(etages.filter((etage) => etage._id !== id));
      toast.success('Étage supprimé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'étage.');
    }
  };

  const handleSelectEtage = (etage) => {
    setSelectedEtage(etage);
    setUpdateData({ numero: etage.numero, description: etage.description });
  };

  const handleUpdate = async () => {
    if (!selectedEtage) return;
    try {
      await updateEtage(selectedEtage._id, updateData);
      setSelectedEtage(null);
      setUpdateData({ numero: '', description: '' });
      const data = await getEtages();
      setEtages(data);
      toast.success('Étage mis à jour avec succès !');
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'étage.");
    }
  };

  const handleCreate = async () => {
    if (!newEtage.numero) {
      toast.warn("Numéro d'étage requis");
      return;
    }
    try {
      await createEtage(newEtage);
      setNewEtage({ numero: '', description: '' });
      const data = await getEtages();
      setEtages(data);
      toast.success('Étage ajouté avec succès !');
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'étage. Veuillez réessayer.");
    }
  };

  // Fonction pour filtrer les étages
  const filteredEtages = etages.filter((etage) => {
    return (
      etage.numero.toString().includes(filter) || // Filtre par numéro
      etage.description.toLowerCase().includes(filter.toLowerCase()) // Filtre par description
    );
  });

  return (
    <div className="etage-container" style={{ marginTop: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="etage-form">
        <h2>Ajouter un étage</h2>
        <input
          type="number"
          placeholder="Numéro"
          value={newEtage.numero}
          onChange={(e) => setNewEtage({ ...newEtage, numero: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newEtage.description}
          onChange={(e) => setNewEtage({ ...newEtage, description: e.target.value })}
        />
        <button onClick={handleCreate}>Ajouter</button>
      </div>

      {selectedEtage && (
        <div className="update-form">
          <h3>Modifier l'étage</h3>
          <input
            type="number"
            placeholder="Numéro"
            value={updateData.numero}
            onChange={(e) => setUpdateData({ ...updateData, numero: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={updateData.description}
            onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
          />
          <button onClick={handleUpdate}>Mettre à jour</button>
          <button onClick={() => setSelectedEtage(null)}>Annuler</button>
        </div>
      )}

      {/* Champ de saisie pour le filtre */}
      <div className="filter-container" style={{ marginTop: '20px' }}>
        <h2>Filtrer les étages</h2>
        <input
          type="text"
          placeholder="Rechercher par numéro ou description"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="etage-list" style={{ marginTop: '20px' }}>
        <h2>Liste des Étages</h2>
        <ul className="scrollable-list">
          {filteredEtages.map((etage) => (
            <li key={etage._id}>
              <p>{etage.numero} - {etage.description}</p>
              <div>
                <button onClick={() => handleDelete(etage._id)}>Supprimer</button>
                <button onClick={() => handleSelectEtage(etage)}>Modifier</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EtageList;