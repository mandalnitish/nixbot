// frontend/src/utils/pdfExport.js
import jsPDF from 'jspdf';

export const exportChatToPDF = (conversation, messages) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple
  doc.text('NixBot Conversation', margin, yPosition);
  yPosition += 10;

  // Conversation details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Title: ${conversation.title}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Date: ${new Date(conversation.createdAt).toLocaleString()}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Messages: ${messages.length}`, margin, yPosition);
  yPosition += 10;

  // Separator line
  doc.setDrawColor(139, 92, 246);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Messages
  messages.forEach((message, index) => {
    const isBot = message.role === 'assistant';
    const timestamp = new Date(message.createdAt).toLocaleTimeString();

    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // Message header
    doc.setFontSize(11);
    doc.setTextColor(isBot ? 139 : 59, isBot ? 92 : 130, isBot ? 246 : 246);
    doc.setFont(undefined, 'bold');
    doc.text(isBot ? '🤖 NixBot' : '👤 You', margin, yPosition);
    
    // Timestamp
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont(undefined, 'normal');
    doc.text(timestamp, pageWidth - margin - 30, yPosition);
    yPosition += 6;

    // Message content
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    // Clean message content (remove markdown)
    let cleanContent = message.content
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`{3}[\s\S]*?`{3}/g, '[Code Block]') // Replace code blocks
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links

    const lines = doc.splitTextToSize(cleanContent, maxWidth);
    lines.forEach(line => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 5; // Space between messages
  });

  // Footer on last page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} | Exported from NixBot`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
};