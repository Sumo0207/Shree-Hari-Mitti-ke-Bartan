import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, RefreshCw, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  username: z.string().trim().min(2, { message: "Username must be at least 2 characters" }).max(50).optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, event, loading: authLoading } = useAuth();

  const isEmailVerified = user?.email_confirmed_at != null;

  // Listen for PASSWORD_RECOVERY event from Supabase
  useEffect(() => {
    if (event === 'PASSWORD_RECOVERY') {
      setIsResetPassword(true);
    }
  }, [event]);

  // Also check URL hash for recovery tokens (fallback)
  useEffect(() => {
    const checkHashForRecovery = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        // Let Supabase handle the token exchange
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            setIsResetPassword(true);
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Invalid or expired reset link. Please request a new one.",
            });
          }
        }
      }
    };

    checkHashForRecovery();
  }, [toast]);

  useEffect(() => {
    if (user && !isResetPassword) {
      navigate('/');
    }
  }, [user, navigate, isResetPassword]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationData = isLogin
        ? { email, password }
        : { email, password, username };

      authSchema.parse(validationData);

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          }
          throw error;
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate('/');
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username?.trim() || email.split('@')[0],
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('This email is already registered. Please sign in instead.');
          }
          throw error;
        }

        toast({
          title: "Account created!",
          description: "Welcome to Shree Hari Mitti ke Bartan.",
        });
        navigate('/');
      }
    } catch (error: any) {
      // Check for rate limiting (429)
      if (error.status === 429) {
        toast({
          variant: "destructive",
          title: "Too Many Requests",
          description: "You've made too many attempts. Please wait a few minutes before trying again.",
        });
        return; // Exit early
      }

      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else if (error.message === 'Failed to fetch') {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Unable to connect to server. Please check your internet connection and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message || "An error occurred during authentication.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailSchema = z.string().email({ message: "Invalid email address" });
      emailSchema.parse(email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent!",
        description: "Check your email for the password reset link.",
      });
      setIsForgotPassword(false);
      setEmail('');
    } catch (error: any) {
      if (error.status === 429) {
        toast({
          variant: "destructive",
          title: "Too Many Requests",
          description: "Please wait a few minutes before trying again.",
        });
        return;
      }

      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to send reset email.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" }).max(100);
      passwordSchema.parse(password);

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });

      // Clear the hash from URL and redirect
      window.history.replaceState(null, '', '/auth');
      setIsResetPassword(false);
      setPassword('');
      setConfirmPassword('');
      navigate('/');
    } catch (error: any) {
      if (error.status === 429) {
        toast({
          variant: "destructive",
          title: "Too Many Requests",
          description: "Please wait a few minutes before trying again.",
        });
        return;
      }

      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to reset password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox and click the verification link.",
      });
    } catch (error: any) {
      if (error.status === 429) {
        toast({
          variant: "destructive",
          title: "Too Many Requests",
          description: "Please wait a few minutes before trying again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to resend verification email.",
        });
      }
    } finally {
      setResendingEmail(false);
    }
  };

  // Show loading state while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-clay-light/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-clay-light/20 px-4 py-8">
      <Card className="w-full max-w-md clay-texture">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center">
            {isResetPassword ? 'Set New Password' : isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join Us'}
          </CardTitle>
          <CardDescription className="text-center">
            {isResetPassword
              ? 'Enter your new password below'
              : isForgotPassword
                ? 'Enter your email to receive a password reset link'
                : isLogin ? 'Sign in to your account' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email Verification Status */}
          {user && !isResetPassword && (
            <div className="mb-4">
              {isEmailVerified ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">Email Verified</AlertTitle>
                  <AlertDescription className="text-green-600">
                    Your email address has been verified.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <AlertTitle className="text-orange-700">Email Not Verified</AlertTitle>
                  <AlertDescription className="text-orange-600">
                    <p className="mb-2">Please verify your email address to access all features.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className="border-orange-500 text-orange-700 hover:bg-orange-500/20"
                    >
                      {resendingEmail ? (
                        <>
                          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-3 w-3" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {isResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setEmail('');
                  }}
                  className="text-primary hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </div>
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
