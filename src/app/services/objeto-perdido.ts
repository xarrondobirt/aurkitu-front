import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjetoPerdidoDTO, TipoObjeto } from '../interfaces/objetos';
import { TokenService } from './token-service';


@Injectable({
  providedIn: 'root',
})

export class ObjetoPerdidoService {

  // URL
  private urlAPI: string = environment.apiUrl + '/v1/objeto'; 

  // Constructor. Inyectamos el servicio del token
  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}


  // POST nuevo objeto. Foto y documento opciones
  crearObjetoPerdido(request: ObjetoPerdidoDTO, foto?: File, doc?: File): Observable<any> {

    // tokens
    const headers = new HttpHeaders({
    //  'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.getAccessToken()
    });

    // formamos el url de la llamada
    let urlSetObject: string = this.urlAPI + '/guardar';

    const formData = new FormData();

    // JSON con tipo específico
    const jsonBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('objeto', jsonBlob);
    
    // Archivos opcionales
    if (foto) formData.append('foto', foto);
    if (doc) formData.append('factura', doc);
    
    return this.httpClient.post(urlSetObject, formData,{ headers });
  }


  // GET tipos de objeto
  obtenerTiposObjeto(): Observable<TipoObjeto[]> {
    // formamos la URL del endpoint
    const urlGetTipos: string = this.urlAPI + '/obtener-tipos';

    // tokens
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenService.getAccessToken()
    });

    return this.httpClient.get<TipoObjeto[]>(urlGetTipos, { headers });
  }

  
  // GET tipos de objeto
  obtenerColoresObjeto(): Observable<TipoObjeto[]> {
    // formamos la URL del endpoint
    const urlGetTipos: string = this.urlAPI + '/obtener-colores';

    // tokens
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenService.getAccessToken()
    });

    return this.httpClient.get<TipoObjeto[]>(urlGetTipos, { headers });
  }

  // POST buscar objetos perdidos
  buscarObjetos(filtros: any) {
    // formamos la URL del endpoint
    const urlBuscarObjetos: string = this.urlAPI + '/buscar';

    // tokens
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenService.getAccessToken()
    });

    return this.httpClient.post(urlBuscarObjetos, filtros,{ headers });
  }
  

}


