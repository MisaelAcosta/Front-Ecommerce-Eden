// components/data/actions/auth-state.ts

// ✅ ESTADO PARA REGISTRO
export type RegisterState = {
  ok: boolean;
  message: string | null;
};

export const initialRegisterState: RegisterState = {
  ok: false,
  message: null,
};

// ✅ ESTADO PARA LOGIN
export type LoginState = {
  ok: boolean;
  message: string | null;
};

export const initialLoginState: LoginState = {
  ok: false,
  message: null,
};
