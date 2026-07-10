import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface ReportExportToolbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: { header: string; key: string }[];
  filename: string;
  disabled?: boolean;
}

export function ReportExportToolbar({ data, columns, filename, disabled }: ReportExportToolbarProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportCSV = () => {
    try {
      const headers = columns.map(c => c.header).join(',');
      const rows = data.map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(','));
      const csv = [headers, ...rows].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert('Failed to generate CSV');
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const xlsx = await import('xlsx');
      const ws = xlsx.utils.json_to_sheet(data.map(row => {
        const out: Record<string, unknown> = {};
        columns.forEach(c => { out[c.header] = row[c.key]; });
        return out;
      }));
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Report');
      xlsx.writeFile(wb, `${filename}.xlsx`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const head = [columns.map(c => c.header)];
      const body = data.map(row => columns.map(c => row[c.key] ?? ''));
      
      doc.text(filename, 14, 15);
      autoTable(doc, {
        head,
        body,
        startY: 20,
      });
      
      doc.save(`${filename}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={disabled || isExporting} className="gap-2">
        <FileText className="h-4 w-4" />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={disabled || isExporting} className="gap-2">
        <FileSpreadsheet className="h-4 w-4 text-green-600" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={disabled || isExporting} className="gap-2">
        <Download className="h-4 w-4 text-red-600" />
        PDF
      </Button>
    </div>
  );
}
