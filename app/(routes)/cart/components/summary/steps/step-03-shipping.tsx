"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import { readAccountProfile } from "@/lib/account-profile";
import { useCartWizard } from "@/hooks/use-cart-wizard";
import { getShippingCost } from "@/lib/shipping";
import {
  RegionCombobox,
  CommuneCombobox,
} from "@/components/profile/region-commune-select";

type Props = {
  onPay?: () => void;
  onBack?: () => void;
};

type ProfileData = {
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

type LocationLike =
  | string
  | {
      value?: string | null;
      label?: string | null;
      name?: string | null;
    }
  | null
  | undefined;

type LocalProfileData = {
  region?: LocationLike;
  comuna?: LocationLike;
  calle?: string | null;
  numero?: string | null;
  depto?: string | null;
  nota?: string | null;
};

type Step03Data = {
  useAccount: boolean;
  region: string | null;
  comuna: string | null;
  calle: string;
  numero: string;
  depto: string;
  nota: string;
  shippingCost?: number;
};

const normalizeLocationValue = (value: LocationLike): string | null => {
  if (!value) return null;

  if (typeof value === "string") {
    const clean = value.trim();
    return clean.length > 0 ? clean : null;
  }

  if (typeof value === "object") {
    const candidate =
      (typeof value.value === "string" && value.value.trim()) ||
      (typeof value.label === "string" && value.label.trim()) ||
      (typeof value.name === "string" && value.name.trim()) ||
      null;

    return candidate && candidate.length > 0 ? candidate : null;
  }

  return null;
};

const Step03Shipping = ({ onPay, onBack }: Props) => {
  const { items } = useCart();

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0),
    [items]
  );

  const { step03, setStep03 } = useCartWizard();
  const {
    useAccount,
    region,
    comuna,
    calle,
    numero,
    depto,
    nota,
    shippingCost: shippingCostFromStore,
  } = step03 as Step03Data;

  const setUseAccount = (v: boolean) => setStep03({ useAccount: v });
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountHint, setAccountHint] = useState<string | null>(null);

  const isAutofillingRef = useRef(false);

  const setRegion = (v: string | null) => setStep03({ region: v });
  const setComuna = (v: string | null) => setStep03({ comuna: v });
  const setCalle = (v: string) => setStep03({ calle: v });
  const setNumero = (v: string) => setStep03({ numero: v });
  const setDepto = (v: string) => setStep03({ depto: v });
  const setNota = (v: string) => setStep03({ nota: v });

  const shipping = useMemo(() => {
    return getShippingCost(region, comuna);
  }, [region, comuna]);

  const shippingCost = shipping.cost;

  useEffect(() => {
    if ((shippingCostFromStore ?? 0) !== shippingCost) {
      setStep03({ shippingCost });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingCost]);

  const total = subtotal + shippingCost;

  const canPay =
    items.length > 0 &&
    !!region &&
    !!comuna &&
    calle.trim().length > 2 &&
    numero.trim().length > 0;

  const applyFromLocalProfile = (p: LocalProfileData | null) => {
    if (!p) return false;

    let applied = false;

    const regionValue = normalizeLocationValue(p.region);
    const comunaValue = normalizeLocationValue(p.comuna);

    if (regionValue) {
      setRegion(regionValue);
      applied = true;
    }

    if (comunaValue) {
      setComuna(comunaValue);
      applied = true;
    }

    if (p.calle) {
      setCalle(String(p.calle).trim());
      applied = true;
    }

    if (p.numero) {
      setNumero(String(p.numero).trim());
      applied = true;
    }

    if (p.depto) {
      setDepto(String(p.depto).trim());
      applied = true;
    }

    if (p.nota) {
      setNota(String(p.nota).trim());
      applied = true;
    }

    return applied;
  };

  const applyFromStrapiProfile = (prof: ProfileData | null) => {
    if (!prof) return false;

    let applied = false;

    if (prof.region) {
      setRegion(String(prof.region));
      applied = true;
    }
    if (prof.comuna) {
      setComuna(String(prof.comuna));
      applied = true;
    }
    if (prof.calle) {
      setCalle(String(prof.calle).trim());
      applied = true;
    }
    if (prof.numero) {
      setNumero(String(prof.numero).trim());
      applied = true;
    }
    if (prof.depto) {
      setDepto(String(prof.depto).trim());
      applied = true;
    }
    if (prof.nota) {
      setNota(String(prof.nota).trim());
      applied = true;
    }

    return applied;
  };

  return (
    <div className="w-full rounded-md border bg-white p-5 shadow-none">
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

          <h3 className="text-sm font-semibold tracking-wide">ENVÍO Y PAGO</h3>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-[3px] w-2 rounded-full bg-black/20" />
          <span className="h-[3px] w-2 rounded-full bg-black/20" />
          <span className="h-[3px] w-6 rounded-full bg-black" />
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">
          USAR DIRECCIÓN DE MI CUENTA
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
            isAutofillingRef.current = true;

            try {
              const pLocal = readAccountProfile();
              const appliedLocal = applyFromLocalProfile(pLocal);

              if (appliedLocal) {
                setAccountHint("* Se cargó tu dirección desde tu perfil (local).");
                return;
              }

              const res = await fetch("/api/profile", {
                method: "GET",
                cache: "no-store",
              });

              const json = await res.json();
              const prof: ProfileData | null = json?.profile ?? null;

              const appliedStrapi = applyFromStrapiProfile(prof);

              if (appliedStrapi) {
                setAccountHint("* Se cargó tu dirección desde tu perfil.");
              } else {
                setAccountHint(
                  "* No encontramos dirección guardada. Completa tu perfil en INFO."
                );
              }
            } catch {
              setAccountHint("* No se pudo cargar tu dirección. Intenta de nuevo.");
            } finally {
              isAutofillingRef.current = false;
              setLoadingAccount(false);
            }
          }}
          aria-label="Usar dirección de mi cuenta"
        />
      </div>

      {useAccount && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {accountHint ?? "* Cargando dirección de tu cuenta..."}
        </p>
      )}

      <Separator className="my-3" />

      <div className="space-y-4">
        <p className="text-[11px] font-medium text-muted-foreground">
          DIRECCIÓN DE ENVÍO
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[11px]">Región</Label>
            <RegionCombobox
              value={region}
              onChange={(val) => {
                setRegion(val);

                if (!isAutofillingRef.current) {
                  setComuna(null);
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[11px]">Comuna</Label>
            <CommuneCombobox region={region} value={comuna} onChange={setComuna} />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[11px]">Calle</Label>
          <Input
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
            placeholder="Ej: Av. Siempre Viva"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[11px]">Número</Label>
            <Input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="123"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[11px]">Depto (Opcional)</Label>
            <Input
              value={depto}
              onChange={(e) => setDepto(e.target.value)}
              placeholder="Dpto 45"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[11px]">Nota (Opcional)</Label>
          <Textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: Dejar en conserjería / llamar al llegar"
            className="min-h-[70px]"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Subtotal</p>
          <p className="text-xs font-semibold">{formatPrice(subtotal)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">Envío</p>
            {shippingCost > 0 && (
              <p className="text-[10px] text-muted-foreground">{shipping.label}</p>
            )}
          </div>
          <p className="text-xs font-semibold">
            {shippingCost > 0 ? formatPrice(shippingCost) : "—"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-semibold">TOTAL FINAL</p>
          <p className="text-sm font-semibold">{formatPrice(total)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md border bg-neutral-50 p-3">
        <ShieldCheck className="h-4 w-4" />
        <p className="text-[11px] text-neutral-700">
          Compra segura • 
        </p>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 text-[10px]">
          <CreditCard className="h-3.5 w-3.5" />
          Flow
        </span>
      </div>

      <Button
        className="mt-4 w-full bg-black text-white hover:bg-black/90"
        onClick={onPay}
        disabled={!canPay || loadingAccount}
      >
        {loadingAccount ? "CARGANDO..." : "PAGAR"}
      </Button>

      {!canPay && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          * Completa región, comuna, calle y número para continuar.
        </p>
      )}
    </div>
  );
};

export default Step03Shipping;
