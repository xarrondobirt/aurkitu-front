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


  // POST nuevo objeto
  crearObjetoPerdido(request: ObjetoPerdidoDTO, foto?: File, doc?: File): Observable<any> {
    //return this.http.post(this.urlAPI, objeto);

    console.log(this.urlAPI);
    console.log(request);
    

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

      console.log(jsonBlob.type);
      
      // Archivos opcionales
      if (foto) formData.append('foto', foto);
      if (doc) formData.append('factura', doc);
      
      return this.httpClient.post(urlSetObject, formData,{ headers });
    
    //return this.httpClient.post(urlSetObject, request,{ headers });

  }

  // GET tipos de objeto
  obtenerTiposObjeto(): Observable<TipoObjeto[]> {
  // formamos la URL del endpoint
  const urlGetTipos: string = this.urlAPI + '/obtener-tipos';

  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.tokenService.getAccessToken()
  });

  return this.httpClient.get<TipoObjeto[]>(urlGetTipos, { headers });
  }

  // GET tipos de objeto
  obtenerColoresObjeto(): Observable<TipoObjeto[]> {
  // formamos la URL del endpoint
  const urlGetTipos: string = this.urlAPI + '/obtener-colores';

  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.tokenService.getAccessToken()
  });

  return this.httpClient.get<TipoObjeto[]>(urlGetTipos, { headers });
  }
}




