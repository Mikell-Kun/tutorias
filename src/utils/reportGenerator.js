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
                doc.text(String(value), x + 2, y + 10, { maxWidth: w - 4 });
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
                    doc.text(String(value), x + 1, y + (h - 2), { maxWidth: w - 2 });
                }
            }
        };

        let currentY = 15;

        // Header Section
        drawFormGrid(margin, currentY, contentWidth, 8, mainTitle, '', true);
        currentY += 8;
        drawFormGrid(margin, currentY, contentWidth, 8, 'Instituto Tecnológico de Mexicali', '', true);
        currentY += 8;

        // Row 3: Tutor Name, Dept, Period
        const col1W = contentWidth * 0.3;
        const col2W = contentWidth * 0.2;
        const col3W = contentWidth * 0.5;

        drawFormGrid(margin, currentY, col1W, 10, 'nombre del tutor/a', data.tutorName);
        drawFormGrid(margin + col1W, currentY, col2W, 10, 'departamento academico', data.academicDept || '');
        drawFormGrid(margin + col1W + col2W, currentY, col3W, 10, 'Periodo', data.period);
        currentY += 10;

        // Row 4: Program, Group, Dates
        const colWProg = contentWidth * 0.4;
        const colWGrp = contentWidth * 0.15;
        const colWDate = contentWidth * 0.225;
        drawFormGrid(margin, currentY, colWProg, 10, 'programa educativo', data.program);
        drawFormGrid(margin + colWProg, currentY, colWGrp, 10, 'grupo', data.groupNum);
        drawFormGrid(margin + colWProg + colWGrp, currentY, colWDate, 10, 'fecha inicio', data.startDate);
        drawFormGrid(margin + colWProg + colWGrp + colWDate, currentY, colWDate, 10, 'fecha final', data.endDate);
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
            ? 'estadísticas de atención en el periodo'
            : 'estadísticas de atención en el periodo';
        doc.setFont('helvetica', 'bold');
        doc.rect(margin, currentY, contentWidth, 6);
        doc.text(statsTitle, margin + (contentWidth / 2), currentY + 4, { align: 'center' });
        currentY += 6;

        // Support Areas
        const supportAreas = [
            { label: 'Servicios Psicológicos (SP)', value: 'SP' },
            { label: 'Servicios de Salud (SS)', value: 'SS' },
            { label: 'Adicciones (AD)', value: 'AD' },
            { label: 'Beca de Manutención (BM)', value: 'BM' },
            { label: 'Beca de Transporte (BT)', value: 'BT' },
            { label: 'Beca de Alimentación (BA)', value: 'BA' },
            { label: 'Asesoría Académica (AA)', value: 'AA' },
            { label: 'Asesoría de Procesos (APAA)', value: 'APAA' },
            { label: 'Aptitudes Sobresalientes (AS)', value: 'AS' }
        ];

        // --- Grp Stats ---
        const totalG = data.students.length || 0;
        let sumG = 0;
        let maxG = -1;
        let topAreaG = 'Ninguna';
        
        Object.keys(data.groupTutoring?.referrals || {}).forEach(k => {
            const v = data.groupTutoring.referrals[k];
            sumG += v;
            if (v > maxG && v > 0) { 
                maxG = v; 
                topAreaG = k; 
            }
        });
        const topPercG = totalG > 0 && maxG > 0 ? ((maxG / totalG) * 100).toFixed(2) : '0.00';

        // Grp Summary Row
        const statColW = contentWidth / 4;
        const grpHeaders = ['alumnos en tutoria grupal', 'estudiantes canalizados', 'area con mayor canalizacion', 'Resultado (porcentaje total)'];
        grpHeaders.forEach((h, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 8);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(h, margin + (statColW * i) + (statColW / 2), currentY + 5, { align: 'center', maxWidth: statColW - 2 });
        });
        currentY += 8;
        const grpValues = [totalG.toString(), sumG.toString(), topAreaG, `${topPercG}%`];
        grpValues.forEach((v, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 8);
            doc.setFont('helvetica', 'normal');
            doc.text(String(v), margin + (statColW * i) + (statColW / 2), currentY + 5.5, { align: 'center' });
        });
        currentY += 12; // Added gap before detailed table

        // Grp Table
        const grpTableBody = supportAreas.map(area => {
            const c = data.groupTutoring?.referrals?.[area.value] || 0;
            const p = totalG > 0 ? ((c / totalG) * 100).toFixed(2) : '0.00';
            return [area.label, c.toString(), `${p}%`];
        });

        autoTable(doc, {
            startY: currentY,
            head: [['Área de Canalización (Grupal)', 'Cantidad', 'Porcentaje']],
            body: grpTableBody,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 1, minCellHeight: 5 },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
            columnStyles: {
                0: { cellWidth: contentWidth * 0.6 },
                1: { cellWidth: contentWidth * 0.2, halign: 'center' },
                2: { cellWidth: contentWidth * 0.2, halign: 'center' }
            },
            margin: { left: margin }
        });
        
        // Espacio visual entre modalidades
        currentY = doc.lastAutoTable.finalY + 25;

        // --- Indiv Stats ---
        if (currentY > 230) {
            doc.addPage();
            currentY = margin;
        }

        const totalI = data.individualTutoring?.totalStudents || 0;
        let sumI = 0;
        let maxI = -1;
        let topAreaI = 'Ninguna';
        Object.keys(data.individualTutoring?.referrals || {}).forEach(k => {
            const v = data.individualTutoring.referrals[k];
            sumI += v;
            if (v > maxI && v > 0) { 
                maxI = v; 
                topAreaI = k; 
            }
        });
        const topPercI = totalI > 0 && maxI > 0 ? ((maxI / totalI) * 100).toFixed(2) : '0.00';

        const indHeaders = ['alumnos en tutoria individual', 'estudiantes canalizados', 'area con mayor canalizacion', 'Resultado (porcentaje total)'];
        indHeaders.forEach((h, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 8);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(h, margin + (statColW * i) + (statColW / 2), currentY + 5, { align: 'center', maxWidth: statColW - 2 });
        });
        currentY += 8;
        const indValues = [totalI.toString(), sumI.toString(), topAreaI, `${topPercI}%`];
        indValues.forEach((v, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 8);
            doc.setFont('helvetica', 'normal');
            doc.text(String(v), margin + (statColW * i) + (statColW / 2), currentY + 5.5, { align: 'center' });
        });
        currentY += 12; // Added gap before detailed table

        // Indiv Table
        const indTableBody = supportAreas.map(area => {
            const c = data.individualTutoring?.referrals?.[area.value] || 0;
            const p = totalI > 0 ? ((c / totalI) * 100).toFixed(2) : '0.00';
            return [area.label, c.toString(), `${p}%`];
        });

        autoTable(doc, {
            startY: currentY,
            head: [['Área de Canalización (Individual)', 'Cantidad', 'Porcentaje']],
            body: indTableBody,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 1, minCellHeight: 5 },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
            columnStyles: {
                0: { cellWidth: contentWidth * 0.6 },
                1: { cellWidth: contentWidth * 0.2, halign: 'center' },
                2: { cellWidth: contentWidth * 0.2, halign: 'center' }
            },
            margin: { left: margin }
        });
        currentY = doc.lastAutoTable.finalY + 10;


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

