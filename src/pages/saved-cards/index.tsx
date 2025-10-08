import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
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
import paymentService, {
  PaymentMethod,
  BankAccount,
} from "@/services/paymentService";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import SavedCardsSkeleton from "@/components/skeletons/SavedCardsSkeleton";
import StripeProviderWrapper from "@/components/payment/StripeProvider";
import StripeCardInput from "@/components/payment/StripeCardInput";
import { CustomModal } from "@/components/customcomponents/CustomModal";

// Country list for dropdown
const countries = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Australia", value: "AU" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "Italy", value: "IT" },
  { label: "Spain", value: "ES" },
  { label: "Netherlands", value: "NL" },
  { label: "Sweden", value: "SE" },
  { label: "Norway", value: "NO" },
  { label: "Denmark", value: "DK" },
  { label: "Finland", value: "FI" },
  { label: "Switzerland", value: "CH" },
  { label: "Austria", value: "AT" },
  { label: "Belgium", value: "BE" },
  { label: "Ireland", value: "IE" },
  { label: "Portugal", value: "PT" },
  { label: "Greece", value: "GR" },
  { label: "Poland", value: "PL" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Hungary", value: "HU" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Croatia", value: "HR" },
  { label: "Romania", value: "RO" },
  { label: "Bulgaria", value: "BG" },
  { label: "Estonia", value: "EE" },
  { label: "Latvia", value: "LV" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Malta", value: "MT" },
  { label: "Cyprus", value: "CY" },
  { label: "Japan", value: "JP" },
  { label: "South Korea", value: "KR" },
  { label: "China", value: "CN" },
  { label: "India", value: "IN" },
  { label: "Singapore", value: "SG" },
  { label: "Hong Kong", value: "HK" },
  { label: "Taiwan", value: "TW" },
  { label: "Thailand", value: "TH" },
  { label: "Malaysia", value: "MY" },
  { label: "Indonesia", value: "ID" },
  { label: "Philippines", value: "PH" },
  { label: "Vietnam", value: "VN" },
  { label: "New Zealand", value: "NZ" },
  { label: "South Africa", value: "ZA" },
  { label: "Brazil", value: "BR" },
  { label: "Argentina", value: "AR" },
  { label: "Chile", value: "CL" },
  { label: "Mexico", value: "MX" },
  { label: "Colombia", value: "CO" },
  { label: "Peru", value: "PE" },
  { label: "Uruguay", value: "UY" },
  { label: "Ecuador", value: "EC" },
  { label: "Venezuela", value: "VE" },
  { label: "Bolivia", value: "BO" },
  { label: "Paraguay", value: "PY" },
  { label: "Guyana", value: "GY" },
  { label: "Suriname", value: "SR" },
  { label: "Israel", value: "IL" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Qatar", value: "QA" },
  { label: "Kuwait", value: "KW" },
  { label: "Bahrain", value: "BH" },
  { label: "Oman", value: "OM" },
  { label: "Jordan", value: "JO" },
  { label: "Lebanon", value: "LB" },
  { label: "Turkey", value: "TR" },
  { label: "Russia", value: "RU" },
  { label: "Ukraine", value: "UA" },
  { label: "Belarus", value: "BY" },
  { label: "Moldova", value: "MD" },
  { label: "Georgia", value: "GE" },
  { label: "Armenia", value: "AM" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Afghanistan", value: "AF" },
  { label: "Pakistan", value: "PK" },
  { label: "Bangladesh", value: "BD" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Nepal", value: "NP" },
  { label: "Bhutan", value: "BT" },
  { label: "Myanmar", value: "MM" },
  { label: "Cambodia", value: "KH" },
  { label: "Laos", value: "LA" },
  { label: "Mongolia", value: "MN" },
  { label: "North Korea", value: "KP" },
  { label: "Iceland", value: "IS" },
  { label: "Greenland", value: "GL" },
  { label: "Faroe Islands", value: "FO" },
  { label: "Albania", value: "AL" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Serbia", value: "RS" },
  { label: "Montenegro", value: "ME" },
  { label: "North Macedonia", value: "MK" },
  { label: "Kosovo", value: "XK" },
  { label: "Andorra", value: "AD" },
  { label: "Monaco", value: "MC" },
  { label: "San Marino", value: "SM" },
  { label: "Vatican City", value: "VA" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Gibraltar", value: "GI" },
  { label: "Jersey", value: "JE" },
  { label: "Guernsey", value: "GG" },
  { label: "Isle of Man", value: "IM" },
  { label: "Falkland Islands", value: "FK" },
  { label: "Bermuda", value: "BM" },
  { label: "Cayman Islands", value: "KY" },
  { label: "British Virgin Islands", value: "VG" },
  { label: "Anguilla", value: "AI" },
  { label: "Montserrat", value: "MS" },
  { label: "Turks and Caicos Islands", value: "TC" },
  { label: "Bahamas", value: "BS" },
  { label: "Barbados", value: "BB" },
  { label: "Trinidad and Tobago", value: "TT" },
  { label: "Jamaica", value: "JM" },
  { label: "Dominican Republic", value: "DO" },
  { label: "Haiti", value: "HT" },
  { label: "Cuba", value: "CU" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Virgin Islands", value: "VI" },
  { label: "Antigua and Barbuda", value: "AG" },
  { label: "Saint Kitts and Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Vincent and the Grenadines", value: "VC" },
  { label: "Grenada", value: "GD" },
  { label: "Dominica", value: "DM" },
  { label: "Belize", value: "BZ" },
  { label: "Costa Rica", value: "CR" },
  { label: "Panama", value: "PA" },
  { label: "Nicaragua", value: "NI" },
  { label: "Honduras", value: "HN" },
  { label: "El Salvador", value: "SV" },
  { label: "Guatemala", value: "GT" },
  { label: "Morocco", value: "MA" },
  { label: "Algeria", value: "DZ" },
  { label: "Tunisia", value: "TN" },
  { label: "Libya", value: "LY" },
  { label: "Egypt", value: "EG" },
  { label: "Sudan", value: "SD" },
  { label: "South Sudan", value: "SS" },
  { label: "Ethiopia", value: "ET" },
  { label: "Eritrea", value: "ER" },
  { label: "Djibouti", value: "DJ" },
  { label: "Somalia", value: "SO" },
  { label: "Kenya", value: "KE" },
  { label: "Uganda", value: "UG" },
  { label: "Tanzania", value: "TZ" },
  { label: "Rwanda", value: "RW" },
  { label: "Burundi", value: "BI" },
  { label: "Democratic Republic of the Congo", value: "CD" },
  { label: "Republic of the Congo", value: "CG" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Cameroon", value: "CM" },
  { label: "Nigeria", value: "NG" },
  { label: "Niger", value: "NE" },
  { label: "Mali", value: "ML" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Ghana", value: "GH" },
  { label: "Togo", value: "TG" },
  { label: "Benin", value: "BJ" },
  { label: "Ivory Coast", value: "CI" },
  { label: "Liberia", value: "LR" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Senegal", value: "SN" },
  { label: "Gambia", value: "GM" },
  { label: "Mauritania", value: "MR" },
  { label: "Cape Verde", value: "CV" },
  { label: "São Tomé and Príncipe", value: "ST" },
  { label: "Equatorial Guinea", value: "GQ" },
  { label: "Gabon", value: "GA" },
  { label: "Angola", value: "AO" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" },
  { label: "Botswana", value: "BW" },
  { label: "Namibia", value: "NA" },
  { label: "Lesotho", value: "LS" },
  { label: "Swaziland", value: "SZ" },
  { label: "Madagascar", value: "MG" },
  { label: "Mauritius", value: "MU" },
  { label: "Seychelles", value: "SC" },
  { label: "Comoros", value: "KM" },
  { label: "Malawi", value: "MW" },
  { label: "Mozambique", value: "MZ" },
];

const SavedCards = () => {
  const navigate = useNavigate();

  // State management
  const [savedCards, setSavedCards] = useState<PaymentMethod[]>([]);
  const [savedAccounts, setSavedAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [stripeSetupStatus, setStripeSetupStatus] = useState({
    isActive: false,
    isLoading: true,
  });

  // Modal states
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);
  const [editAccountModalOpen, setEditAccountModalOpen] = useState(false);
  const [deleteCardModalOpen, setDeleteCardModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  // Form states
  const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [bankAccountForm, setBankAccountForm] = useState({
    bank_name: "",
    account_number: "",
    routing_number: "",
    account_holder_name: "",
    account_type: "checking" as "checking" | "savings",
  });
  const [editCardForm, setEditCardForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  const [editFormErrors, setEditFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
  });

  // Validation helper functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return "";
    }
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    return phoneRegex.test(cleanPhone)
      ? ""
      : "Please enter a valid phone number";
  };

  const validatePostalCode = (postalCode: string): string => {
    if (!postalCode.trim()) {
      return "";
    }
    const postalRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    return postalRegex.test(postalCode)
      ? ""
      : "Please enter a valid postal code (12345 or 12345-6789)";
  };

  const validateRequired = (value: string, fieldName: string): string => {
    return value.trim() ? "" : `${fieldName} is required`;
  };

  const validateEditForm = (): boolean => {
    const errors = {
      name: validateRequired(editCardForm.name, "Cardholder name"),
      email: validateEmail(editCardForm.email),
      phone: validatePhone(editCardForm.phone),
      address: {
        line1: validateRequired(editCardForm.address.line1, "Address line 1"),
        line2: "",
        city: validateRequired(editCardForm.address.city, "City"),
        state: validateRequired(editCardForm.address.state, "State"),
        postal_code: validatePostalCode(editCardForm.address.postal_code),
        country: validateRequired(editCardForm.address.country, "Country"),
      },
    };

    setEditFormErrors(errors);

    // Check if there are any errors
    const hasErrors =
      errors.name ||
      errors.email ||
      errors.phone ||
      errors.address.line1 ||
      errors.address.city ||
      errors.address.state ||
      errors.address.postal_code ||
      errors.address.country;

    return !hasErrors;
  };

  const updateEditForm = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "address") {
        setEditCardForm((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
        // Clear validation error for this field
        setEditFormErrors((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: "",
          },
        }));
      }
    } else {
      setEditCardForm((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear validation error for this field
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Check Stripe setup status
  const checkStripeSetupStatus = useCallback(async () => {
    try {
      const response = await paymentService.getCoachAccountStatus();
      if (response.success) {
        setStripeSetupStatus({
          isActive: response.body.account?.account_status === "active",
          isLoading: false,
        });
      } else {
        setStripeSetupStatus({
          isActive: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error checking Stripe setup status:", error);
      setStripeSetupStatus({
        isActive: false,
        isLoading: false,
      });
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSavedCards(),
        loadSavedAccounts(),
        checkStripeSetupStatus(),
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  }, [checkStripeSetupStatus]);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadSavedCards = async () => {
    try {
      setCardsLoading(true);
      const response = await paymentService.getSavedCards();
      if (response.success) {
        setSavedCards(response.body || []);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error loading saved cards:", error);
      toast.error("Failed to load saved cards");
    } finally {
      setCardsLoading(false);
    }
  };

  const loadSavedAccounts = async () => {
    try {
      setAccountsLoading(true);
      const response = await paymentService.getSavedBankAccounts();
      if (response.success) {
        setSavedAccounts(response.body || []);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error loading bank accounts:", error);
      toast.error("Failed to load bank accounts");
    } finally {
      setAccountsLoading(false);
    }
  };

  // Card operations
  const handleCardDeleteClick = (cardId: string) => {
    setCardToDelete(cardId);
    setDeleteCardModalOpen(true);
  };

  const handleCardDelete = async () => {
    if (!cardToDelete) return;

    try {
      const response = await paymentService.deleteCard(cardToDelete);
      if (response.success) {
        toast.success("Card deleted successfully");
        loadSavedCards();
        setDeleteCardModalOpen(false);
        setCardToDelete(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    try {
      const response = await paymentService.setDefaultCard(cardId);
      if (response.success) {
        toast.success("Default card updated successfully");
        loadSavedCards();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error setting default card:", error);
      toast.error("Failed to set default card");
    }
  };

  const handleCardEdit = (card: PaymentMethod) => {
    setSelectedCard(card);

    // Convert country name to country code if needed
    const existingCountry = card.billing_details?.address?.country || "";
    const countryCode =
      countries.find(
        (country) =>
          country.label === existingCountry || country.value === existingCountry
      )?.value ||
      existingCountry ||
      "US";

    setEditCardForm({
      name: card.billing_details?.name || "",
      email: card.billing_details?.email || "",
      phone: card.billing_details?.phone || "",
      address: {
        line1: card.billing_details?.address?.line1 || "",
        line2: card.billing_details?.address?.line2 || "",
        city: card.billing_details?.address?.city || "",
        state: card.billing_details?.address?.state || "",
        postal_code: card.billing_details?.address?.postal_code || "",
        country: countryCode,
      },
    });
    setEditCardModalOpen(true);
  };

  const handleUpdateCard = async () => {
    if (!selectedCard) return;

    // Validate form before proceeding
    if (!validateEditForm()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      const response = await paymentService.updatePaymentMethod(
        selectedCard.id,
        editCardForm
      );
      if (response.success) {
        toast.success("Card updated successfully");
        setEditCardModalOpen(false);
        setSelectedCard(null);
        // Clear form and errors
        setEditCardForm({
          name: "",
          email: "",
          phone: "",
          address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "US",
          },
        });
        setEditFormErrors({
          name: "",
          email: "",
          phone: "",
          address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
          },
        });
        loadSavedCards();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card");
    }
  };

  // Bank account operations
  const handleBankAccountDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteAccountModalOpen(true);
  };

  const handleBankAccountDelete = async () => {
    if (!accountToDelete) return;

    try {
      const response = await paymentService.deleteBankAccount(accountToDelete);
      if (response.success) {
        toast.success("Bank account deleted successfully");
        loadSavedAccounts();
        setDeleteAccountModalOpen(false);
        setAccountToDelete(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      toast.error("Failed to delete bank account");
    }
  };

  const handleSetDefaultBankAccount = async (accountId: string) => {
    try {
      const response = await paymentService.setDefaultBankAccount(accountId);
      if (response.success) {
        toast.success("Default bank account updated successfully");
        loadSavedAccounts();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error setting default bank account:", error);
      toast.error("Failed to set default bank account");
    }
  };

  const handleBankAccountEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setBankAccountForm({
      bank_name: account.bank_name,
      account_number: "", // Don't pre-fill for security
      routing_number: account.routing_number,
      account_holder_name: account.account_holder_name,
      account_type: account.account_type,
    });
    setEditAccountModalOpen(true);
  };

  const handleSaveBankAccount = async () => {
    // Validate required fields
    if (
      !bankAccountForm.bank_name.trim() ||
      !bankAccountForm.account_number.trim() ||
      !bankAccountForm.routing_number.trim() ||
      !bankAccountForm.account_holder_name.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check for duplicate bank account
    const isDuplicate = savedAccounts.some(
      (account) =>
        account.routing_number === bankAccountForm.routing_number.trim() &&
        account.account_number_last4 ===
          bankAccountForm.account_number.slice(-4)
    );

    if (isDuplicate) {
      toast.error("This bank account is already added to your account");
      return;
    }

    try {
      const response = await paymentService.saveBankAccount(bankAccountForm);
      if (response.success) {
        toast.success("Bank account saved successfully");
        setAddAccountModalOpen(false);
        setBankAccountForm({
          bank_name: "",
          account_number: "",
          routing_number: "",
          account_holder_name: "",
          account_type: "checking",
        });
        loadSavedAccounts();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      toast.error("Failed to save bank account");
    }
  };

  const handleUpdateBankAccount = async () => {
    if (!selectedAccount) return;

    try {
      const response = await paymentService.updateBankAccount(
        selectedAccount._id,
        {
          bank_name: bankAccountForm.bank_name,
          account_holder_name: bankAccountForm.account_holder_name,
          account_type: bankAccountForm.account_type,
        }
      );
      if (response.success) {
        toast.success("Bank account updated successfully");
        setEditAccountModalOpen(false);
        loadSavedAccounts();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating bank account:", error);
      toast.error("Failed to update bank account");
    }
  };

  // Utility functions
  const getCardBrand = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "VISA";
      case "mastercard":
        return "MASTERCARD";
      case "amex":
        return "AMEX";
      case "discover":
        return "DISCOVER";
      default:
        return brand?.toUpperCase() || "CARD";
    }
  };

  const getCardBackgroundColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "from-blue-600 to-blue-800";
      case "mastercard":
        return "from-red-600 to-red-800";
      case "amex":
        return "from-green-600 to-green-800";
      case "discover":
        return "from-orange-600 to-orange-800";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  if (loading) {
    return <SavedCardsSkeleton />;
  }

  return (
    <div className="text-white py-6">
      <h2
        className="md:text-2xl text-md mb-7 font-semibold flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img
          src={IMAGES.arrowLeft}
          alt="arrowLeft"
          className="w-6 h-6 cursor-pointer"
        />
        <span className="text-white">Saved Cards & Accounts</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Credit/Debit Card Section */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 row-span-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold">Credit/Debit card</h3>
            <Dialog open={addCardModalOpen} onOpenChange={setAddCardModalOpen}>
              <DialogTrigger asChild>
                <button className="text-primary hover:text-white transition-all duration-300 text-sm font-semibold flex items-center gap-2">
                  <Icon
                    icon="f7:plus-app"
                    style={{ width: "21px", height: "21px" }}
                  />
                  Add New Card
                </button>
              </DialogTrigger>
              <DialogContent className="bg-black border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <StripeProviderWrapper>
                  <StripeCardInput
                    onSuccess={() => {
                      setAddCardModalOpen(false);
                      loadSavedCards();
                    }}
                    onCancel={() => setAddCardModalOpen(false)}
                    loading={cardsLoading}
                    setLoading={setCardsLoading}
                  />
                </StripeProviderWrapper>
              </DialogContent>
            </Dialog>
          </div>

          {cardsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading cards...</span>
            </div>
          ) : savedCards.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No saved cards found</p>
              <p className="text-sm mt-2">Add your first card to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1 gap-4">
              {savedCards.map((card, index) => (
                <div key={card.id} className="w-full">
                  <div
                    className={`rounded-2xl mb-3 overflow-hidden shadow-lg text-white border border-white/30 bg-gradient-to-br ${getCardBackgroundColor(
                      card.card?.brand || ""
                    )}`}
                  >
                    <div className="p-4 pb-0">
                      {/* Chip + Contactless */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-10 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
                          <div className="w-6 h-5 bg-yellow-600 rounded-sm"></div>
                        </div>
                        <Icon icon="ph:wifi" className="w-7 h-7" />
                      </div>

                      {/* Card Number */}
                      <div className="text-2xl sm:text-2xl font-semibold tracking-widest mb-8">
                        •••• •••• •••• {card.card?.last4 || "****"}
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/20 backdrop-blur-sm bg-black/30">
                      {/* Card Info */}
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-gray-300 mb-1">Card Holder Name</p>
                          <p className="font-semibold text-white">
                            {card.billing_details?.name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-300 mb-1">Expiry date</p>
                          <p className="font-semibold text-white">
                            {card.card?.exp_month?.toString().padStart(2, "0")}/
                            {card.card?.exp_year?.toString().slice(-2) ||
                              "**/**"}
                          </p>
                        </div>
                        <div className="text-lg font-bold">
                          {getCardBrand(card.card?.brand || "")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`card-${index}`}
                        checked={card.is_default}
                        disabled={card.is_default}
                        onCheckedChange={() => {
                          if (!card.is_default) {
                            handleSetDefaultCard(card.id);
                          }
                        }}
                        className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      />
                      <label
                        htmlFor={`card-${index}`}
                        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {card.is_default ? "Default Card" : "Make Default"}
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Icon
                        icon="ph:pencil"
                        className="w-5 h-5 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleCardEdit(card)}
                      />
                      <Icon
                        icon="ph:trash"
                        className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleCardDeleteClick(card.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Bank Accounts */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 lg:col-start-4 pl-0 lg:pl-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold">Bank Accounts</h3>
            <Dialog
              open={addAccountModalOpen}
              onOpenChange={setAddAccountModalOpen}
            >
              <DialogTrigger asChild>
                <button
                  className={`transition-all duration-300 text-sm font-semibold flex items-center gap-2 ${
                    stripeSetupStatus.isActive
                      ? "text-primary hover:text-white"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!stripeSetupStatus.isActive) {
                      e.preventDefault();
                      alert(
                        "You need to complete your Stripe Connect account setup before you can add bank accounts. Bank accounts must be connected to Stripe for withdrawals.\n\nPlease complete your Stripe Connect setup on the mobile app to enable this feature."
                      );
                    }
                  }}
                >
                  <Icon
                    icon="f7:plus-app"
                    style={{ width: "21px", height: "21px" }}
                  />
                  Add New Account
                </button>
              </DialogTrigger>
              <DialogContent className="bg-black border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Bank Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bank Name
                    </label>
                    <Input
                      value={bankAccountForm.bank_name}
                      onChange={(e) =>
                        setBankAccountForm((prev) => ({
                          ...prev,
                          bank_name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Chase Bank"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account Holder Name
                    </label>
                    <Input
                      value={bankAccountForm.account_holder_name}
                      onChange={(e) =>
                        setBankAccountForm((prev) => ({
                          ...prev,
                          account_holder_name: e.target.value,
                        }))
                      }
                      placeholder="Full name on account"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account Number
                    </label>
                    <Input
                      value={bankAccountForm.account_number}
                      onChange={(e) =>
                        setBankAccountForm((prev) => ({
                          ...prev,
                          account_number: e.target.value,
                        }))
                      }
                      placeholder="Account number"
                      type="password"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Routing Number
                    </label>
                    <Input
                      value={bankAccountForm.routing_number}
                      onChange={(e) =>
                        setBankAccountForm((prev) => ({
                          ...prev,
                          routing_number: e.target.value,
                        }))
                      }
                      placeholder="9-digit routing number"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account Type
                    </label>
                    <Select
                      value={bankAccountForm.account_type}
                      onValueChange={(value: "checking" | "savings") =>
                        setBankAccountForm((prev) => ({
                          ...prev,
                          account_type: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setAddAccountModalOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveBankAccount} className="flex-1">
                      Save Account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stripe setup warning */}
          {!stripeSetupStatus.isLoading && !stripeSetupStatus.isActive && (
            <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                ⚠️ Complete Stripe setup to add bank accounts
              </p>
            </div>
          )}

          {/* Bank accounts summary */}
          {savedAccounts.length > 0 && stripeSetupStatus.isActive && (
            <div className="mt-3 p-3 bg-white/10 border border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white text-sm font-semibold">
                  Bank Accounts Status
                </h4>
                <span className="text-white text-sm font-medium">
                  {
                    savedAccounts.filter((acc) => acc.stripe_bank_account_id)
                      .length
                  }
                  /{savedAccounts.length} Connected
                </span>
              </div>
              <p
                className={`text-xs font-medium ${
                  savedAccounts.every((acc) => acc.stripe_bank_account_id)
                    ? "text-green-400"
                    : "text-orange-400"
                }`}
              >
                {savedAccounts.every((acc) => acc.stripe_bank_account_id)
                  ? "✅ All bank accounts are connected to Stripe and ready for withdrawals"
                  : "⚠️ Some bank accounts are pending Stripe connection. They will be connected automatically once your Stripe verification is complete."}
              </p>
            </div>
          )}

          {accountsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading accounts...</span>
            </div>
          ) : savedAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No bank accounts found</p>
              <p className="text-sm mt-2">
                Add your first account to get started
              </p>
            </div>
          ) : (
            savedAccounts.map((account) => (
              <div
                key={account._id}
                className="p-4 flex items-start justify-between bg-white/10 rounded-xl mt-5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <Icon icon="ph:bank" className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white text-sm font-semibold mb-2">
                      {account.bank_name}
                      {account.is_default && (
                        <span className="text-black text-xs bg-primary px-2 py-1 rounded-full inline-block ml-2">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {account.account_type} •••• {account.account_number_last4}
                    </p>

                    {/* Stripe connection status */}
                    {stripeSetupStatus.isActive && (
                      <div className="flex items-center gap-2 mt-2">
                        {account.stripe_bank_account_id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-400 text-xs font-medium">
                              Connected to Stripe
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-orange-400 text-xs font-medium">
                              Pending Stripe connection
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!account.is_default && (
                    <Icon
                      icon="ph:star"
                      className="w-5 h-5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSetDefaultBankAccount(account._id)}
                    />
                  )}
                  <Icon
                    icon="ph:pencil"
                    className="w-5 h-5 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleBankAccountEdit(account)}
                  />
                  <Icon
                    icon="ph:trash"
                    className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => handleBankAccountDeleteClick(account._id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Card Modal */}
      <Dialog open={editCardModalOpen} onOpenChange={setEditCardModalOpen}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Card Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCard && (
              <div className="text-center mb-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300">
                  {selectedCard.card?.brand?.toUpperCase()} ••••{" "}
                  {selectedCard.card?.last4}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Cardholder Name *
              </label>
              <Input
                value={editCardForm.name}
                onChange={(e) => updateEditForm("name", e.target.value)}
                placeholder="Name on card"
                className={`bg-gray-800 border-gray-700 text-white ${
                  editFormErrors.name ? "border-red-500" : ""
                }`}
              />
              {editFormErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {editFormErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={editCardForm.email}
                onChange={(e) => updateEditForm("email", e.target.value)}
                placeholder="Email address"
                type="email"
                className={`bg-gray-800 border-gray-700 text-white ${
                  editFormErrors.email ? "border-red-500" : ""
                }`}
              />
              {editFormErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {editFormErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={editCardForm.phone}
                onChange={(e) => updateEditForm("phone", e.target.value)}
                placeholder="Phone number"
                className={`bg-gray-800 border-gray-700 text-white ${
                  editFormErrors.phone ? "border-red-500" : ""
                }`}
              />
              {editFormErrors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {editFormErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                value={editCardForm.address.line1}
                onChange={(e) =>
                  updateEditForm("address.line1", e.target.value)
                }
                placeholder="Address Line 1 *"
                className={`bg-gray-800 border-gray-700 text-white mb-2 ${
                  editFormErrors.address.line1 ? "border-red-500" : ""
                }`}
              />
              {editFormErrors.address.line1 && (
                <p className="text-red-500 text-xs mt-1 mb-2">
                  {editFormErrors.address.line1}
                </p>
              )}

              <Input
                value={editCardForm.address.line2}
                onChange={(e) =>
                  updateEditForm("address.line2", e.target.value)
                }
                placeholder="Address Line 2 (Optional)"
                className="bg-gray-800 border-gray-700 text-white mb-2"
              />

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <Input
                    value={editCardForm.address.city}
                    onChange={(e) =>
                      updateEditForm("address.city", e.target.value)
                    }
                    placeholder="City *"
                    className={`bg-gray-800 border-gray-700 text-white ${
                      editFormErrors.address.city ? "border-red-500" : ""
                    }`}
                  />
                  {editFormErrors.address.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {editFormErrors.address.city}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    value={editCardForm.address.state}
                    onChange={(e) =>
                      updateEditForm("address.state", e.target.value)
                    }
                    placeholder="State *"
                    className={`bg-gray-800 border-gray-700 text-white ${
                      editFormErrors.address.state ? "border-red-500" : ""
                    }`}
                  />
                  {editFormErrors.address.state && (
                    <p className="text-red-500 text-xs mt-1">
                      {editFormErrors.address.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    value={editCardForm.address.postal_code}
                    onChange={(e) =>
                      updateEditForm("address.postal_code", e.target.value)
                    }
                    placeholder="ZIP Code"
                    className={`bg-gray-800 border-gray-700 text-white ${
                      editFormErrors.address.postal_code ? "border-red-500" : ""
                    }`}
                  />
                  {editFormErrors.address.postal_code && (
                    <p className="text-red-500 text-xs mt-1">
                      {editFormErrors.address.postal_code}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    value={editCardForm.address.country}
                    onValueChange={(value) =>
                      updateEditForm("address.country", value)
                    }
                  >
                    <SelectTrigger
                      className={`bg-gray-800 border-gray-700 text-white ${
                        editFormErrors.address.country ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Country *" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                      {countries.map((country) => (
                        <SelectItem
                          key={country.value}
                          value={country.value}
                          className="text-white"
                        >
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editFormErrors.address.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {editFormErrors.address.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  setEditCardModalOpen(false);
                  // Clear validation errors when closing modal
                  setEditFormErrors({
                    name: "",
                    email: "",
                    phone: "",
                    address: {
                      line1: "",
                      line2: "",
                      city: "",
                      state: "",
                      postal_code: "",
                      country: "",
                    },
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCard} className="flex-1">
                Update Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Bank Account Modal */}
      <Dialog
        open={editAccountModalOpen}
        onOpenChange={setEditAccountModalOpen}
      >
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Bank Name
              </label>
              <Input
                value={bankAccountForm.bank_name}
                onChange={(e) =>
                  setBankAccountForm((prev) => ({
                    ...prev,
                    bank_name: e.target.value,
                  }))
                }
                placeholder="Bank name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Holder Name
              </label>
              <Input
                value={bankAccountForm.account_holder_name}
                onChange={(e) =>
                  setBankAccountForm((prev) => ({
                    ...prev,
                    account_holder_name: e.target.value,
                  }))
                }
                placeholder="Account holder name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Type
              </label>
              <Select
                value={bankAccountForm.account_type}
                onValueChange={(value: "checking" | "savings") =>
                  setBankAccountForm((prev) => ({
                    ...prev,
                    account_type: value,
                  }))
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-400">
              Note: For security reasons, account and routing numbers cannot be
              changed. Please delete and add a new account if needed.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setEditAccountModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateBankAccount} className="flex-1">
                Update Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Card Modal */}
      <CustomModal
        title="Delete Card"
        open={deleteCardModalOpen}
        setOpen={setDeleteCardModalOpen}
        onCancel={() => {
          setDeleteCardModalOpen(false);
          setCardToDelete(null);
        }}
        onSubmit={handleCardDelete}
        submitText="Delete Card"
        cancelText="Cancel"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Card?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete this card? This action cannot be
              undone.
            </p>
          </div>
        }
      />

      {/* Delete Bank Account Modal */}
      <CustomModal
        title="Delete Bank Account"
        open={deleteAccountModalOpen}
        setOpen={setDeleteAccountModalOpen}
        onCancel={() => {
          setDeleteAccountModalOpen(false);
          setAccountToDelete(null);
        }}
        onSubmit={handleBankAccountDelete}
        submitText="Delete Account"
        cancelText="Cancel"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Bank Account?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete this bank account? This action
              cannot be undone.
            </p>
          </div>
        }
      />
      {/* 
<CustomModal
        title=""
        submitText={deleteLoader ? "Deleting..." : "Yes I’m Sure"}
        open={deleteExercise}
        setOpen={setDeleteExercise}
        onCancel={() => !deleteLoader && setDeleteExercise(false)}
        onSubmit={() => !deleteLoader && handleDeleteExercise()}
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Delete Workout?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white">{editExercise?.title}</span> workout?
            </p>
          </div>
        }
      /> */}
    </div>
  );
};

export default SavedCards;
