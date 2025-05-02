import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../services/api'; // Importez la fonction login depuis votre service API
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!username || !password) {
      toast.warn('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // Appeler la fonction login
      const response = await login(username, password);

      if (response.message === 'Identifiants incorrects') {
        toast.error('Identifiants incorrects. Veuillez réessayer.');
      } else {
        toast.success(`Bienvenue, ${response.name} !`);
        localStorage.setItem('userRole', response.role);
        navigate('/equipement'); // Redirection vers le tableau de bord ou autre page
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };
  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button2" type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;