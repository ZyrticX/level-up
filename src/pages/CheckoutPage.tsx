import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Package,
  Tag,
  CheckCircle,
  ArrowRight,
  Calendar,
  Clock,
  Video
} from 'lucide-react';

interface CourseDetails {
  id: string;
  name: string;
  institution: string;
  department: string;
  price: number;
  originalPrice?: number;
  duration: string;
  videos: number;
  description: string;
}

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'bit' | 'apple' | 'google'>('credit');

  // Mock course data - in production, fetch from Supabase
  const course: CourseDetails = {
    id: courseId || 'physics-101',
    name: 'פיזיקה 1 - מכניקה קלאסית',
    institution: 'הטכניון',
    department: 'מדעי המחשב',
    price: 299,
    originalPrice: 399,
    duration: '45 שעות',
    videos: 32,
    description: 'קורס מקיף המכסה את כל נושאי הפיזיקה הקלאסית'
  };

  const handleApplyCoupon = () => {
    // Mock coupon validation
    const validCoupons: Record<string, number> = {
      'STUDENT10': 10,
      'SUMMER20': 20,
      'FIRST50': 50,
    };

    const discount = validCoupons[couponCode.toUpperCase()];
    if (discount) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount });
      toast.success(`קופון הופעל בהצלחה! הנחה של ${discount}%`);
    } else {
      toast.error('קוד קופון לא תקין');
    }
  };

  const calculateTotal = () => {
    let total = course.price;
    if (appliedCoupon) {
      total = total * (1 - appliedCoupon.discount / 100);
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast.error('יש לאשר את תנאי השימוש');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('התשלום בוצע בהצלחה!');
      navigate(`/course/${courseId}?purchased=true`);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">השלמת רכישה</h1>
          <p className="text-muted-foreground">עוד צעד אחד ותוכלו להתחיל ללמוד!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Summary */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  סיכום הזמנה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course Details */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">{course.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{course.institution}</span>
                    <span>•</span>
                    <span>{course.department}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-primary" />
                      <span>{course.videos} סרטונים</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Coupon */}
                <div className="space-y-2">
                  <Label>קוד קופון (אופציונלי)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="הזן קוד"
                      className="text-right"
                      disabled={!!appliedCoupon}
                    />
                    <Button 
                      onClick={handleApplyCoupon}
                      variant="outline"
                      disabled={!!appliedCoupon || !couponCode}
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>הנחה של {appliedCoupon.discount}% הופעלה</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>מחיר קורס</span>
                    <span>₪{course.price}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>הנחה ({appliedCoupon.discount}%)</span>
                      <span>-₪{(course.price * appliedCoupon.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>סה"כ לתשלום</span>
                    <span className="text-primary">₪{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="glass-success p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">תשלום מאובטח בהצפנת SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Personal Details */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>פרטים אישיים</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">שם פרטי *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="שם פרטי"
                          required
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">שם משפחה *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="שם משפחה"
                          required
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">אימייל *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="email@example.com"
                          required
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">טלפון *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="05X-XXXXXXX"
                          required
                          className="text-right"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Selection */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      בחר אמצעי תשלום
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit')}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === 'credit'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                          paymentMethod === 'credit' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div className={`text-sm font-medium ${
                          paymentMethod === 'credit' ? 'text-primary' : 'text-foreground'
                        }`}>
                          כרטיס אשראי
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bit')}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === 'bit'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-6 h-6 mx-auto mb-2 flex items-center justify-center text-lg font-bold ${
                          paymentMethod === 'bit' ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          ביט
                        </div>
                        <div className={`text-sm font-medium ${
                          paymentMethod === 'bit' ? 'text-primary' : 'text-foreground'
                        }`}>
                          ביט
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple')}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === 'apple'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-6 h-6 mx-auto mb-2 flex items-center justify-center ${
                          paymentMethod === 'apple' ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                          </svg>
                        </div>
                        <div className={`text-sm font-medium ${
                          paymentMethod === 'apple' ? 'text-primary' : 'text-foreground'
                        }`}>
                          Apple Pay
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('google')}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === 'google'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-6 h-6 mx-auto mb-2 flex items-center justify-center ${
                          paymentMethod === 'google' ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.78h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.78c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <div className={`text-sm font-medium ${
                          paymentMethod === 'google' ? 'text-primary' : 'text-foreground'
                        }`}>
                          Google Pay
                        </div>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details */}
                {paymentMethod === 'credit' && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      פרטי תשלום
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">מספר כרטיס אשראי *</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                        className="text-right font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">שם בעל הכרטיס *</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        placeholder="כפי שמופיע על הכרטיס"
                        required
                        className="text-right"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">תוקף *</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          required
                          maxLength={5}
                          className="text-right font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="XXX"
                          required
                          maxLength={3}
                          className="text-right font-mono"
                        />
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="glass-primary p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-primary mb-1">תשלום מאובטח 100%</p>
                          <p className="text-muted-foreground">
                            פרטי הכרטיס מוצפנים ב-SSL 256-bit ולא נשמרים במערכת שלנו
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )}

                {/* Alternative Payment Methods Placeholder */}
                {paymentMethod !== 'credit' && (
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        {paymentMethod === 'bit' && 'תשלום באמצעות ביט יופעל בקרוב'}
                        {paymentMethod === 'apple' && 'תשלום באמצעות Apple Pay יופעל בקרוב'}
                        {paymentMethod === 'google' && 'תשלום באמצעות Google Pay יופעל בקרוב'}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Terms and Submit */}
                <Card className="glass-card">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      />
                      <Label 
                        htmlFor="terms" 
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        אני מאשר/ת את{' '}
                        <a href="/privacy" className="text-primary underline" target="_blank">
                          תנאי השימוש ומדיניות הפרטיות
                        </a>
                        {' '}ומאשר/ת את ביצוע החיוב
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing || !termsAccepted || paymentMethod !== 'credit'}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
                          מעבד תשלום...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 ml-2" />
                          השלם רכישה - ₪{calculateTotal().toFixed(2)}
                          <ArrowRight className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      בלחיצה על "השלם רכישה" תחויב/י בסכום המוצג לעיל
                    </p>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">גישה מיידית</p>
                    <p className="text-xs text-muted-foreground">לאחר התשלום</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">גישה ללא הגבלת זמן</p>
                    <p className="text-xs text-muted-foreground">לכל החיים</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">ערבות החזר כספי</p>
                    <p className="text-xs text-muted-foreground">30 יום</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;






