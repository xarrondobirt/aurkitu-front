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

export interface LogoutRequest{
    accessToken: string
}

export interface LogoutResponse{
    status: string
}
export interface SetLoginRequest{
    username: string,
    password: string
}

export interface SetLoginResponse{
    mensaje: string
}

export interface ResetPassRequest{
    email: string,
    nuevaPassword: String,
    repitePassword: String,
    codVerificacion: String
}

export interface ResetPassResponse{
    mensaje: string
}

export interface RecuperarPassRequest{
    email: string
}

export interface RecuperarPassResponse{
    mensaje: string
}