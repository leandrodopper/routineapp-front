// Generated by https://quicktype.io
export interface LoginData {
    usernameOrEmail:string;
    password:string;
}

export interface LoginResponse {
    token:   string;
    usuario: Usuario;
}

export interface RegisterData {
    nombre: string;
    apellidos: string;
    username: string;
    email: string;
    password: string;
    telefono: string;
    altura: number;
    peso:number;
    edad: number;
}

export interface Usuario {
    id:        number;
    nombre:    string;
    apellidos: string;
    username:  string;
    email:     string;
    password:  string;
    telefono:  string;
    altura:    number;
    peso:      number;
    edad:      number;
    imagen?:    string;
    roles:     Role[];
}

export interface Role {
    id:     number;
    nombre: string;
}


export interface Ejercicio {
    id:             number;
    username_creador: string;
    nombre:         string;
    descripcion:    string;
    grupo_muscular: string;
    imagen:         string;
    dificultad:     string;
}

export interface GetEjerciciosResponse {
    contenido:      Ejercicio[];
    numPagina:      number;
    tamPagina:      number;
    totalElementos: number;
    totalPaginas:   number;
    ultima:         boolean;
}


export interface GetRutinasResponse {
    contenido:      ContenidoRutinas[];
    numPagina:      number;
    tamPagina:      number;
    totalElementos: number;
    totalPaginas:   number;
    ultima:         boolean;
}

export interface ContenidoRutinas {
    id:           number;
    nombre:       string;
    descripcion:  string;
    dias_rutina?: DiaRutina[];
    creador: string;
    puntuacion:  number;
}


export interface DiaRutina {
    id:                  number;
    id_rutina:           number;
    descripcion:         string;
    nombre:              string;
    ejerciciosDiaRutina: EjercicioDiaRutina[];
}

export interface EjercicioDiaRutina {
    id_EjercicioRutina: number;
    ejercicioId:        number;
    series:             number;
    repeticiones:       number;
}


export interface Rutina {
    id:          number;
    nombre:      string;
    descripcion: string;
    dias_rutina: DiaRutina[];
    creador:     string;
    puntuacion:  number;
}


export interface GetComentariosRutinaResponse {
    contenido:      ContenidoComentarios[];
    numPagina:      number;
    tamPagina:      number;
    totalElementos: number;
    totalPaginas:   number;
    ultima:         boolean;
}

export interface ContenidoComentarios {
    id:                 number;
    usuario:            string;
    contenido:          string;
    fecha:              string;
    comentarioPadre_id: null | number;
    respuestas:         ContenidoComentarios[];
    rutina_id:          number;
}

export interface PostEntreno {
    diaRutinaId:          number;
    duracionMinutos:      number;
    ejerciciosRealizados: EjerciciosRealizado[];
}

export interface EjerciciosRealizado {
    ejercicioId:            number;
    nivelEsfuerzoPercibido: number | null;
    seriesRealizadas:       SeriesRealizada[];
}

export interface SeriesRealizada {
    numeroSerie:            number;
    repeticionesRealizadas: number;
    objetivoCumplido:       boolean;
    pesoUtilizado:          number;
}


export interface GetTiemposResponse {
    maximo:   number;
    minimo:   number;
    promedio: number;
}









