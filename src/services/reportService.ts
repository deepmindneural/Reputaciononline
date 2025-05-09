import { SearchResult, Mention, Rating } from '@/services/searchService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ReportOptions {
  title: string;
  format: 'pdf' | 'excel' | 'csv';
  includeImages?: boolean;
  includeMentions?: boolean;
  includeRatings?: boolean;
  filterBySentiment?: 'all' | 'positive' | 'neutral' | 'negative';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  customLogo?: string;
  customHeader?: string;
  customFooter?: string;
}

export interface ReportData {
  entity?: SearchResult;
  entities?: SearchResult[];
  mentions?: Mention[];
  dateGenerated: Date;
  generatedBy: string;
  customData?: any;
}

/**
 * Servicio para generar y exportar reportes en diferentes formatos.
 */
class ReportService {
  
  /**
   * Genera un reporte a partir de los datos proporcionados
   * @param data Datos para el reporte
   * @param options Opciones de generación
   * @returns URL del archivo generado o blob
   */
  async generateReport(data: ReportData, options: ReportOptions): Promise<string | Blob> {
    switch (options.format) {
      case 'pdf':
        return this.generatePDFReport(data, options);
      case 'excel':
        return this.generateExcelReport(data, options);
      case 'csv':
        return this.generateCSVReport(data, options);
      default:
        throw new Error(`Formato no soportado: ${options.format}`);
    }
  }

