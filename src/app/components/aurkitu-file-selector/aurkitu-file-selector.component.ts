import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// Importamos los iconos
import {
  imagesOutline,
  folderOpenOutline,
  addCircle,
  trash,
  documentText,
  checkmarkCircle
} from 'ionicons/icons';

@Component({
  selector: 'aurkitu-file-selector',
  templateUrl: './aurkitu-file-selector.component.html',
  styleUrls: ['./aurkitu-file-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AurkituFileSelectorComponent {

  @Input() type: 'image' | 'document' = 'image';
  @Input() label: string = 'Adjuntar evidencia';
  @Output() fileSelected = new EventEmitter<File | null>();

  previewUrl: string | null = null;
  fileName: string | null = null;

  uniqueId = 'file-input-' + Math.random().toString(36).substr(2, 9);

  public icos = {
    image: imagesOutline,
    folder: folderOpenOutline,
    add: addCircle,
    trash: trash,
    doc: documentText,
    check: checkmarkCircle
  };

  constructor() { }

  async handleSelection() {
    if (this.previewUrl || this.fileName) return;

    if (this.type === 'image') {
      await this.openGallery();
    } else {
      this.openFileBrowser();
    }
  }

  async openGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `foto_${Date.now()}.${image.format}`, { type: blob.type });

        this.previewUrl = image.webPath;
        this.fileSelected.emit(file);
      }
    } catch (error) {
      console.log('Cancelado:', error);
    }
  }

  openFileBrowser() {
    document.getElementById(this.uniqueId)?.click();
  }

  onNativeFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileSelected.emit(file);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.previewUrl = null;
    this.fileName = null;
    this.fileSelected.emit(null);
    const input = document.getElementById(this.uniqueId) as HTMLInputElement;
    if (input) input.value = '';
  }
}
