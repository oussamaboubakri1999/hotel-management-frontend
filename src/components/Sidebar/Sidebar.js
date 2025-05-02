import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Supprime le rôle de localStorage
    navigate('/login'); // Redirige vers la page de connexion
  };

  const menuItems = [
    { path: '/etage', label: 'Étage', roles: ['manager', 'admin'] },
    { path: '/chambre', label: 'Chambre', roles: ['manager', 'admin'] },
    { path: '/equipement', label: 'Équipement', roles: ['manager', 'admin', 'user'] },
    { path: '/departement', label: 'Département', roles: ['manager', 'admin'] },
    { path: '/users', label: 'Utilisateurs', roles: ['admin'] },
  ];

  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        {menuItems
          .filter(item => item.roles.includes(userRole))
          .map(item => (
            <li key={item.path}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Déconnexion
      </button>
    </div>
  );
};

export default Sidebar;
