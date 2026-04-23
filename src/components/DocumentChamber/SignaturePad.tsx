import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureData = sigCanvas.current.toDataURL();
      onSave(signatureData);
      setHasSignature(true);
    } else {
      alert('Please draw your signature first');
    }
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
      <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>✍️ Draw Your Signature</h4>
      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 500,
            height: 200,
            className: 'signature-canvas',
            style: { width: '100%', height: '150px', backgroundColor: '#f9fafb' }
          }}
          onBegin={() => setHasSignature(false)}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button
          onClick={clear}
          style={{ padding: '6px 16px', backgroundColor: '#6b7280', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          Clear
        </button>
        <button
          onClick={save}
          style={{ padding: '6px 16px', backgroundColor: '#4F46E5', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          Save Signature
        </button>
      </div>
      {hasSignature && <p style={{ color: '#10b981', fontSize: '12px', marginTop: '8px' }}>✓ Signature saved!</p>}
    </div>
  );
};