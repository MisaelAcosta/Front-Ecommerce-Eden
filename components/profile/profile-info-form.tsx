"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
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
import { Separator } from "@radix-ui/react-separator";

type ProfileInfoFormProps = {
  onBack: () => void;
  userId: number;
  initialProfile?: ProfileData | null;
};

// ESTILO REUTILIZABLE - ETIQUETAS
// Mantiene todos los labels del formulario con la tipografia y jerarquia visual de Eden.
const labelClassName = `${khInterferenceRegularFont.className} text-[11px] uppercase`;

// ESTILO REUTILIZABLE - CAMPOS DE TEXTO
// Altura fija, borde claro y fondo negro. `disabled:opacity-60` diferencia lectura de edicion.
const inputClassName =
  "h-10 rounded-none border-white/35 bg-black text-xs text-white placeholder:text-white/35 disabled:opacity-60";

export function ProfileInfoForm({
  onBack,
  userId,
  initialProfile,
}: ProfileInfoFormProps) {
  // ESTADO DE EDICION
  // Si no existe perfil, el formulario abre editable para que el cliente complete sus datos.
  const [isEditing, setIsEditing] = useState(() => !initialProfile);

  // ESTADOS DE GUARDADO
  // Controlan el boton y los mensajes visuales de exito o error bajo el formulario.
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PREFERENCIAS DE AVISO
  // Se guardan en Strapi y definen el canal de actualizaciones de envio.
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(
    () => initialProfile?.notifyWhatsapp ?? false
  );
  const [notifyEmail, setNotifyEmail] = useState(
    () => initialProfile?.notifyEmail ?? true
  );

  // RUT Y TELEFONO
  // Se separan para controlar los campos OTP y luego se reconstruyen antes de guardar.
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
  // UBICACION
  // Region y comuna alimentan los comboboxes; cambiar region limpia la comuna seleccionada.
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    () => initialProfile?.region ?? null
  );
  const [selectedComuna, setSelectedComuna] = useState<string | null>(
    () => initialProfile?.comuna ?? null
  );

  // RESTABLECER EDICION
  // Recupera los valores cargados desde Strapi al presionar Cancelar.
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

  // AVISO DE SOLO LECTURA
  // Captura intentos sobre campos bloqueados y explica como habilitar su edicion.
  const handleReadOnlyFieldAttempt = (
    event: React.PointerEvent<HTMLFormElement>
  ) => {
    if (isEditing) return;

    const target = event.target as HTMLElement;
    const isFormControl = target.closest(
      "input, textarea, button, [role=checkbox]"
    );

    if (!isFormControl) return;

    event.preventDefault();
    toast.info("Activa Editar para modificar tu informacion.");
  };

  // GUARDAR PERFIL
  // Construye el payload para `/api/profile` y replica los datos relevantes en localStorage
  // para que el checkout pueda autocompletar el despacho sin otra consulta.
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
    // CONTENEDOR GENERAL DE INFO
    // `flex` y `h-full` mantienen la cabecera fija y permiten desplazarse solo en el formulario.
    <div className="flex h-full flex-col bg-black text-white shadow-none">
      {/* CABECERA: boton volver, etiqueta de contexto y accion Editar/Cancelar. */}
      <header className="flex items-center justify-between border-b border-white/20
       px-5 pb-5 pt-14">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver al perfil"
            className="
              inline-flex size-8 items-center cursor-pointer justify-center
              transition-colors 
            "
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <div>
            <p
              className={`${khInterferenceLightFont.className} text-[10px] 
              tracking-widest text-white/55`}
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

        {/* BOTON EDITAR: solo aparece si ya existen datos persistidos en el perfil. */}
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
            className={`${khInterferenceLightFont.className}
              cursor-pointer  px-3 py-2 text-[10px] tracking-widest uppercase
              transition-colors hover:text-white`}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        )}
      </header>

      {/* FORMULARIO DESPLAZABLE: no cambia el alto de la cabecera al tener muchos campos. */}
      <form
        onSubmit={handleSubmitInfo}
        onPointerDownCapture={handleReadOnlyFieldAttempt}
        className="flex-1 space-y-10 overflow-y-auto px-5 py-6 text-xs"
      >
        

        {/* BLOQUE 02 - DATOS DE ENVIO: nombre, RUT y telefono del destinatario. */}
        <section className="space-y-4 pt-5">
          {/* TITULO DE SECCION: linea verde decorativa + tipografia principal. */}
          <div className="flex items-center gap-3">
            <span className="h-5 w-2 bg-[#ADFE00]" />
            <p
              className={`${khInterferenceRegularFont.className} text-[20px] 
              uppercase leading-none`}
            >
              Datos de envio
            </p>
          </div>

          {/* CAMPO NOMBRE: valor de texto que se envia como `nombre` al backend. */}
          <div className="space-y-3">
            {/* CAMPO RUT: ocho digitos, separador y digito verificador. */}
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

            {/* CAMPO TELEFONO: prefijo fijo +56 9 y ocho digitos locales. */}
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
                        className="h-9 w-6 rounded-none border-white/35 
                        bg-black text-xs text-white"
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
                      className="h-9 w-6 rounded-none border-white/35 bg-black text-xs text-white"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-1">
              <Label className={labelClassName}>Telefono</Label>
              <div className="flex items-center gap-2">
                <span
                  className={`${khInterferenceLightFont.className} border
                   border-white/35 bg-black px-2 py-2 text-[12px] text-white`}
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
                        className="h-9 w-6 border-white/35 bg-black text-xs text-white"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>
        </section>


        {/* BLOQUE 03 - DIRECCION: datos usados para el despacho durante el checkout. */}
        <section className="space-y-4 border-t border-white/20 pt-10">
          {/* TITULO DE SECCION: mantiene el mismo recurso visual verde que Datos de envio. */}
          <div className="flex items-center gap-3">
            <span className="h-5 w-2  bg-[#ADFE00]" />
            <p
              className={`${khInterferenceRegularFont.className} text-[20px] 
              uppercase leading-none`}
            >
              Dirección
            </p>
          </div>

          {/* SELECTORES REGION Y COMUNA: dos columnas de igual ancho. */}
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

          {/* CAMPO CALLE: ocupa todo el ancho disponible. */}
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

          {/* CAMPOS NUMERO Y DEPTO: comparten una fila para reducir desplazamiento. */}
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

          {/* CAMPO NOTA: textarea alto para indicaciones de entrega opcionales. */}
          <div className="space-y-1">
            <Label htmlFor="nota" className={labelClassName}>
              Nota (opcional)
            </Label>
            <Textarea
              id="nota"
              name="nota"
              className="min-h-[88px] rounded-none border-white/35 bg-black text-xs text-white placeholder:text-white/35 disabled:opacity-60"
              defaultValue={initialProfile?.nota ?? ""}
              disabled={!isEditing}
            />
          </div>
        </section>

        {/* MENSAJE DE EXITO: borde y fondo verde Eden despues de guardar. */}
        {savedMessage && (
          <p
            className={`${khInterferenceLightFont.className} border-l-4 border-[#ADFE00] bg-[#ADFE00]/20 px-3 py-2 text-[11px] uppercase`}
          >
            {savedMessage}
          </p>
        )}
        {/* MENSAJE DE ERROR: conserva el formulario y explica que el guardado fallo. */}
        {errorMessage && (
          <p
            className={`${khInterferenceLightFont.className} border-l-4 border-red-400 bg-red-950/50 px-3 py-2 text-[11px] uppercase text-red-200`}
          >
            {errorMessage}
          </p>
        )}

        {/* ACCION FINAL: solo es visible en modo edicion para evitar guardados accidentales. */}
        {isEditing && (
          <Button
            type="submit"
            className={`${khInterferenceLightFont.className}
              mt-2 h-12 w-full rounded-none bg-white text-[13px] uppercase text-black
              hover:bg-[#ADFE00] hover:text-black`}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar informacion"}
          </Button>
        )}
      </form>
    </div>
  );
}
