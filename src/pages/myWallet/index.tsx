import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import walletService, {
  WalletBalance,
  Transaction,
  WithdrawalAccount,
} from "@/services/walletService";

const UserWallet = () => {
  const navigate = useNavigate();

  // State management
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawalAccounts, setWithdrawalAccounts] = useState<
    WithdrawalAccount[]
  >([]);
  const [withdrawalEligibility, setWithdrawalEligibility] = useState({
    canWithdraw: false,
    stripeSetupComplete: false,
    hasBankAccounts: false,
    hasStripeBankAccounts: false,
    pendingPayouts: 0,
    requirements: [] as string[],
    nextSteps: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Modal states
  const [openDrawer, setOpenDrawer] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  // Filter states
  const [selectedFilters, setSelectedFilters] = useState({
    All: true,
    Credit: false,
    Debit: false,
    Custom: false,
  });

  // Withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    bank_account_id: "",
    description: "",
  });

  // Pagination state
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [transactionOffset, setTransactionOffset] = useState(0);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadWalletBalance(),
        loadTransactionHistory(),
        loadWithdrawalAccounts(),
        loadWithdrawalEligibility(),
      ]);
    } catch (error) {
      console.error("Error loading wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWalletBalance = async () => {
    try {
      const response = await walletService.getWalletBalance();
      if (response.success && response.body) {
        setWalletBalance(response.body);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error loading wallet balance:", error);
    }
  };

  const loadTransactionHistory = async (offset = 0, filters = {}) => {
    try {
      setTransactionsLoading(true);

      // Determine filter type
      let filterType = "all";
      if (selectedFilters.Credit && !selectedFilters.Debit) {
        filterType = "credit";
      } else if (selectedFilters.Debit && !selectedFilters.Credit) {
        filterType = "debit";
      }

      const response = await walletService.getTransactionHistory({
        type: filterType as "all" | "credit" | "debit",
        limit: 20,
        offset,
        ...filters,
      });

      if (response.success && response.body) {
        if (offset === 0) {
          setTransactions(response.body.transactions);
        } else {
          setTransactions((prev) => [...prev, ...response.body.transactions]);
        }
        setHasMoreTransactions(response.body.pagination.hasMore);
        setTransactionOffset(offset + response.body.transactions.length);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const loadWithdrawalEligibility = async () => {
    try {
      const response = await walletService.checkWithdrawalEligibility();
      if (response.success && response.body) {
        setWithdrawalEligibility(response.body.eligibility);
      }
    } catch (error) {
      console.error("Error loading withdrawal eligibility:", error);
    }
  };

  const loadWithdrawalAccounts = async () => {
    try {
      const response = await walletService.getWithdrawalAccounts();
      if (response.success && response.body) {
        setWithdrawalAccounts(response.body.accounts);
        // Set default account if available
        const defaultAccount = response.body.accounts.find(
          (acc) => acc.is_default
        );
        if (defaultAccount) {
          setWithdrawalForm((prev) => ({
            ...prev,
            bank_account_id: defaultAccount.id,
          }));
        }
      }
    } catch (error) {
      console.error("Error loading withdrawal accounts:", error);
    }
  };

  // Handle filter changes
  const toggleFilter = (filterName: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (filterName === "All") {
        // If All is selected, deselect other filters
        Object.keys(newFilters).forEach((key) => {
          newFilters[key as keyof typeof newFilters] = key === "All";
        });
      } else {
        // If any other filter is selected, deselect All
        newFilters.All = false;
        newFilters[filterName as keyof typeof newFilters] =
          !prev[filterName as keyof typeof prev];

        // If no specific filters are selected, select All
        if (!newFilters.Credit && !newFilters.Debit && !newFilters.Custom) {
          newFilters.All = true;
        }
      }

      return newFilters;
    });

    // Reload transactions with new filters
    setTimeout(() => loadTransactionHistory(0), 100);
  };

  // Show withdrawal guidance
  const showWithdrawalGuidance = () => {
    // If user is fully set up but has no funds, show different message
    if (
      withdrawalEligibility.stripeSetupComplete &&
      withdrawalEligibility.hasStripeBankAccounts
    ) {
      alert(
        "You have no pending payouts available for withdrawal. You need to earn money from workout sales before you can withdraw funds."
      );
      return;
    }

    let message = "To withdraw funds, you need to complete the following:\n\n";
    let needsStripeSetup = false;
    let needsBankAccount = false;

    if (!withdrawalEligibility.stripeSetupComplete) {
      message += "• Complete your Stripe Connect account setup\n";
      needsStripeSetup = true;
    }

    if (!withdrawalEligibility.hasBankAccounts) {
      message += "• Add a bank account\n";
      needsBankAccount = true;
    } else if (!withdrawalEligibility.hasStripeBankAccounts) {
      message += "• Connect your bank account through Stripe Connect\n";
      needsStripeSetup = true;
    }

    if (withdrawalEligibility.pendingPayouts <= 0) {
      message += "• Have pending payouts to withdraw\n";
    }

    message += "\nPlease complete these steps to enable withdrawals.";

    // Determine action based on what's needed
    if (needsStripeSetup) {
      if (
        confirm(message + "\n\nWould you like to set up Stripe Connect now?")
      ) {
        window.location.href = "/stripe-setup";
      }
    } else if (needsBankAccount) {
      if (confirm(message + "\n\nWould you like to add a bank account now?")) {
        window.location.href = "/saved-cards";
      }
    } else {
      alert(message);
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async () => {
    if (!withdrawalForm.amount || !withdrawalForm.bank_account_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(withdrawalForm.amount);
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (walletBalance && amount > (walletBalance.pending_payouts || 0)) {
      toast.error("Insufficient pending payouts for withdrawal");
      return;
    }

    try {
      setWithdrawing(true);
      const response = await walletService.initiateWithdrawal({
        amount,
        bank_account_id: withdrawalForm.bank_account_id,
        description: withdrawalForm.description,
      });

      if (response.success) {
        toast.success(response.message);
        setWithdrawalModalOpen(false);
        setWithdrawalForm({ amount: "", bank_account_id: "", description: "" });
        // Reload wallet data
        loadWalletBalance();
        loadTransactionHistory(0);
        loadWithdrawalEligibility();
      } else {
        // Handle specific error types
        if (response.error === "STRIPE_SETUP_REQUIRED") {
          toast.error(
            "Stripe setup required. Please complete your Stripe Connect account setup first."
          );
        } else if (response.error === "STRIPE_BANK_ACCOUNT_REQUIRED") {
          toast.error(
            "Bank account not connected to Stripe. Please add a bank account through Stripe Connect."
          );
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Failed to process withdrawal");
    } finally {
      setWithdrawing(false);
    }
  };

  // Load more transactions
  const loadMoreTransactions = () => {
    if (!transactionsLoading && hasMoreTransactions) {
      loadTransactionHistory(transactionOffset);
    }
  };

  if (loading) {
    return (
      <div className="text-white py-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading wallet data...</span>
      </div>
    );
  }

  return (
    <div className="text-white my-6 mb-0 pb-9 px-1">
      <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-[auto] gap-4">
        <div className="flex items-center gap-4 mb-3">
          <h2
            className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <img
              src={IMAGES.arrowLeft}
              alt="arrowLeft"
              className="w-6 h-6 cursor-pointer"
            />
            <span className="text-white">My Wallet</span>
          </h2>
        </div>
      </div>

      <div className="flex justify-between items-end bg-primary p-6 rounded-xl">
        <div>
          <p className="text-black text-sm">Available Balance</p>
          <p className="text-black text-xl font-bold">
            {walletBalance?.formatted_balance || "$0.00"}
          </p>
          {walletBalance && (walletBalance.pending_balance || 0) > 0 && (
            <p className="text-black text-xs mt-1">
              Pending: ${(walletBalance.pending_balance || 0).toFixed(2)}
            </p>
          )}
        </div>
        <Dialog
          open={withdrawalModalOpen}
          onOpenChange={setWithdrawalModalOpen}
        >
          <DialogTrigger asChild>
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold cursor-pointer min-w-[120px] ${
                withdrawalEligibility.canWithdraw
                  ? "bg-white text-black"
                  : withdrawalEligibility.stripeSetupComplete &&
                    withdrawalEligibility.hasStripeBankAccounts
                  ? "bg-gray-600 text-white opacity-60"
                  : "bg-gray-600 text-white"
              }`}
              disabled={
                !walletBalance || (walletBalance.pending_payouts || 0) <= 0
              }
              onClick={() => {
                if (withdrawalEligibility.canWithdraw) {
                  // Button will open modal via DialogTrigger
                } else if (
                  withdrawalEligibility.stripeSetupComplete &&
                  withdrawalEligibility.hasStripeBankAccounts
                ) {
                  // User is fully set up but has no funds
                  toast.error("No pending payouts available for withdrawal");
                } else {
                  showWithdrawalGuidance();
                }
              }}
            >
              {withdrawalEligibility.canWithdraw
                ? "Withdraw"
                : withdrawalEligibility.stripeSetupComplete &&
                  withdrawalEligibility.hasStripeBankAccounts
                ? "No Funds"
                : "Setup Required"}
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  max={walletBalance?.pending_payouts || 0}
                  value={withdrawalForm.amount}
                  onChange={(e) =>
                    setWithdrawalForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="Enter amount to withdraw"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {walletBalance && (
                  <p className="text-sm text-gray-400 mt-1">
                    Available for withdrawal: $
                    {(walletBalance.pending_payouts || 0).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bank Account
                </label>
                <Select
                  value={withdrawalForm.bank_account_id}
                  onValueChange={(value) =>
                    setWithdrawalForm((prev) => ({
                      ...prev,
                      bank_account_id: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {withdrawalAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{account.formatted_account}</span>
                          {account.is_default && (
                            <span className="text-xs bg-primary text-black px-2 py-1 rounded ml-2">
                              Default
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {withdrawalAccounts.length === 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    No bank accounts found. Please add a bank account first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <Input
                  value={withdrawalForm.description}
                  onChange={(e) =>
                    setWithdrawalForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Withdrawal purpose"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setWithdrawalModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={withdrawing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawal}
                  className="flex-1"
                  disabled={
                    withdrawing ||
                    !withdrawalForm.amount ||
                    !withdrawalForm.bank_account_id
                  }
                >
                  {withdrawing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Withdraw Now"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-screen bg-black text-white py-6 border-t-8 border-white/10 mt-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold mb-6">Transactions History</h2>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Icon
                  icon="rivet-icons:filter"
                  color="oklch(84.1% 0.238 128.85)"
                  className="w-6 h-6"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="bg-black w-45 p-2 border-lightdark rounded-[12px]"
                sideOffset={10}
              >
                <DropdownMenuItem className="text-white hover:text-primary mb-2">
                  <div
                    className="flex items-center gap-2 justify-between w-full cursor-pointer"
                    onClick={() => toggleFilter("All")}
                  >
                    All
                    <Checkbox
                      className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      checked={selectedFilters.All}
                      readOnly
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:text-primary mb-2">
                  <div
                    className="flex items-center gap-2 justify-between w-full cursor-pointer"
                    onClick={() => toggleFilter("Credit")}
                  >
                    Credit
                    <Checkbox
                      className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      checked={selectedFilters.Credit}
                      readOnly
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:text-primary mb-2">
                  <div
                    className="flex items-center gap-2 justify-between w-full cursor-pointer"
                    onClick={() => toggleFilter("Debit")}
                  >
                    Debit
                    <Checkbox
                      className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      checked={selectedFilters.Debit}
                      readOnly
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:text-primary mb-2">
                  <div
                    className="flex items-center gap-2 justify-between w-full cursor-pointer"
                    onClick={() => toggleFilter("Custom")}
                  >
                    Custom
                    <Checkbox
                      className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      checked={selectedFilters.Custom}
                      readOnly
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-6">
          {transactionsLoading && transactions.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No transactions found</p>
              <p className="text-sm mt-2">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <>
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 bg-white/10 rounded-xl"
                >
                  <div className="flex flex-col">
                    <p className="text-white text-base font-semibold mb-1">
                      {transaction.title}
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      Tran. ID: {transaction.transaction_id}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {transaction.formatted_date} • {transaction.time}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p
                      className={`text-base font-bold mb-1 ${
                        transaction.type === "credit"
                          ? "text-primary"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.formatted_amount}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {transaction.payment_method}
                    </p>
                    {transaction.status !== "completed" && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          transaction.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : transaction.status === "failed"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMoreTransactions && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={loadMoreTransactions}
                    disabled={transactionsLoading}
                    variant="outline"
                    className="min-w-[120px]"
                  >
                    {transactionsLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DrawerSidebar
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        title=""
        showHeader={false}
      >
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold mb-4">
            Wallet Statistics
          </h3>
          {walletBalance && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Earned:</span>
                <span className="text-primary">
                  ${(walletBalance.total_earned || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Withdrawn:</span>
                <span className="text-red-400">
                  ${(walletBalance.total_withdrawn || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recent Earnings:</span>
                <span className="text-green-400">
                  ${(walletBalance.recent_earnings || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </DrawerSidebar>
    </div>
  );
};

export default UserWallet;
