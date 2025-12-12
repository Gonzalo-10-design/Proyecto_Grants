import { useState } from 'react';
import { User, Lock, Mail, LogIn, UserPlus } from 'lucide-react';
import Grantia from '../assets/imagenes/Grantia.png';

// dotenv → cargado automáticamente por Create React App
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? 'login' : 'register';

      const response = await fetch(
        `${API_BASE_URL}/api/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la operación');
      }

      if (isLogin) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        onLoginSuccess();
      } else {
        alert('Registro exitoso. Por favor inicia sesión.');
        setIsLogin(true);
        setFormData({ username: '', password: '', email: '' });
      }

    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] px-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1ea34a] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-8 text-center">
            <img
              src={Grantia}
              alt="Logo Grantia"
              className="mx-auto mb-4 w-20 h-20 rounded-2xl"
            />
            <h1 className="text-3xl font-extrabold mb-2">GRANTIA</h1>
            <p className="text-gray-200 text-sm">
              {isLogin ? 'Accede a tu cuenta' : 'Crea tu cuenta nueva'}
            </p>
          </div>

          {/* FORM */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* USERNAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1ea34a]"
                    placeholder="Tu nombre de usuario"
                  />
                </div>
              </div>

              {/* EMAIL (solo registro) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-gray-400">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1ea34a]"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1ea34a]"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ⚠ {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1ea34a] to-[#0f3d28] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                  </>
                )}
              </button>
            </form>

            {/* TOGGLE */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ username: '', password: '', email: '' });
                }}
                className="text-[#1ea34a] font-semibold text-sm hover:text-[#0f3d28]"
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate aquí'
                  : '¿Ya tienes cuenta? Inicia sesión aquí'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
