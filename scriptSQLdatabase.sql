-- CREATE TABLE statements
CREATE TABLE public.caminata (
    idcaminata SERIAL PRIMARY KEY,
    fcr NUMERIC NOT NULL,
    tiempo NUMERIC NOT NULL,
    distancia NUMERIC NOT NULL,
    consumovo2 NUMERIC,
    barevodos TEXT NOT NULL,
    fcm NUMERIC
);

CREATE TABLE public.etapas (
    idetapa SERIAL PRIMARY KEY,
    elefinal NUMERIC NOT NULL,
    velocidadfinal NUMERIC NOT NULL,
    numeroetapa INTEGER NOT NULL,
    vodos DOUBLE PRECISION NOT NULL,
    saturacionvodos NUMERIC,
    tiempo NUMERIC
);

CREATE TABLE public.historial (
    idhistorial SERIAL PRIMARY KEY,
    fecha DATE DEFAULT CURRENT_DATE NOT NULL,
    peso NUMERIC NOT NULL,
    idusuario INTEGER NOT NULL,
    imc NUMERIC,
    imcdescripcion VARCHAR(50),
    FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario)
);

CREATE TABLE public.notasdiarias (
    idnota SERIAL PRIMARY KEY,
    descripcion TEXT
);

CREATE TABLE public.publicaciones (
    idpublicacion SERIAL PRIMARY KEY,
    imagen TEXT,
    recomendacion TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    titulo TEXT
);

CREATE TABLE public.recomendaciones (
    idrecomendacion SERIAL PRIMARY KEY,
    descripcion VARCHAR NOT NULL,
    idhistorial INTEGER,
    idtests INTEGER,
    FOREIGN KEY (idhistorial) REFERENCES public.historial(idhistorial),
    FOREIGN KEY (idtests) REFERENCES public.tests(idtest)
);

CREATE TABLE public.tests (
    idtest SERIAL PRIMARY KEY,
    fecha DATE DEFAULT CURRENT_DATE NOT NULL,
    fkbruce INTEGER,
    fkcaminata INTEGER,
    idusuario INTEGER,
    FOREIGN KEY (fkcaminata) REFERENCES public.caminata(idcaminata),
    FOREIGN KEY (fkbruce) REFERENCES public.etapas(idetapa),
    FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario)
);

CREATE TABLE public.usuario (
    idusuario SERIAL PRIMARY KEY,
    dni TEXT NOT NULL,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR NOT NULL,
    genero VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    dependencia VARCHAR(100) NOT NULL,
    fechanacimiento DATE NOT NULL,
    talla NUMERIC NOT NULL,
    rh VARCHAR NOT NULL,
    nombreemergencia VARCHAR NOT NULL,
    parentesco VARCHAR NOT NULL,
    telefonoemergencia VARCHAR NOT NULL,
    eps VARCHAR NOT NULL,
    alergias VARCHAR DEFAULT 'Ninguno' NOT NULL,
    contrasena VARCHAR NOT NULL,
    actividadsemana INTEGER NOT NULL,
    nivelsemana VARCHAR,
    imgperfil VARCHAR,
    rol INTEGER DEFAULT 0 NOT NULL,
    grupo VARCHAR(100),
    peso NUMERIC
);

-- ALTER SEQUENCE statements
ALTER SEQUENCE public.caminata_idcaminata_seq OWNED BY public.caminata.idcaminata;
ALTER SEQUENCE public.etapas_idetapa_seq OWNED BY public.etapas.idetapa;
ALTER SEQUENCE public.historial_idhistorial_seq OWNED BY public.historial.idhistorial;
ALTER SEQUENCE public.notasdiarias_idnota_seq OWNED BY public.notasdiarias.idnota;
ALTER SEQUENCE public.publicaciones_idpublicacion_seq OWNED BY public.publicaciones.idpublicacion;
ALTER SEQUENCE public.recomendaciones_idrecomendacion_seq OWNED BY public.recomendaciones.idrecomendacion;
ALTER SEQUENCE public.tests_idtest_seq OWNED BY public.tests.idtest;
ALTER SEQUENCE public.usuario_idusuario_seq OWNED BY public.usuario.idusuario;

-- ALTER TABLE DEFAULT statements
ALTER TABLE ONLY public.caminata ALTER COLUMN idcaminata SET DEFAULT nextval('public.caminata_idcaminata_seq');
ALTER TABLE ONLY public.etapas ALTER COLUMN idetapa SET DEFAULT nextval('public.etapas_idetapa_seq');
ALTER TABLE ONLY public.historial ALTER COLUMN idhistorial SET DEFAULT nextval('public.historial_idhistorial_seq');
ALTER TABLE ONLY public.notasdiarias ALTER COLUMN idnota SET DEFAULT nextval('public.notasdiarias_idnota_seq');
ALTER TABLE ONLY public.publicaciones ALTER COLUMN idpublicacion SET DEFAULT nextval('public.publicaciones_idpublicacion_seq');
ALTER TABLE ONLY public.recomendaciones ALTER COLUMN idrecomendacion SET DEFAULT nextval('public.recomendaciones_idrecomendacion_seq');
ALTER TABLE ONLY public.tests ALTER COLUMN idtest SET DEFAULT nextval('public.tests_idtest_seq');
ALTER TABLE ONLY public.usuario ALTER COLUMN idusuario SET DEFAULT nextval('public.usuario_idusuario_seq');
