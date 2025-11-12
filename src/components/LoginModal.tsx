import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginForm from './LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl bg-white shadow-2xl p-8" dir="rtl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            כניסה למנויים
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            ברוכים השבים ל-LevelUp
          </p>
        </DialogHeader>
        <LoginForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

