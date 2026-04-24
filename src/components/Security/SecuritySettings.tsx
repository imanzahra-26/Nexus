import { useState } from 'react';
import React from 'react';
import { PasswordStrength } from './PasswordStrength';
import { TwoFactorAuth } from './TwoFactorAuth';

export const SecuritySettings: React.FC = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Security Settings</h2>
      
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Change Password</h3>
        <PasswordStrength onPasswordChange={setPasswordStrength} />
        
        {passwordStrength >= 4 && (
          <button style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px'
          }}>
            Update Password
          </button>
        )}
      </div>

      <TwoFactorAuth />
    </div>
  );
};