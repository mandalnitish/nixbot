// backend/src/controllers/fileController.js - Improved Version
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|txt|doc|docx|png|jpg|jpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, TXT, DOCX, and image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Extract text from PDF - Multiple methods
const extractPDFText = async (filePath) => {
  try {
    // Method 1: Try pdf-parse
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    if (data.text && data.text.trim().length > 0) {
      console.log('PDF extracted successfully with pdf-parse');
      return data.text;
    }
  } catch (error) {
    console.error('pdf-parse failed:', error.message);
  }

  try {
    // Method 2: Try pdfjs-dist as fallback
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    if (fullText.trim().length > 0) {
      console.log('PDF extracted successfully with pdfjs-dist');
      return fullText;
    }
  } catch (error) {
    console.error('pdfjs-dist failed:', error.message);
  }

  // If all methods fail, return a helpful message
  return `[PDF file: ${path.basename(filePath)}]\n\nNote: Could not automatically extract text from this PDF. The PDF may be:\n- Scanned images without OCR\n- Protected/encrypted\n- Using unsupported encoding\n\nPlease describe what's in the PDF or ask general questions about it.`;
};

// Extract text from DOCX
const extractDocxText = async (filePath) => {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (result.value && result.value.trim().length > 0) {
      console.log('DOCX extracted successfully');
      return result.value;
    }
    return '[Could not extract text from DOCX file]';
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return '[Could not extract text from DOCX file]';
  }
};

// Extract text from TXT
const extractTxtText = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('TXT extraction error:', error);
    return '[Could not read text file]';
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Main file upload handler
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let extractedText = '';
    let fileType = '';

    console.log('📁 Processing file:', req.file.originalname);
    console.log('📊 File size:', formatFileSize(req.file.size));
    console.log('📝 File type:', fileExt);

    // Extract text based on file type
    if (fileExt === '.pdf') {
      extractedText = await extractPDFText(filePath);
      fileType = 'pdf';
    } else if (fileExt === '.docx' || fileExt === '.doc') {
      extractedText = await extractDocxText(filePath);
      fileType = 'docx';
    } else if (fileExt === '.txt') {
      extractedText = extractTxtText(filePath);
      fileType = 'txt';
    } else if (['.png', '.jpg', '.jpeg'].includes(fileExt)) {
      extractedText = `[Image file: ${req.file.originalname}]\n\nThis is an image file. I can discuss general topics about images, but I cannot directly analyze the image content without vision capabilities. Please describe what you see in the image or ask questions about it.`;
      fileType = 'image';
    }

    const textLength = extractedText.length;
    console.log('✅ Extracted text length:', textLength, 'characters');

    // Limit text to prevent overwhelming the AI
    const maxChars = 15000;
    let processedText = extractedText;
    if (textLength > maxChars) {
      processedText = extractedText.substring(0, maxChars) + `\n\n[Text truncated - showing first ${maxChars} characters of ${textLength} total]`;
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        filename: req.file.originalname,
        fileType: fileType,
        fileSize: req.file.size,
        formattedSize: formatFileSize(req.file.size),
        extractedText: processedText,
        originalLength: textLength,
        filePath: filePath
      }
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process file'
    });
  }
};

module.exports = {
  upload,
  uploadFile
};