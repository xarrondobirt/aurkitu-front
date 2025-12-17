// Interfaces para la gestión de mensajes y conversaciones
export interface MensajesRequest{
    accessToken: string | null
}

export interface MensajesResponse{
    mensaje: string
}

export interface SesionDTO{
    id: number,
	username: string
}

export interface ConversacionResponse{
    id: number,
    participante: SesionDTO,
    idObjeto: number,
    createDate: Date,
    lastUpdateDate: Date,
    mensajesSinLeer: boolean
}

export interface MensajeDTO{
    id: number;
    remitente: SesionDTO;
    contenido: string;
    leido: boolean;
    createDate: Date;
}

export interface SetMensajeRequest{
    idDestinatario: number,
    idObjeto: number,
    contenido: string
}


