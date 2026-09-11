// These functions run in the browser and let the user download
// the resume text as a PDF file or a Word (.doc) file.

import jsPDF from "jspdf";

// jsPDF's default font can't draw special characters properly
// (long dashes, bullets, smart quotes). This swaps them for
// plain characters so the PDF text stays clean.
function sanitizeForPdf(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, "-")   // en dash, em dash
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes
    .replace(/[\u201C\u201D]/g, '"')   // smart double quotes
    .replace(/\u2022/g, "-")           // bullet point
    .replace(/\u2026/g, "...")         // ellipsis
    .replace(/\u00A0/g, " ");          // non-breaking space
}

export function downloadResumePdf(text: string, filename = "resume.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const marginX = 40;
  const marginY = 50;
  const maxWidth = 515;
  const lineHeight = 14;
  const pageHeight = 842;

  doc.setFont("helvetica");
  doc.setFontSize(11);

  const cleanText = sanitizeForPdf(text);
  const lines = doc.splitTextToSize(cleanText, maxWidth);
  let y = marginY;

  lines.forEach((line: string) => {
    if (y > pageHeight - marginY) {
      doc.addPage();
      y = marginY;
    }
    doc.text(line, marginX, y);
    y += lineHeight;
  });

  doc.save(filename);
}

export function downloadResumeDoc(text: string, filename = "resume.doc") {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const paragraphs = escaped
    .split("\n")
    .map((line) => `<p style="margin:0;">${line || "&nbsp;"}</p>`)
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"></head>
    <body style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">
      ${paragraphs}
    </body>
    </html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}