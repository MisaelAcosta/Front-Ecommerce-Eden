"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const interference = localFont({
  src: "../fonts/KHInterferenceTRIAL-Regular.otf",
  display: "swap",
});

type AuthCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

export function AuthCard({
  title,
  children,
  className,
  compact = false,
}: AuthCardProps) {
  return (
    <section
      className={cn(
        interference.className,
        "relative w-full max-w-[540px] rounded-[14px] bg-black px-7 py-12 text-white shadow-2xl sm:px-16",
        compact ? "sm:py-16" : "sm:py-14",
        className
      )}
    >
      <DialogClose asChild>
        <button className="absolute right-5 top-5 
        inline-flex size-9 cursor-pointer items-center 
        justify-center rounded-full border border-white/15
         text-white/70 transition hover:border-white/40 
         hover:text-white">
          <X className="size-4" />
          <span className="sr-only">Cerrar</span>
        </button>
      </DialogClose>

      <Image
        src="/icons/op/white_ilust.png"
        alt="Eden"
        width={96}
        height={96}
        priority
        className="mb-8 size-20 object-contain sm:size-24"
      />

      {title ? (
        <h1 className="mb-5 text-[32px] leading-none 
        tracking-[0] text-white sm:text-[34px]">
          {title}
        </h1>
      ) : null}

      {children}
    </section>
  );
}

export const authInputClassName =
  "h-14 rounded-[8px] border-0 bg-[#232323] px-5 text-[13px] uppercase tracking-[0] text-white shadow-none placeholder:text-white/25 focus-visible:ring-1 focus-visible:ring-white/45";

export const authPrimaryButtonClassName =
  "h-[58px] rounded-[8px] bg-[#bdbdbd] text-[18px] font-normal uppercase tracking-[0] text-white shadow-none transition hover:bg-white hover:text-black disabled:bg-[#7d7d7d]";

export const authLinkClassName =
  "cursor-pointer text-[13px] uppercase tracking-[0] text-white/70 transition hover:text-white";
