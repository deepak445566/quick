import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SubmitLink = () => {
  const [urls, setUrls] = useState('');
  const [delay, setDelay] = useState(2); // Default 2 seconds delay
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalUrls, setTotalUrls] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setProgress(0);

    // URLs ko array mein convert karein
    const urlArray = urls.split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlArray.length === 0) {
      setError('Please enter at least one URL');
      setLoading(false);
      return;
    }

    if (urlArray.length > 50) {
      setError('Maximum 50 URLs allowed at once');
      setLoading(false);
      return;
    }

    try {
      console.log('🟡 Submitting batch URLs:', urlArray);
      console.log('⏱️ Delay between URLs:', delay, 'seconds');
      
      setTotalUrls(urlArray.length);

      const response = await axios.post(
        '/indexing/submit-batch', 
        { 
          urls: urlArray,
          delay: delay * 1000 // Convert to milliseconds
        },
        { withCredentials: true }
      );

      console.log('✅ Batch Submission Response:', response.data);
      
      if (response.data.success) {
        const successCount = response.data.results.filter(r => r.success).length;
        const failedCount = response.data.results.filter(r => !r.success).length;
        
        setMessage(`✅ Successfully processed ${successCount} URLs, ${failedCount} failed`);
        
        // Progress bar complete
        setProgress(100);
        
        setUrls('');
        
        // Auto clear message after 8 seconds
        setTimeout(() => {
          setMessage('');
          setProgress(0);
        }, 8000);
      }
      
    } catch (error) {
      console.error('🔴 Batch indexing error:', error);
      
      if (error.response?.data?.message) {
        setError(`Batch Submission Error: ${error.response.data.message}`);
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Check if backend is running.');
      } else {
        setError('Failed to submit URLs for indexing');
      }
    } finally {
      setLoading(false);
    }
  };

  // Single URL submission (existing functionality)
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const singleUrl = urls.split('\n')[0]?.trim();

    if (!singleUrl) {
      setError('Please enter a URL');
      setLoading(false);
      return;
    }

    try {
      new URL(singleUrl);
      
      console.log('🟡 Submitting single URL:', singleUrl);
      
      const response = await axios.post(
        '/indexing/submit-url', 
        { url: singleUrl },
        { withCredentials: true }
      );

      console.log('✅ Single URL Response:', response.data);
      
      if (response.data.success) {
        setMessage(`✅ Success! URL submitted: ${singleUrl}`);
        setUrls('');
        setTimeout(() => setMessage(''), 5000);
      }
      
    } catch (error) {
      console.error('🔴 Single URL error:', error);
      
      if (error.response?.data?.message) {
        setError(`Error: ${error.response.data.message}`);
      } else if (error instanceof TypeError) {
        setError('Invalid URL format');
      } else {
        setError('Failed to submit URL');
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submit URLs for Google Indexing
            </h1>
            <p className="text-gray-600 mb-6">
              Submit multiple URLs at once with configurable delay between requests
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

              {/* Progress Bar */}
              {loading && totalUrls > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm text-blue-700 mb-2">
                    <span>Processing URLs...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {Math.round((progress / 100) * totalUrls)} of {totalUrls} URLs processed
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URLs (One per line) *
                </label>
                <textarea
                  id="urls"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                  rows="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter one URL per line. Maximum 50 URLs allowed.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Current: {urls.split('\n').filter(url => url.trim().length > 0).length} URLs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="delay" className="block text-sm font-medium text-gray-700 mb-2">
                    Delay Between URLs (Seconds)
                  </label>
                  <select
                    id="delay"
                    value={delay}
                    onChange={(e) => setDelay(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">1 Second</option>
                    <option value="2">2 Seconds</option>
                    <option value="5">5 Seconds</option>
                    <option value="10">10 Seconds</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Prevents rate limiting
                  </p>
                </div>
                
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <p>⏱️ Estimated time: </p>
                    <p className="font-semibold">
                      {urls.split('\n').filter(url => url.trim().length > 0).length * delay} seconds
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing {totalUrls} URLs...
                    </span>
                  ) : (
                    'Submit All URLs'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSingleSubmit}
                  disabled={loading || !urls.split('\n')[0]?.trim()}
                  className="px-6 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  Submit First URL Only
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Batch Features:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>✅ Submit up to 50 URLs at once</li>
                <li>✅ Configurable delay between requests (1-10 seconds)</li>
                <li>✅ Real-time progress tracking</li>
                <li>✅ Individual URL status reporting</li>
                <li>✅ Rate limit protection</li>
                <li>✅ History tracking for all URLs</li>
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