"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type ProfileInfoFormProps = {
  onBack: () => void;
    userId?: number;
  // más adelante aquí puedes recibir initialProfile con datos desde Strapi
};


export function ProfileInfoForm({ onBack, userId }: ProfileInfoFormProps) {
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const [rutBody, setRutBody] = useState("");
  const [rutDv, setRutDv] = useState("");
  const [phoneRest, setPhoneRest] = useState("");

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedComuna, setSelectedComuna] = useState<string | null>(null);

  const handleSubmitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      userId, // 👈 importante
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
        setSavedMessage("Información guardada correctamente ✅");
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
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full p-1 hover:bg-neutral-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">INFO</h2>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmitInfo}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-4 text-xs"
      >
        {/* Preferencia de contacto */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
            RECIBE INFORMACIÓN DE MIS ENVÍOS POR
          </p>

          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                id="notifyWhatsapp"
                checked={notifyWhatsapp}
                onCheckedChange={(v) => setNotifyWhatsapp(!!v)}
              />
              <span className="text-xs">Whatsapp</span>
            </label>

            <label className="flex items-center gap-2">
              <Checkbox
                id="notifyEmail"
                checked={notifyEmail}
                onCheckedChange={(v) => setNotifyEmail(!!v)}
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
                    if (/^\d*$/.test(val)) {
                      setRutBody(val);
                    }
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
                    if (/^[0-9kK]?$/.test(val)) {
                      setRutDv(val.toUpperCase());
                    }
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
                  if (/^\d*$/.test(val)) {
                    setPhoneRest(val);
                  }
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
              <RegionCombobox
                value={selectedRegion}
                onChange={(val) => {
                  setSelectedRegion(val);
                  setSelectedComuna(null); // reset comuna si cambia región
                }}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Comuna</Label>
              <CommuneCombobox
                region={selectedRegion}
                value={selectedComuna}
                onChange={setSelectedComuna}
              />
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
            />
          </div>
        </div>

        {/* Mensajes de estado */}
        {savedMessage && (
          <p className="text-[11px] text-emerald-600">{savedMessage}</p>
        )}
        {errorMessage && (
          <p className="text-[11px] text-red-600">{errorMessage}</p>
        )}

        <Button
          type="submit"
          className="mt-2 w-full rounded-xl bg-black text-xs font-semibold tracking-wide text-white hover:bg-black/90"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar información"}
        </Button>
      </form>
    </div>
  );
}


