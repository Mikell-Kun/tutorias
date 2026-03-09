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

/**
 * Main function for generating Group Reports (Semester or Detailed).
 * 
 * @param {Object} data - Form data.
 * @param {string} mainTitle - Title of the report.
 */
const generateGroupReportBase = (data, mainTitle) => {
    try {
        const doc = new jsPDF();
        const margin = 10;
        const pageWidth = 210;
        const contentWidth = pageWidth - (margin * 2);

        // Header Table Helper
        const drawFormGrid = (x, y, w, h, label, value = '', isTitle = false) => {
            doc.rect(x, y, w, h);
            if (isTitle) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(label.toUpperCase(), x + (w / 2), y + (h / 2) + 1.5, { align: 'center' });
            } else {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.text(label, x + 1, y + 3.5);
                if (value) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    doc.text(String(value), x + 1, y + (h - 2));
                }
            }
        };

        let currentY = 15;

        // Header Section
        drawFormGrid(margin, currentY, contentWidth, 8, mainTitle, '', true);
        currentY += 8;
        drawFormGrid(margin, currentY, contentWidth, 8, 'Instituto tecnologico', '', true);
        currentY += 8;

        // Row 3: Tutor Name, Dept, Period
        const col1W = contentWidth * 0.3;
        const col2W = contentWidth * 0.2;
        const col3W = contentWidth * 0.5;

        drawFormGrid(margin, currentY, col1W, 10, 'nombre del tutor/a', data.tutorName);
        drawFormGrid(margin + col1W, currentY, col2W, 10, 'departamento academico', '');
        drawFormGrid(margin + col1W + col2W, currentY, col3W, 10, 'Periodo', data.period);
        currentY += 10;

        // Row 4: Program, Group, Dates
        const subColW = contentWidth / 4;
        drawFormGrid(margin, currentY, subColW, 10, 'programa educativo', data.program);
        drawFormGrid(margin + subColW, currentY, subColW, 10, 'num. grupo', data.groupNum);
        drawFormGrid(margin + (subColW * 2), currentY, subColW, 10, 'fecha inicio', data.startDate);
        drawFormGrid(margin + (subColW * 3), currentY, subColW, 10, 'fecha final', data.endDate);
        currentY += 15;

        // Students Table Title
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.rect(margin, currentY, contentWidth, 8);
        doc.text('lista de estudiantes', margin + (contentWidth / 2), currentY + 5.5, { align: 'center' });
        currentY += 8;

        // Student Data
        const studentsData = data.students.map((s, i) => [i + 1, s.name, s.control]);
        while (studentsData.length < 15) {
            studentsData.push([studentsData.length + 1, '', '']);
        }

        autoTable(doc, {
            startY: currentY,
            head: [],
            body: studentsData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 1, minCellHeight: 6 },
            columnStyles: {
                0: { cellWidth: 20, halign: 'center' },
                1: { cellWidth: (contentWidth - 20) * 0.7 },
                2: { cellWidth: (contentWidth - 20) * 0.3, halign: 'center' }
            },
            margin: { left: margin }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Stats Box Title
        const statsTitle = mainTitle.includes('semestral')
            ? 'estudiantes atendidos en el semestre'
            : 'estudiantes atendidos en el periodo';
        doc.setFont('helvetica', 'bold');
        doc.rect(margin, currentY, contentWidth, 6);
        doc.text(statsTitle, margin + (contentWidth / 2), currentY + 4, { align: 'center' });
        currentY += 6;

        // Stats Headers
        const statColW = contentWidth / 4;
        const statHeaders = ['tutoria grupal', 'estudiantes canalizados', 'area con mayor canalizacion', 'Resultado (porcentaje total)'];
        statHeaders.forEach((h, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 10);
            doc.setFontSize(7);
            doc.text(h, margin + (statColW * i) + (statColW / 2), currentY + 6, { align: 'center', maxWidth: statColW - 5 });
        });
        currentY += 10;

        // Stats Values
        const statsRow = [
            data.groupTutoring.totalStudents,
            data.groupTutoring.channeledCount,
            data.groupTutoring.topArea,
            `${data.groupTutoring.resultPercentage}%`
        ];
        statsRow.forEach((v, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 8);
            doc.setFont('helvetica', 'normal');
            doc.text(String(v), margin + (statColW * i) + (statColW / 2), currentY + 5.5, { align: 'center' });
        });
        currentY += 12;

        // Individual Stats (Placeholder)
        const indHeaders = ['tutoria individual', 'estudiantes canalizados', 'area con mayor canalizacion', 'Resultado (porcentaje total)'];
        indHeaders.forEach((h, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 10);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.text(h, margin + (statColW * i) + (statColW / 2), currentY + 6, { align: 'center', maxWidth: statColW - 5 });
        });
        currentY += 10;
        for (let i = 0; i < 4; i++) {
            doc.rect(margin + (statColW * i), currentY, statColW, 8);
        }
        currentY += 12;

        // Observations
        doc.setFont('helvetica', 'bold');
        doc.rect(margin, currentY, contentWidth, 5);
        doc.text('observaciones', margin + (contentWidth / 2), currentY + 4, { align: 'center' });
        currentY += 5;
        doc.rect(margin, currentY, contentWidth, 20);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(data.observations || '', margin + 2, currentY + 5, { maxWidth: contentWidth - 4 });
        currentY += 30;

        // Signatures
        const sigW = 50;
        const sigSpacing = (contentWidth - (sigW * 3)) / 2;
        doc.line(margin, currentY, margin + sigW, currentY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y firma del coordinador de tutoría de Departamento Académico', margin + (sigW / 2), currentY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + sigW + sigSpacing, currentY, margin + (sigW * 2) + sigSpacing, currentY);
        doc.text('Nombre y firma del Jefe de Departamento Académico', margin + sigW + sigSpacing + (sigW / 2), currentY + 5, { align: 'center', maxWidth: sigW });

        const tutorSigX = margin + (sigW * 2) + (sigSpacing * 2);
        doc.line(tutorSigX, currentY, tutorSigX + sigW, currentY);
        doc.text('Nombre y firma del Tutor', tutorSigX + (sigW / 2), currentY + 5, { align: 'center', maxWidth: sigW });

        doc.save(`${mainTitle.replace(/\s+/g, '_')}_Grupo_${data.groupNum}_${data.tutorName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error('Error al generar el reporte grupal:', error);
        alert('Error al generar el PDF del grupo.');
    }
};

export const generateGroupSemesterReport = (data) => {
    generateGroupReportBase(data, 'reporte semestral por grupo del tutor');
};

export const generateDetailedGroupReport = (data) => {
    generateGroupReportBase(data, 'reporte detallado por grupo del tutor');
};
