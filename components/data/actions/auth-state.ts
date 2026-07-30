// components/data/actions/auth-state.ts

// Estado para registro.
export type RegisterState = {
  ok: boolean;
  message: string | null;
};

export const initialRegisterState: RegisterState = {
  ok: false,
  message: null,
};

// Estado para login.
export type LoginState = {
  ok: boolean;
  message: string | null;
};

export const initialLoginState: LoginState = {
  ok: false,
  message: null,
};
