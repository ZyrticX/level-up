import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImageFromSrc } from '@/utils/backgroundRemoval';
import logoImage from '@/assets/levelup-logo-for-transparent.png';

const LogoTransparency = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transparentLogoUrl, setTransparentLogoUrl] = useState<string | null>(null);

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    try {
      // Load the logo image
      const image = await loadImageFromSrc(logoImage);
      
      // Remove background
      const transparentBlob = await removeBackground(image);
      
      // Create URL for the transparent logo
      const url = URL.createObjectURL(transparentBlob);
      setTransparentLogoUrl(url);
      
      // Download the transparent logo
      const link = document.createElement('a');
      link.download = 'levelup-logo-transparent.png';
      link.href = url;
      link.click();
      
    } catch (error) {
      console.error('Error processing logo:', error);
      alert('שגיאה בעיבוד הלוגו. נסה שוב.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-foreground">הסרת רקע מהלוגו</h3>
      
      <div className="flex flex-col items-center gap-4">
        <img 
          src={logoImage} 
          alt="Original Logo" 
          className="w-48 h-auto border rounded-lg"
        />
        
        <Button 
          onClick={handleRemoveBackground}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'מעבד את הלוגו...' : 'צור לוגו שקוף'}
        </Button>
      </div>
      
      {transparentLogoUrl && (
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-lg font-medium text-foreground">לוגו שקוף:</h4>
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <img 
              src={transparentLogoUrl} 
              alt="Transparent Logo" 
              className="w-48 h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoTransparency;