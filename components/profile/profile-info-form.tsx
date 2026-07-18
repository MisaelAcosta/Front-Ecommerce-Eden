"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  khInterferenceBoldFont,
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "@/app/(routes)/cart/components/cart-fonts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { writeAccountProfile } from "@/lib/account-profile";
import { CommuneCombobox, RegionCombobox } from "./region-commune-select";
import type { ProfileData } from "./profile-types";

type ProfileInfoFormProps = {
  onBack: () => void;
  userId: number;
  initialProfile?: ProfileData | null;
};

const labelClassName = `${khInterferenceRegularFont.className} text-[11px] uppercase`;
const inputClassName =
  "h-10 rounded-none border-black bg-white text-xs disabled:opacity-60";

export function ProfileInfoForm({
  onBack,
  userId,
  initialProfile,
}: ProfileInfoFormProps) {
  const [isEditing, setIsEditing] = useState(() => !initialProfile);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [notifyWhatsapp, setNotifyWhatsapp] = useState(
    () => initialProfile?.notifyWhatsapp ?? false
  );
  const [notifyEmail, setNotifyEmail] = useState(
    () => initialProfile?.notifyEmail ?? true
  );

  const [rutBody, setRutBody] = useState(() => {
    if (!initialProfile?.rut) return "";
    const [body] = initialProfile.rut.split("-");
    return body ?? "";
  });
  const [rutDv, setRutDv] = useState(() => {
    if (!initialProfile?.rut) return "";
    const [, dv] = initialProfile.rut.split("-");
    return dv ?? "";
  });
  const [phoneRest, setPhoneRest] = useState(() => {
    if (!initialProfile?.telefono) return "";
    const match = initialProfile.telefono.match(/^\+569(\d{8})$/);
    return match ? match[1] : "";
  });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    () => initialProfile?.region ?? null
  );
  const [selectedComuna, setSelectedComuna] = useState<string | null>(
    () => initialProfile?.comuna ?? null
  );

  const resetFromInitial = () => {
    setNotifyWhatsapp(initialProfile?.notifyWhatsapp ?? false);
    setNotifyEmail(initialProfile?.notifyEmail ?? true);

    if (initialProfile?.rut) {
      const [body, dv] = initialProfile.rut.split("-");
      setRutBody(body ?? "");
      setRutDv(dv ?? "");
    } else {
      setRutBody("");
      setRutDv("");
    }

    if (initialProfile?.telefono) {
      const match = initialProfile.telefono.match(/^\+569(\d{8})$/);
      setPhoneRest(match ? match[1] : "");
    } else {
      setPhoneRest("");
    }

    setSelectedRegion(initialProfile?.region ?? null);
    setSelectedComuna(initialProfile?.comuna ?? null);
  };

  const handleSubmitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEditing) return;

    setSaving(true);
    setSavedMessage(null);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const rutFormatted =
      rutBody.trim() && rutDv.trim()
        ? `${rutBody.trim()}-${rutDv.trim()}`
        : "";
    const phoneFormatted = phoneRest.trim() ? `+569${phoneRest.trim()}` : "";
    const payload = {
      userId,
      notifyWhatsapp,
      notifyEmail,
      nombre: (formData.get("nombre") || "").toString(),
      rut: rutFormatted,
      telefono: phoneFormatted,
      region: selectedRegion || null,
      comuna: selectedComuna || null,
      calle: (formData.get("calle") || "").toString(),
      numero: (formData.get("numero") || "").toString(),
      depto: (formData.get("depto") || "").toString(),
      nota: (formData.get("nota") || "").toString(),
    };

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setErrorMessage("Hubo un problema al guardar tu informacion.");
        return;
      }

      writeAccountProfile({
        name: payload.nombre.trim(),
        rutBody: rutBody.trim(),
        rutDv: rutDv.trim().toUpperCase(),
        phoneRest: phoneRest.trim(),
        region: payload.region
          ? { value: payload.region, label: payload.region }
          : undefined,
        comuna: payload.comuna
          ? { value: payload.comuna, label: payload.comuna }
          : undefined,
        calle: payload.calle.trim(),
        numero: payload.numero.trim(),
        depto: payload.depto.trim(),
      });

      setSavedMessage("Informacion guardada correctamente.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado al guardar perfil:", error);
      setErrorMessage("Error inesperado al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#fafafa] text-black">
      <header className="flex items-center justify-between border-b border-black px-5 pb-5 pt-14">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver al perfil"
            className="inline-flex size-8 items-center justify-center border border-black transition-colors hover:bg-[#ADFE00]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <div>
            <p
              className={`${khInterferenceLightFont.className} text-[10px] uppercase text-black/55`}
            >
              Mi cuenta
            </p>
            <h2
              className={`${khInterferenceBoldFont.className} mt-1 text-[29px] uppercase leading-none`}
            >
              Info
            </h2>
          </div>
        </div>

        {initialProfile && (
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                resetFromInitial();
                setSavedMessage(null);
                setErrorMessage(null);
              }
              setIsEditing((value) => !value);
            }}
            className={`${khInterferenceRegularFont.className} border border-black px-3 py-2 text-[10px] uppercase transition-colors hover:bg-[#ADFE00]`}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        )}
      </header>

      <form
        onSubmit={handleSubmitInfo}
        className="flex-1 space-y-7 overflow-y-auto px-5 py-6 text-xs"
      >
        <section className="border-y border-black py-4">
          <p
            className={`${khInterferenceLightFont.className} text-[10px] uppercase text-black/60`}
          >
            Recibir informacion de mis envios por
          </p>
          <div className="mt-4 flex gap-5">
            <label
              className={`${khInterferenceRegularFont.className} flex items-center gap-2 text-[12px] uppercase`}
            >
              <Checkbox
                id="notifyWhatsapp"
                checked={notifyWhatsapp}
                onCheckedChange={(value) => {
                  if (isEditing) setNotifyWhatsapp(!!value);
                }}
                disabled={!isEditing}
              />
              <span>Whatsapp</span>
            </label>
            <label
              className={`${khInterferenceRegularFont.className} flex items-center gap-2 text-[12px] uppercase`}
            >
              <Checkbox
                id="notifyEmail"
                checked={notifyEmail}
                onCheckedChange={(value) => {
                  if (isEditing) setNotifyEmail(!!value);
                }}
                disabled={!isEditing}
              />
              <span>Correo</span>
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#ADFE00]" />
            <p
              className={`${khInterferenceBoldFont.className} text-[20px] uppercase leading-none`}
            >
              Datos de envio
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="nombre" className={labelClassName}>
                Nombre y apellido
              </Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Juan Perez"
                className={inputClassName}
                defaultValue={initialProfile?.nombre ?? ""}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-1">
              <Label className={labelClassName}>Rut</Label>
              <div className="flex items-center gap-1">
                <InputOTP
                  maxLength={8}
                  value={rutBody}
                  onChange={(value) => {
                    if (isEditing && /^\d*$/.test(value)) setRutBody(value);
                  }}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-9 w-6 rounded-none border-black bg-white text-xs"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                </InputOTP>
                <InputOTP
                  maxLength={1}
                  value={rutDv}
                  onChange={(value) => {
                    if (isEditing && /^[0-9kK]?$/.test(value)) {
                      setRutDv(value.toUpperCase());
                    }
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-9 w-6 rounded-none border-black bg-white text-xs"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-1">
              <Label className={labelClassName}>Telefono</Label>
              <div className="flex items-center gap-2">
                <span
                  className={`${khInterferenceRegularFont.className} border border-black bg-white px-2 py-2 text-[12px]`}
                >
                  +56 9
                </span>
                <InputOTP
                  maxLength={8}
                  value={phoneRest}
                  onChange={(value) => {
                    if (isEditing && /^\d*$/.test(value)) setPhoneRest(value);
                  }}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-9 w-6 rounded-none border-black bg-white text-xs"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-black pt-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#ADFE00]" />
            <p
              className={`${khInterferenceBoldFont.className} text-[20px] uppercase leading-none`}
            >
              Direccion
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className={labelClassName}>Region</Label>
              <div className={!isEditing ? "pointer-events-none opacity-60" : ""}>
                <RegionCombobox
                  value={selectedRegion}
                  onChange={(value) => {
                    setSelectedRegion(value);
                    setSelectedComuna(null);
                  }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className={labelClassName}>Comuna</Label>
              <div className={!isEditing ? "pointer-events-none opacity-60" : ""}>
                <CommuneCombobox
                  region={selectedRegion}
                  value={selectedComuna}
                  onChange={setSelectedComuna}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="calle" className={labelClassName}>
              Calle
            </Label>
            <Input
              id="calle"
              name="calle"
              className={inputClassName}
              defaultValue={initialProfile?.calle ?? ""}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="numero" className={labelClassName}>
                Numero
              </Label>
              <Input
                id="numero"
                name="numero"
                className={inputClassName}
                defaultValue={initialProfile?.numero ?? ""}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="depto" className={labelClassName}>
                Depto (opcional)
              </Label>
              <Input
                id="depto"
                name="depto"
                className={inputClassName}
                defaultValue={initialProfile?.depto ?? ""}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="nota" className={labelClassName}>
              Nota (opcional)
            </Label>
            <Textarea
              id="nota"
              name="nota"
              className="min-h-[88px] rounded-none border-black bg-white text-xs disabled:opacity-60"
              defaultValue={initialProfile?.nota ?? ""}
              disabled={!isEditing}
            />
          </div>
        </section>

        {savedMessage && (
          <p
            className={`${khInterferenceRegularFont.className} border-l-4 border-[#ADFE00] bg-[#ADFE00]/20 px-3 py-2 text-[11px] uppercase`}
          >
            {savedMessage}
          </p>
        )}
        {errorMessage && (
          <p
            className={`${khInterferenceRegularFont.className} border-l-4 border-red-600 bg-red-50 px-3 py-2 text-[11px] uppercase text-red-700`}
          >
            {errorMessage}
          </p>
        )}

        {isEditing && (
          <Button
            type="submit"
            className={`${khInterferenceRegularFont.className} mt-2 h-12 w-full rounded-none bg-black text-[13px] uppercase text-white hover:bg-[#ADFE00] hover:text-black`}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar informacion"}
          </Button>
        )}
      </form>
    </div>
  );
}
