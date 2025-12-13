from flask import Flask, jsonify, request, g
from flask_cors import CORS
import sqlite3
import hashlib
import secrets
from functools import wraps
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Almacenamiento temporal de tokens de sesión (en producción usar Redis)
active_sessions = {}

def get_db_connection():
    """Conecta a la base de datos SQLite"""
    conn = sqlite3.connect('Base_datos_convocatorias.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Crea las tablas si no existen"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla de usuarios extendida
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            estado_acceso TEXT DEFAULT 'free' CHECK(estado_acceso IN ('free', 'premium', 'admin')),
            fecha_inicio_premium TIMESTAMP NULL,
            fecha_fin_premium TIMESTAMP NULL,
            metodo_pago TEXT NULL,
            referencia_pago TEXT NULL,
            origen_alta TEXT DEFAULT 'registro_web' CHECK(origen_alta IN ('registro_web', 'manual_admin', 'importacion')),
            
            ultima_actividad TIMESTAMP NULL,
            activo BOOLEAN DEFAULT 1
        )
    ''')
    
    # Tabla de historial de pagos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS HistorialPagos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            monto REAL NOT NULL,
            moneda TEXT DEFAULT 'USD',
            metodo_pago TEXT NOT NULL,
            referencia_externa TEXT,
            estado TEXT DEFAULT 'completado' CHECK(estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
            fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notas TEXT,
            
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
        )
    ''')
    
    conn.commit()
    conn.close()

def hash_password(password):
    """Genera un hash seguro de la contraseña"""
    return hashlib.sha256(password.encode()).hexdigest()

def require_auth(f):
    """Decorador para rutas que requieren autenticación"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or token not in active_sessions:
            return jsonify({'error': 'No autorizado'}), 401
        
        # Inyectar información del usuario en g
        g.user = active_sessions[token]
        return f(*args, **kwargs)
    return decorated_function

def require_premium(f):
    """Decorador para rutas que requieren acceso premium"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Primero verificar autenticación
        token = request.headers.get('Authorization')
        if not token or token not in active_sessions:
            return jsonify({'error': 'No autorizado'}), 401
        
        g.user = active_sessions[token]
        
        # Verificar estado de acceso
        if g.user.get('estado_acceso') not in ['premium', 'admin']:
            # Verificar si el periodo premium sigue vigente
            fecha_fin = g.user.get('fecha_fin_premium')
            if fecha_fin:
                try:
                    fin = datetime.fromisoformat(fecha_fin)
                    if datetime.now() < fin:
                        return f(*args, **kwargs)
                except:
                    pass
            
            return jsonify({
                'error': 'Acceso premium requerido',
                'mensaje': 'Esta funcionalidad está disponible solo para usuarios premium',
                'tipo_error': 'sin_acceso_premium'
            }), 403
        
        return f(*args, **kwargs)
    return decorated_function

