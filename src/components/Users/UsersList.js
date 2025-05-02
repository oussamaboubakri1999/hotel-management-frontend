import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, createUser } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UsersList.css';

function UsersList() {
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [error, setError] = useState(null); // Gestion des erreurs
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' }); // Nouvel utilisateur
  const [filter, setFilter] = useState(''); // État pour le filtre

  // Rôles disponibles
  const roles = ['admin', 'manager', 'user'];

  // Récupérer les utilisateurs au chargement du composant
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      toast.success('Utilisateur supprimé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'utilisateur.');
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Ajouter un nouvel utilisateur
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!newUser.username || !newUser.password || !newUser.role) {
      toast.warn('Tous les champs sont requis');
      return;
    }

    try {
      await createUser(newUser);
      toast.success('Utilisateur créé avec succès !');
      setNewUser({ username: '', password: '', role: '' }); // Réinitialiser le formulaire
      const data = await getUsers(); // Rafraîchir la liste des utilisateurs
      setUsers(data);
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur.");
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    return (
      user.username.toLowerCase().includes(filter.toLowerCase()) || // Filtre par nom d'utilisateur
      user.role.toLowerCase().includes(filter.toLowerCase()) // Filtre par rôle
    );
  });

  return (
    <div className="users-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Formulaire pour ajouter un utilisateur */}
      <div className="user-form">
        <h2>Ajouter un utilisateur</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={newUser.username}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={handleInputChange}
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button type="submit">Ajouter</button>
        </form>
      </div>

      {/* Champ de saisie pour le filtre */}
      <div className="filter-container">
        <h2>Filtrer les utilisateurs</h2>
        <input
          type="text"
          placeholder="Rechercher par nom ou rôle"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-list">
        <h2>Liste des Utilisateurs</h2>
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user._id}>
                <p>
                  <strong>{user.username}</strong> - Rôle: {user.role}
                </p>
                <div>
                  <button onClick={() => handleDelete(user._id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun utilisateur disponible.</p>
        )}
      </div>
    </div>
  );
}

export default UsersList;