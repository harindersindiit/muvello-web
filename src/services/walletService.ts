import axiosInstance from "@/utils/axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface WalletBalance {
  balance: number;
  currency: string;
  pending_payouts: number; // Available for withdrawal
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  recent_earnings: number;
  formatted_balance: string; // Shows pending_payouts as available balance
}

interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  formatted_amount: string;
  type: "credit" | "debit";
  category: string;
  payment_method: string;
  status: string;
  date: string;
  time: string;
  formatted_date: string;
  transaction_id: string;
  related_user?: {
    id: string;
    name: string;
    profile_image?: string;
  };
  workout?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  metadata?: Record<string, unknown>;
}

interface WithdrawalAccount {
  id: string;
  bank_name: string;
  account_last4: string;
  account_type: "checking" | "savings";
  account_holder_name: string;
  is_default: boolean;
  stripe_integrated: boolean;
  formatted_account: string;
}

interface WalletStats {
  period_days: number;
  total_earned: number;
  total_spent: number;
  transaction_count: number;
  earnings_count: number;
  spending_count: number;
}

interface ServiceResponse<T = unknown> {
  success: boolean;
  message: string;
  body?: T;
  error?: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

class WalletService {
  // Get wallet balance and summary
  async getWalletBalance(): Promise<ServiceResponse<WalletBalance>> {
    try {
      const response = await axiosInstance.get("/wallet/balance");
      console.log(response);
      return {
        success: true,
        message: "Wallet balance retrieved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching wallet balance:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to fetch wallet balance",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Get transaction history with filtering
  async getTransactionHistory(
    filters: {
      type?: "all" | "credit" | "debit";
      category?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<
    ServiceResponse<{ transactions: Transaction[]; pagination: PaginationInfo }>
  > {
    try {
      const queryParams = new URLSearchParams();

      if (filters.type && filters.type !== "all") {
        queryParams.append("type", filters.type);
      }
      if (filters.category) {
        queryParams.append("category", filters.category);
      }
      if (filters.startDate) {
        queryParams.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append("endDate", filters.endDate);
      }
      if (filters.limit) {
        queryParams.append("limit", filters.limit.toString());
      }
      if (filters.offset) {
        queryParams.append("offset", filters.offset.toString());
      }

      const response = await axiosInstance.get(
        `/wallet/transactions?${queryParams.toString()}`
      );

      return {
        success: true,
        message: "Transaction history retrieved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching transaction history:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to fetch transaction history",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Check withdrawal eligibility and provide guidance
  async checkWithdrawalEligibility(): Promise<
    ServiceResponse<{
      eligibility: {
        canWithdraw: boolean;
        stripeSetupComplete: boolean;
        hasBankAccounts: boolean;
        hasStripeBankAccounts: boolean;
        pendingPayouts: number;
        requirements: string[];
        nextSteps: string[];
      };
    }>
  > {
    try {
      const response = await axiosInstance.get(
        "/wallet/withdrawal-eligibility"
      );
      return {
        success: true,
        message: "Withdrawal eligibility checked successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error checking withdrawal eligibility:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to check withdrawal eligibility",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Debug and refresh Stripe account status
  async debugStripeAccountStatus(): Promise<
    ServiceResponse<{
      coach_account: Record<string, unknown>;
      stripe_account: Record<string, unknown>;
      status_analysis: Record<string, unknown>;
    }>
  > {
    try {
      const response = await axiosInstance.get("/wallet/debug-stripe-status");
      return {
        success: true,
        message: "Stripe account status refreshed",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error debugging Stripe account status:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to debug Stripe account status",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Get withdrawal-eligible bank accounts
  async getWithdrawalAccounts(): Promise<
    ServiceResponse<{ accounts: WithdrawalAccount[] }>
  > {
    try {
      const response = await axiosInstance.get("/wallet/withdrawal-accounts");
      return {
        success: true,
        message: "Withdrawal accounts retrieved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching withdrawal accounts:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to fetch withdrawal accounts",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Initiate withdrawal
  async initiateWithdrawal(withdrawalData: {
    amount: number;
    bank_account_id: string;
    description?: string;
  }): Promise<
    ServiceResponse<{
      transaction_id: string;
      new_balance: number;
      processing_time: string;
    }>
  > {
    try {
      const response = await axiosInstance.post(
        "/wallet/withdraw",
        withdrawalData
      );

      return {
        success: true,
        message: response.data.message || "Withdrawal initiated successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error initiating withdrawal:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to initiate withdrawal",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Create transaction (for testing/admin)
  async createTransaction(transactionData: {
    related_user_id?: string;
    type: "credit" | "debit";
    category: string;
    amount: number;
    title: string;
    description?: string;
    payment_method?: string;
    workout_id?: string;
    metadata?: Record<string, unknown>;
  }): Promise<
    ServiceResponse<{ transaction_id: string; new_balance: number }>
  > {
    try {
      const response = await axiosInstance.post(
        "/wallet/transactions",
        transactionData
      );

      return {
        success: true,
        message: "Transaction created successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error creating transaction:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to create transaction",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Get wallet statistics
  async getWalletStats(
    period: number = 30
  ): Promise<ServiceResponse<WalletStats>> {
    try {
      const response = await axiosInstance.get(
        `/wallet/stats?period=${period}`
      );

      return {
        success: true,
        message: "Wallet statistics retrieved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching wallet stats:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to fetch wallet statistics",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Utility method to format amount
  static formatAmount(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  // Utility method to format date
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Utility method to format time
  static formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Get coach account status for Stripe setup check
  async getCoachAccountStatus(): Promise<
    ServiceResponse<{
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

  // Connect existing bank accounts to Stripe
  async connectBankAccountsToStripe(): Promise<ServiceResponse> {
    try {
      const response = await axiosInstance.post(
        "/wallet/connect-bank-accounts"
      );
      return {
        success: true,
        message:
          response.data.message || "Bank accounts connected successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error connecting bank accounts to Stripe:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to connect bank accounts to Stripe",
        error: (error as ApiError)?.message,
      };
    }
  }

  // Get workout purchase transactions
  async getWorkoutPurchaseTransactions(): Promise<
    ServiceResponse<{
      purchases: Array<{
        paymentId: string;
        workout: {
          id: string;
          title: string;
          thumbnail?: string;
        };
        coach: {
          id: string;
          name: string;
          email: string;
        };
        purchaseDate: string;
        amount: number;
        platformFee: number;
        coachEarning: number;
        status: string;
      }>;
      totalPurchases: number;
    }>
  > {
    try {
      const response = await axiosInstance.get("/payments/purchased-workouts");
      return {
        success: true,
        message: "Workout purchases retrieved successfully",
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching workout purchases:", error);
      return {
        success: false,
        message:
          (error as ApiError)?.response?.data?.message ||
          "Failed to fetch workout purchases",
        error: (error as ApiError)?.message,
      };
    }
  }
}

export default new WalletService();
export type {
  WalletBalance,
  Transaction,
  WithdrawalAccount,
  WalletStats,
  ServiceResponse,
  PaginationInfo,
};
