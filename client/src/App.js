import { useState, useEffect, useRef } from 'react';
import './App.css';
import { uploadFile } from './service/api';

const EXPIRY_OPTIONS = [
  { value: '5m', label: '5 minutes' },
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '6h', label: '6 hours' },
  { value: '24h', label: '24 hours' },
];

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [expiry, setExpiry] = useState('24h');

  const fileInputRef = useRef();

  useEffect(() => {
    const upload = async () => {
      if (file) {
        setLoading(true);
        setResult('');
        setExpiresAt('');
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);
        data.append("expiry", expiry);

        const response = await uploadFile(data);
        setLoading(false);
        if (response && response.path) {
          setResult(response.path);
          setExpiresAt(response.expiresAt || '');
        } else {
          setResult("error");
        }
      }
    };
    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatExpiry = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleReset = () => {
    setFile(null);
    setResult('');
    setExpiresAt('');
    setCopied(false);
  };

  return (
    <div className='container'>
      <div className='card'>
        <div className='icon-wrapper'>☁️</div>
        <h1>Inshare</h1>
        <p className='subtitle'>Upload a file and get an instant shareable link.<br />No sign-up required.</p>

        {!file && !loading && !result && (
          <>
            <div className='expiry-selector'>
              <label htmlFor='expiry'>Link expires in:</label>
              <select
                id='expiry'
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              >
                {EXPIRY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div
              className={`upload-zone ${dragover ? 'dragover' : ''}`}
              onClick={onUploadClick}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={handleDrop}
            >
              <div className='upload-icon'>📁</div>
              <p className='upload-text'>
                Drag & drop your file here, or <strong>browse</strong>
              </p>
            </div>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files[0]) setFile(e.target.files[0]);
          }}
        />

        {file && (
          <div className='file-info'>
            <span className='file-icon'>📄</span>
            <span className='file-name'>{file.name}</span>
            <span className='file-size'>{formatSize(file.size)}</span>
          </div>
        )}

        {loading && (
          <button className='upload-btn' disabled>
            <span className='spinner'></span> Uploading...
          </button>
        )}

        {!loading && result && result !== 'error' && (
          <div className='result-area'>
            <div className='result-box'>
              <a href={result} target='_blank' rel='noreferrer' className='link-text'>
                {result}
              </a>
              <button className='copy-btn' onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            {expiresAt && (
              <p className='expiry-info'>⏱ Expires: {formatExpiry(expiresAt)}</p>
            )}
            <button className='upload-btn reset-btn' onClick={handleReset}>
              Upload Another File
            </button>
          </div>
        )}

        {!loading && result === 'error' && (
          <div className='result-area'>
            <div className='error-box'>
              ⚠️ Upload failed. Please check your connection and try again.
            </div>
            <button className='upload-btn reset-btn' onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}

        <p className='hint'>Max file size: 10 MB</p>
      </div>
    </div>
  );
}

export default App;
