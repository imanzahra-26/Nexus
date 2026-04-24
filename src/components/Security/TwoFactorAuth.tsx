import React, { useState } from 'react';

export const TwoFactorAuth: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());

  const handleEnable2FA = () => {
    setShowOTPInput(true);
    alert(`Your verification code is: ${generatedCode}\n(In a real app, this would be sent to your phone/email)`);
  };

  const handleVerifyOTP = () => {
    if (otpCode === generatedCode) {
      setIs2FAEnabled(true);
      setShowOTPInput(false);
      setOtpCode('');
      alert('2FA enabled successfully! Your account is now more secure.');
    } else {
      alert('Invalid code. Please try again.');
    }
  };

  const handleDisable2FA = () => {
    setIs2FAEnabled(false);
    alert('2FA has been disabled for this account.');
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>🔐</span>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Two-Factor Authentication (2FA)</h3>
          </div>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Add an extra layer of security to your account
          </p>
          {is2FAEnabled && (
            <p style={{ fontSize: '12px', color: '#10B981', marginTop: '8px' }}>
              ✓ 2FA is currently ENABLED
            </p>
          )}
        </div>
        
        <div>
          {!is2FAEnabled ? (
            <button
              onClick={handleEnable2FA}
              style={{
                backgroundColor: '#4F46E5',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Enable 2FA
            </button>
          ) : (
            <button
              onClick={handleDisable2FA}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Disable 2FA
            </button>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPInput && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px'
        }}>
          <p style={{ marginBottom: '12px', fontSize: '14px' }}>
            Enter the 6-digit verification code:
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="000000"
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                width: '150px',
                textAlign: 'center',
                fontSize: '18px'
              }}
            />
            <button
              onClick={handleVerifyOTP}
              style={{
                backgroundColor: '#10B981',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Verify
            </button>
            <button
              onClick={() => setShowOTPInput(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
            Demo mode: Code is <strong>{generatedCode}</strong>
          </p>
        </div>
      )}
    </div>
  );
};