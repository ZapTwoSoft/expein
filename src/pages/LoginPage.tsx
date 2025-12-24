import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { GoogleIcon } from '@/components/ui/google-icon';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast({
          title: "Error signing in with Google",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#12141a] to-[#0f0f0f] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Decorative geometric shapes */}
      <div className="absolute top-20 left-20 w-20 h-20 border-2 border-brand/20 rounded-lg rotate-12 animate-float"></div>
      <div className="absolute top-40 right-32 w-12 h-12 border-2 border-purple-500/20 rounded-full animate-float-delayed"></div>
      <div className="absolute bottom-40 left-1/4 w-16 h-16 border-2 border-brand/20 rotate-45 animate-float"></div>
      <div className="absolute bottom-32 right-20 w-8 h-8 border-2 border-purple-500/20 rotate-45 animate-float-delayed"></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-brand/30 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-purple-500/30 rounded-full blur-sm animate-pulse delay-500"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-brand absolute -top-2 -right-2 animate-pulse" />
                <span className="text-4xl text-brand font-bold tracking-tight">Expein.</span>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="text-base text-gray-400">
                Sign in to continue your financial journey
              </p>
            </div>
          </div>

          <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid gap-6">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full h-12 bg-white border-white/20 text-black hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200 font-medium shadow-lg"
                >
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  {googleLoading ? "Signing in..." : "Continue with Google"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#12141a] px-3 py-1 text-gray-400 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="grid gap-5">
                  <div className="grid gap-2.5">
                    <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-brand" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all duration-200"
                    />
                  </div>
                  <div className="grid gap-2.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-brand" />
                        Password
                      </Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-gray-400 hover:text-brand transition-colors duration-200"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="h-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all duration-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-4 hover:bg-transparent text-gray-400 hover:text-brand transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-brand to-brand-400 text-black hover:from-brand-400 hover:to-brand hover:scale-[1.02] font-semibold shadow-lg shadow-brand/20 transition-all duration-200 mt-2" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm">
            <span className="text-gray-400">Don't have an account? </span>
            <Link 
              to="/signup" 
              className="text-brand font-semibold hover:text-brand-400 transition-colors duration-200 underline decoration-brand/30 underline-offset-4 hover:decoration-brand-400/50"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
} 