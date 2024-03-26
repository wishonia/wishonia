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

  const handleGoogleLogin = () => {
    // Logic for handling Google login
    // This is where you would integrate with Google's login API
    console.log("Google login logic goes here.");
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 border border-black shadow-lg">
      {/* Login modal UI as a popup */}
      <p className="text-center">Please login to so we know you're not a damn robot.</p>
      <div className="text-center">
        <input className="border border-black p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
        <button className="border border-black p-2 mt-2" onClick={handleLogin}>Login</button>
      </div>
      <div className="text-center my-2">OR</div>
      <div className="text-center">
        <button className="bg-white text-black p-2 border border-black shadow-md" onClick={handleGoogleLogin}>
          <img className="inline mr-2 align-middle w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/640px-Google_%22G%22_logo.svg.png" alt="Google logo" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
