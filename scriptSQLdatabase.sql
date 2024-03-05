CREATE TABLE caminata (
    idcaminata SERIAL PRIMARY KEY,
    fcr numeric,
    tiempo numeric,
    distancia numeric,
    consumovo2 numeric,
    barevodos character varying,
    fcm numeric
);

CREATE TABLE etapas (
    tiempo numeric,
    saturacionvodos numeric,
    vodos double precision,
    fcm numeric,
    fcr numeric,
    numeroetapa integer,
    velocidadfinal numeric,
    elefinal numeric,
    idetapa SERIAL PRIMARY KEY
);

CREATE TABLE historial (
    idhistorial SERIAL PRIMARY KEY,
    fecha date DEFAULT CURRENT_DATE,
    peso numeric,
    bareimc integer,
    imc numeric,
    imcdescripcion character varying,
    idusuario integer
);

CREATE TABLE notadiaria (
    descripcion text,
    id SERIAL PRIMARY KEY
);

CREATE TABLE recomendaciones (
    idhistorial integer,
    descripcion character varying,
    idrecomendacion integer,
    idtests integer
);

CREATE TABLE tests (
    idusuario integer,
    fkcaminata integer,
    fkbruce integer,
    fecha date DEFAULT CURRENT_DATE,
    idtest SERIAL PRIMARY KEY
);

CREATE TABLE usuario (
    nombres character varying,
    apellidos character varying,
    genero character varying,
    direccion character varying,
    dependencia character varying,
    fechanacimiento date,
    talla numeric,
    rh character varying,
    nombreemergencia character varying,
    parentesco character varying,
    telefonoemergencia character varying,
    eps character varying,
    alergias character varying,
    contrasena character varying,
    actividadsemana integer,
    nivelsemana character varying,
    imgperfil character varying,
    rol integer DEFAULT 0,
    grupo character varying,
    dni character varying,
    idusuario SERIAL PRIMARY KEY
);

-- RELACIONES entre tests y respectivo padre xD
ALTER TABLE tests ADD CONSTRAINT fketapastests FOREIGN KEY (fkbruce) REFERENCES etapas(idetapa);
ALTER TABLE tests ADD CONSTRAINT fk_caminata FOREIGN KEY (fkcaminata) REFERENCES caminata(idcaminata);
ALTER TABLE tests ADD CONSTRAINT fkbruce FOREIGN KEY (fkbruce) REFERENCES etapas(idetapa);
-- Relación entre historial y usuario
ALTER TABLE historial ADD CONSTRAINT fk_usuario_historial FOREIGN KEY (idusuario) REFERENCES usuario(idusuario);
-- Relación entre tests y usuario
ALTER TABLE tests ADD CONSTRAINT fk_usuario_tests FOREIGN KEY (idusuario) REFERENCES usuario(idusuario);
