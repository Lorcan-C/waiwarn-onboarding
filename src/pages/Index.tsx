import { useState } from "react";
import { HelpCircle, CheckCircle2, Sun, Settings } from "lucide-react";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import CheckInModal from "@/components/CheckInModal";
import CheckOutModal from "@/components/CheckOutModal";
import UnstuckModal from "@/components/UnstuckModal";
import OnboardingSetupView from "@/components/OnboardingSetupView";
import waiwarnLogo from "@/assets/waiwarn-logo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stuckModalOpen, setStuckModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [managerSetupModalOpen, setManagerSetupModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 overflow-auto relative">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"
        style={{ opacity: 0.5 }}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-6">
        {/* Header with Logo and Check-in Button */}
        <div className="h-10 flex items-center justify-between w-full max-w-[1120px] mb-8">
          <img src={waiwarnLogo} alt="What Am I Working On Right Now" className="h-10" />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setManagerSetupModalOpen(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manager Set Up
            </Button>
            <Button
              onClick={() => setCheckInModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Sun className="w-4 h-4 mr-2" />
              Check In
            </Button>
          </div>
        </div>

        {/* Glass Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-[1120px] flex-1 overflow-hidden flex flex-col">
          {/* Two Column Layout */}
          <TwoColumnLayout />

          {/* Footer Bar */}
          <div className="border-t border-gray-200 p-4 flex justify-between">
            <Button
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
              onClick={() => setStuckModalOpen(true)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              I'm stuck
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setCheckoutModalOpen(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Check out for today
            </Button>
          </div>
        </div>
      </div>

      {/* Stuck Modal */}
      <UnstuckModal
        isOpen={stuckModalOpen}
        onClose={() => setStuckModalOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckOutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
      />

      {/* Manager Set Up Modal */}
      <Dialog open={managerSetupModalOpen} onOpenChange={setManagerSetupModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manager Set Up</DialogTitle>
            <DialogDescription>
              Configure onboarding guidance for your new hire.
            </DialogDescription>
          </DialogHeader>
          <OnboardingSetupView onClose={() => setManagerSetupModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
