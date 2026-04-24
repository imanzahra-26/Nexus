import React, { useState } from 'react';

interface PasswordStrengthProps {
  onPasswordChange?: (strength: number) => void;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ onPasswordChange }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const checkStrength = (pwd: string) => {
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    
    // Character type checks
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    // Max score is 6
    const finalScore = Math.min(score, 6);
    setStrength(finalScore);
    if (onPasswordChange) onPasswordChange(finalScore);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkStrength(newPassword);
  };

  const getStrengthText = () => {
    if (strength === 0) return 'No password';
    if (strength <= 2) return 'Weak 🔴';
    if (strength <= 4) return 'Medium 🟡';
    return 'Strong 🟢';
  };

  const getStrengthColor = () => {
    if (strength === 0) return '#9CA3AF';
    if (strength <= 2) return '#EF4444';
    if (strength <= 4) return '#F59E0B';
    return '#10B981';
  };

  const getStrengthWidth = () => {
    return `${(strength / 6) * 100}%`;
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={handleChange}
        placeholder="Enter your password"
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #D1D5DB',
          marginBottom: '8px'
        }}
      />
      
      {/* Strength Bar */}
      <div style={{
        height: '6px',
        backgroundColor: '#E5E7EB',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <div style={{
          width: getStrengthWidth(),
          height: '100%',
          backgroundColor: getStrengthColor(),
          transition: 'width 0.3s ease'
        }} />
      </div>
      
      {/* Strength Text */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          Password strength:
        </span>
        <span style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: getStrengthColor()
        }}>
          {getStrengthText()}
        </span>
      </div>
      
      {/* Tips */}
      {strength <= 2 && password.length > 0 && (
        <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '8px' }}>
          💡 Use 8+ characters, uppercase, numbers, and symbols
        </p>
      )}
    </div>
  );
};