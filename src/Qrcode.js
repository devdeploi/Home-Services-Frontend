import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Qrcode() {
  const [text, setText] = useState('');
  const qrCodeRef = useRef(null);

  const handleDownload = () => {
    if (!qrCodeRef.current) return;
    
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="App container mt-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">QR Code Generator</h2>
          
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter text or URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {text && (
            <div className="text-center mb-4">
              <div className="border p-3 rounded">
                <QRCodeSVG
                  ref={qrCodeRef}
                  value={text}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <button 
                onClick={handleDownload}
                className="btn btn-primary mt-3"
                disabled={!text}
              >
                <i className="bi bi-download me-2"></i>
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Qrcode;


