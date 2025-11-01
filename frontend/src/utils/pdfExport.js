import jsPDF from "jspdf";

export const exportChatToPDF = (conversation, messages) => {
  const doc = new jsPDF("p", "mm", "a4");
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(88, 101, 242);
  doc.text("NixBot Conversation", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Title: ${conversation.title || "Untitled"}`, margin, y);
  y += 6;
  doc.text(`Date: ${new Date(conversation.createdAt).toLocaleString()}`, margin, y);
  y += 8;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ===== MESSAGES =====
  messages.forEach((msg) => {
    const isBot = msg.role === "assistant";
    const sender = isBot ? "NixBot" : "You";
    const senderColor = isBot ? [88, 101, 242] : [0, 171, 85];
    const blocks = parseContent(msg.content);

    if (y + 30 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    // Sender header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...senderColor);
    doc.text(sender, margin, y);
    y += 8;

    // Message blocks
    blocks.forEach((block) => {
      if (y + 20 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      if (block.type === "text") {
        doc.setFont("helvetica", isBot ? "normal" : "bold");
        doc.setFontSize(11);
        doc.setTextColor(20, 20, 20);
        const lines = doc.splitTextToSize(block.content, maxWidth);
        lines.forEach((line) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 6;
        });
        y += 4;
      }

      if (block.type === "code") {
        const codeLines = block.content.split("\n");
        const lineHeight = 6;
        const boxHeight = codeLines.length * lineHeight + 6;

        // Background box
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(margin, y, maxWidth, boxHeight, 2, 2, "F");

        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        let codeY = y + 8;

        // Draw code lines cleanly (no overlapping)
        codeLines.forEach((line) => {
          const wrapped = doc.splitTextToSize(line, maxWidth - 6);
          wrapped.forEach((wrappedLine) => {
            if (codeY > pageHeight - 15) {
              doc.addPage();
              codeY = margin;
            }
            doc.text(wrappedLine, margin + 3, codeY);
            codeY += lineHeight;
          });
        });

        y += boxHeight + 6;
      }

      if (block.type === "output") {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        const lines = doc.splitTextToSize(`Output: ${block.content}`, maxWidth);
        lines.forEach((line) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 5;
        });
        y += 5;
      }
    });

    y += 6;
  });

  // ===== FOOTER =====
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Page ${i} of ${totalPages} | Exported from NixBot`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  const filename =
    `${conversation.title?.replace(/[^a-z0-9]/gi, "_") || "chat"}_${Date.now()}.pdf`;
  doc.save(filename);
};

// === Helpers ===
function parseContent(content) {
  const blocks = [];
  const codeRegex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) blocks.push({ type: "text", content: cleanText(text) });
    }
    blocks.push({ type: "code", content: match[1].trim() });
    lastIndex = codeRegex.lastIndex;
  }

  const remaining = content.slice(lastIndex).trim();
  if (remaining) {
    if (/^Output:/i.test(remaining)) {
      blocks.push({
        type: "output",
        content: remaining.replace(/^Output:/i, "").trim(),
      });
    } else {
      blocks.push({ type: "text", content: cleanText(remaining) });
    }
  }

  return blocks;
}

function cleanText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .trim();
}
