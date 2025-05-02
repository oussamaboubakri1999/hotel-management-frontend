import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // URL de votre backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getEtages = async () => {
    try {
      const response = await api.get('/etage');
      return response.data; // Assuming response.data contains the list of etages
    } catch (error) {
      console.error("Erreur lors de la récupération des étages:", error);
      throw new Error("Erreur lors de la récupération des étages"); // Rethrow error to be handled by component
    }
  };
  
  export const deleteEtage = async (id) => {
    if (!id) {
      console.error("ID manquant, impossible de supprimer.");
      return;
    }
  
    try {
      const response = await api.delete(`/etage/${id}`);
      console.log("Étage supprimé avec succès :", response.data);
      return response.data; // Return deleted data or success message
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étage:", error);
      throw new Error("Erreur lors de la suppression de l'étage");
    }
  };
  
  export const createEtage = async (etage) => {
    try {
      const response = await api.post('/etage', etage);
      console.log("Étage créé avec succès :", response.data);
      return response.data; // Return the created etage
    } catch (error) {
      console.error("Erreur lors de la création de l'étage:", error);
      throw new Error("Erreur lors de la création de l'étage");
    }
  };
  
  export const updateEtage = async (id, etage) => {
    if (!id) {
      console.error("ID manquant, impossible de mettre à jour.");
      return;
    }
  
    try {
      const response = await api.put(`/etage/${id}`, etage);
      console.log("Étage mis à jour avec succès :", response.data);
      return response.data; // Return updated data
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étage:", error);
      throw new Error("Erreur lors de la mise à jour de l'étage");
    }
  };
// Fonctions pour Chambre
export const getChambres = () => api.get('/chambre');
export const createChambre = (chambre) => api.post('/chambre', chambre);
export const updateChambre = (id, chambre) => api.put(`/chambre/${id}`, chambre);
export const deleteChambre = (id) => api.delete(`/chambre/${id}`);

// Fonctions pour Equipement
// Fonctions pour Equipement
export const getEquipements = async () => {
    try {
      const response = await api.get('/equipement');
      return response.data; // Retourne la liste des équipements
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
      throw new Error("Erreur lors de la récupération des équipements");
    }
  };
  
  export const createEquipement = async (equipement) => {
    try {
      const response = await api.post('/equipement', equipement);
      console.log("Équipement créé avec succès :", response.data);
      return response.data; // Retourne l'équipement créé
    } catch (error) {
      console.error("Erreur lors de la création de l'équipement:", error);
      throw new Error("Erreur lors de la création de l'équipement");
    }
  };
  
  export const updateEquipement = async (id, equipement) => {
    if (!id) {
      console.error("ID manquant, impossible de mettre à jour.");
      return;
    }
  
    try {
      const response = await api.put(`/equipement/${id}`, equipement);
      console.log("Équipement mis à jour avec succès :", response.data);
      return response.data; // Retourne l'équipement mis à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipement:", error);
      throw new Error("Erreur lors de la mise à jour de l'équipement");
    }
  };
  
  export const deleteEquipement = async (id) => {
    if (!id) {
      console.error("ID manquant, impossible de supprimer.");
      return;
    }
  
    try {
      const response = await api.delete(`/equipement/${id}`);
      console.log("Équipement supprimé avec succès :", response.data);
      return response.data; // Retourne les données supprimées ou un message de succès
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipement:", error);
      throw new Error("Erreur lors de la suppression de l'équipement");
    }
  };
// Fonctions pour Departement
// Fonctions pour Département
export const getDepartements = async () => {
    try {
      const response = await api.get('/departement');
      return response.data; // Retourne la liste des départements
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error);
      throw new Error("Erreur lors de la récupération des départements");
    }
  };
  
  export const createDepartement = async (departement) => {
    try {
      const response = await api.post('/departement', departement);
      console.log("Département créé avec succès :", response.data);
      return response.data; // Retourne le département créé
    } catch (error) {
      console.error("Erreur lors de la création du département:", error);
      throw new Error("Erreur lors de la création du département");
    }
  };
  
  export const updateDepartement = async (id, departement) => {
    if (!id) {
      console.error("ID manquant, impossible de mettre à jour.");
      return;
    }
  
    try {
      const response = await api.put(`/departement/${id}`, departement);
      console.log("Département mis à jour avec succès :", response.data);
      return response.data; // Retourne le département mis à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du département:", error);
      throw new Error("Erreur lors de la mise à jour du département");
    }
  };
  
  export const deleteDepartement = async (id) => {
    if (!id) {
      console.error("ID manquant, impossible de supprimer.");
      return;
    }
  
    try {
      const response = await api.delete(`/departement/${id}`);
      console.log("Département supprimé avec succès :", response.data);
      return response.data; // Retourne les données supprimées ou un message de succès
    } catch (error) {
      console.error("Erreur lors de la suppression du département:", error);
      throw new Error("Erreur lors de la suppression du département");
    }
  };
// Fonctions pour Users
// Fonctions pour Users
export const getUsers = async () => {
    try {
      const response = await api.get('/users');
      return response.data; // Retourne la liste des utilisateurs
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  };
  
  export const deleteUser = async (id) => {
    if (!id) {
      console.error("ID manquant, impossible de supprimer.");
      return;
    }
  
    try {
      const response = await api.delete(`/users/${id}`);
      console.log("Utilisateur supprimé avec succès :", response.data);
      return response.data; // Retourne les données supprimées ou un message de succès
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  };  

  export const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        username,
        password,
      });
      return response.data; // Retourne les données de l'utilisateur (name, role)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };
  // Fonction pour créer un utilisateur
  export const createUser = async (user) => {
    try {
      const response = await api.post('/users', user); // Envoie une requête POST à l'endpoint /users
      console.log("Utilisateur créé avec succès :", response.data);
      return response.data; // Retourne les données de l'utilisateur créé
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  };