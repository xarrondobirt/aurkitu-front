import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RefreshTokenRequest, SetLoginRequest, SetLoginResponse } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})

// Servicio para gestionar el login del usuario
export class LoginUsuario {
  // URL
  private urlAPI: string = environment.apiUrl + '/v1/auth'; 

  constructor(private httpClient: HttpClient) {}

  // método para gestionar las altas de usuarios
  setUser(request: SetLoginRequest): Observable<SetLoginResponse>{
    console.log(this.urlAPI);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // formamos el url de la llamada
    let urlSetUser: string = this.urlAPI + '/login';
    
    return this.httpClient.post<SetLoginResponse>(urlSetUser, request,{ headers });
  }

  refreshToken(request: RefreshTokenRequest): Observable<SetLoginResponse>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // formamos el url de la llamada
    let urlRefreshToken: string = this.urlAPI + '/refresh-token';

    return this.httpClient.post<SetLoginResponse>(urlRefreshToken, request,{ headers });
  }
}
