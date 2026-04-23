import React, { useState } from 'react';
import { SignaturePad } from './SignaturePad';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'review' | 'signed';
  uploadedAt: string;
  signature?: string;
}

export const DocumentChamber: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        status: 'draft',
        uploadedAt: new Date().toLocaleString()
      };
      setDocuments([...documents, newDoc]);
      alert(`Document "${file.name}" uploaded successfully!`);
    }
  };

  const updateStatus = (id: string, newStatus: 'draft' | 'review' | 'signed') => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, status: newStatus } : doc
    ));
  };

  const handleSignDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowSignaturePad(true);
  };

  const saveSignature = (signatureData: string) => {
    if (selectedDocument) {
      setDocuments(documents.map(doc =>
        doc.id === selectedDocument.id 
          ? { ...doc, status: 'signed', signature: signatureData }
          : doc
      ));
      setShowSignaturePad(false);
      setSelectedDocument(null);
      alert('Document signed successfully!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return { bg: '#fef3c7', text: '#92400e', label: 'Draft' };
      case 'review': return { bg: '#dbeafe', text: '#1e40af', label: 'In Review' };
      case 'signed': return { bg: '#d1fae5', text: '#065f46', label: 'Signed' };
      default: return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>📄 Document Chamber</h2>
      
      {/* Upload Section */}
      <div style={{ marginBottom: '24px', padding: '20px', border: '2px dashed #e5e7eb', borderRadius: '12px', textAlign: 'center' }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Upload Document</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Click or drag PDF/DOC files here</p>
        </label>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>No documents uploaded yet</p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>Upload a document to get started</p>
        </div>
      ) : (
        <div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Your Documents ({documents.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map(doc => {
              const statusStyle = getStatusColor(doc.status);
              return (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '24px' }}>📄</span>
                      <div>
                        <p style={{ fontWeight: 'bold' }}>{doc.name}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Uploaded: {doc.uploadedAt}</p>
                      </div>
                      <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {doc.status !== 'signed' && (
                      <button
                        onClick={() => handleSignDocument(doc)}
                        style={{ backgroundColor: '#4F46E5', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✍️ Sign
                      </button>
                    )}
                    {doc.status === 'draft' && (
                      <button
                        onClick={() => updateStatus(doc.id, 'review')}
                        style={{ backgroundColor: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Submit for Review
                      </button>
                    )}
                    {doc.status === 'review' && (
                      <button
                        onClick={() => updateStatus(doc.id, 'signed')}
                        style={{ backgroundColor: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Approve & Sign
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Previewing: ${doc.name}`)}
                      style={{ backgroundColor: '#6b7280', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                    >
                      👁️ Preview
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', maxWidth: '90%', width: '600px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Sign Document: {selectedDocument?.name}</h3>
            <SignaturePad onSave={saveSignature} />
            <button
              onClick={() => setShowSignaturePad(false)}
              style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};