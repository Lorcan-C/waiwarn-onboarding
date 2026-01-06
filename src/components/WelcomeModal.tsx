import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCheckIn: () => void;
}

const WelcomeModal = ({ isOpen, onClose, onStartCheckIn }: WelcomeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl">Welcome to WAIWARN</DialogTitle>
          <DialogDescription className="text-base">
            Your guide for the first 90 days. We help you stay on top of what matters.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={onStartCheckIn} className="w-full">
            Start your first check-in
          </Button>
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:underline"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
