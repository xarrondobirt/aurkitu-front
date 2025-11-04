import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SetUserRequest, SetUserResponse, VerifyEmailRequest, VerifyEmailResponse} from '../interfaces/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// servicio para gestionar el registro del usuario y la verificación del email (Backend)
export class RegistroUsuarioService {
  // URL básica del API
  //private urlAPI: string ='http://localhost:8080/v1/auth'; // para ionic navegador
  private urlAPI: string = environment.apiUrl + '/v1/auth'; 
  
  constructor(private httpClient: HttpClient) { }
  
  // método para gestionar las altas de usuarios
  setUser(request: SetUserRequest): Observable<SetUserResponse>{
    console.log(this.urlAPI);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // formamos el url de la llamada
    let urlSetUser: string = this.urlAPI + '/registro';
    
    return this.httpClient.post<SetUserResponse>(urlSetUser, request,{ headers });
  }

  // método para verificar el código introducido por el usuario
  verifyEmail(request: VerifyEmailRequest){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // formamos el url de la llamada
    let urlVerifyEmail = this.urlAPI + '/verificar-email';

    return this.httpClient.post<VerifyEmailResponse>(urlVerifyEmail, request,{ headers });
  }
}
