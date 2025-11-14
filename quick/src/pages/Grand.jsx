import React from 'react';

const Grand = () => {
  const steps = [
    {
      id: 1,
      title: "Go to Google Search Console",
      description:
        "Visit the official Google Search Console at https://search.google.com/search-console and log in with your Google account.",
      icon: "🌐",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Select Your Property",
      description:
        "Choose the website property (domain or URL prefix) that you want to grant access to. Make sure it's verified under your account.",
      icon: "🏠",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Open Settings",
      description:
        "In the left sidebar, scroll down and click on 'Settings'. You'll see an option for 'Users and permissions'.",
      icon: "⚙️",
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: 4,
      title: "Add a New User",
      description:
        "Click the 'Add user' button in the top-right corner. A dialog box will appear asking for the email address and role.",
      icon: "➕",
      color: "from-green-500 to-emerald-500",
    },
    {
  id: 5,
  title: "Add Our Service Account Email",
  description:
    "Enter this exact email address: instant-indexing-key@indexing-477510.iam.gserviceaccount.com - This grants our system secure, limited access to submit indexing requests on your behalf.",
  icon: "📧",
  color: "from-indigo-500 to-violet-500",
},
    {
      id: 6,
      title: "Save and Confirm",
      description:
        "Click 'Add' to save the user. The service now has permission to manage URL indexing requests for your property.",
      icon: "✅",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Grant Access Guide
            </h1>
            <p className="text-gray-400 mt-2">
              Step-by-step guide to give website access in Google Search Console
            </p>
          </div>
          <button
            onClick={() =>
              window.open("https://search.google.com/search-console", "_blank")
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🌐 Open Search Console
          </button>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${step.color} mb-4 text-2xl`}
              >
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Step {step.id}: {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Extra Help Section */}
        <div className="bg-gray-800 rounded-xl mt-12 p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-4">
            💡 Need Help?
          </h2>
          <p className="text-gray-300 mb-4">
            If you're unsure about which email to add or the permissions to
            choose, you can contact our support team for quick assistance.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.location.href = "/support"}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition-colors"
            >
              💬 Contact Support
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://support.google.com/webmasters/answer/7687615",
                  "_blank"
                )
              }
              className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg font-medium transition-colors"
            >
              📘 Google's Official Guide
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-800 rounded-xl mt-12 p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-purple-400 flex items-center gap-2 mb-4">
            📝 Summary
          </h2>
          <ul className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Login to Google Search Console</li>
            <li>Select your verified website property</li>
            <li>Open <strong>Settings → Users and permissions</strong></li>
            <li>Add the service account email provided</li>
            <li>Assign the appropriate role and save</li>
          </ul>
          <p className="mt-4 text-gray-400 text-sm">
            Once access is granted, the system will automatically manage and
            index your URLs securely using Google's API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Grand;