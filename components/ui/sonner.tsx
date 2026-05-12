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
      richColors
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
          "--normal-bg": "#ffffff",
          "--normal-text": "#111111",
          "--normal-border": "rgba(0, 0, 0, 0.12)",
          "--border-radius": "10px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "eden-toast group/toast border border-black/10 bg-white text-black shadow-[0_18px_50px_rgba(0,0,0,0.14)]",
          title: "text-sm font-semibold",
          description: "text-xs text-black/60",
          actionButton:
            "bg-black text-white hover:bg-black/85 text-xs font-semibold",
          closeButton: "border-black/10 bg-white text-black",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
