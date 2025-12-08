import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RecuperarPassResponse, RecuperarPassRequest, ResetPassRequest, ResetPassResponse} from '../interfaces/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

// servicio para gestionar el cambio de contraseña
export class ForgotPassword {
  // URL básica del API
  //private urlAPI: string ='http://localhost:8080/v1/auth'; // para ionic navegador
  private urlAPI: string = environment.apiUrl + '/v1/auth'; 

  // constructor
  constructor(private httpClient: HttpClient) { }

  // métrodo para verifiacar correo
  correoRecuperacion(request: RecuperarPassRequest): Observable<RecuperarPassResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // url de la llamada
    let urlNewPass = this.urlAPI + '/recuperar-password';

    return this.httpClient.post<RecuperarPassResponse>(urlNewPass, request,{ headers });
  }

  // métrodo para restaurar contraseña
  setNewPass(request: ResetPassRequest): Observable<ResetPassResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // url de la llamada
    let urlNewPass = this.urlAPI + '/reset-password';

    return this.httpClient.post<ResetPassResponse>(urlNewPass, request,{ headers });
  }
}
