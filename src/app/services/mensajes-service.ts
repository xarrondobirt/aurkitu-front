import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MensajesRequest, ConversacionResponse, SetMensajeRequest, MensajesResponse, ConversacionDetalleResponse } from '../interfaces/messages';

@Injectable({
  providedIn: 'root',
})

// servicio para gestionar las conversaciones y los mensajes -- TODO VALIDAR SERVICIO
export class MensajesService {
  // url del backend mensaje
  private urlAPI: string = environment.apiUrl + '/v1/mensaje'; 
  
  constructor(private httpClient: HttpClient) { }

  // método que devuelve las conversaciones del usuario
  getConversaciones(request: MensajesRequest): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + request.accessToken
    });

    // formamos el url de la llamada
    let urlGetConversaciones: string = this.urlAPI + '/conversaciones';
    
    console.log(urlGetConversaciones);
    
    const respuesta = this.httpClient.get<ConversacionResponse[]>(urlGetConversaciones, {headers});
    return respuesta;
  }
  // método para obtener los mensajes de una determinada conversacion
  getMensajesConversacionById(idConversacion: number, request: MensajesRequest): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + request.accessToken
    });

    let urlGetMensajes = this.urlAPI + '/conversacion/' + idConversacion + '/mensajes';
    console.log(urlGetMensajes);
    
    const respuesta = this.httpClient.get<ConversacionDetalleResponse[]>(urlGetMensajes, {headers});
    return respuesta;
  }

  // método para enviar un nuevo mensaje
  sendMessage(request: MensajesRequest, requestMensaje: SetMensajeRequest): Observable<MensajesResponse>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + request.accessToken
    });

    let urlSetMensaje = this.urlAPI + '/enviar';
    console.log(urlSetMensaje);
    
    const respuesta = this.httpClient.post<MensajesResponse>(urlSetMensaje, requestMensaje, {headers});
    return respuesta;
  }

  // método para cerrar el caso del objeto perdido
  cerrarCaso(idObjeto: number, request: MensajesRequest): Observable<MensajesResponse>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + request.accessToken
    });

    let urlCerrarCaso = this.urlAPI + '/cerrar-caso/'+ idObjeto;
    console.log(urlCerrarCaso);
    
    const respuesta = this.httpClient.put<MensajesResponse>(urlCerrarCaso, request, {headers});
    return respuesta;
  }
}
