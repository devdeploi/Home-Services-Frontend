import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Qrcode() {
  const [text, setText] = useState('');
  const qrCodeRef = useRef(null);

  const handleDownload = () => {
    if (!qrCodeRef.current) return;

    // QRCodeCanvas renders a canvas element directly
    const canvas = qrCodeRef.current;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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
                <QRCodeCanvas
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


