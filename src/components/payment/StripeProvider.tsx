import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY_PUBLISH || "");

interface StripeProviderWrapperProps {
  children: React.ReactNode;
}

const StripeProviderWrapper: React.FC<StripeProviderWrapperProps> = ({
  children,
}) => {
  const options = {
    // You can customize Stripe Elements appearance here
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#94EB00", // Your primary green color
        colorBackground: "#1f2937", // Dark background
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
      rules: {
        ".Tab": {
          backgroundColor: "#374151",
          color: "#ffffff",
        },
        ".Tab--selected": {
          backgroundColor: "#94EB00",
          color: "#000000",
        },
        ".Input": {
          backgroundColor: "#374151",
          color: "#ffffff",
          border: "1px solid #4b5563",
        },
        ".Input:focus": {
          borderColor: "#94EB00",
          boxShadow: "0 0 0 1px #94EB00",
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProviderWrapper;
