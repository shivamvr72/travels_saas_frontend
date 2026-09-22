import { Trip } from '@/features/trips/domain/trip-types';
import { Invoice } from '@/features/finance/domain/finance-types';
import { format } from 'date-fns';

export async function generateInvoicePDF(
  trip: Trip,
  invoice?: Invoice | null,
  customFilename?: string
) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const tripNumber = trip.trip_number || 'TRP-' + trip.id.slice(0, 8).toUpperCase();
  const invoiceNumber = invoice?.invoice_number || `INV-${tripNumber}`;
  const filename = customFilename || `${invoiceNumber}.pdf`;

  // 1. Header Banner
  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SVR TRAVELS', 14, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('FLEET OPERATIONS & TRAVEL SERVICES', 14, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('TAX INVOICE', 196, 17, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`Invoice #: ${invoiceNumber}`, 196, 24, { align: 'right' });

  // 2. Metadata Section (2 columns)
  let y = 42;
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BILLED TO:', 14, y);
  doc.text('TRIP & INVOICE DETAILS:', 115, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  const customerName =
    trip.customer?.name ||
    trip.company?.name ||
    'Valued Customer';
  const customerPhone = trip.customer?.phone || '—';
  const pickupAddress = trip.origin || '—';

  doc.text(`Customer / Company: ${customerName}`, 14, y);
  doc.text(`Trip Number: ${tripNumber}`, 115, y);

  y += 4.5;
  doc.text(`Phone: ${customerPhone}`, 14, y);
  const tripDateStr = trip.start_date
    ? format(new Date(trip.start_date), 'dd MMM yyyy')
    : '—';
  doc.text(`Trip Date: ${tripDateStr}`, 115, y);

  y += 4.5;
  doc.text(`Pickup: ${pickupAddress.slice(0, 45)}`, 14, y);
  const invoiceDateStr = invoice?.invoice_date
    ? format(new Date(invoice.invoice_date), 'dd MMM yyyy')
    : format(new Date(), 'dd MMM yyyy');
  doc.text(`Invoice Date: ${invoiceDateStr}`, 115, y);

  y += 4.5;
  const destinationStr = trip.destination || '—';
  doc.text(`Route: ${trip.origin || '—'} -> ${destinationStr}`, 14, y);
  const statusStr = invoice?.status || 'FINAL';
  doc.text(`Status: ${statusStr.toUpperCase()}`, 115, y);

  y += 4.5;
  const vehicleReg =
    trip.vehicle?.license_plate ||
    trip.external_hiring?.external_vehicle_reg ||
    'Assigned Vehicle';
  const vehicleDesc = trip.vehicle
    ? [trip.vehicle.make, trip.vehicle.model].filter(Boolean).join(' ')
    : (trip.external_hiring?.vehicle_description || '');
  doc.text(`Vehicle: ${vehicleReg}${vehicleDesc ? ' (' + vehicleDesc + ')' : ''}`, 14, y);
  const driverName =
    trip.driver?.name ||
    trip.external_hiring?.external_driver_name ||
    'Assigned Driver';
  doc.text(`Driver: ${driverName}`, 115, y);

  // 3. Table Rows
  y += 9;
  const tableRows: string[][] = [];

  const baseRate = invoice?.base_rate ?? (invoice?.total_amount || 0);
  const incKm = invoice?.included_km ?? 0;
  const incHrs = invoice?.included_hrs ?? 0;

  tableRows.push([
    '1',
    'Base Trip Fare',
    `Included: ${incKm} km, ${incHrs} hrs`,
    `INR ${Number(baseRate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
  ]);

  let rowIdx = 2;
  if (invoice && invoice.extra_km > 0) {
    tableRows.push([
      String(rowIdx++),
      'Extra Distance Charges',
      `${invoice.extra_km} km @ INR ${invoice.extra_km_rate}/km`,
      `INR ${Number(invoice.extra_km_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  if (invoice && invoice.extra_hrs > 0) {
    tableRows.push([
      String(rowIdx++),
      'Extra Time Charges',
      `${invoice.extra_hrs} hrs @ INR ${invoice.extra_hr_rate}/hr`,
      `INR ${Number(invoice.extra_hr_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  if (invoice && invoice.driver_meal > 0) {
    tableRows.push([
      String(rowIdx++),
      'Driver Allowance / Meal',
      'Food & day allowance',
      `INR ${Number(invoice.driver_meal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  if (invoice && invoice.night_charge > 0) {
    tableRows.push([
      String(rowIdx++),
      'Night Halt Charges',
      'Night drive allowance',
      `INR ${Number(invoice.night_charge).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  if (invoice && invoice.toll_tax > 0) {
    tableRows.push([
      String(rowIdx++),
      'Toll & Fastag Charges',
      'Highway toll payment',
      `INR ${Number(invoice.toll_tax).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  if (invoice && invoice.parking_charge > 0) {
    tableRows.push([
      String(rowIdx++),
      'Parking Charges',
      'Airport/station parking',
      `INR ${Number(invoice.parking_charge).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  if (invoice && invoice.other_charges > 0) {
    tableRows.push([
      String(rowIdx++),
      'Other Incidentals',
      'Miscellaneous expenses',
      `INR ${Number(invoice.other_charges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);
  }

  autoTable(doc, {
    head: [['#', 'Description', 'Quantity / Details', 'Amount']],
    body: tableRows,
    startY: y,
    headStyles: {
      fillColor: [39, 39, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 72 },
      2: { cellWidth: 65 },
      3: { cellWidth: 35, halign: 'right' },
    },
    theme: 'grid',
    margin: { left: 14, right: 14 },
  });

  // 4. Totals Breakdown
  const finalY = (doc as any).lastAutoTable.finalY + 6;
  const rightX = 196;
  const labelX = 135;

  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);

  const subtotal = invoice?.subtotal ?? baseRate;
  const gstPercent = invoice?.gst_percent ?? 0;
  const gstAmount = invoice?.gst_amount ?? 0;
  const totalAmount = invoice?.total_amount ?? subtotal;

  let currentY = finalY;

  doc.text('Subtotal:', labelX, currentY);
  doc.text(
    `INR ${Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    rightX,
    currentY,
    { align: 'right' }
  );

  if (gstPercent > 0 || gstAmount > 0) {
    currentY += 5;
    doc.text(`GST (${gstPercent}%):`, labelX, currentY);
    doc.text(
      `INR ${Number(gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      rightX,
      currentY,
      { align: 'right' }
    );
  }

  currentY += 7;
  doc.setFillColor(244, 244, 245);
  doc.rect(labelX - 4, currentY - 4.5, 65, 8.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('Total Amount:', labelX, currentY + 1.2);
  doc.text(
    `INR ${Number(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    rightX,
    currentY + 1.2,
    { align: 'right' }
  );

  // 5. Terms & Footer
  currentY += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Terms & Conditions:', 14, currentY);
  currentY += 3.5;
  doc.text(
    '1. Payment is due upon receipt of invoice unless agreed otherwise in writing.',
    14,
    currentY
  );
  currentY += 3.5;
  doc.text(
    '2. Please reference the invoice number for all electronic bank transfers.',
    14,
    currentY
  );
  currentY += 3.5;
  doc.text(
    '3. This is a computer-generated invoice and requires no physical signature.',
    14,
    currentY
  );

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 280, 196, 280);
  doc.setFontSize(7.5);
  doc.text('SVR Travels | Thank you for your business!', 105, 285, { align: 'center' });

  doc.save(filename);
}
