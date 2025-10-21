"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Upload, Building2, User, Mail, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRegisterMutation } from "@/lib/api/authApi";

// Zod validation schema
const registrationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  userType: z.enum(["student", "teacher", "other"], {
    required_error: "Please select a user type",
  }),
  institutionName: z.string().optional(),
  age: z.coerce.number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  profilePicture: z.any().optional(),
  institutionLogo: z.any().optional(),
}).refine((data) => {
  if (data.userType !== "student" && !data.institutionName) {
    return false;
  }
  return true;
}, {
  message: "Institution name is required for teachers and other user types",
  path: ["institutionName"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register = () => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const userType = watch("userType");

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePicture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("institutionLogo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [registerUser, { isLoading: isSubmitting }] = useRegisterMutation();

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = data;
      
      const result = await registerUser({
        ...registrationData,
        age: parseInt(registrationData.age.toString()),
      }).unwrap();

      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully. Signing you in...",
      });

      // Automatically sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        emailOrUsername: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: "Sign in failed",
          description: "Account created but couldn't sign in automatically. Please login manually.",
          variant: "destructive",
        });
        router.push("/login");
      } else {
        // Redirect based on user role
        router.push(result.redirectUrl || "/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error?.data?.error || error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 animate-glow">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            ExamGen AI
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-Powered Examination Generation Platform
          </p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-card/95 animate-scale-in">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center text-base">
              Join thousands of educators creating amazing exams with AI
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-3 cursor-pointer shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
                  >
                    <Upload className="w-4 h-4" />
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              </div>

              {/* Two Column Layout for Desktop */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    className="transition-all duration-300 focus:shadow-md"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.name.message}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.25s' }}>
                  <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    {...register("username")}
                    placeholder="johndoe123"
                    className="transition-all duration-300 focus:shadow-md"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.username.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="transition-all duration-300 focus:shadow-md"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.35s' }}>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+1 234 567 8900"
                    className="transition-all duration-300 focus:shadow-md"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.phone.message}</p>
                  )}
                </div>

                {/* User Type */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <Label htmlFor="userType" className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    User Type
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("userType", value as "student" | "teacher" | "other")}
                  >
                    <SelectTrigger className="transition-all duration-300 focus:shadow-md">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="other">Institution/Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.userType.message}</p>
                  )}
                </div>

                {/* Age */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.45s' }}>
                  <Label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age")}
                    placeholder="25"
                    min="13"
                    max="120"
                    className="transition-all duration-300 focus:shadow-md"
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.age.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      className="transition-all duration-300 focus:shadow-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.55s' }}>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirm your password"
                      className="transition-all duration-300 focus:shadow-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Conditional Institution Name */}
              {userType && userType !== "student" && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="institutionName" className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Institution Name
                  </Label>
                  <Input
                    id="institutionName"
                    {...register("institutionName")}
                    placeholder="Enter your institution name"
                    className="transition-all duration-300 focus:shadow-md"
                  />
                  {errors.institutionName && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.institutionName.message}</p>
                  )}

                  {/* Institution Logo Upload */}
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Institution Logo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                      <input
                        id="institution-logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                      <label htmlFor="institution-logo" className="cursor-pointer">
                        {logoPreview ? (
                          <div className="flex flex-col items-center">
                            <img src={logoPreview} alt="Logo preview" className="h-24 w-24 object-contain mb-2 rounded" />
                            <p className="text-sm text-muted-foreground">Click to change logo</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-sm font-medium mb-1">Upload Institution Logo</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: '0.5s' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline font-medium transition-colors">
                  Sign in here
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Features Footer */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">AI-Powered</h3>
            <p className="text-xs text-muted-foreground">Generate exams with advanced AI</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-xs text-muted-foreground">Create papers in minutes</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Secure</h3>
            <p className="text-xs text-muted-foreground">Your data is safe with us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
