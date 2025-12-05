from apify_client import ApifyClient
from openai import OpenAI
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import sqlite3

# Cargar variables de entorno
load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    project="proj_98P5aN2pjysn4wr84CiXq61a"
)
APIFY_TOKEN = os.getenv("APIFY_TOKEN")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

if not APIFY_TOKEN or not OPENAI_KEY:
    raise ValueError("Faltan las claves en el archivo .env (APIFY_TOKEN u OPENAI_API_KEY).")

ACTOR_ID = "kfiWbq3boy3dWKbiL"

# Instancias de cliente Apify y OpenAI
apify = ApifyClient(APIFY_TOKEN)
openai_client = OpenAI(api_key=OPENAI_KEY)

# Cargar input dinámico
if os.path.exists("apify_input.json"):
    print("Cargando configuración desde 'apify_input.json'...")
    with open("apify_input.json", "r", encoding="utf-8") as f:
        run_input = json.load(f)
else:
    print("Sin archivo de entrada local. Se usará la configuración del Actor en Apify.")
    run_input = None

# Ejecutar actor en Apify
print("Ejecutando actor en Apify...")
if run_input:
    run = apify.actor(ACTOR_ID).call(run_input=run_input)
else:
    run = apify.actor(ACTOR_ID).call()

# Descargar resultados del dataset
dataset_items = list(apify.dataset(run["defaultDatasetId"]).iterate_items())
print(f"Descargados {len(dataset_items)} posts desde Apify")

# --- Funciones auxiliares ---

def clean_author(author):
    if isinstance(author, dict):
        return {
            "name": author.get("name"),
            "universalName": author.get("universalName")
        }
    return {"name": None, "universalName": None}

def parse_date(post):
    if post.get("createdAt"):
        try:
            return datetime.fromisoformat(post["createdAt"].replace("Z", "+00:00"))
        except:
            return None
    return None

def ensure_field(value):
    if not value or (isinstance(value, str) and not value.strip()):
        return "Información no encontrada / Information not found"
    return value

def infer_publication_date(time_str):
    """Convierte valores como '7h', '3d', '2w', '1mo' a fechas aproximadas."""
    now = datetime.utcnow()
    if not time_str:
        return None
    try:
        s = time_str.lower().strip()
        if s.endswith("h"):
            return now.strftime("%Y-%m-%d")
        elif s.endswith("d"):
            days = int(s.replace("d", "").strip())
            return (now - timedelta(days=days)).strftime("%Y-%m-%d")
        elif s.endswith("w"):
            weeks = int(s.replace("w", "").strip())
            return (now - timedelta(weeks=weeks)).strftime("%Y-%m-%d")
        elif s.endswith("mo"):
            months = int(s.replace("mo", "").strip())
            return (now - timedelta(days=30*months)).strftime("%Y-%m-%d")
    except:
        return None
    return None

def verificar_duplicado_con_ia(nombre_convocatoria, entidad_proponente, fecha_cierre):
    """
    Verifica si una convocatoria ya existe en la base de datos usando OpenAI
    para comparación semántica.
    """
    conn = sqlite3.connect("Base_datos_convocatorias.db")
    cursor = conn.cursor()
    
    # Obtener todas las convocatorias existentes
    cursor.execute('''
        SELECT Nombre_Convocatoria, Entidad_Proponente, Fecha_Cierre 
        FROM Datos
    ''')
    convocatorias_existentes = cursor.fetchall()
    conn.close()
    
    if not convocatorias_existentes:
        return False, None
    
    # Preparar datos para comparación con IA
    prompt = f"""
    Analiza si la siguiente convocatoria es un DUPLICADO de alguna de las convocatorias existentes en la base de datos.
    
    CONVOCATORIA NUEVA:
    - Nombre: {nombre_convocatoria}
    - Entidad: {entidad_proponente}
    - Fecha de cierre: {fecha_cierre}
    
    CONVOCATORIAS EXISTENTES:
    {chr(10).join([f"- Nombre: {c[0]} | Entidad: {c[1]} | Fecha cierre: {c[2]}" for c in convocatorias_existentes[:20]])}
    
    CRITERIOS DE DUPLICADO:
    1. El nombre es muy similar o idéntico (considera variaciones menores, typos, mayúsculas/minúsculas)
    2. La entidad proponente es la misma o muy similar
    3. La fecha de cierre es la misma o muy cercana (±7 días)
    
    Si encuentras un duplicado CLARO, responde EXCLUSIVAMENTE en este formato JSON:
    {{
        "es_duplicado": true,
        "nombre_duplicado": "nombre exacto de la convocatoria duplicada",
        "razon": "explicación breve de por qué es duplicado"
    }}
    
    Si NO es un duplicado, responde:
    {{
        "es_duplicado": false
    }}
    
    IMPORTANTE: Sé ESTRICTO. Solo marca como duplicado si hay una similitud MUY alta en los 3 criterios.
    """
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Eres un experto en detectar convocatorias duplicadas. Respondes solo en JSON válido."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        
        result_text = response.choices[0].message.content.strip()
        result = json.loads(result_text)
        
        if result.get("es_duplicado"):
            print(f"⚠️  DUPLICADO DETECTADO: {result.get('razon', 'Sin razón')}")
            return True, result.get("nombre_duplicado")
        
        return False, None
        
    except Exception as e:
        print(f"Error en verificación de duplicados: {e}")
        # En caso de error, hacer verificación básica
        return verificar_duplicado_basico(nombre_convocatoria, entidad_proponente)

