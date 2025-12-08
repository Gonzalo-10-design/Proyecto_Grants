import { useState } from 'react';
import { User, Lock, Mail, LogIn, UserPlus } from 'lucide-react';
import LogoIsateck from '../assets/imagenes/Logo_isateck.jpeg';


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
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la operación');
      }

      if (isLogin) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        onLoginSuccess();
      } else {
        setError('');
        alert('Registro exitoso. Por favor inicia sesión.');
        setIsLogin(true);
        setFormData({ username: '', password: '', email: '' });
      }
    } catch (err) {
      setError(err.message);
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
          
          <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-8 text-center">
            <img src={LogoIsateck} alt="Logo Isateck" className="mx-auto mb-4 w-20 h-20 rounded-2xl" />
            <h1 className="text-3xl font-extrabold mb-2">I+D ESKAR</h1>
            <p className="text-gray-200 text-sm">
              {isLogin ? 'Accede a tu cuenta' : 'Crea tu cuenta nueva'}
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea34a] focus:border-transparent transition-all"
                    placeholder="Tu nombre de usuario"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea34a] focus:border-transparent transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea34a] focus:border-transparent transition-all"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-500 font-bold">⚠</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1ea34a] to-[#0f3d28] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ username: '', password: '', email: '' });
                }}
                className="text-[#1ea34a] hover:text-[#0f3d28] font-semibold text-sm transition-colors"
              >
                {isLogin 
                  ? '¿No tienes cuenta? Regístrate aquí' 
                  : '¿Ya tienes cuenta? Inicia sesión aquí'
                }
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            Inteligencia Estratégica para el Acceso a Financiación Global
          </p>
        </div>
      </div>
    </div>
  );
}