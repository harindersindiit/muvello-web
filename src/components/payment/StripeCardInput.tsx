import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import paymentService from "@/services/paymentService";

interface StripeCardInputProps {
  onSuccess: () => void;
  onCancel: () => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

const StripeCardInput: React.FC<StripeCardInputProps> = ({
  onSuccess,
  onCancel,
  loading = false,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#1f2937",
        "::placeholder": {
          color: "#9ca3af",
        },
        iconColor: "#94EB00",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: false,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please try again.");
      return;
    }

    if (!cardHolderName.trim()) {
      toast.error("Please enter the cardholder name");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setProcessingPayment(true);
    setLoading?.(true);

    try {
      // Step 1: Create setup intent
      const setupIntentResponse = await paymentService.createSetupIntent();

      if (
        !setupIntentResponse.success ||
        !setupIntentResponse.body?.client_secret
      ) {
        toast.error(
          setupIntentResponse.message || "Failed to create setup intent"
        );
        return;
      }

      // Step 2: Confirm setup intent with card details
      const { error, setupIntent } = await stripe.confirmCardSetup(
        setupIntentResponse.body.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardHolderName.trim(),
            },
          },
        }
      );

      if (error) {
        console.error("Stripe setup intent error:", error);
        toast.error(error.message || "Failed to setup payment method");
        return;
      }

      if (setupIntent?.status === "succeeded") {
        // Step 3: Save payment method to backend
        const saveResponse = await paymentService.savePaymentMethod(
          setupIntent
        );

        if (saveResponse.success) {
          toast.success("Card added successfully!");
          // Clear form
          setCardHolderName("");
          cardElement.clear();
          onSuccess();
        } else {
          toast.error(saveResponse.message || "Failed to save payment method");
        }
      } else {
        toast.error("Setup intent was not successful");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setProcessingPayment(false);
      setLoading?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Cardholder Name
        </label>
        <Input
          type="text"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          placeholder="Name on card"
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Card Information
        </label>
        <div className="p-3 border border-gray-700 rounded-md bg-gray-800">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-xs text-gray-400 bg-gray-900 p-3 rounded-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-500">🔒</span>
          <span className="font-medium">Secure Payment</span>
        </div>
        <p>
          Your card information is encrypted and processed securely by Stripe.
          We never store your full card details on our servers.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={processingPayment || loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || !elements || processingPayment || loading}
        >
          {processingPayment || loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Add Card"
          )}
        </Button>
      </div>
    </form>
  );
};

export default StripeCardInput;