def verificar_duplicado_basico(nombre_convocatoria, entidad_proponente):
    """
    Verificación básica de duplicados (fallback sin IA)
    """
    conn = sqlite3.connect("Base_datos_convocatorias.db")
    cursor = conn.cursor()
    
    # Búsqueda exacta
    cursor.execute('''
        SELECT Nombre_Convocatoria 
        FROM Datos 
        WHERE LOWER(Nombre_Convocatoria) = LOWER(?) 
        AND LOWER(Entidad_Proponente) = LOWER(?)
    ''', (nombre_convocatoria, entidad_proponente))
    
    resultado = cursor.fetchone()
    conn.close()
    
    if resultado:
        return True, resultado[0]
    return False, None

# --- Fase 1: Filtrado local ---

data_sorted = sorted(dataset_items, key=lambda x: parse_date(x) or datetime.min, reverse=True)

cleaned_posts = []
for post in data_sorted:
    author_cleaned = clean_author(post.get("author"))
    cleaned_posts.append({
        "author_name": author_cleaned.get("name"),
        "author_universalName": author_cleaned.get("universalName"),
        "timeSincePosted": post.get("timeSincePosted"),
        "text": post.get("text"),
        "url": post.get("url"),
    })

# --- Fase 2: Análisis con OpenAI ---

filtered_posts = []
duplicados_encontrados = 0
convocatorias_nuevas = 0