  /**
   * Genera un reporte en formato PDF
   */
  private async generatePDFReport(data: ReportData, options: ReportOptions): Promise<Blob> {
    // Crear documento PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Añadir encabezado personalizado si existe
    if (options.customHeader) {
      doc.setFontSize(10);
      doc.text(options.customHeader, pageWidth / 2, 10, { align: 'center' });
    }
    
    // Añadir título
    doc.setFontSize(16);
    doc.text(options.title, pageWidth / 2, 20, { align: 'center' });
    
    // Añadir fecha de generación
    doc.setFontSize(10);
    const dateText = `Generado el: ${data.dateGenerated.toLocaleDateString('es-CO')} por ${data.generatedBy}`;
    doc.text(dateText, pageWidth / 2, 30, { align: 'center' });
    
    let currentY = 40;
    
    // Información de la entidad si existe
    if (data.entity) {
      doc.setFontSize(12);
      doc.text(`Entidad: ${data.entity.name}`, 14, currentY);
      currentY += 7;
      doc.setFontSize(10);
      doc.text(`Tipo: ${this.getEntityTypeText(data.entity.type)}`, 14, currentY);
      currentY += 7;
      doc.text(`Puntuación: ${data.entity.overallScore.toFixed(1)}`, 14, currentY);
      currentY += 7;
      doc.text(`Sentimiento: ${this.getSentimentText(data.entity.overallSentiment)}`, 14, currentY);
      currentY += 12;
    }
    
    // Lista de entidades si existe
    if (data.entities && data.entities.length > 0) {
      const tableColumn = ['Nombre', 'Tipo', 'Puntuación', 'Sentimiento'];
      const tableRows = data.entities.map(entity => [
        entity.name,
        this.getEntityTypeText(entity.type),
        entity.overallScore.toFixed(1),
        this.getSentimentText(entity.overallSentiment)
      ]);
      
      doc.setFontSize(12);
      doc.text('Entidades', 14, currentY);
      currentY += 7;
      
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [0, 153, 153] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Menciones si existen y están incluidas en las opciones
    if (data.mentions && data.mentions.length > 0 && options.includeMentions) {
      let filteredMentions = data.mentions;
      
      // Filtrar por sentimiento si se especifica
      if (options.filterBySentiment && options.filterBySentiment !== 'all') {
        filteredMentions = data.mentions.filter(m => m.sentiment === options.filterBySentiment);
      }
      
      // Filtrar por fecha si se especifica
      if (options.dateRange) {
        filteredMentions = filteredMentions.filter(m => {
          const mentionDate = new Date(m.date);
          return mentionDate >= options.dateRange!.startDate && mentionDate <= options.dateRange!.endDate;
        });
      }
      
      if (filteredMentions.length > 0) {
        const tableColumn = ['Fuente', 'Fecha', 'Autor', 'Contenido', 'Sentimiento'];
        const tableRows = filteredMentions.map(mention => [
          mention.source,
          new Date(mention.date).toLocaleDateString('es-CO'),
          mention.author || '-',
          mention.text.length > 50 ? mention.text.substring(0, 47) + '...' : mention.text,
          this.getSentimentText(mention.sentiment)
        ]);
        
        doc.setFontSize(12);
        doc.text('Menciones', 14, currentY);
        currentY += 7;
        
        (doc as any).autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: currentY,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [0, 153, 153] },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          columnStyles: {
            3: { cellWidth: 80 }
          }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }
    }
    
    // Pie de página personalizado si existe
    if (options.customFooter) {
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.text(options.customFooter, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // Devolver como blob
    return doc.output('blob');
  }

  /**
   * Genera un reporte en formato Excel
   */
  private async generateExcelReport(data: ReportData, options: ReportOptions): Promise<Blob> {
    const workbook = XLSX.utils.book_new();
    
    // Información general
    const infoSheet = XLSX.utils.aoa_to_sheet([
      ['Reporte: ' + options.title],
      ['Fecha de generación:', data.dateGenerated.toLocaleDateString('es-CO')],
      ['Generado por:', data.generatedBy],
      []
    ]);
    
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información');
    
    // Entidad principal
    if (data.entity) {
      const entityData = [
        ['Nombre', 'Tipo', 'Puntuación', 'Sentimiento', 'Descripción'],
        [
          data.entity.name,
          this.getEntityTypeText(data.entity.type),
          data.entity.overallScore.toFixed(1),
          this.getSentimentText(data.entity.overallSentiment),
          data.entity.description
        ]
      ];
      
      const entitySheet = XLSX.utils.aoa_to_sheet(entityData);
      XLSX.utils.book_append_sheet(workbook, entitySheet, 'Entidad Principal');
    }
    
    // Lista de entidades
    if (data.entities && data.entities.length > 0) {
      const entitiesData = [
        ['Nombre', 'Tipo', 'Puntuación', 'Sentimiento', 'Descripción', 'URL']
      ];
      
      data.entities.forEach(entity => {
        entitiesData.push([
          entity.name,
          this.getEntityTypeText(entity.type),
          entity.overallScore.toFixed(1),
          this.getSentimentText(entity.overallSentiment),
          entity.description,
          entity.url
        ]);
      });
      
      const entitiesSheet = XLSX.utils.aoa_to_sheet(entitiesData);
      XLSX.utils.book_append_sheet(workbook, entitiesSheet, 'Entidades');
    }
    
    // Menciones
    if (data.mentions && data.mentions.length > 0 && options.includeMentions) {
      let filteredMentions = data.mentions;
      
      // Filtrar por sentimiento si se especifica
      if (options.filterBySentiment && options.filterBySentiment !== 'all') {
        filteredMentions = data.mentions.filter(m => m.sentiment === options.filterBySentiment);
      }
      
      // Filtrar por fecha si se especifica
      if (options.dateRange) {
        filteredMentions = filteredMentions.filter(m => {
          const mentionDate = new Date(m.date);
          return mentionDate >= options.dateRange!.startDate && mentionDate <= options.dateRange!.endDate;
        });
      }
      
      if (filteredMentions.length > 0) {
        const mentionsData = [
          ['Fuente', 'Fecha', 'Autor', 'Contenido', 'Sentimiento', 'Likes', 'Compartidos', 'URL']
        ];
        
        filteredMentions.forEach(mention => {
          mentionsData.push([
            mention.source,
            new Date(mention.date).toLocaleDateString('es-CO'),
            mention.author || '-',
            mention.text,
            this.getSentimentText(mention.sentiment),
            mention.likes?.toString() || '-',
            mention.shares?.toString() || '-',
            mention.url || '-'
          ]);
        });
        
        const mentionsSheet = XLSX.utils.aoa_to_sheet(mentionsData);
        XLSX.utils.book_append_sheet(workbook, mentionsSheet, 'Menciones');
      }
    }
    
    // Generar archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Genera un reporte en formato CSV
   */
  private async generateCSVReport(data: ReportData, options: ReportOptions): Promise<Blob> {
    let csvContent = `"Reporte: ${options.title}"
"Fecha de generación:","${data.dateGenerated.toLocaleDateString('es-CO')}"
"Generado por:","${data.generatedBy}"

`;
    
    // Entidad principal
    if (data.entity) {
      csvContent += '\n"ENTIDAD PRINCIPAL"\n';
      csvContent += '"Nombre","Tipo","Puntuación","Sentimiento","Descripción"\n';
      csvContent += `"${data.entity.name}","${this.getEntityTypeText(data.entity.type)}","${data.entity.overallScore.toFixed(1)}","${this.getSentimentText(data.entity.overallSentiment)}","${data.entity.description.replace(/"/g, '""')}"\n`;
    }
    
    // Lista de entidades
    if (data.entities && data.entities.length > 0) {
      csvContent += '\n"ENTIDADES"\n';
      csvContent += '"Nombre","Tipo","Puntuación","Sentimiento","Descripción","URL"\n';
      
      data.entities.forEach(entity => {
        csvContent += `"${entity.name}","${this.getEntityTypeText(entity.type)}","${entity.overallScore.toFixed(1)}","${this.getSentimentText(entity.overallSentiment)}","${entity.description.replace(/"/g, '""')}","${entity.url}"\n`;
      });
    }
    
    // Menciones
    if (data.mentions && data.mentions.length > 0 && options.includeMentions) {
      let filteredMentions = data.mentions;
      
      // Filtrar por sentimiento si se especifica
      if (options.filterBySentiment && options.filterBySentiment !== 'all') {
        filteredMentions = data.mentions.filter(m => m.sentiment === options.filterBySentiment);
      }
      
      // Filtrar por fecha si se especifica
      if (options.dateRange) {
        filteredMentions = filteredMentions.filter(m => {
          const mentionDate = new Date(m.date);
          return mentionDate >= options.dateRange!.startDate && mentionDate <= options.dateRange!.endDate;
        });
      }
      
      if (filteredMentions.length > 0) {
        csvContent += '\n"MENCIONES"\n';
        csvContent += '"Fuente","Fecha","Autor","Contenido","Sentimiento","Likes","Compartidos","URL"\n';
        
        filteredMentions.forEach(mention => {
          csvContent += `"${mention.source}","${new Date(mention.date).toLocaleDateString('es-CO')}","${(mention.author || '-').replace(/"/g, '""')}","${mention.text.replace(/"/g, '""')}","${this.getSentimentText(mention.sentiment)}","${mention.likes || '-'}","${mention.shares || '-'}","${mention.url || '-'}"\n`;
        });
      }
    }
    
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Obtiene el texto del tipo de entidad
   */
  private getEntityTypeText(type: string): string {
    switch (type) {
      case 'person':
        return 'Persona';
      case 'company':
        return 'Empresa';
      case 'product':
        return 'Producto';
      case 'agency':
        return 'Agencia';
      case 'hotel':
        return 'Hotel';
      case 'place':
        return 'Lugar';
      case 'news':
        return 'Noticia';
      case 'reviews':
        return 'Reseña';
      case 'related':
        return 'Relacionado';
      default:
        return 'Entidad';
    }
  }

  /**
   * Obtiene el texto del sentimiento
   */
  private getSentimentText(sentiment: string): string {
    switch (sentiment) {
      case 'positive':
        return 'Positivo';
      case 'negative':
        return 'Negativo';
      default:
        return 'Neutral';
    }
  }

  /**
   * Descarga un archivo generado
   */
  downloadFile(content: Blob, fileName: string): void {
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
}

export const reportService = new ReportService();
