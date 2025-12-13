-- Tabla de usuarios extendida
CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Control de acceso y pagos
    estado_acceso TEXT DEFAULT 'free' CHECK(estado_acceso IN ('free', 'premium', 'admin')),
    fecha_inicio_premium TIMESTAMP NULL,
    fecha_fin_premium TIMESTAMP NULL,
    metodo_pago TEXT NULL, -- 'manual', 'stripe', 'paypal', etc.
    referencia_pago TEXT NULL, -- ID de transacción o referencia
    origen_alta TEXT DEFAULT 'registro_web' CHECK(origen_alta IN ('registro_web', 'manual_admin', 'importacion')),
    
    -- Auditoría
    ultima_actividad TIMESTAMP NULL,
    activo BOOLEAN DEFAULT 1
);

-- Tabla de historial de pagos (para escalabilidad futura)
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
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON Usuarios(estado_acceso);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON Usuarios(email);
CREATE INDEX IF NOT EXISTS idx_historial_usuario ON HistorialPagos(usuario_id);