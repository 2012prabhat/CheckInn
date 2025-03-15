// app/bookings/error/page.js
"use client"; // Mark the component as a Client Component
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  // Function to handle retry
  const handleRetry = () => {
    router.push("/"); // Redirect to the home page or booking page
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
      <p className="text-gray-700 mb-4">
        There was an issue processing your payment. Please try again or contact support if the problem persists.
      </p>

      <div className="mt-6">
        <button
          onClick={handleRetry}
          className="secBtn w-40"
        >
          Try Again
        </button>
      </div>

      <div className="mt-4">
        <p className="text-gray-700">
          Need help?{" "}
          <a href="mailto:support@checkinn.com" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;