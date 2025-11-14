import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('🍪 All cookies:', document.cookie);
    
    const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      console.log('✅ Token cookie mil gaya');
    } else {
      console.log('❌ Token cookie nahi mila');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16"> {/* Added padding for fixed navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Dashboard, {user?.fullname || user?.userId}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            You have successfully registered and logged in!
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a 
                href="/submit" 
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Submit New Link
              </a>
              <a 
                href="/history" 
                className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition"
              >
                View History
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;