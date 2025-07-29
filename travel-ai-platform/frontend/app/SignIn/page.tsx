"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles,
  Shield, Zap, Globe, Star, CheckCircle, Rocket
} from "lucide-react";
import Link from "next/link";

export default function ModernSignIn() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { register } = useAuth();

  const benefits = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "AI-Powered Planning",
      description: "Get personalized itineraries in seconds"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Crisis Management",
      description: "Real-time safety alerts and rescheduling"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Booking",
      description: "Book flights and hotels with one click"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Global Community",
      description: "Connect with 2.5M+ travelers worldwide"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      setStep(3); // Success step
      setTimeout(() => {
        router.push("/main");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (step === 1 && formData.name && formData.email) {
      setStep(2);
    }
  };

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Interactive Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isClient && (
          <>
            <motion.div
              className="absolute w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ top: '10%', left: '10%' }}
            />
            <motion.div
              className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ top: '60%', right: '10%' }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <Badge variant="primary" size="lg" className="mb-4">
                <Star className="h-4 w-4 mr-2" />
                Join 2.5M+ Travelers
              </Badge>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Start Your Journey
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience the future of travel planning with AI-powered recommendations and real-time assistance.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card variant="glass" className="bg-black/40 backdrop-blur-xl border-white/20">
                    <CardHeader className="text-center pb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>
                      <CardTitle className="text-2xl font-bold text-white">
                        Welcome to TravelAI
                      </CardTitle>
                      <p className="text-gray-300 mt-2">
                        Let's get you started on your journey
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={nextStep}
                        disabled={!formData.name || !formData.email}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                      >
                        Continue
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>

                      <div className="text-center pt-4">
                        <p className="text-sm text-gray-400">
                          Already have an account?{" "}
                          <Link href="/LogIn" className="text-violet-400 hover:text-violet-300 font-medium">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card variant="glass" className="bg-black/40 backdrop-blur-xl border-white/20">
                    <CardHeader className="text-center pb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                          <Lock className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>
                      <CardTitle className="text-2xl font-bold text-white">
                        Secure Your Account
                      </CardTitle>
                      <p className="text-gray-300 mt-2">
                        Create a strong password to protect your account
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm"
                        >
                          {error}
                        </motion.div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              value={formData.password}
                              onChange={handleChange}
                              className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                              placeholder="Create a strong password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1 border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading || !formData.password || !formData.confirmPassword}
                            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                          >
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <Rocket className="h-4 w-4 mr-2" />
                                Create Account
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card variant="glass" className="bg-black/40 backdrop-blur-xl border-white/20">
                    <CardContent className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mb-4">
                        Welcome Aboard! 🎉
                      </h2>
                      <p className="text-gray-300 mb-6">
                        Your account has been created successfully. Get ready to explore the world with AI-powered travel planning!
                      </p>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 mx-auto border-2 border-violet-500 border-t-transparent rounded-full"
                      />
                      <p className="text-sm text-gray-400 mt-4">
                        Redirecting you to your dashboard...
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
