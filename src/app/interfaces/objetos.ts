export interface ObjetoPerdidoDTO {
  ubicacion: string;
  radio: number;
  idTipoObjeto: number;
  descripcion: string;
  marca?: string;
  numSerie?: string;
  idColor: number;
  fechaPerdida: string;
}

export interface TipoObjeto {
  id: number;
  descripcion: string;
}

export interface ColoresObjeto {
  id: number;
  descripcion: string;
}