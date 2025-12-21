import { Injectable } from '@angular/core';
import { RefreshTokenRequest, SetLoginResponse, Tokens } from '../interfaces/users';
import { Observable } from 'rxjs';
import { LoginUsuario } from './login-usuario';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
// clase para gestionar los tokens en local y su refresco vía API de manera centralizada
export class AuthenticationService {
  
  constructor(private loginService: LoginUsuario, private tokenService: TokenService,){}

  // método para obtener los tokens de Storage
  getTokensLocal(): Tokens {

    let tokensLocal: Tokens = {
      accessToken: this.tokenService.getAccessToken(),
      refreshToken: this.tokenService.getRefreshToken(),
      alias: this.tokenService.getSessionUsername()
    };
    return tokensLocal;
  }

  // método para obtener el refresh token cuando se ha caducado la sesión
  refrescarToken(tokensLocal: Tokens) {
    let request: RefreshTokenRequest = {
      token: tokensLocal.refreshToken
    }
    let responseObservable: Observable<SetLoginResponse> = this.loginService.refreshToken(request);
    let response: SetLoginResponse;
      // Obtención de datos mediante el observable
    responseObservable.subscribe(datos =>{
      response = datos;
      console.log(response);

      let tokens: Tokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        alias: tokensLocal.alias
      }
      console.log(tokens);

      this.actualizarTokens(tokens);
    },
    // En caso de error, se muestra la información del error como feedback
    (error) => {
      console.error('Error', error);
    });
  }

    // método para actualizar los tokens
  actualizarTokens(tokens: Tokens) {
    
    if(tokens.accessToken != null && tokens.refreshToken != null && tokens.alias != null){
      this.tokenService.setAccessToken(tokens.accessToken);
      this.tokenService.setRefreshToken(tokens.refreshToken);
      this.tokenService.setSessionUsername(tokens.alias);
    }
  }

  // método para eliminar los tokens al hacer logout
  deleteTokens() {
    this.tokenService.deleteAccessToken();
    this.tokenService.deleteRefreshToken();
    this.tokenService.deleteSessionUsername();
  }
}
