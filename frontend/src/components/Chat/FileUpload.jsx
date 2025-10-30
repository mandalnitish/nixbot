// frontend/src/components/Chat/FileUpload.jsx
import React, { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react';

const FileUpload = ({ onFileSelect, onFileRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, TXT, DOCX, and image files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/files/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          extractedText: data.data.extractedText
        });
        onFileSelect(data.data);
      } else {
        setError(data.message || 'Failed to upload file');
      }
    } catch (err) {
      setError('Error uploading file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    onFileRemove();
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (uploadedFile) {
    return (
      <div className="mb-3 p-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-purple-400">
            {getFileIcon(uploadedFile.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {uploadedFile.name}
            </p>
            <p className="text-gray-400 text-xs">
              {formatFileSize(uploadedFile.size)} • Uploaded
            </p>
          </div>
          <button
            onClick={removeFile}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-purple-500/30 hover:border-purple-500/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className={`w-10 h-10 mb-3 ${uploading ? 'animate-bounce' : ''} text-purple-400`} />
            <p className="text-white font-medium mb-1">
              {uploading ? 'Uploading...' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-gray-400 text-sm">
              PDF, TXT, DOCX, or Images (Max 10MB)
            </p>
          </div>
        </label>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;