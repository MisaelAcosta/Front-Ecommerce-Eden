"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

type TransitionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  children: ReactNode;
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export default function TransitionLink({
  children,
  href,
  onClick,
  target,
  ...props
}: TransitionLinkProps) {
  const { navigateWithTransition, shouldAnimateHref } = useNavigationTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Respetamos comportamientos nativos como abrir en nueva pestaña
    // y solo interceptamos navegacion interna elegible.
    onClick?.(event);

    if (
      event.defaultPrevented ||
      target === "_blank" ||
      isModifiedEvent(event) ||
      isExternalHref(href) ||
      !shouldAnimateHref(href)
    ) {
      return;
    }

    event.preventDefault();
    navigateWithTransition(href);
  };

  return (
    <Link href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
