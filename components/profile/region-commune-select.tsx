"use client";

import { useState } from "react";
import regionesComunas from "@/regiones y comunas/comunas-regiones.json";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type RegionesData = {
  regiones: {
    region: string;
    comunas: string[];
  }[];
};

const regionesChile = (regionesComunas as unknown as RegionesData).regiones;

export type RegionComboboxProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  onRegionChangeResetComuna?: () => void;
};

export function RegionCombobox({
  value,
  onChange,
  onRegionChangeResetComuna,
}: RegionComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    regionesChile.find((r) => r.region === value)?.region ?? "Selecciona región";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border bg-neutral-100 px-3 text-left text-xs",
            !value && "text-neutral-400"
          )}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Buscar región..." />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {regionesChile.map((region) => (
                <CommandItem
                  key={region.region}
                  value={region.region}
                  onSelect={(val) => {
                    onChange(val);
                    onRegionChangeResetComuna?.();
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === region.region ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{region.region}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type CommuneComboboxProps = {
  region: string | null;
  value: string | null;
  onChange: (value: string | null) => void;
};

export function CommuneCombobox({
  region,
  value,
  onChange,
}: CommuneComboboxProps) {
  const [open, setOpen] = useState(false);

  const comunas =
    regionesChile.find((r) => r.region === region)?.comunas ?? [];

  const selectedLabel =
    comunas.includes(value ?? "") && value ? value : "Selecciona comuna";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border bg-neutral-100 px-3 text-left text-xs",
            !value && "text-neutral-400"
          )}
          disabled={!region}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Buscar comuna..." />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {comunas.map((comuna) => (
                <CommandItem
                  key={comuna}
                  value={comuna}
                  onSelect={(val) => {
                    onChange(val);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === comuna ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{comuna}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