for i, post in enumerate(cleaned_posts, start=1):
    text = post.get("text", "")
    if not text or len(text.strip()) < 30:
        print(f"Post #{i} descartado por texto vacío o irrelevante")
        continue

    fecha_inferida = infer_publication_date(post.get("timeSincePosted"))
    autor = post.get("author_name") or post.get("author_universalName") or "Entidad desconocida"
    enlace_post = post.get("url") or "Enlace no disponible"

    prompt = f"""
    Analiza el siguiente texto publicado en LinkedIn. Tu objetivo es determinar si corresponde a:
    - una convocatoria,
    - un fondo de financiamiento,
    - una subvención,
    - un grant de investigación, innovación o emprendimiento,
    - una ayuda económica o programa que entregue recursos.

    Si NO corresponde claramente a algún tipo de financiamiento o apoyo económico, responde SOLO:

    {{
      "es_financiamiento": false
    }}

    Si SÍ corresponde a financiamiento, devuelve EXCLUSIVAMENTE un JSON válido con esta estructura:

    {{
      "es_financiamiento": true,
      "nombre_convocatoria": "",
      "entidad_proponente": "",
      "monto": "",
      "fechas": {{
        "apertura": "",
        "cierre": "",
        "publicacion": ""
      }},
      "pais": "",
      "enlaces": [],
      "temas": [],
      "resumen": ""
    }}

    INSTRUCCIONES IMPORTANTES:
    1. Identifica si el texto contiene señales claras de financiamiento: "convocatoria", "grant", "funding", "apply", 
       "call for proposals", "subvención", "financiación", "deadline", montos, elegibilidad, o términos similares.

    2. Acepta montos expresados en:
       - dólares (USD),
       - euros (EUR / €),
       - pesos colombianos (COP).
       Si el texto menciona un monto con cualquiera de estas monedas, extrae esa información.

    3. Si no se encuentra explícitamente la entidad proponente, usa el autor del post como entidad_proponente: "{autor}".

    4. Si no hay fechas explícitas de apertura o cierre, déjalas vacías,
       pero intenta inferir la fecha de publicación usando timeSincePosted="{post.get("timeSincePosted")}"
       tomando como referencia la fecha actual {datetime.utcnow().date()}.

    5. El campo "enlaces" debe incluir al menos el enlace al post original: "{enlace_post}".

    6. Resume el contenido principal en español en máximo 30 palabras.

    7. En los campos sin información disponible, deja una cadena vacía "" o un arreglo vacío [] según corresponda.

    8. No incluyas absolutamente nada fuera del JSON.

    TEXTO DEL POST:
    {text}
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Responde exclusivamente en formato JSON válido y conciso."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        result_text = response.choices[0].message.content.strip()

        if not result_text:
            print(f"OpenAI devolvió respuesta vacía para post #{i}")
            continue

        try:
            result = json.loads(result_text)
        except json.JSONDecodeError:
            print(f"JSON inválido en post #{i}. Respuesta:\n{result_text}\n")
            continue

    except Exception as e:
        print(f"Error procesando post #{i}: {e}")
        continue

    if result.get("es_financiamiento"):
        result["nombre_convocatoria"] = ensure_field(result.get("nombre_convocatoria"))
        result["entidad_proponente"] = ensure_field(result.get("entidad_proponente") or autor)
        result["monto"] = ensure_field(result.get("monto"))
        result["pais"] = ensure_field(result.get("pais"))

        fechas = result.get("fechas", {})
        result["fechas"] = {
            "apertura": ensure_field(fechas.get("apertura")),
            "cierre": ensure_field(fechas.get("cierre")),
            "publicacion": ensure_field(fechas.get("publicacion") or fecha_inferida)
        }

        result["temas"] = result.get("temas") or ["Información no encontrada / Information not found"]
        result["enlaces"] = result.get("enlaces") or [enlace_post]
        result["resumen"] = result.get("resumen") or "Información no encontrada / Information not found"

        # VERIFICACIÓN DE DUPLICADOS
        print(f"\n🔍 Verificando duplicado para: {result['nombre_convocatoria']}")
        es_duplicado, nombre_duplicado = verificar_duplicado_con_ia(
            result["nombre_convocatoria"],
            result["entidad_proponente"],
            result["fechas"]["cierre"]
        )
        
        if es_duplicado:
            duplicados_encontrados += 1
            print(f"❌ DUPLICADO DETECTADO - Ya existe: '{nombre_duplicado}'")
            continue
        else:
            print(f"✅ NUEVA CONVOCATORIA - Será agregada")
            convocatorias_nuevas += 1

        post.update(result)
        filtered_posts.append(post)

# --- Fase 3: Almacenamiento en base de datos ---

conn = sqlite3.connect("Base_datos_convocatorias.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS Datos (
    Nombre_Convocatoria TEXT PRIMARY KEY,
    Entidad_Proponente TEXT,
    Monto TEXT,
    Fecha_Apertura TEXT,
    Fecha_Cierre TEXT,
    Fecha_Publicacion TEXT,
    Pais TEXT,
    Enlaces TEXT,
    Resumen TEXT,
    Temas TEXT
)
""")

def almacenar_datos(post):
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO Datos (
                Nombre_Convocatoria, Entidad_Proponente, Monto,
                Fecha_Apertura, Fecha_Cierre, Fecha_Publicacion,
                Pais, Enlaces, Resumen, Temas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ensure_field(post["nombre_convocatoria"]),
            ensure_field(post["entidad_proponente"]),
            ensure_field(post["monto"]),
            ensure_field(post["fechas"]["apertura"]),
            ensure_field(post["fechas"]["cierre"]),
            ensure_field(post["fechas"]["publicacion"]),
            ensure_field(post["pais"]),
            ", ".join(post["enlaces"]),
            ensure_field(post["resumen"]),
            ", ".join(post["temas"])
        ))
        conn.commit()
    except Exception as e:
        print(f"Error al guardar convocatoria '{post.get('nombre_convocatoria', 'Sin nombre')}': {e}")

if filtered_posts:
    print(f"\n{'='*60}")
    print(f"📊 RESUMEN DE PROCESAMIENTO:")
    print(f"{'='*60}")
    print(f"✅ Convocatorias NUEVAS encontradas: {convocatorias_nuevas}")
    print(f"❌ Duplicados detectados y omitidos: {duplicados_encontrados}")
    print(f"💾 Total a guardar en base de datos: {len(filtered_posts)}")
    print(f"{'='*60}\n")
    
    print("Guardando convocatorias en la base de datos...")
    for post in filtered_posts:
        almacenar_datos(post)
    print("✅ Todas las convocatorias fueron almacenadas correctamente.")
else:
    print("\n⚠️  No se encontraron convocatorias nuevas para guardar.")

conn.close()
print("\n🔒 Conexión a la base de datos cerrada.")
print(f"🎉 Procesamiento finalizado exitosamente.")