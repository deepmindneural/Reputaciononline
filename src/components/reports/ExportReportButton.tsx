"use client";

import React, { useState } from 'react';
import { Download, FileType, FileCog, X, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { reportService, ReportOptions, ReportData } from '@/services/reportService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchResult, Mention } from '@/services/searchService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface ExportReportButtonProps {
  entity?: SearchResult;
  entities?: SearchResult[];
  mentions?: Mention[];
  customData?: any;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

export default function ExportReportButton({
  entity,
  entities,
  mentions,
  customData,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
}: ExportReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [reportTitle, setReportTitle] = useState(`Reporte de ${entity ? entity.name : 'Reputaciu00f3n Online'}`);
  const [includeMentions, setIncludeMentions] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeRatings, setIncludeRatings] = useState(true);
  const [filterBySentiment, setFilterBySentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [date, setDate] = useState<DateRange | undefined>();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Configurar opciones del reporte
      const reportOptions: ReportOptions = {
        title: reportTitle,
        format: reportFormat,
        includeImages,
        includeMentions,
        includeRatings,
        filterBySentiment,
        dateRange: date && date.from && date.to ? {
          startDate: date.from,
          endDate: date.to
        } : undefined,
        customHeader: 'Reputaciu00f3n Online',
        customFooter: 'u00a9 ' + new Date().getFullYear() + ' Reputaciu00f3n Online - Todos los derechos reservados',
      };

      // Configurar datos del reporte
      const reportData: ReportData = {
        entity,
        entities,
        mentions,
        dateGenerated: new Date(),
        generatedBy: 'Usuario',
        customData,
      };

      // Generar el reporte
      const result = await reportService.generateReport(reportData, reportOptions);

      // Descargar el archivo
      const fileName = `${reportTitle.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.${reportFormat}`;
      reportService.downloadFile(result as Blob, fileName);

      // Cerrar el diu00e1logo
      setOpen(false);
    } catch (err) {
      console.error('Error al exportar el reporte:', err);
      setError('Ocurriu00f3 un error al generar el reporte. Por favor, intu00e9ntalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <Download className="h-4 w-4" />
        <span>Exportar reporte</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar reporte</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-title">Tu00edtulo del reporte</Label>
              <Input
                id="report-title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid gap-2">
              <Label>Formato</Label>
              <RadioGroup
                defaultValue={reportFormat}
                onValueChange={(value) => setReportFormat(value as 'pdf' | 'excel' | 'csv')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label htmlFor="format-pdf" className="flex items-center gap-1">
                    <FileType className="h-4 w-4 text-red-500" />
                    PDF
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="format-excel" />
                  <Label htmlFor="format-excel" className="flex items-center gap-1">
                    <FileType className="h-4 w-4 text-green-500" />
                    Excel
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label htmlFor="format-csv" className="flex items-center gap-1">
                    <FileType className="h-4 w-4 text-gray-500" />
                    CSV
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Incluir en el reporte</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-mentions"
                    checked={includeMentions}
                    onCheckedChange={(checked) => setIncludeMentions(checked as boolean)}
                  />
                  <Label htmlFor="include-mentions">Menciones</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-images"
                    checked={includeImages}
                    onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                  />
                  <Label htmlFor="include-images">Imu00e1genes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-ratings"
                    checked={includeRatings}
                    onCheckedChange={(checked) => setIncludeRatings(checked as boolean)}
                  />
                  <Label htmlFor="include-ratings">Calificaciones</Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Filtrar por sentimiento</Label>
              <Select 
                value={filterBySentiment} 
                onValueChange={(value) => setFilterBySentiment(value as 'all' | 'positive' | 'neutral' | 'negative')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar sentimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="positive">Positivos</SelectItem>
                  <SelectItem value="neutral">Neutrales</SelectItem>
                  <SelectItem value="negative">Negativos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Rango de fechas</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'PPP', { locale: es })} -{' '}
                          {format(date.to, 'PPP', { locale: es })}
                        </>
                      ) : (
                        format(date.from, 'PPP', { locale: es })
                      )
                    ) : (
                      <span>Seleccionar peru00edodo</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={es}
                  />
                  <div className="flex justify-end gap-2 p-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setDate(undefined);
                        setDatePickerOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setDatePickerOpen(false)}
                    >
                      Aplicar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && (
            <div className="text-red-500 py-2 text-sm">
              {error}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
