import React from "react";
import CryptoJS from "crypto-js";

const EsewaPayButton = ({ amount, taxAmount, transactionUUID }) => {
  const handlePay = () => {
    const totalAmount = parseInt(amount) + taxAmount;
    const productCode = "EPAYTEST";
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const stringToSign = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`;
    const secretKey = "8gBm/:&EnhH.1/q"; // eSewa demo secret

    // Generate HMAC-SHA256 signature in base64
    const hash = CryptoJS.HmacSHA256(stringToSign, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    // Create form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const inputs = {
      amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUUID,
      product_code: productCode,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: "http://localhost:5173/payment-success",
      failure_url: "http://localhost:5173/sujen-home",
      signed_field_names: signedFieldNames,
      signature,
    };

    for (const key in inputs) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = inputs[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <button
      onClick={handlePay}
      className="btn btn-success px-4 py-2 rounded-pill d-flex align-items-center gap-2"
      style={{
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
        fontWeight: "bold",
      }}
    >
      <img
        src="https://esewa.com.np/common/images/esewa-icon.png"
        alt="eSewa"
        width="20"
        height="20"
      />
      Pay with eSewa
    </button>
  );
};

export default EsewaPayButton;
