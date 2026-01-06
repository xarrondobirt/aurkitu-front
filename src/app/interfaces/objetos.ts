export interface ObjetoPerdidoDTO {
  ubicacion: string;
  radio: number;
  idTipoObjeto: number;
  descripcion: string;
  marca?: string;
  serie?: string;
  idColor: number;
  fecha: string;
}

export interface TipoObjeto {
  id: number;
  descripcion: string;
}

export interface ColoresObjeto {
  id: number;
  descripcion: string;
}

export interface FiltroFecha {
  label: string;
  days: number;
}