def require_admin(f):
    """Decorador para rutas administrativas"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or token not in active_sessions:
            return jsonify({'error': 'No autorizado'}), 401
        
        g.user = active_sessions[token]
        
        if g.user.get('estado_acceso') != 'admin':
            return jsonify({'error': 'Acceso administrativo requerido'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

# Inicializar base de datos
init_database()

# ===== ENDPOINTS PÚBLICOS =====

@app.route('/api/register', methods=['POST'])
def register():
    """Registra un nuevo usuario (free por defecto)"""
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
        cursor.execute('''
            INSERT INTO Usuarios (username, password_hash, email, estado_acceso, origen_alta)
            VALUES (?, ?, ?, 'free', 'registro_web')
        ''', (username, password_hash, email))
        
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
        cursor.execute('''
            SELECT id, username, estado_acceso, fecha_fin_premium
            FROM Usuarios 
            WHERE username = ? AND password_hash = ? AND activo = 1
        ''', (username, password_hash))
        
        user = cursor.fetchone()
        
        # Actualizar última actividad
        if user:
            cursor.execute(
                'UPDATE Usuarios SET ultima_actividad = ? WHERE id = ?',
                (datetime.now().isoformat(), user['id'])
            )
            conn.commit()
        
        conn.close()
        
        if not user:
            return jsonify({'error': 'Usuario o contraseña incorrectos'}), 401
        
        # Generar token de sesión
        token = secrets.token_urlsafe(32)
        active_sessions[token] = {
            'user_id': user['id'],
            'username': user['username'],
            'estado_acceso': user['estado_acceso'],
            'fecha_fin_premium': user['fecha_fin_premium']
        }
        
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'token': token,
            'username': user['username'],
            'estado_acceso': user['estado_acceso'],
            'tiene_acceso_premium': user['estado_acceso'] in ['premium', 'admin']
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

# ===== ENDPOINTS PROTEGIDOS (REQUIEREN AUTH) =====

@app.route('/api/verify-session', methods=['GET'])
@require_auth
def verify_session():
    """Verifica si la sesión es válida"""
    return jsonify({
        'valid': True,
        'username': g.user['username'],
        'estado_acceso': g.user['estado_acceso'],
        'tiene_acceso_premium': g.user['estado_acceso'] in ['premium', 'admin']
    }), 200

@app.route('/api/user/profile', methods=['GET'])
@require_auth
def get_profile():
    """Obtiene el perfil del usuario"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, username, email, estado_acceso, 
                   fecha_inicio_premium, fecha_fin_premium, created_at
            FROM Usuarios WHERE id = ?
        ''', (g.user['user_id'],))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'estado_acceso': user['estado_acceso'],
            'fecha_inicio_premium': user['fecha_inicio_premium'],
            'fecha_fin_premium': user['fecha_fin_premium'],
            'fecha_registro': user['created_at']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== ENDPOINTS PREMIUM (REQUIEREN ACCESO PAGADO) =====

@app.route('/api/convocatorias', methods=['GET'])
@require_premium
def get_convocatorias():
    """Obtiene todas las convocatorias (requiere acceso premium)"""
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
@require_premium
def get_convocatoria_by_name(nombre):
    """Obtiene una convocatoria específica (requiere acceso premium)"""
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

# ===== ENDPOINTS ADMINISTRATIVOS =====

@app.route('/api/admin/users', methods=['GET'])
@require_admin
def list_users():
    """Lista todos los usuarios (solo admin)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, username, email, estado_acceso, 
                   fecha_inicio_premium, fecha_fin_premium, created_at, activo
            FROM Usuarios
            ORDER BY created_at DESC
        ''')
        
        users = cursor.fetchall()
        conn.close()
        
        users_list = []
        for user in users:
            users_list.append({
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'estado_acceso': user['estado_acceso'],
                'fecha_inicio_premium': user['fecha_inicio_premium'],
                'fecha_fin_premium': user['fecha_fin_premium'],
                'fecha_registro': user['created_at'],
                'activo': bool(user['activo'])
            })
        
        return jsonify(users_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/grant-premium', methods=['POST'])
@require_admin
def grant_premium(user_id):
    """Otorga acceso premium a un usuario (solo admin)"""
    try:
        data = request.get_json()
        duracion_dias = data.get('duracion_dias', 30)  # Por defecto 30 días
        metodo = data.get('metodo_pago', 'manual_admin')
        referencia = data.get('referencia', f'Admin-{datetime.now().strftime("%Y%m%d-%H%M%S")}')
        monto = data.get('monto', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar que el usuario existe
        cursor.execute('SELECT id FROM Usuarios WHERE id = ?', (user_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Actualizar usuario
        fecha_inicio = datetime.now()
        fecha_fin = fecha_inicio + timedelta(days=duracion_dias)
        
        cursor.execute('''
            UPDATE Usuarios
            SET estado_acceso = 'premium',
                fecha_inicio_premium = ?,
                fecha_fin_premium = ?,
                metodo_pago = ?,
                referencia_pago = ?
            WHERE id = ?
        ''', (fecha_inicio.isoformat(), fecha_fin.isoformat(), metodo, referencia, user_id))
        
        # Registrar en historial de pagos
        cursor.execute('''
            INSERT INTO HistorialPagos (usuario_id, monto, metodo_pago, referencia_externa, estado, notas)
            VALUES (?, ?, ?, ?, 'completado', 'Otorgado por administrador')
        ''', (user_id, monto, metodo, referencia))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Acceso premium otorgado exitosamente',
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/revoke-premium', methods=['POST'])
@require_admin
def revoke_premium(user_id):
    """Revoca acceso premium a un usuario (solo admin)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE Usuarios
            SET estado_acceso = 'free',
                fecha_fin_premium = NULL
            WHERE id = ?
        ''', (user_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Acceso premium revocado'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/create-user', methods=['POST'])
@require_admin
def admin_create_user():
    """Crea un usuario desde el panel administrativo"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        estado_acceso = data.get('estado_acceso', 'free')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña son requeridos'}), 400
        
        if estado_acceso not in ['free', 'premium', 'admin']:
            return jsonify({'error': 'Estado de acceso inválido'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar duplicado
        cursor.execute('SELECT id FROM Usuarios WHERE username = ?', (username,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'El usuario ya existe'}), 409
        
        password_hash = hash_password(password)
        
        # Si es premium, establecer fechas
        fecha_inicio = None
        fecha_fin = None
        if estado_acceso == 'premium':
            fecha_inicio = datetime.now()
            fecha_fin = fecha_inicio + timedelta(days=30)
        
        cursor.execute('''
            INSERT INTO Usuarios (
                username, password_hash, email, estado_acceso,
                fecha_inicio_premium, fecha_fin_premium,
                metodo_pago, origen_alta
            ) VALUES (?, ?, ?, ?, ?, ?, 'manual_admin', 'manual_admin')
        ''', (username, password_hash, email, estado_acceso,
              fecha_inicio.isoformat() if fecha_inicio else None,
              fecha_fin.isoformat() if fecha_fin else None))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Usuario creado exitosamente',
            'user_id': user_id,
            'username': username,
            'estado_acceso': estado_acceso
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)