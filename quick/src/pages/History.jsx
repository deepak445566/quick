import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // History fetch karna
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'history/my-history',
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('🔴 History fetch error:', error);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // History record delete karna
  const deleteHistory = async (id) => {
    try {
      await axios.delete(
        `/history/${id}`,
        { withCredentials: true }
      );
      
      // Local state update karein
      setHistory(history.filter(item => item._id !== id));
    } catch (error) {
      console.error('🔴 Delete error:', error);
      setError('Failed to delete record');
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Status ke according color aur text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'indexed':
        return { color: 'green', text: 'Indexed', icon: '✅' };
      case 'submitted':
        return { color: 'blue', text: 'Submitted', icon: '🟡' };
      case 'failed':
        return { color: 'red', text: 'Failed', icon: '❌' };
      case 'pending':
        return { color: 'yellow', text: 'Pending', icon: '⏳' };
      default:
        return { color: 'gray', text: 'Unknown', icon: '❓' };
    }
  };

  // Agar user logged in nahi hai
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">Please login to view your history</p>
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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Indexing History
                </h1>
                <p className="text-gray-600 mt-2">
                  Your submitted URLs and their indexing status
                </p>
              </div>
              <button
                onClick={fetchHistory}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Refresh
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No History Found
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't submitted any URLs for indexing yet.
                </p>
                <a
                  href="/submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Submit Your First URL
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {history.map((item) => {
                      const statusInfo = getStatusInfo(item.status);
                      return (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                              {item.url}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                              {statusInfo.icon} {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()} at{' '}
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteHistory(item._id)}
                              className="text-red-600 hover:text-red-900 transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Showing {history.length} most recent submissions
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;