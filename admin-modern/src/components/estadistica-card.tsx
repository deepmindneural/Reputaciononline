"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";

interface EstadisticaCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  cambio?: number;
  description?: string;
  iconColor?: string;
}

export function EstadisticaCard({
  title,
  value,
  icon,
  cambio,
  description,
  iconColor = "bg-primary",
}: EstadisticaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={cn("p-2 rounded-full", iconColor)}>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {cambio !== undefined && (
            <div className="flex items-center text-xs mt-1">
              {cambio > 0 ? (
                <>
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">{cambio}%</span>
                </>
              ) : cambio < 0 ? (
                <>
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(cambio)}%</span>
                </>
              ) : (
                <span className="text-gray-500">Sin cambios</span>
              )}
              <span className="text-muted-foreground ml-1">
                desde el mes anterior
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
