import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import FeedView from './components/FeedView';
import { AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[200] animate-slide-up">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
        type === 'success' ? 'bg-white/90 border-emerald-100' : 'bg-white/90 border-rose-100'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="text-emerald-500" size={20} />
        ) : (
          <AlertCircle className="text-rose-500" size={20} />
        )}
        <p className="text-sm font-semibold text-slate-800">{message}</p>
      </div>
    </div>
  );
};

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('twitter_auth');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 15000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const getAuthHeaders = (username, password) => {
    const user = username || auth?.username;
    const pass = password || auth?.password;
    if (!user || !pass) return {};
    const base64 = btoa(`${user}:${pass}`);
    return { 'Authorization': `Basic ${base64}` };
  };

  const fetchStream = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stream`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching stream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const base64 = btoa(`${username}:${password}`);
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { 'Authorization': `Basic ${base64}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const authData = { ...userData, password };
        setAuth(authData);
        localStorage.setItem('twitter_auth', JSON.stringify(authData));
        showToast(`¡Hola, ${userData.username}!`);
        fetchStream();
        return true;
      }
      return false;
    } catch (error) {
      showToast('Error de conexión', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('twitter_auth');
    showToast('Sesión cerrada');
  };

  const handlePost = async (content) => {
    setIsPosting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        showToast('¡Publicado!');
        fetchStream(); 
      } else {
        showToast('Error al publicar', 'error');
      }
    } catch (error) {
      showToast('Error de red', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {!auth ? (
        <LoginView onLogin={handleLogin} />
      ) : (
        <FeedView 
          auth={auth} 
          posts={posts} 
          isLoading={isLoading} 
          isPosting={isPosting}
          onLogout={handleLogout}
          onPost={handlePost}
        />
      )}
    </>
  );
}

export default App;
