import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[95vh] overflow-y-auto rounded-3xl bg-white" dir="rtl">
        <Tabs defaultValue={defaultTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-primary/10 rounded-2xl p-1">
            <TabsTrigger 
              value="login" 
              className="text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all h-12"
            >
              כניסה למנויים
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all h-12"
            >
              הרשמה לאתר
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-8">
            <LoginForm onSuccess={onClose} />
          </TabsContent>

          <TabsContent value="signup" className="mt-8">
            <SignupForm onSuccess={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

