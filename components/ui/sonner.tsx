"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      position="bottom-right"
      duration={3200}
      visibleToasts={4}
      mobileOffset={16}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#1B2C1C",
          "--normal-text": "#ADFE00",
          "--normal-border": "rgba(173, 254, 0, 0.3)",
          // Mantiene los avisos de exito, como "Sesion iniciada", dentro de la paleta Eden.
          "--success-bg": "#1B2C1C",
          "--success-border": "rgba(173, 254, 0, 0.3)",
          "--success-text": "#ADFE00",
          "--border-radius": "10px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "eden-toast group/toast border border-[#ADFE00]/30 bg-[#1B2C1C] text-[#ADFE00] shadow-[0_18px_50px_rgba(0,0,0,0.22)]",
          title: "text-sm font-semibold text-[#ADFE00]",
          description: "text-xs text-[#ADFE00]/70",
          actionButton:
            "bg-[#ADFE00] text-[#1B2C1C] hover:bg-[#C0FF01] text-xs font-semibold",
          closeButton:
            "border-[#ADFE00]/30 bg-[#1B2C1C] text-[#ADFE00] hover:bg-[#ADFE00]/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
