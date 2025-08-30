import axiosInstance from "@/utils/axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface BankAccount {
  _id: string;
  stripe_bank_account_id?: string;
  bank_name: string;
  account_number_last4: string;
  account_holder_name: string;
  account_type: "checking" | "savings";
  routing_number: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaymentServiceResponse<T = unknown> {
  success: boolean;
  message: string;
  body?: T;
  error?: string;
}

class PaymentService {
  // Payment Methods
  async getSavedPaymentMethods(): Promise<
    PaymentServiceResponse<PaymentMethod[]>
  > {
    try {
      const response = await axiosInstance.get("/payments/payment-methods");
      console.log("API Response:", response);
      return {
        success: true,
        message: "Payment methods retrieved successfully",
        body: response.data.body?.payment_methods || [],
      };
    } catch (error: unknown) {
      console.error("Error fetching saved cards:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to fetch saved cards",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Backward compatibility
  async getSavedCards(): Promise<PaymentServiceResponse<PaymentMethod[]>> {
    return this.getSavedPaymentMethods();
  }

  async deleteCard(paymentMethodId: string): Promise<PaymentServiceResponse> {
    try {
      const response = await axiosInstance.delete(
        `/payments/payment-methods/${paymentMethodId}`
      );
      return {
        success: true,
        message: response.data.message || "Card deleted successfully",
      };
    } catch (error: unknown) {
      console.error("Error deleting card:", error as ApiError);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to delete card",
        error: (error as ApiError)?.message,
      };
    }
  }

  async setDefaultCard(
    paymentMethodId: string
  ): Promise<PaymentServiceResponse> {
    try {
      const response = await axiosInstance.put(
        "/payments/payment-methods/default",
        { payment_method_id: paymentMethodId }
      );
      return {
        success: true,
        message: response.data.message || "Default card updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error setting default card:", error as ApiError);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to set default card",
        error: (error as ApiError)?.message,
      };
    }
  }

  async updatePaymentMethod(
    paymentMethodId: string,
    billingDetails: Record<string, unknown>
  ): Promise<PaymentServiceResponse> {
    try {
      const response = await axiosInstance.put(
        `/payments/payment-methods/${paymentMethodId}`,
        { billing_details: billingDetails }
      );
      return {
        success: true,
        message: response.data.message || "Payment method updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error updating payment method:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update payment method",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Bank Accounts
  async getSavedBankAccounts(): Promise<PaymentServiceResponse<BankAccount[]>> {
    try {
      const response = await axiosInstance.get("/payments/bank-accounts");
      console.log("Bank Accounts API Response:", response);
      return {
        success: true,
        message: "Bank accounts retrieved successfully",
        body: response.data.body?.bank_accounts || [],
      };
    } catch (error: unknown) {
      console.error("Error fetching bank accounts:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch bank accounts",
        error: (error as ApiError)?.message,
      };
    }
  }

  async saveBankAccount(accountDetails: {
    bank_name: string;
    account_number: string;
    routing_number: string;
    account_holder_name: string;
    account_type: "checking" | "savings";
  }): Promise<PaymentServiceResponse<BankAccount>> {
    try {
      const response = await axiosInstance.post(
        "/payments/bank-accounts",
        accountDetails
      );
      return {
        success: true,
        message: response.data.message || "Bank account saved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error saving bank account:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to save bank account",
        error: (error as ApiError)?.message,
      };
    }
  }

  async updateBankAccount(
    accountId: string,
    accountDetails: Partial<{
      bank_name: string;
      account_holder_name: string;
      account_type: "checking" | "savings";
    }>
  ): Promise<PaymentServiceResponse<BankAccount>> {
    try {
      const response = await axiosInstance.put(
        `/payments/bank-accounts/${accountId}`,
        accountDetails
      );
      return {
        success: true,
        message: response.data.message || "Bank account updated successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error updating bank account:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update bank account",
        error: (error as ApiError)?.message,
      };
    }
  }

  async deleteBankAccount(accountId: string): Promise<PaymentServiceResponse> {
    try {
      const response = await axiosInstance.delete(
        `/payments/bank-accounts/${accountId}`
      );
      return {
        success: true,
        message: response.data.message || "Bank account deleted successfully",
      };
    } catch (error: unknown) {
      console.error("Error deleting bank account:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to delete bank account",
        error: (error as ApiError)?.message,
      };
    }
  }

  async setDefaultBankAccount(
    accountId: string
  ): Promise<PaymentServiceResponse> {
    try {
      const response = await axiosInstance.put(
        `/payments/bank-accounts/${accountId}/default`,
        {}
      );
      return {
        success: true,
        message:
          response.data.message || "Default bank account updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error setting default bank account:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to set default bank account",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Setup Intent Creation for adding new cards
  async createSetupIntent(): Promise<
    PaymentServiceResponse<{ client_secret: string }>
  > {
    try {
      const response = await axiosInstance.post("/payments/setup-intent", {});
      return {
        success: true,
        message: "Setup intent created successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error creating setup intent:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create setup intent",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Save payment method after successful setup intent
  async savePaymentMethod(
    setupIntent: Record<string, unknown>
  ): Promise<PaymentServiceResponse> {
    try {
      const response = await axiosInstance.post("/payments/payment-methods", {
        setupIntent,
      });
      return {
        success: true,
        message: response.data.message || "Payment method saved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error saving payment method:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to save payment method",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Get coach account status for Stripe setup check
  async getCoachAccountStatus(): Promise<
    PaymentServiceResponse<{
      account: {
        account_status: string;
        verification_status: string;
      };
    }>
  > {
    try {
      const response = await axiosInstance.get(
        "/payments/coach/account-status"
      );
      return {
        success: true,
        message:
          response.data.message ||
          "Coach account status retrieved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error getting coach account status:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to get coach account status",
        error: (error as ApiError)?.message,
      };
    }
  }
}

export default new PaymentService();
export type { PaymentMethod, BankAccount, PaymentServiceResponse };
