type LocationOption = {
  value: string;
  label: string;
};

export type AccountProfile = {
  name?: string;

  rutBody?: string; // 8 dígitos
  rutDv?: string;   // 1 dígito o K

  phoneRest?: string; // 8 dígitos (sin +56 9)

  // envío
  calle?: string;
  numero?: string;
  depto?: string;

  // combobox
  region?: LocationOption;
  comuna?: LocationOption;
};

export const ACCOUNT_PROFILE_KEY = "eden-profile";

export const readAccountProfile = (): AccountProfile | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(ACCOUNT_PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AccountProfile;
  } catch {
    return null;
  }
};

export const writeAccountProfile = (profile: AccountProfile) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_PROFILE_KEY, JSON.stringify(profile));
};

export const clearAccountProfile = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCOUNT_PROFILE_KEY);
};