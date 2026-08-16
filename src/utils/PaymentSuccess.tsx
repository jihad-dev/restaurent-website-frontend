import { CheckCircleIcon } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="w-20 h-20 text-green-500 animate-bounce" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {transactionId && (
          <div className="bg-gray-100 p-3 rounded-lg mb-6">
            <span className="text-xs text-gray-500 block">Transaction ID</span>
            <span className="font-mono text-sm font-semibold text-gray-700">
              {transactionId}
            </span>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            to="/my-order"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;