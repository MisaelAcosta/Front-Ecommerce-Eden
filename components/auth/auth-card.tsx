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
        "relative w-full max-w-[560px]  bg-black px-6 py-8 text-white shadow-2xl sm:px-10 sm:py-10 md:px-14",
        compact ? "md:py-14" : "md:py-12",
        className
      )}
    >
      <DialogClose asChild>
        <button className="absolute right-5 top-5 
        inline-flex size-9 cursor-pointer items-center 
        justify-center border border-white/15
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
        className="mb-6 size-14 object-contain sm:mb-8 sm:size-20 md:size-24"
      />

      {title ? (
        <h1 className="mb-5 text-[26px] leading-none 
        tracking-[0] text-white sm:text-[32px] md:text-[34px]">
          {title}
        </h1>
      ) : null}

      {children}
    </section>
  );
}

export const authInputClassName =
  "h-[52px] border-0 bg-[#232323] px-4 font-sans text-[12px] normal-case tracking-normal text-white shadow-none placeholder:uppercase placeholder:tracking-[0] placeholder:text-white/25 focus-visible:ring-1 focus-visible:ring-white/45 sm:h-14 sm:px-5 sm:text-[13px]";

export const authPrimaryButtonClassName =
  "h-[52px]  bg-[#bdbdbd] text-[16px] font-normal uppercase tracking-[0] text-white shadow-none transition hover:bg-white hover:text-black disabled:bg-[#7d7d7d] sm:h-[58px] sm:text-[18px]";

export const authLinkClassName =
  "cursor-pointer text-[11px] uppercase tracking-[0] text-white/70 transition hover:text-white sm:text-[13px]";
