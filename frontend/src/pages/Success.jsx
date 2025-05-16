import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Success = () => {
  const location = useLocation();

  const getTransactionData = () => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get("data");

    if (!encodedData) return null;

    try {
      const jsonString = atob(encodedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to decode transaction data:", error);
      return null;
    }
  };

  const transactionData = getTransactionData();

  useEffect(() => {
    const notifyBackend = async () => {
      if (transactionData) {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://localhost:3000/esewa/payment/success', transactionData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Successfully notified backend about payment');
        } catch (error) {
          console.error('Failed to notify backend:', error);
        }
      }
    };

    notifyBackend();
  }, [transactionData]);

  if (!transactionData) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          ❌ Invalid or missing transaction data.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-success text-center mb-4">
            Payment Successful!
          </h3>

          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Transaction Code:</strong>{" "}
              {transactionData.transaction_code}
            </li>
            <li className="list-group-item">
              <strong>Status:</strong> {transactionData.status}
            </li>
            <li className="list-group-item">
              <strong>Total Amount:</strong> {transactionData.total_amount}
            </li>
            <li className="list-group-item">
              <strong>Product Code:</strong> {transactionData.product_code}
            </li>
            <li className="list-group-item">
              <strong>Transaction UUID:</strong>{" "}
              {transactionData.transaction_uuid}
            </li>
          </ul>

          <div className="text-center mt-4">
            <a href="/" className="btn btn-success">
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
