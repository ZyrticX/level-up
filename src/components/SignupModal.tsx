import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SignupForm from './SignupForm';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-8" dir="rtl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            הרשמה לאתר
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            הצטרפו אלינו והתחילו את המסע להצלחה אקדמית
          </p>
        </DialogHeader>
        <SignupForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;

