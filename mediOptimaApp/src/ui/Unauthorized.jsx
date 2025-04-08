import React from 'react';
import { useNavigate } from 'react-router-dom';
function Unauthorized(){
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Unauthorized Access
        </h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          You don't have permission to view this page. This may be because:
        </p>
        
        {/* Reasons List */}
        <ul className="text-left max-w-xs mx-auto mb-8 space-y-2">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span className="text-gray-700">Your session has expired</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span className="text-gray-700">You don't have the required permissions</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span className="text-gray-700">You need to authenticate first</span>
          </li>
        </ul>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 mb-8">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Login to Continue
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border border-blue-500 text-blue-500 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Return to Home
          </button>
        </div>
        
        {/* Security Notice */}
        <div className="flex items-center justify-center text-sm text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-1.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
          For your security, unauthorized access attempts are logged.
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;