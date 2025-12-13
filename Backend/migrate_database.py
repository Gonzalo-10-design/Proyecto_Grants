"""
Script de migración para actualizar la base de datos existente
Ejecutar: python migrate_database.py
"""

import sqlite3
from datetime import datetime

def migrate_database():
    conn = sqlite3.connect('Base_datos_convocatorias.db')
    cursor = conn.cursor()
    
    print("Iniciando migración de base de datos...")
    
    # 1. Verificar si las columnas ya existen
    cursor.execute("PRAGMA table_info(Usuarios)")
    columns = [col[1] for col in cursor.fetchall()]
    
    # 2. Agregar nuevas columnas si no existen
    new_columns = {
        'estado_acceso': "TEXT DEFAULT 'free' CHECK(estado_acceso IN ('free', 'premium', 'admin'))",
        'fecha_inicio_premium': "TIMESTAMP NULL",
        'fecha_fin_premium': "TIMESTAMP NULL",
        'metodo_pago': "TEXT NULL",
        'referencia_pago': "TEXT NULL",
        'origen_alta': "TEXT DEFAULT 'registro_web' CHECK(origen_alta IN ('registro_web', 'manual_admin', 'importacion'))",
        'ultima_actividad': "TIMESTAMP NULL",
        'activo': "BOOLEAN DEFAULT 1"
    }
    
    for column_name, column_def in new_columns.items():
        if column_name not in columns:
            try:
                cursor.execute(f"ALTER TABLE Usuarios ADD COLUMN {column_name} {column_def}")
                print(f"✓ Columna '{column_name}' agregada")
            except sqlite3.OperationalError as e:
                print(f"✗ Error agregando '{column_name}': {e}")
    
    # 3. Crear tabla de historial de pagos
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
    print("✓ Tabla HistorialPagos creada/verificada")
    
    # 4. Crear índices
    try:
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON Usuarios(estado_acceso)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_usuarios_email ON Usuarios(email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_historial_usuario ON HistorialPagos(usuario_id)")
        print("✓ Índices creados")
    except sqlite3.OperationalError as e:
        print(f"✗ Error creando índices: {e}")
    
    # 5. Actualizar usuarios existentes con valores por defecto
    cursor.execute("""
        UPDATE Usuarios 
        SET estado_acceso = 'free',
            origen_alta = 'registro_web',
            activo = 1
        WHERE estado_acceso IS NULL
    """)
    
    conn.commit()
    
    # 6. Mostrar resumen
    cursor.execute("SELECT COUNT(*) FROM Usuarios")
    total_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM Usuarios WHERE estado_acceso = 'free'")
    free_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM Usuarios WHERE estado_acceso = 'premium'")
    premium_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM Usuarios WHERE estado_acceso = 'admin'")
    admin_users = cursor.fetchone()[0]
    
    print("\n=== RESUMEN DE MIGRACIÓN ===")
    print(f"Total de usuarios: {total_users}")
    print(f"  - Free: {free_users}")
    print(f"  - Premium: {premium_users}")
    print(f"  - Admin: {admin_users}")
    print("\n✓ Migración completada exitosamente")
    
    conn.close()

if __name__ == "__main__":
    migrate_database()