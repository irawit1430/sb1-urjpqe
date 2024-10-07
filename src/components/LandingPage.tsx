import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col justify-center items-center text-white">
      <Music size={64} className="mb-8" />
      <h1 className="text-5xl font-bold mb-4">Music Match</h1>
      <p className="text-xl mb-8">Find your perfect match through music</p>
      <button
        onClick={handleSignIn}
        className="bg-white text-purple-600 font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition duration-300"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LandingPage;