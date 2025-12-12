export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  // luego aquí puedes agregar campos de perfil cuando los traigas desde Strapi
};

export type ProfileView = "menu" | "compras" | "info";

// devolucion de informacion guardada en el perfil
export type ProfileData = {
  nombre: string | null;
  rut: string | null;
  telefono: string | null;
  region: string | null;
  comuna: string | null;
  calle: string | null;
  numero: string | null;
  depto: string | null;
  nota: string | null;
  notifyWhatsapp: boolean;
  notifyEmail: boolean;
};
