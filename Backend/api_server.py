from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import hashlib
import secrets
from functools import wraps

app = Flask(__name__)
CORS(app)

# Almacenamiento temporal de tokens de sesión (en producción usar Redis o similar)
active_sessions = {}

def get_db_connection():
    """Conecta a la base de datos SQLite"""
    conn = sqlite3.connect('Base_datos_convocatorias.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_users_table():
    """Crea la tabla de usuarios si no existe"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    """Genera un hash seguro de la contraseña"""
    return hashlib.sha256(password.encode()).hexdigest()

def require_auth(f):
    """Decorador para proteger rutas que requieren autenticación"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or token not in active_sessions:
            return jsonify({'error': 'No autorizado'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Inicializar tabla de usuarios
init_users_table()

@app.route('/api/register', methods=['POST'])
def register():
    """Registra un nuevo usuario"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña son requeridos'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si el usuario ya existe
        cursor.execute('SELECT id FROM Usuarios WHERE username = ?', (username,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'El usuario ya existe'}), 409
        
        # Insertar nuevo usuario
        password_hash = hash_password(password)
        cursor.execute(
            'INSERT INTO Usuarios (username, password_hash, email) VALUES (?, ?, ?)',
            (username, password_hash, email)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Usuario registrado exitosamente'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Inicia sesión y devuelve un token"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña son requeridos'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar credenciales
        password_hash = hash_password(password)
        cursor.execute(
            'SELECT id, username FROM Usuarios WHERE username = ? AND password_hash = ?',
            (username, password_hash)
        )
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'Usuario o contraseña incorrectos'}), 401
        
        # Generar token de sesión
        token = secrets.token_urlsafe(32)
        active_sessions[token] = {
            'user_id': user['id'],
            'username': user['username']
        }
        
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'token': token,
            'username': user['username']
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Cierra la sesión del usuario"""
    token = request.headers.get('Authorization')
    if token and token in active_sessions:
        del active_sessions[token]
    return jsonify({'message': 'Sesión cerrada exitosamente'}), 200

@app.route('/api/verify-session', methods=['GET'])
@require_auth
def verify_session():
    """Verifica si la sesión es válida"""
    token = request.headers.get('Authorization')
    user_data = active_sessions.get(token)
    return jsonify({
        'valid': True,
        'username': user_data['username']
    }), 200

@app.route('/api/convocatorias', methods=['GET'])
@require_auth
def get_convocatorias():
    """Obtiene todas las convocatorias (requiere autenticación)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Datos')
        convocatorias = cursor.fetchall()
        conn.close()
        
        convocatorias_list = []
        for conv in convocatorias:
            convocatorias_list.append({
                'nombre_convocatoria': conv['Nombre_Convocatoria'],
                'entidad_proponente': conv['Entidad_Proponente'],
                'monto': conv['Monto'],
                'fecha_apertura': conv['Fecha_Apertura'],
                'fecha_cierre': conv['Fecha_Cierre'],
                'fecha_publicacion': conv['Fecha_Publicacion'],
                'pais': conv['Pais'],
                'enlaces': conv['Enlaces'],
                'resumen': conv['Resumen'],
                'temas': conv['Temas']
            })
        
        return jsonify(convocatorias_list), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/convocatorias/<nombre>', methods=['GET'])
@require_auth
def get_convocatoria_by_name(nombre):
    """Obtiene una convocatoria específica por nombre (requiere autenticación)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Datos WHERE Nombre_Convocatoria = ?', (nombre,))
        conv = cursor.fetchone()
        conn.close()
        
        if conv:
            convocatoria = {
                'nombre_convocatoria': conv['Nombre_Convocatoria'],
                'entidad_proponente': conv['Entidad_Proponente'],
                'monto': conv['Monto'],
                'fecha_apertura': conv['Fecha_Apertura'],
                'fecha_cierre': conv['Fecha_Cierre'],
                'fecha_publicacion': conv['Fecha_Publicacion'],
                'pais': conv['Pais'],
                'enlaces': conv['Enlaces'],
                'resumen': conv['Resumen'],
                'temas': conv['Temas']
            }
            return jsonify(convocatoria), 200
        else:
            return jsonify({'error': 'Convocatoria no encontrada'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)