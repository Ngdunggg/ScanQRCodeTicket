// API Configuration
// For Expo: Use either:
// 1. Public URL (ngrok) - Recommended: https://xxxx-xxxx-xxxx.ngrok-free.app
// 2. Local IP address: http://192.168.1.100:5000
// 
// Set in .env file: EXPO_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok-free.app
const getBaseURL = () => {
  const envURL = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envURL) {
    // Remove trailing slash if exists
    return envURL.replace(/\/$/, "");
  }
  return "http://localhost:5000";
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds
};

export const API_ENDPOINTS = {
  PURCHASED_TICKETS: "/purchased-tickets/:ticketId",
};
