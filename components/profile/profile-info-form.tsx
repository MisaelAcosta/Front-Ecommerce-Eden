// components/profile/profile-info-form.tsx
"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { writeAccountProfile } from "@/lib/account-profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

import { RegionCombobox, CommuneCombobox } from "./region-commune-select";
import type { ProfileData } from "./profile-types";

type ProfileInfoFormProps = {
  onBack: () => void;
  userId: number;
  initialProfile?: ProfileData | null;
};

export function ProfileInfoForm({
  onBack,
  userId,
  initialProfile,
}: ProfileInfoFormProps) {
  // 🔹 Modo edición
  const [isEditing, setIsEditing] = useState(() => !initialProfile);

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preferencias
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(
    () => initialProfile?.notifyWhatsapp ?? false
  );
  const [notifyEmail, setNotifyEmail] = useState(
    () => initialProfile?.notifyEmail ?? true
  );

  // RUT: partimos el "cuerpo-dv"
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

  // Teléfono: quitar +569
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

  //  Reset a los valores originales cuando el usuario cancela edición
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

  const handleSubmitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditing) return; // seguridad

    setSaving(true);
    setSavedMessage(null);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    const rutFormatted =
      rutBody.trim() && rutDv.trim()
        ? `${rutBody.trim()}-${rutDv.trim()}`
        : "";

    const phoneFormatted = phoneRest.trim()
      ? `+569${phoneRest.trim()}`
      : "";

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

    console.log("Payload enviado a /api/profile:", payload);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Error guardando perfil:", await res.text());
        setErrorMessage("Hubo un problema al guardar tu información.");
      } else {
        // 1) Guardamos en localStorage para que el checkout pueda autocompletar
        writeAccountProfile({
        name: payload.nombre?.trim(),
        rutBody: rutBody.trim(),
        rutDv: rutDv.trim().toUpperCase(),
        phoneRest: phoneRest.trim(),
        region: payload.region
          ? { value: payload.region, label: payload.region }
          : undefined,
        comuna: payload.comuna
          ? { value: payload.comuna, label: payload.comuna }
          : undefined,
        calle: payload.calle?.trim(),
        numero: payload.numero?.trim(),
        depto: payload.depto?.trim(),
      });

        // ✅ 2) UI feedback
        setSavedMessage("Información guardada correctamente ✅");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setErrorMessage("Error inesperado al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full p-1 hover:bg-neutral-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight">INFO</h2>
        </div>

        {/* Botón editar / cancelar */}
        {initialProfile && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                type="button"
                onClick={() => {
                  resetFromInitial();
                  setIsEditing(false);
                  setSavedMessage(null);
                  setErrorMessage(null);
                }}
                className="text-[11px] font-medium text-neutral-500 hover:underline"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[11px] pt-10  cursor-pointer font-medium text-black hover:underline"
              >
                Editar información
              </button>
            )}
          </div>
        )}
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmitInfo}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-4 text-xs"
      >
        {/* Preferencia de contacto */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
            RECIBIR INFORMACIÓN DE MIS ENVÍOS POR
          </p>

          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                id="notifyWhatsapp"
                checked={notifyWhatsapp}
                onCheckedChange={(v) => {
                  if (!isEditing) return;
                  setNotifyWhatsapp(!!v);
                }}
                disabled={!isEditing}
              />
              <span className="text-xs">Whatsapp</span>
            </label>

            <label className="flex items-center gap-2">
              <Checkbox
                id="notifyEmail"
                checked={notifyEmail}
                onCheckedChange={(v) => {
                  if (!isEditing) return;
                  setNotifyEmail(!!v);
                }}
                disabled={!isEditing}
              />
              <span className="text-xs">Correo</span>
            </label>
          </div>
        </div>

        {/* Datos de envío */}
        <div className="space-y-3">
          <p className="text-[15px] font-black uppercase tracking-[0.12em]">
            DATOS DE ENVÍO
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nombre" className="text-[11px]">
                Nombre y Apellido
              </Label>
              <Input
                placeholder="Juan Perez"
                id="nombre"
                name="nombre"
                className="h-9 bg-neutral-100 text-xs"
                defaultValue={initialProfile?.nombre ?? ""}
                disabled={!isEditing}
              />
            </div>

            {/* RUT con OTP */}
            <div className="space-y-1">
              <Label className="text-[11px]">Rut</Label>
              <div className="flex items-center gap-1">
                <InputOTP
                  maxLength={8}
                  value={rutBody}
                  onChange={(val) => {
                    if (!isEditing) return;
                    if (/^\d*$/.test(val)) setRutBody(val);
                  }}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-8 w-6 bg-white text-xs"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                </InputOTP>

                <InputOTP
                  maxLength={1}
                  value={rutDv}
                  onChange={(val) => {
                    if (!isEditing) return;
                    if (/^[0-9kK]?$/.test(val)) setRutDv(val.toUpperCase());
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-8 w-6 bg-white text-xs"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>

          {/* Teléfono con prefijo +56 9 y OTP */}
          <div className="space-y-1">
            <Label className="text-[11px]">Teléfono</Label>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white px-2 py-1 text-[15px] font-medium">
                +56 9
              </span>
              <InputOTP
                maxLength={8}
                value={phoneRest}
                onChange={(val) => {
                  if (!isEditing) return;
                  if (/^\d*$/.test(val)) setPhoneRest(val);
                }}
              >
                <InputOTPGroup>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-8 w-6 bg-white text-xs"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-3">
          <p className="text-[15px] font-black uppercase tracking-[0.12em]">
            DIRECCIÓN
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">Región</Label>
              <div className={!isEditing ? "opacity-60 pointer-events-none" : ""}>
                <RegionCombobox
                  value={selectedRegion}
                  onChange={(val) => {
                    setSelectedRegion(val);
                    setSelectedComuna(null);
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Comuna</Label>
              <div className={!isEditing ? "opacity-60 pointer-events-none" : ""}>
                <CommuneCombobox
                  region={selectedRegion}
                  value={selectedComuna}
                  onChange={setSelectedComuna}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="calle" className="text-[11px]">
              Calle
            </Label>
            <Input
              id="calle"
              name="calle"
              className="h-9 rounded-md bg-neutral-100 text-xs"
              defaultValue={initialProfile?.calle ?? ""}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="numero" className="text-[11px]">
                Número
              </Label>
              <Input
                id="numero"
                name="numero"
                className="h-9 rounded-md bg-neutral-100 text-xs"
                defaultValue={initialProfile?.numero ?? ""}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="depto" className="text-[11px]">
                Depto (Opcional)
              </Label>
              <Input
                id="depto"
                name="depto"
                className="h-9 rounded-md bg-neutral-100 text-xs"
                defaultValue={initialProfile?.depto ?? ""}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="nota" className="text-[11px]">
              Nota (Opcional)
            </Label>
            <Textarea
              id="nota"
              name="nota"
              className="min-h-[70px] rounded-md bg-neutral-100 text-xs"
              defaultValue={initialProfile?.nota ?? ""}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Mensajes de estado */}
        {savedMessage && (
          <p className="text-[11px] text-emerald-600">{savedMessage}</p>
        )}
        {errorMessage && <p className="text-[11px] text-red-600">{errorMessage}</p>}

        {/* Botón guardar solo si se está editando */}
        {isEditing && (
          <Button
            type="submit"
            className="mt-2 w-full rounded-xl bg-black text-xs font-semibold tracking-wide text-white hover:bg-black/90"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar información"}
          </Button>
        )}
      </form>
    </div>
  );
}




