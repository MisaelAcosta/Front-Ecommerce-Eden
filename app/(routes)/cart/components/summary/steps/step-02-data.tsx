"use client";

import { useMemo, useState, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { readAccountProfile } from "@/lib/account-profile";
import { useCartWizard } from "@/hooks/use-cart-wizard";
import {
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "../../cart-fonts";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

type Props = {
  onContinue: () => void;
  onBack?: () => void;
};

type ProfileData = {
  nombre: string | null;
  rut: string | null;
  telefono: string | null;

  // (tu profile no tiene email; el email real viene en json.account.email)
  email?: string | null;
  region: string | null;
  comuna: string | null;
  calle: string | null;
  numero: string | null;
  depto: string | null;
  nota: string | null;
  notifyWhatsapp: boolean;
  notifyEmail: boolean;
};

type LocalProfileData = {
  name?: string | null;
  email?: string | null;
  rutBody?: string | null;
  rutDv?: string | null;
  phoneRest?: string | null;
};

const isValidEmail = (v?: string | null) => {
  const s = String(v ?? "").trim();
  return s.length >= 6 && s.includes("@") && s.includes(".");
};

const Step02Data = ({ onContinue, onBack }: Props) => {
  const { items } = useCart();
  const dvWrapRef = useRef<HTMLDivElement>(null);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0),
    [items]
  );

  // ✅ Wizard store
  const { step02, setStep02 } = useCartWizard();
  const { useAccount, name, rutBody, rutDv, phoneRest, email } = step02;
  const emailSafe = String(email ?? "");

  const setUseAccount = (v: boolean) => setStep02({ useAccount: v });
  const setName = (v: string) => setStep02({ name: v });
  const setRutBody = (v: string) => setStep02({ rutBody: v });
  const setRutDv = (v: string) => setStep02({ rutDv: v });
  const setPhoneRest = (v: string) => setStep02({ phoneRest: v });
  const setEmail = (v: string) => setStep02({ email: v });

  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountHint, setAccountHint] = useState<string | null>(null);

  const canContinue =
    items.length > 0 &&
    name.trim().length > 1 &&
    isValidEmail(email) &&
    rutBody.length === 8 &&
    rutDv.length === 1 &&
    phoneRest.length === 8;

  const applyFromLocalProfile = (p: LocalProfileData | null) => {
    if (!p) return false;

    let applied = false;

    if (p.name) {
      setName(String(p.name).trim());
      applied = true;
    }

    // ✅ email local (si lo guardas)
    if (p.email) {
      setEmail(String(p.email).trim());
      applied = true;
    }

    if (p.rutBody) {
      const body = String(p.rutBody).replace(/\D/g, "").slice(0, 8);
      if (body) {
        setRutBody(body);
        applied = true;
      }
    }

    if (p.rutDv) {
      const dv = String(p.rutDv).slice(0, 1).toUpperCase();
      if (dv) {
        setRutDv(dv);
        applied = true;
      }
    }

    if (p.phoneRest) {
      const phone = String(p.phoneRest).replace(/\D/g, "").slice(0, 8);
      if (phone) {
        setPhoneRest(phone);
        applied = true;
      }
    }

    return applied;
  };

  const applyFromStrapiProfile = (prof: ProfileData | null) => {
    if (!prof) return false;

    let applied = false;

    if (prof.nombre) {
      setName(String(prof.nombre).trim());
      applied = true;
    }

    // ❗OJO: el email real viene como json.account.email (no en prof)
    // Igual lo dejamos por si algún día lo agregas en el profile
    if (prof.email) {
      setEmail(String(prof.email).trim());
      applied = true;
    }

    // RUT tipo "12345678-K"
    if (prof.rut) {
      const [body, dv] = String(prof.rut).split("-");
      const cleanBody = String(body || "").replace(/\D/g, "").slice(0, 8);
      const cleanDv = String(dv || "").slice(0, 1).toUpperCase();

      if (cleanBody) {
        setRutBody(cleanBody);
        applied = true;
      }
      if (cleanDv) {
        setRutDv(cleanDv);
        applied = true;
      }
    }

    // Teléfono tipo "+56912345678"
    if (prof.telefono) {
      const match = String(prof.telefono).match(/^\+569(\d{8})$/);
      if (match?.[1]) {
        setPhoneRest(match[1]);
        applied = true;
      }
    }

    return applied;
  };

  return (
    <div className="w-full rounded-md border bg-white p-5 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="rounded-full p-1 hover:bg-muted disabled:opacity-40"
            aria-label="Volver"
          >
            <ArrowLeft size={16} />
          </button>

          <h3
            className={`${khInterferenceRegularFont.className} text-sm tracking-wide`}
          >
            DATOS
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-[3px] w-2 rounded-full bg-black/20" />
          <span className="h-[3px] w-6 rounded-full bg-black" />
          <span className="h-[3px] w-2 rounded-full bg-black/20" />
        </div>
      </div>

      <Separator className="my-3" />

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <p
          className={`${khInterferenceLightFont.className} text-[11px] text-muted-foreground`}
        >
          USAR DATOS DE MI CUENTA
        </p>

        <Switch
          checked={useAccount}
          disabled={loadingAccount}
          onCheckedChange={async (checked) => {
            setUseAccount(checked);

            if (!checked) {
              setAccountHint(null);
              return;
            }

            setLoadingAccount(true);
            setAccountHint(null);

            // 1) localStorage
            const pLocal = readAccountProfile();
            const appliedLocal = applyFromLocalProfile(pLocal);

            if (appliedLocal) {
              setAccountHint("* Se cargaron datos desde tu perfil (local).");
              setLoadingAccount(false);
              return;
            }

            // 2) Strapi
            try {
              const res = await fetch("/api/profile", {
                method: "GET",
                cache: "no-store",
              });

              const json = await res.json();

              // ✅ email real del user (users-permissions)
              const accountEmail: string | null = json?.account?.email ?? null;
              if (accountEmail) {
                setEmail(String(accountEmail).trim());
              }

              const prof: ProfileData | null = json?.profile ?? null;
              const appliedStrapi = applyFromStrapiProfile(prof);

              if (accountEmail || appliedStrapi) {
                setAccountHint("* Se cargaron datos desde tu cuenta.");
              } else {
                setAccountHint(
                  "* No encontramos datos guardados. Completa tu perfil en INFO."
                );
              }
            } catch {
              setAccountHint("* No se pudo cargar tu perfil. Intenta de nuevo.");
            } finally {
              setLoadingAccount(false);
            }
          }}
          aria-label="Usar datos de mi cuenta"
        />
      </div>

      <Separator className="my-3" />

      {/* Form */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-3">
          <Label className="text-xs text-black">Nombre</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            className="h-9"
          />
        </div>

        {/* Email */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-3">
          <Label className="text-xs text-black">Email</Label>
          <div className="space-y-1">
            <Input
              value={emailSafe}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="h-9"
              inputMode="email"
              autoComplete="email"
            />
            {emailSafe.length > 0 && !isValidEmail(email) && (
              <p className="text-[11px] text-muted-foreground">
                * Ingresa un email válido.
              </p>
            )}
          </div>
        </div>

        {/* RUT */}
        <div className="space-y-1">
          <Label className="text-[11px]">Rut</Label>

          <div className="flex items-center gap-1 shadow-none">
            <InputOTP
              maxLength={8}
              value={rutBody}
              onChange={(val) => {
                const onlyDigits = val.replace(/\D/g, "");
                const body = onlyDigits.slice(0, 8);
                const extra = onlyDigits.slice(8);

                setRutBody(body);

                if (extra.length > 0) {
                  const dvCandidate = extra.slice(0, 1);
                  if (/^[0-9kK]$/.test(dvCandidate)) {
                    setRutDv(dvCandidate.toUpperCase());
                  }
                  requestAnimationFrame(() => {
                    dvWrapRef.current?.querySelector("input")?.focus();
                  });
                  return;
                }

                if (body.length === 8) {
                  requestAnimationFrame(() => {
                    dvWrapRef.current?.querySelector("input")?.focus();
                  });
                }
              }}
            >
              <InputOTPGroup>
                {Array.from({ length: 8 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-8 w-6 text-xs" />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <InputOTPSeparator />

            {/* DV */}
            <div ref={dvWrapRef}>
              <InputOTP
                maxLength={1}
                value={rutDv}
                onChange={(val) => {
                  const clean = String(val || "")
                    .replace(/[^0-9kK]/g, "")
                    .slice(0, 1);
                  setRutDv(clean.toUpperCase());
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="h-8 w-6 text-xs"
                    onKeyDown={(e) => {
                      const allowed = [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                      ];

                      if (rutDv.length === 1 && !allowed.includes(e.key)) {
                        if (e.ctrlKey || e.metaKey) return;
                        e.preventDefault();
                      }
                    }}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-1">
          <Label className="text-[11px]">Teléfono</Label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white px-2 py-1 text-xs font-medium">
              +56 9
            </span>

            <InputOTP
              maxLength={8}
              value={phoneRest}
              onChange={(val) => /^\d*$/.test(val) && setPhoneRest(val)}
            >
              <InputOTPGroup>
                {Array.from({ length: 8 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-8 w-6 text-xs" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`${khInterferenceRegularFont.className} text-xs leading-4`}>
            ESTIMADO
          </p>
          <p className={`${khInterferenceRegularFont.className} text-xs leading-4`}>
            TOTAL
          </p>
        </div>
        <p className={`${khInterferenceLightFont.className} text-sm`}>
          {formatPrice(subtotal)}
        </p>
      </div>

      {/* CTA */}
      <Button
        className="mt-4 w-full bg-black text-white hover:bg-black/90"
        onClick={onContinue}
        disabled={!canContinue || loadingAccount}
      >
        {loadingAccount ? "CARGANDO..." : "CONTINUAR"}
      </Button>

      {/* Hint */}
      {useAccount && (
        <p
          className={`${khInterferenceLightFont.className} mt-3 text-[11px] text-muted-foreground`}
        >
          {accountHint ?? "* Cargando datos de tu cuenta..."}
        </p>
      )}
    </div>
  );
};

export default Step02Data;




