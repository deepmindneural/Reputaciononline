// src/components/ui/dropdown-menu/index.tsx
"use client";

import * as React from "react";
import { FaChevronRight, FaCheck } from "react-icons/fa";

type DropdownMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
};

type DropdownMenuItemProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  inset?: boolean;
};

export function DropdownMenu({ trigger, children, align = "end" }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Cierra el menú cuando se hace clic fuera de él
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute ${alignmentClasses[align]} z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  return children;
}

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DropdownMenuItem({
  children,
  disabled = false,
  onSelect,
  inset = false,
}: DropdownMenuItemProps) {
  return (
    <div
      onClick={() => {
        if (!disabled && onSelect) onSelect();
      }}
      className={`${inset ? "pl-8" : "pl-4"} pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 dark:border-gray-700 my-1" />;
}

export function DropdownMenuLabel({ children, inset = false }: { children: React.ReactNode; inset?: boolean }) {
  return (
    <div
      className={`${inset ? "pl-8" : "pl-4"} pr-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function DropdownMenuShortcut({ children }: { children: React.ReactNode }) {
  return <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{children}</span>;
}

export function DropdownMenuSub({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const subMenuRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative"
      ref={subMenuRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        {trigger}
        <FaChevronRight className="ml-auto h-4 w-4" />
      </div>

      {open && (
        <div className="absolute left-full top-0 z-10 mt-0 ml-1 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function DropdownMenuRadioGroup({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return <div value={value} onChange={e => onValueChange(e.toString())}>{children}</div>;
}

export function DropdownMenuRadioItem({
  children,
  value,
  disabled = false,
}: {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
}) {
  const radioGroup = React.useContext({ value: "", onChange: (_: any) => {} } as any);
  const checked = radioGroup.value === value;

  return (
    <div
      className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => {
        if (!disabled) {
          radioGroup.onChange(value);
        }
      }}
    >
      <div className="mr-2 h-3.5 w-3.5">
        {checked && <FaCheck className="h-3.5 w-3.5" />}
      </div>
      {children}
    </div>
  );
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => {
        if (!disabled) {
          onCheckedChange(!checked);
        }
      }}
    >
      <div className="mr-2 h-3.5 w-3.5">
        {checked && <FaCheck className="h-3.5 w-3.5" />}
      </div>
      {children}
    </div>
  );
}
