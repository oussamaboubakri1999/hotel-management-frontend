import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import EtageList from './components/Etage/EtageList';
import './App.css';
import Equipement from './components/Equipement/EquipementList';
import Chambre from './components/Chambre/ChambreList';
import Departement from './components/Departement/DepartementList';
import Users from './components/Users/UsersList';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import du composant de protection

function App() {
  const location = useLocation();

  return (
    <div className="app">
      {location.pathname !== '/login' && <Sidebar />}
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Routes protégées */}
          <Route
            path="/etage"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <EtageList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chambre"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Chambre />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipement"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin', 'user']}>
                <Equipement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departement"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Departement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
