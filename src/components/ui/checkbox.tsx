"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** 
   * Event handler llamado cuando cambia el estado del checkbox.
   * Soporta tanto la API de Radix UI (onCheckedChange) como la de HTML (onChange)
   */
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * Checkbox simple con estilos shadcn (sin dependencia Radix).
 * Compatible con las props de Radix UI para facilitar la migración.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, checked, defaultChecked, ...props }, ref) => {
    // Gestionar el estado interno si no se proporciona checked o defaultChecked
    const [internalChecked, setInternalChecked] = React.useState<boolean>(defaultChecked || false);
    
    // Estado controlado o no controlado
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;
    
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // Si no es controlado, actualiza el estado interno
        if (!isControlled) {
          setInternalChecked(event.target.checked);
        }
        
        // Llamar a ambos handlers si están definidos
        if (onChange) {
          onChange(event);
        }
        
        if (onCheckedChange) {
          onCheckedChange(event.target.checked);
        }
      },
      [isControlled, onChange, onCheckedChange]
    );

    return (
      <label className="relative inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "appearance-none h-4 w-4 shrink-0 rounded-sm border border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "peer",
            className,
          )}
          checked={isControlled ? isChecked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          onChange={handleChange}
          {...props}
        />
        <span className="pointer-events-none absolute left-0 top-0 flex h-4 w-4 items-center justify-center peer-checked:visible peer-checked:bg-primary peer-checked:text-primary-foreground invisible rounded-sm">
          <Check className="h-3 w-3" />
        </span>
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
