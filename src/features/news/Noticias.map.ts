import { INoticiasNormalizadas } from "./type";
import { INoticias } from "./fakeRest";
import { calculateMinutes, capitalizeTitle } from "./utils";


export const noticiasMapeadas = (noticias: INoticias[]): INoticiasNormalizadas[] => {
    return noticias.map((n) => ({
      id: n.id,
      titulo: capitalizeTitle(n.titulo),
      descripcion: n.descripcion,
      fecha: `Hace ${calculateMinutes(n.fecha)} minutos`,
      esPremium: n.esPremium,
      imagen: n.imagen,
      descripcionCorta: n.descripcion.substring(0, 100),
    }));
  };
  