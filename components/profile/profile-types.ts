export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  // luego aquí puedes agregar campos de perfil cuando los traigas desde Strapi
};

export type ProfileView = "menu" | "compras" | "info";
