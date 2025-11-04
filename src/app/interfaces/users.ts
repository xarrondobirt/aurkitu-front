// Interfaces para la gestión de usuarios y verificación del email. Request y response
export interface SetUserRequest{
    username: string,
    email: string,
    password: string
}

export interface SetUserResponse{
    id: number,
    mensaje: string
}

export interface VerifyEmailRequest{
    idUsuario: number,
    codigoVerificacion: String
}

export interface VerifyEmailResponse{
    mensaje: string
}