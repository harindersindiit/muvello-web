import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import paymentService from "@/services/paymentService";
import { toast } from "react-toastify";

interface StripeAccountStatus {
  account_status: string;
  verification_status: string;
}

const StripeSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] =
    useState<StripeAccountStatus | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getCoachAccountStatus();

      if (response.success && response.body) {
        setAccountStatus(response.body.account);
      } else {
        toast.error(response.message || "Failed to check account status");
      }
    } catch (error) {
      console.error("Error checking account status:", error);
      toast.error("Failed to check account status");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSetup = async () => {
    try {
      setSetupLoading(true);

      // In a real implementation, this would redirect to Stripe Connect onboarding
      // For now, we'll simulate the process
      toast.info("Redirecting to Stripe Connect setup...");

      // Simulate redirect to Stripe Connect onboarding
      // In production, this would be:
      // window.location.href = stripeOnboardingUrl;

      // For demo purposes, we'll just show a success message
      setTimeout(() => {
        toast.success("Stripe Connect setup completed!");
        navigate("/my-wallet");
      }, 2000);
    } catch (error) {
      console.error("Error setting up Stripe:", error);
      toast.error("Failed to set up Stripe Connect");
    } finally {
      setSetupLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case "restricted":
        return (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Restricted
          </span>
        );
      default:
        return (
          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case "unverified":
        return (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Unverified
          </span>
        );
      default:
        return (
          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking account status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-gray-800"
            >
              <Icon icon="lucide:arrow-left" className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Stripe Connect Setup</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Status Card */}
          {accountStatus && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Icon icon="lucide:credit-card" className="h-5 w-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Account Status:</span>
                    {getStatusBadge(accountStatus.account_status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Verification:</span>
                    {getVerificationBadge(accountStatus.verification_status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Instructions */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Icon icon="lucide:info" className="h-5 w-5" />
                <span>Setup Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">
                      Connect Your Account
                    </p>
                    <p className="text-gray-400 text-sm">
                      Link your bank account to receive payments from clients
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">
                      Verify Your Identity
                    </p>
                    <p className="text-gray-400 text-sm">
                      Complete identity verification for secure transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Start Earning</p>
                    <p className="text-gray-400 text-sm">
                      Begin receiving payments from your coaching services
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Icon icon="lucide:star" className="h-5 w-5" />
                <span>Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="lucide:shield-check"
                    className="h-5 w-5 text-green-500"
                  />
                  <span className="text-gray-300">Secure payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="lucide:clock"
                    className="h-5 w-5 text-green-500"
                  />
                  <span className="text-gray-300">Fast transfers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="lucide:globe"
                    className="h-5 w-5 text-green-500"
                  />
                  <span className="text-gray-300">Global reach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="lucide:trending-up"
                    className="h-5 w-5 text-green-500"
                  />
                  <span className="text-gray-300">Low fees</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleStripeSetup}
              disabled={setupLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {setupLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Set up Stripe Connect
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/my-wallet")}
              className="flex-1 border-gray-600 text-white hover:bg-gray-800"
            >
              Back to Wallet
            </Button>
          </div>

          {/* Security Notice */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Security Notice</p>
                  <p className="text-gray-400 text-sm">
                    Your financial information is encrypted and secure. We use
                    Stripe, a trusted payment processor used by millions of
                    businesses worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StripeSetup;
