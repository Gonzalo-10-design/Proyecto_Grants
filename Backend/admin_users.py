"""
Script de administración de usuarios
Ejecutar: python admin_users.py
"""

import sqlite3
import hashlib
from datetime import datetime, timedelta

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_db_connection():
    conn = sqlite3.connect('Base_datos_convocatorias.db')
    conn.row_factory = sqlite3.Row
    return conn

def list_users():
    """Lista todos los usuarios"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, username, email, estado_acceso, 
               fecha_inicio_premium, fecha_fin_premium, created_at
        FROM Usuarios
        ORDER BY created_at DESC
    ''')
    
    users = cursor.fetchall()
    conn.close()
    
    print("\n=== LISTA DE USUARIOS ===")
    print(f"{'ID':<5} {'Usuario':<20} {'Email':<30} {'Estado':<10} {'Fecha Registro':<20}")
    print("=" * 90)
    
    for user in users:
        print(f"{user['id']:<5} {user['username']:<20} {user['email'] or 'N/A':<30} {user['estado_acceso']:<10} {user['created_at']:<20}")
    
    print(f"\nTotal: {len(users)} usuarios")

def create_user(username, password, email='', estado='free'):
    """Crea un nuevo usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si ya existe
    cursor.execute('SELECT id FROM Usuarios WHERE username = ?', (username,))
    if cursor.fetchone():
        print(f"El usuario '{username}' ya existe")
        conn.close()
        return
    
    password_hash = hash_password(password)
    
    # Determinar fechas si es premium
    fecha_inicio = None
    fecha_fin = None
    if estado == 'premium':
        fecha_inicio = datetime.now()
        fecha_fin = fecha_inicio + timedelta(days=30)
    
    cursor.execute('''
        INSERT INTO Usuarios (
            username, password_hash, email, estado_acceso,
            fecha_inicio_premium, fecha_fin_premium,
            metodo_pago, origen_alta
        ) VALUES (?, ?, ?, ?, ?, ?, 'manual_admin', 'manual_admin')
    ''', (
        username, password_hash, email, estado,
        fecha_inicio.isoformat() if fecha_inicio else None,
        fecha_fin.isoformat() if fecha_fin else None
    ))
    
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    
    print(f"Usuario '{username}' creado exitosamente (ID: {user_id}, Estado: {estado})")

def grant_premium(user_id, dias=30):
    """Otorga acceso premium a un usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT username FROM Usuarios WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        print(f"Usuario con ID {user_id} no encontrado")
        conn.close()
        return
    
    fecha_inicio = datetime.now()
    fecha_fin = fecha_inicio + timedelta(days=dias)
    
    cursor.execute('''
        UPDATE Usuarios
        SET estado_acceso = 'premium',
            fecha_inicio_premium = ?,
            fecha_fin_premium = ?,
            metodo_pago = 'manual_admin',
            referencia_pago = ?
        WHERE id = ?
    ''', (
        fecha_inicio.isoformat(),
        fecha_fin.isoformat(),
        f'Admin-{datetime.now().strftime("%Y%m%d-%H%M%S")}',
        user_id
    ))
    
    # Registrar en historial
    cursor.execute('''
        INSERT INTO HistorialPagos (usuario_id, monto, metodo_pago, referencia_externa, estado, notas)
        VALUES (?, 0, 'manual_admin', ?, 'completado', 'Otorgado por administrador')
    ''', (user_id, f'ADMIN-{user_id}-{datetime.now().strftime("%Y%m%d")}'))
    
    conn.commit()
    conn.close()
    
    print(f"Acceso premium otorgado a '{user['username']}' por {dias} días")
    print(f"  Válido hasta: {fecha_fin.strftime('%Y-%m-%d %H:%M:%S')}")

def revoke_premium(user_id):
    """Revoca el acceso premium"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT username FROM Usuarios WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        print(f"Usuario con ID {user_id} no encontrado")
        conn.close()
        return
    
    cursor.execute('''
        UPDATE Usuarios
        SET estado_acceso = 'free',
            fecha_fin_premium = NULL
        WHERE id = ?
    ''', (user_id,))
    
    conn.commit()
    conn.close()
    
    print(f"Acceso premium revocado para '{user['username']}'")

def make_admin(user_id):
    """Convierte un usuario en administrador"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT username FROM Usuarios WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        print(f"Usuario con ID {user_id} no encontrado")
        conn.close()
        return
    
    cursor.execute('''
        UPDATE Usuarios
        SET estado_acceso = 'admin'
        WHERE id = ?
    ''', (user_id,))
    
    conn.commit()
    conn.close()
    
    print(f" {user['username']} es ahora administrador")

def menu():
    """Menú interactivo"""
    while True:
        print("\n" + "="*50)
        print("ADMINISTRACIÓN DE USUARIOS - GRANTIA")
        print("="*50)
        print("1. Listar usuarios")
        print("2. Crear usuario")
        print("3. Otorgar acceso premium")
        print("4. Revocar acceso premium")
        print("5. Hacer administrador")
        print("0. Salir")
        print("="*50)
        
        opcion = input("\nSelecciona una opción: ").strip()
        
        if opcion == '1':
            list_users()
        
        elif opcion == '2':
            print("\n--- CREAR USUARIO ---")
            username = input("Usuario: ").strip()
            password = input("Contraseña: ").strip()
            email = input("Email (opcional): ").strip()
            print("\nEstado de acceso:")
            print("  1. free (gratuito)")
            print("  2. premium (acceso pagado)")
            print("  3. admin (administrador)")
            estado_opt = input("Selecciona (1/2/3): ").strip()
            
            estados = {'1': 'free', '2': 'premium', '3': 'admin'}
            estado = estados.get(estado_opt, 'free')
            
            create_user(username, password, email, estado)
        
        elif opcion == '3':
            user_id = input("ID del usuario: ").strip()
            dias = input("Días de acceso (default 30): ").strip()
            dias = int(dias) if dias else 30
            grant_premium(int(user_id), dias)
        
        elif opcion == '4':
            user_id = input("ID del usuario: ").strip()
            revoke_premium(int(user_id))
        
        elif opcion == '5':
            user_id = input("ID del usuario: ").strip()
            make_admin(int(user_id))
        
        elif opcion == '0':
            print("\n¡Hasta luego!")
            break
        
        else:
            print("\n Opción inválida")

if __name__ == "__main__":
    menu()