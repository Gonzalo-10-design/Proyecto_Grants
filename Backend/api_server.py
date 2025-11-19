from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend

def get_db_connection():
    """Conecta a la base de datos SQLite"""
    conn = sqlite3.connect('Base_datos_convocatorias.db')
    conn.row_factory = sqlite3.Row  # Permite acceder a las columnas por nombre
    return conn

@app.route('/api/convocatorias', methods=['GET'])
def get_convocatorias():
    """Obtiene todas las convocatorias de la base de datos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Datos')
        convocatorias = cursor.fetchall()
        conn.close()
        
        # Convertir las filas a diccionarios
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
def get_convocatoria_by_name(nombre):
    """Obtiene una convocatoria específica por nombre"""
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
    app.run(debug=True, port=5000)