/**
 * Generates the specialized "Reporte de Canalizaciones"
 */
export const generateReferralReport = (data) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const primaryColor = [13, 27, 62]; // Navy

    // --- Header ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE CANALIZACIONES', 105, 15, { align: 'center' });

    // --- Subtitle: DATOS GENERALES ---
    doc.setFillColor(0, 0, 0);
    doc.rect(10, 28, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('DATOS GENERALES', 105, 32, { align: 'center' });

    // --- Data Block 1 ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.rect(10, 34, 190, 15); // Outer frame
    doc.line(105, 34, 105, 41); // Vertical divider
    doc.line(10, 41, 200, 41); // Horizontal divider

    doc.setFont('helvetica', 'bold');
    doc.text('NOMBRE DEL TUTOR:', 12, 38);
    doc.text('DEPARTAMENTO ACADÉMICO:', 107, 38);
    doc.text('FECHA', 60, 46, { align: 'center' });
    doc.text('Inicio:', 85, 46);
    doc.text('Término:', 135, 46);

    doc.setFont('helvetica', 'normal');
    doc.text(data.tutorName || '', 55, 38);
    doc.text(data.academicDept || '', 155, 38);
    doc.text(data.startDate || '', 100, 46);
    doc.text(data.endDate || '', 155, 46);

    // --- Subtitle: UNIDAD ACADÉMICA ---
    doc.setFillColor(0, 0, 0);
    doc.rect(10, 51, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('UNIDAD ACADÉMICA', 105, 55, { align: 'center' });

    // --- Data Block 2 ---
    doc.setTextColor(0, 0, 0);
    doc.rect(10, 57, 190, 15); // Outer frame
    doc.line(80, 57, 80, 64); // Divider 1
    doc.line(135, 57, 135, 64); // Divider 2
    doc.line(10, 64, 200, 64); // Bottom horizontal

    doc.setFont('helvetica', 'bold');
    doc.text('GRUPO:', 12, 61);
    doc.text('Nº ALUMNOS:', 82, 61);
    doc.text('PERIODO:', 137, 61);
    doc.text('CARRERA:', 12, 69);

    doc.setFont('helvetica', 'normal');
    doc.text(data.groupNum || '', 36, 61);
    doc.text(data.totalStudentsNum?.toString() || '', 110, 61);
    doc.text(data.period || '', 160, 61);
    doc.text(data.program || '', 32, 69);

    // --- Session Table ---
    autoTable(doc, {
        startY: 75,
        head: [
            ['SESIÓN', 'TOTAL ALUMNOS ATENDIDOS', { content: 'NÚMERO DE ALUMNOS AL ÁREA CANALIZADA', colSpan: 9 }]
        ],
        body: [
            ['', '', 'SP', 'SS', 'AD', 'BM', 'BT', 'BA', 'AA', 'APAA', 'AS'],
            ...data.sessions.map(s => [
                s.number,
                s.attended,
                s.sp || '',
                s.ss || '',
                s.ad || '',
                s.bm || '',
                s.bt || '',
                s.ba || '',
                s.aa || '',
                s.apaa || '',
                s.as || ''
            ])
        ],
        styles: { fontSize: 8, halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 35 }
        },
        theme: 'grid'
    });

    // --- Referral Support Matrix ---
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFillColor(0, 0, 0);
    doc.rect(10, finalY, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('APOYOS CON LOS QUE CUENTA EL TECNOLÓGICO PARA CANALIZAR A LOS TUTORADO', 105, finalY + 4, { align: 'center' });

    const supportAreasLabels = [
        { label: 'SERVICIOS PSICOLÓGICOS', abrev: 'SP' },
        { label: 'SERVICIOS DE SALUD', abrev: 'SS' },
        { label: 'ADICCIONES', abrev: 'AD' },
        { label: 'BECA DE MANUTENCIÓN', abrev: 'BM' },
        { label: 'BECA DE TRANSPORTE', abrev: 'BT' },
        { label: 'BECA DE ALIMENTACIÓN', abrev: 'BA' },
        { label: 'ASESORÍA ACADÉMICA', abrev: 'AA' },
        { label: 'ASESORÍA DE PROCESOS ACADÉMICO-ADMINISTRATIVOS', abrev: 'APAA' },
        { label: 'APTITUDES SOBRESALIENTES', abrev: 'AS' }
    ];

    autoTable(doc, {
        startY: finalY + 6,
        head: [['APOYO', 'ABREV.', 'ESTANCIA EXTERNA', 'ESTANCIA INTERNA', 'OTRAS', 'NINGUNO']],
        body: supportAreasLabels.map(area => {
            const status = data.supportStatus?.[area.abrev] || {};
            return [
                area.label,
                area.abrev,
                status.externa ? 'X' : '',
                status.interna ? 'X' : '',
                status.otras ? 'X' : '',
                status.ninguno ? 'X' : ''
            ];
        }),
        styles: { fontSize: 7, halign: 'left', lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 15, halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' }
        },
        theme: 'grid'
    });

    // --- Signatures ---
    const signatureY = 265;
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Left: Coordinator
    doc.line(10, signatureY, 80, signatureY);
    doc.text('Nombre y firma del coordinador de', 45, signatureY + 4, { align: 'center' });
    doc.text('tutoría de Departamento', 45, signatureY + 8, { align: 'center' });
    doc.text('Académico', 45, signatureY + 12, { align: 'center' });

    // Right: Dept Head
    doc.line(130, signatureY, 200, signatureY);
    doc.text('Nombre y firma del jefe de Departamento', 165, signatureY + 4, { align: 'center' });
    doc.text('Académico', 165, signatureY + 8, { align: 'center' });

    // Bottom Center: Tutor
    const signatureBottomY = 282;
    doc.line(70, signatureBottomY, 140, signatureBottomY);
    doc.text('Nombre y firma del Tutor', 105, signatureBottomY + 4, { align: 'center' });

    doc.save(`reporte_canalizaciones_${data.groupNum || 'tutor'}.pdf`);
};

/**
 * Generates the "Reporte Semestral por Alumno"
 */
export const generateStudentSemesterReport = (data) => {
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
                    doc.text(String(value), x + 1, y + (h - 2), { maxWidth: w - 2 });
                }
            }
        };

        let currentY = 15;

        // Header Section
        drawFormGrid(margin, currentY, contentWidth, 8, 'reporte semestral por alumno del tutor', '', true);
        currentY += 8;
        drawFormGrid(margin, currentY, contentWidth, 8, 'Instituto Tecnológico de Mexicali', '', true);
        currentY += 8;

        // Row 3: Tutor Name, Period
        const halfWidth = contentWidth / 2;
        drawFormGrid(margin, currentY, halfWidth, 10, 'Nombre del tutor/a', data.tutorName);
        drawFormGrid(margin + halfWidth, currentY, halfWidth, 10, 'periodo', data.period);
        currentY += 10;

        // Row 4: Dept, Dates
        const thirdWidth = contentWidth / 3;
        drawFormGrid(margin, currentY, thirdWidth, 10, 'departamento academico', data.academicDept);
        drawFormGrid(margin + thirdWidth, currentY, thirdWidth, 10, 'fecha inicio', data.startDate);
        drawFormGrid(margin + (thirdWidth * 2), currentY, thirdWidth, 10, 'fecha final', data.endDate);
        currentY += 10;

        // Row 5: Student Info
        const colWName = contentWidth * 0.35;
        const colWControl = contentWidth * 0.15;
        const colWCareer = contentWidth * 0.35;
        const colWSemester = contentWidth * 0.15;
        drawFormGrid(margin, currentY, colWName, 10, 'nombre del alumno/a', data.studentName);
        drawFormGrid(margin + colWName, currentY, colWControl, 10, 'matricula', data.controlNumber);
        drawFormGrid(margin + colWName + colWControl, currentY, colWCareer, 10, 'carrera', data.career);
        drawFormGrid(margin + colWName + colWControl + colWCareer, currentY, colWSemester, 10, 'semestre', data.semester);
        currentY += 15;

        // Sessions Table
        const sessionsData = data.sessions.map((s, i) => [
            s.number || `sesion ${i + 1}`,
            s.area || '-',
            s.supportType || '-',
            s.date || '-'
        ]);

        // Fill empty rows to maintain layout (at least 10)
        while (sessionsData.length < 10) {
            sessionsData.push(['-', '-', '-', '-']);
        }

        autoTable(doc, {
            startY: currentY,
            head: [['no. sesion', 'area canalizada', 'tipo de apoyo', 'fecha de atencion']],
            body: sessionsData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: margin }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Summary Stats Row
        const statColW = contentWidth / 3;
        const statsLabels = ['sesiones en total', 'area con mayor canalizacion', 'Resultado (porcentaje total)'];
        statsLabels.forEach((label, i) => {
            drawFormGrid(margin + (statColW * i), currentY, statColW, 8, label, '', false);
        });
        currentY += 8;

        const statsValues = [
            data.totalSessions || '0',
            data.topArea || '-',
            `${data.resultPercentage || '0'}%`
        ];
        statsValues.forEach((val, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 10);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(String(val), margin + (statColW * i) + (statColW / 2), currentY + 6, { align: 'center' });
        });
        currentY += 15;

        // Observations
        drawFormGrid(margin, currentY, contentWidth, 8, 'observaciones', '', false);
        currentY += 8;
        doc.rect(margin, currentY, contentWidth, 25);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(data.observations || '', margin + 2, currentY + 6, { maxWidth: contentWidth - 4 });
        currentY += 40;

        // Signatures
        const sigW = 60;
        const sigY = currentY;
        const spacing = (contentWidth - (sigW * 3)) / 2;

        doc.line(margin, sigY, margin + sigW, sigY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y firma del coordinador de tutoría de Departamento Académico', margin + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + sigW + spacing, sigY, margin + (sigW * 2) + spacing, sigY);
        doc.text('Nombre y firma del Jefe de Departamento Académico', margin + sigW + spacing + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + (sigW * 2) + (spacing * 2), sigY, margin + (sigW * 3) + (spacing * 2), sigY);
        doc.text('Nombre y firma del Tutor', margin + (sigW * 2) + (spacing * 2) + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.save(`Reporte_Semestral_Alumno_${data.studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('Error al generar el reporte del alumno:', error);
        alert('Error al generar el PDF del alumno.');
    }
};

/**
 * Generates the "Reporte Detallado por Alumno"
 */
export const generateDetailedStudentReport = (data) => {
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
                    doc.text(String(value), x + 1, y + (h - 2), { maxWidth: w - 2 });
                }
            }
        };

        let currentY = 15;

        // Header Section
        drawFormGrid(margin, currentY, contentWidth, 8, 'reporte detallado por alumno del tutor', '', true);
        currentY += 8;
        drawFormGrid(margin, currentY, contentWidth, 8, 'Instituto Tecnológico de Mexicali', '', true);
        currentY += 8;

        // Row 3: Tutor Name, Period
        const halfWidth = contentWidth / 2;
        drawFormGrid(margin, currentY, halfWidth, 10, 'Nombre del tutor/a', data.tutorName);
        drawFormGrid(margin + halfWidth, currentY, halfWidth, 10, 'periodo', data.period);
        currentY += 10;

        // Row 4: Dept, Dates
        const thirdWidth = contentWidth / 3;
        drawFormGrid(margin, currentY, thirdWidth, 10, 'departamento academico', data.academicDept);
        drawFormGrid(margin + thirdWidth, currentY, thirdWidth, 10, 'fecha inicio', data.startDate);
        drawFormGrid(margin + (thirdWidth * 2), currentY, thirdWidth, 10, 'fecha final', data.endDate);
        currentY += 10;

        // Row 5: Student Info
        const colWName = contentWidth * 0.35;
        const colWControl = contentWidth * 0.15;
        const colWCareer = contentWidth * 0.35;
        const colWSemester = contentWidth * 0.15;
        drawFormGrid(margin, currentY, colWName, 10, 'nombre del alumno/a', data.studentName);
        drawFormGrid(margin + colWName, currentY, colWControl, 10, 'matricula', data.controlNumber);
        drawFormGrid(margin + colWName + colWControl, currentY, colWCareer, 10, 'carrera', data.career);
        drawFormGrid(margin + colWName + colWControl + colWCareer, currentY, colWSemester, 10, 'semestre', data.semester);
        currentY += 15;

        // Sessions Table
        const sessionsData = data.sessions.map((s, i) => [
            s.number || `sesion ${i + 1}`,
            s.area || '-',
            s.supportType || '-',
            s.date || '-'
        ]);

        while (sessionsData.length < 10) {
            sessionsData.push(['-', '-', '-', '-']);
        }

        autoTable(doc, {
            startY: currentY,
            head: [['no. sesion', 'area canalizada', 'tipo de apoyo', 'fecha de atencion']],
            body: sessionsData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: margin }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Summary Stats Row
        const statColW = contentWidth / 3;
        const statsLabels = ['sesiones en total', 'area con mayor canalizacion', 'Resultado (porcentaje total)'];
        statsLabels.forEach((label, i) => {
            drawFormGrid(margin + (statColW * i), currentY, statColW, 8, label, '', false);
        });
        currentY += 8;

        const statsValues = [
            data.totalSessions || '0',
            data.topArea || '-',
            `${data.resultPercentage || '0'}%`
        ];
        statsValues.forEach((val, i) => {
            doc.rect(margin + (statColW * i), currentY, statColW, 10);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(String(val), margin + (statColW * i) + (statColW / 2), currentY + 6, { align: 'center' });
        });
        currentY += 15;

        // Observations
        drawFormGrid(margin, currentY, contentWidth, 8, 'observaciones', '', false);
        currentY += 8;
        doc.rect(margin, currentY, contentWidth, 25);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(data.observations || '', margin + 2, currentY + 6, { maxWidth: contentWidth - 4 });
        currentY += 40;

        // Signatures
        const sigW = 60;
        const sigY = currentY;
        const spacing = (contentWidth - (sigW * 3)) / 2;

        doc.line(margin, sigY, margin + sigW, sigY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y firma del coordinador de tutoría de Departamento Académico', margin + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + sigW + spacing, sigY, margin + (sigW * 2) + spacing, sigY);
        doc.text('Nombre y firma del Jefe de Departamento Académico', margin + sigW + spacing + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + (sigW * 2) + (spacing * 2), sigY, margin + (sigW * 3) + (spacing * 2), sigY);
        doc.text('Nombre y firma del Tutor', margin + (sigW * 2) + (spacing * 2) + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.save(`Reporte_Detallado_Alumno_${data.studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('Error al generar el reporte detallado del alumno:', error);
        alert('Error al generar el PDF del alumno.');
    }
};

/**
 * Generates the "Reporte Semestral por Tipo de Incidencia"
 */
export const generateIncidenceSemesterReport = (data) => {
    try {
        const doc = new jsPDF();
        const margin = 10;
        const pageWidth = 210;
        const width = pageWidth - (margin * 2);

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
                    doc.text(String(value), x + 1, y + (h - 2), { maxWidth: w - 2 });
                }
            }
        };

        let currentY = 15;

        // Header Section
        drawFormGrid(margin, currentY, width, 8, 'reporte semestral por tipo de incidencia del tutor', '', true);
        currentY += 8;
        drawFormGrid(margin, currentY, width, 8, 'Instituto tecnologico', '', true);
        currentY += 8;

        // Row 3: Tutor Name, Period
        const halfWidth = width / 2;
        drawFormGrid(margin, currentY, halfWidth, 10, 'Nombre del tutor/a', data.tutorName);
        drawFormGrid(margin + halfWidth, currentY, halfWidth, 10, 'periodo', data.period);
        currentY += 10;

        // Row 4: Dept, Dates
        const thirdWidth = width / 3;
        drawFormGrid(margin, currentY, thirdWidth, 10, 'departamento academico', data.academicDept);
        drawFormGrid(margin + thirdWidth, currentY, thirdWidth, 10, 'fecha inicio', data.startDate);
        drawFormGrid(margin + (thirdWidth * 2), currentY, thirdWidth, 10, 'fecha final', data.endDate);
        currentY += 10;

        // Row 5: Incidence & Support
        drawFormGrid(margin, currentY, halfWidth, 10, 'tipo de incidencia', data.incidenceType);
        drawFormGrid(margin + halfWidth, currentY, halfWidth, 10, 'apoyo que se brindo', data.supportProvided);
        currentY += 15;

        // Students Table
        const tableBody = (data.students || []).map(std => [
            std.name || '-',
            std.attentionDate || '-'
        ]);

        while (tableBody.length < 15) {
            tableBody.push(['-', '-']);
        }

        autoTable(doc, {
            startY: currentY,
            head: [['lista de estudiantes', 'fecha de atencion']],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: margin }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Summary Stats Row
        const thirdWidthStats = width / 3;
        drawFormGrid(margin, currentY, thirdWidthStats, 8, 'total de estudiantes', '', false);
        drawFormGrid(margin + thirdWidthStats, currentY, thirdWidthStats, 8, 'carrera mas en comun', '', false);
        drawFormGrid(margin + (thirdWidthStats * 2), currentY, thirdWidthStats, 8, 'Resultado (porcentaje total)', '', false);
        currentY += 8;

        doc.rect(margin, currentY, thirdWidthStats, 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(String(data.totalAffected || '0'), margin + (thirdWidthStats / 2), currentY + 6, { align: 'center' });

        doc.rect(margin + thirdWidthStats, currentY, thirdWidthStats, 10);
        doc.setFontSize(7);
        doc.text(String(data.topCareer || 'N/A').toUpperCase(), margin + thirdWidthStats + (thirdWidthStats / 2), currentY + 6, { align: 'center', maxWidth: thirdWidthStats - 2 });

        doc.rect(margin + (thirdWidthStats * 2), currentY, thirdWidthStats, 10);
        doc.setFontSize(10);
        doc.text(`${data.careerPercentage || '0'}%`, margin + (thirdWidthStats * 2) + (thirdWidthStats / 2), currentY + 6, { align: 'center' });
        currentY += 15;

        // Observations
        drawFormGrid(margin, currentY, width, 8, 'observaciones', '', false);
        currentY += 8;
        doc.rect(margin, currentY, width, 25);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(data.observations || '', margin + 2, currentY + 6, { maxWidth: width - 4 });
        currentY += 40;

        // Signatures
        const sigW = 60;
        const sigY = currentY;
        const spacing = (width - (sigW * 3)) / 2;

        doc.line(margin, sigY, margin + sigW, sigY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y firma del coordinador de tutoría de Departamento Académico', margin + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + sigW + spacing, sigY, margin + (sigW * 2) + spacing, sigY);
        doc.text('Nombre y firma del Jefe de Departamento Académico', margin + sigW + spacing + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + (sigW * 2) + (spacing * 2), sigY, margin + (sigW * 3) + (spacing * 2), sigY);
        doc.text('Nombre y firma del Tutor', margin + (sigW * 2) + (spacing * 2) + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.save(`Reporte_Semestral_Incidencia_${data.incidenceType.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('Error al generar el reporte de incidencia:', error);
        alert('Error al generar el PDF de incidencia.');
    }
};

/**
 * Generates the "Reporte Detallado por Tipo de Incidencia"
 */
export const generateDetailedIncidenceReport = (data) => {
    try {
        const doc = new jsPDF();
        const margin = 10;
        const pageWidth = 210;
        const width = pageWidth - (margin * 2);

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
                    doc.text(String(value), x + 1, y + (h - 2), { maxWidth: w - 2 });
                }
            }
        };

        let currentY = 15;

        // Header Section
        drawFormGrid(margin, currentY, width, 8, 'reporte detallado por tipo de incidencia del tutor', '', true);
        currentY += 8;
        drawFormGrid(margin, currentY, width, 8, 'Instituto tecnologico', '', true);
        currentY += 8;

        // Row 3: Tutor Name, Period
        const halfWidth = width / 2;
        drawFormGrid(margin, currentY, halfWidth, 10, 'Nombre del tutor/a', data.tutorName);
        drawFormGrid(margin + halfWidth, currentY, halfWidth, 10, 'periodo', data.period);
        currentY += 10;

        // Row 4: Dept, Dates
        const thirdWidth = width / 3;
        drawFormGrid(margin, currentY, thirdWidth, 10, 'departamento academico', data.academicDept);
        drawFormGrid(margin + thirdWidth, currentY, thirdWidth, 10, 'fecha inicio', data.startDate);
        drawFormGrid(margin + (thirdWidth * 2), currentY, thirdWidth, 10, 'fecha final', data.endDate);
        currentY += 10;

        // Row 5: Incidence & Support
        drawFormGrid(margin, currentY, halfWidth, 10, 'tipo de incidencia', data.incidenceType);
        drawFormGrid(margin + halfWidth, currentY, halfWidth, 10, 'apoyo que se brindo', data.supportProvided);
        currentY += 15;

        // Students Table
        const tableBody = (data.students || []).map(std => [
            std.name || '-',
            std.attentionDate || '-'
        ]);

        while (tableBody.length < 15) {
            tableBody.push(['-', '-']);
        }

        autoTable(doc, {
            startY: currentY,
            head: [['lista de estudiantes', 'fecha de atencion']],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: margin }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Summary Stats Row
        const thirdWidthStats = width / 3;
        drawFormGrid(margin, currentY, thirdWidthStats, 8, 'total de estudiantes', '', false);
        drawFormGrid(margin + thirdWidthStats, currentY, thirdWidthStats, 8, 'carrera mas en comun', '', false);
        drawFormGrid(margin + (thirdWidthStats * 2), currentY, thirdWidthStats, 8, 'Resultado (porcentaje total)', '', false);
        currentY += 8;

        doc.rect(margin, currentY, thirdWidthStats, 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(String(data.totalAffected || '0'), margin + (thirdWidthStats / 2), currentY + 6, { align: 'center' });

        doc.rect(margin + thirdWidthStats, currentY, thirdWidthStats, 10);
        doc.setFontSize(7);
        doc.text(String(data.topCareer || 'N/A').toUpperCase(), margin + thirdWidthStats + (thirdWidthStats / 2), currentY + 6, { align: 'center', maxWidth: thirdWidthStats - 2 });

        doc.rect(margin + (thirdWidthStats * 2), currentY, thirdWidthStats, 10);
        doc.setFontSize(10);
        doc.text(`${data.careerPercentage || '0'}%`, margin + (thirdWidthStats * 2) + (thirdWidthStats / 2), currentY + 6, { align: 'center' });
        currentY += 15;

        // Observations
        drawFormGrid(margin, currentY, width, 8, 'observaciones', '', false);
        currentY += 8;
        doc.rect(margin, currentY, width, 25);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(data.observations || '', margin + 2, currentY + 6, { maxWidth: width - 4 });
        currentY += 40;

        // Signatures
        const sigW = 60;
        const sigY = currentY;
        const spacing = (width - (sigW * 3)) / 2;

        doc.line(margin, sigY, margin + sigW, sigY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y firma del coordinador de tutoría de Departamento Académico', margin + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + sigW + spacing, sigY, margin + (sigW * 2) + spacing, sigY);
        doc.text('Nombre y firma del Jefe de Departamento Académico', margin + sigW + spacing + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.line(margin + (sigW * 2) + (spacing * 2), sigY, margin + (sigW * 3) + (spacing * 2), sigY);
        doc.text('Nombre y firma del Tutor', margin + (sigW * 2) + (spacing * 2) + (sigW / 2), sigY + 5, { align: 'center', maxWidth: sigW });

        doc.save(`Reporte_Detallado_Incidencia_${data.incidenceType.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('Error al generar el reporte de incidencia:', error);
        alert('Error al generar el PDF de incidencia.');
    }
};
