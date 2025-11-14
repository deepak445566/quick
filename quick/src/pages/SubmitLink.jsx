import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SubmitLink = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!url) {
      setError('Please enter a URL');
      setLoading(false);
      return;
    }

    try {
      // Basic URL validation
      new URL(url);
      
      console.log('🟡 Submitting to Google Indexing API:', url);
      
      const response = await axios.post(
        '/indexing/submit-url', 
        { url },
        { withCredentials: true }
      );

      console.log('✅ Google Indexing Response:', response.data);
      
      if (response.data.success) {
        setMessage(`✅ Success! URL submitted to Google Indexing: ${url}`);
        setUrl('');
        
        // Auto clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      }
      
    } catch (error) {
      console.error('🔴 Indexing error:', error);
      
      if (error.response?.data?.message) {
        setError(`Google Indexing Error: ${error.response.data.message}`);
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Check if backend is running.');
      } else if (error instanceof TypeError) {
        setError('Invalid URL format');
      } else {
        setError('Failed to submit URL for indexing');
      }
    } finally {
      setLoading(false);
    }
  };

  // Agar user logged in nahi hai toh
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">Please login to submit URLs for indexing</p>
            <a href="/login" className="text-blue-600 hover:underline mt-2 inline-block">
              Go to Login
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submit URL for Google Indexing
            </h1>
            <p className="text-gray-600 mb-6">
              Enter your URL to submit it directly to Google Indexing API
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <strong>Success:</strong> {message}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Must be a valid URL with https:// or http://
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting to Google...
                  </span>
                ) : (
                  'Submit to Google Indexing'
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>✅ URL directly submitted to Google Indexing API</li>
                <li>✅ Real-time indexing request</li>
                <li>✅ Google ke official API through process</li>
                <li>✅ Fast indexing (Google ke crawl schedule par depend karta hai)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitLink;