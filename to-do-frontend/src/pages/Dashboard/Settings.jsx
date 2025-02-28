import axios from "axios";
import { useEffect, useState } from "react";

const Settings = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkGoogleConnection = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/auth/me`,
          { withCredentials: true }
        );
        console.log(response)
        if (response.data?.google?.connected) {
          setIsGoogleConnected(true);
        }
      } catch (error) {
        console.error("Error checking Google connection:", error);
        setError("Could not retrieve your account information");
      } finally {
        setLoading(false);
      }
    };

    checkGoogleConnection();
  }, []);

  const handleGoogleConnect = () => {
    // This will redirect the user to Google's OAuth page
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      
      <div className="mt-6">
        <h3 className="text-xl font-medium">Google Integration</h3>
        {isGoogleConnected ? (
          <div className="mt-2">
            <p className="text-green-600">✅ Your account is connected to Google</p>
            <p className="text-sm text-gray-600 mt-1">Your tasks will be synchronized with Google Calendar</p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-gray-700">Connect your account to Google to sync your tasks with Google Calendar</p>
            <button
              onClick={handleGoogleConnect}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Connect to Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;