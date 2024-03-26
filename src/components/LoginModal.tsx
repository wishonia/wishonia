// LoginModal.tsx
import React, { useState } from 'react';

interface LoginModalProps {
  show: boolean;
  onLogin: (email: string) => void; // Changed to only accept an email
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onLogin }) => {
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    // Logic for handling login
    onLogin(email);
  };

  if (!show) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {/* Login modal UI as a popup */}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginModal;
