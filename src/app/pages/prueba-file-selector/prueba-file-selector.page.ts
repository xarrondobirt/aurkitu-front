import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { AurkituFileSelectorComponent } from '../../components/aurkitu-file-selector/aurkitu-file-selector.component';

@Component({
  selector: 'app-prueba-file-selector',
  templateUrl: './prueba-file-selector.page.html',
  styleUrls: ['./prueba-file-selector.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AurkituFileSelectorComponent
  ]
})
export class PruebaFileSelectorPage {

  // URL al endpoint de subida
  private urlAPI: string = environment.apiUrl + '/v1/objeto/guardar';

  manualToken: string = '';
  selectedPhoto: File | null = null;
  selectedDocument: File | null = null;
  isSubmitting = false;

  // 1. OBJETO JSON DE PRUEBA
  readonly OBJETO_TEST = {
    ubicacion: { latitud: 43.3560, longitud: -2.3250 },
    radio: 1050,
    idTipoObjeto: 7,
    descripcion: "Paraguas estrafalario",
    idColor: 1,
    fecha: "2025-12-25T18:10:00Z"
  };

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  onPhotoChange(file: File | null) {
    this.selectedPhoto = file;
  }

  onDocumentChange(file: File | null) {
    this.selectedDocument = file;
  }

  async enviarDatos() {
    if (!this.manualToken) {
      this.mostrarToast('Falta el Token JWT', 'warning');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    formData.append('objeto', new Blob([JSON.stringify(this.OBJETO_TEST)], { type: 'application/json' }));
    formData.append('idUsuario', '18');
    if (this.selectedPhoto) {
      formData.append('foto', this.selectedPhoto);
    }
    if (this.selectedDocument) {
      formData.append('factura', this.selectedDocument);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.manualToken}`
    });

    this.http.post(this.urlAPI, formData, { headers }).subscribe({
      next: (response) => {
        console.log('Subida ok:', response);
        this.mostrarToast('¡Objeto subido correctamente!', 'success');
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error en subida:', err);
        const errorMsg = err.error?.message || err.statusText || 'Error desconocido';
        this.mostrarToast(`Error: ${errorMsg}`, 'danger');
        this.isSubmitting = false;
      }
    });
  }

  async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color });
    t.present();
  }
}
