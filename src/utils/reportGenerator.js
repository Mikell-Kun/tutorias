import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a Semester Report for a Tutor in PDF format.
 * 
 * @param {Object} tutor - The logged-in tutor object.
 * @param {Array} studentsAtRisk - List of students marked as "Riesgo".
 */
export const generateSemesterReport = (tutor, studentsAtRisk) => {
    try {
        console.log('Iniciando generación de reporte para:', tutor?.nombre_completo);
        console.log('Estudiantes en riesgo:', studentsAtRisk?.length);

        const doc = new jsPDF();
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Formatting Helpers
        const navyColor = [0, 51, 102]; // Approximate navy

        // Header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        // Banner Background for Title
        doc.setFillColor(0, 0, 0); // Black as per image
        doc.rect(10, 25, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('REPORTE SEMESTRAL DEL TUTOR', 105, 31, { align: 'center' });

        // Forms Labels and Values
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);

        const drawCell = (x, y, w, h, label, value = '') => {
            doc.rect(x, y, w, h);
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, x + 2, y + 5);
            if (value) {
                doc.setFont('helvetica', 'normal');
                doc.text(String(value), x + 2, y + 10);
            }
        };

        const startY = 33;
        const rowH = 12;

        // Row 1
        drawCell(10, startY, 190, rowH, 'Instituto Tecnológico', 'Instituto Tecnológico de Mexicali');

        // Row 2
        drawCell(10, startY + rowH, 140, rowH, 'Nombre del Tutor', tutor?.nombre_completo || 'N/A');
        drawCell(150, startY + rowH, 50, rowH, 'Fecha', dateStr);

        // Row 3
        drawCell(10, startY + (rowH * 2), 80, rowH, 'Programa educativo', 'Programa de Tutorías');
        drawCell(90, startY + (rowH * 2), 60, rowH, 'Grupo', '');
        drawCell(150, startY + (rowH * 2), 50, rowH, 'Hora', timeStr);

        // Students Table
        const tableData = studentsAtRisk.map((s, index) => [
            index + 1,
            s.nombre_completo,
            '', '', '', ''
        ]);

        // Fill empty rows if needed to maintain layout look (at least 25 per image)
        while (tableData.length < 25) {
            tableData.push([tableData.length + 1, '', '', '', '', '']);
        }

        autoTable(doc, {
            startY: startY + (rowH * 3) + 5,
            head: [[
                'No.',
                'Lista de estudiantes',
                'Estudiantes atendidos en el semestre',
                '',
                'Estudiantes canalizados en el semestre',
                'Área canalizada'
            ], [
                '',
                '',
                'Tutoría grupal',
                'Tutoría individual',
                '',
                ''
            ]],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [255, 248, 220], // Light gold/cream
                textColor: navyColor,
                fontSize: 8,
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.1
            },
            styles: {
                fontSize: 7,
                cellPadding: 1,
                halign: 'left',
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 70 },
                2: { cellWidth: 25, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 25, halign: 'center' },
                5: { cellWidth: 35 }
            },
            didParseCell: (data) => {
                // Handle row spanning for the headers if needed, but autotable 2nd head row is better
                if (data.section === 'head' && data.row.index === 0) {
                    if (data.column.index === 2) {
                        data.cell.colSpan = 2;
                    }
                }
            }
        });

        const finalY = doc.lastAutoTable.finalY + 10;

        // Instructions/Notes Section
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('Instructivo de llenado:', 10, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text('Anote los datos correspondientes en los apartados del encabezado', 10, finalY + 4);

        doc.text('En el apartado de Observaciones anotar:', 10, finalY + 12);
        doc.text('Anote las 10 actividades adicionales más importantes realizadas en el semestre', 10, finalY + 16);
        doc.text('Anotar las acciones de mayor impacto para alcanzar la competencia de la asignatura', 10, finalY + 20);
        doc.text('Este reporte deberá ser llenado por el Tutor', 10, finalY + 24);
        doc.text('Deberá ser entregada al Coordinador de Tutoría del Departamento Académico con copia para el Tutor.', 10, finalY + 28);

        // Observations Box
        doc.rect(10, finalY + 32, 190, 20);
        doc.setFont('helvetica', 'bold');
        doc.text('Observaciones:', 12, finalY + 37);

        // Footer Signatures
        const sigY = finalY + 65;
        doc.line(10, sigY, 90, sigY);
        doc.line(120, sigY, 200, sigY);

        doc.setFontSize(7);
        doc.text('Nombre y firma del Coordinador de Tutoría del Departamento Académico', 10, sigY + 5, { maxWidth: 80, align: 'center' });
        doc.text('Nombre y firma del jefe de Departamento Académico', 120, sigY + 5, { maxWidth: 80, align: 'center' });

        doc.text(`Fecha de entrega de este reporte: _______________`, 10, sigY - 10);

        // Save PDF
        doc.save(`Reporte_Semestral_Tutor_${tutor?.nombre_completo.replace(/\s+/g, '_')}_${dateStr}.pdf`);
        console.log('Reporte generado exitosamente');
    } catch (error) {
        console.error('Error al generar el reporte PDF:', error);
        alert('Hubo un error al generar el PDF. Revisa la consola para más detalles.');
    }
};
