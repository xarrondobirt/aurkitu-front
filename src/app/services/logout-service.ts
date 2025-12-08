import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogoutRequest, LogoutResponse } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  // url
  private urlAPI: string = environment.apiUrl + '/v1/auth'; 
  
  constructor(private httpClient: HttpClient) { }

   // método para gestionar el logout de los usuarios
   logout(request: LogoutRequest){
    // formamos el url de la llamada
    let urlLogout: string = this.urlAPI + '/logout';
    
    return this.httpClient.post<LogoutResponse>(urlLogout, request);
  }
}
