"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Building2,
  User,
  Mail,
  Calendar,
  Lock,
  Phone,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRegisterMutation } from "@/lib/api/authApi";
import { registrationSchema } from "@/utils/schemas/registerSchema";
import {
  TextInput,
  SelectInput,
  NumberInput,
  FileUpload,
} from "@/components/common/form";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register = () => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
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

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingProfile(true);
        
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Upload to Cloudinary
        const profilePicUrl = await uploadToCloudinary(file);
        setValue("profilePicture", profilePicUrl);
        
        toast({
          title: "Profile picture uploaded",
          description: "Your profile picture has been uploaded successfully.",
        });
      } catch (error) {
        console.error("Profile picture upload error:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload profile picture. Please try again.",
          variant: "destructive",
        });
        setProfilePreview(null);
      } finally {
        setIsUploadingProfile(false);
      }
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingLogo(true);
        
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Upload to Cloudinary
        const logoUrl = await uploadToCloudinary(file);
        setValue("institutionLogo", logoUrl);
        
        toast({
          title: "Logo uploaded",
          description: "Your institution logo has been uploaded successfully.",
        });
      } catch (error) {
        console.error("Logo upload error:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
        setLogoPreview(null);
      } finally {
        setIsUploadingLogo(false);
      }
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
        description:
          "Your account has been created successfully. Signing you in...",
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
          description:
            "Account created but couldn't sign in automatically. Please login manually.",
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
        description:
          error?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "other", label: "Institution/Organization" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

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
              <FileUpload
                id="profile-picture"
                label="Profile Picture"
                accept="image/*"
                preview={profilePreview}
                onChange={handleProfilePictureChange}
                isProfilePicture={true}
                profileIcon={User}
                animationDelay="0.1s"
                required={false}
              />
              {isUploadingProfile && (
                <div className="text-center text-sm text-muted-foreground">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Uploading profile picture...
                  </div>
                </div>
              )}

              {/* Two Column Layout for Desktop */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <TextInput
                  id="name"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={User}
                  setValue={setValue}
                  value={watch("name")}
                  error={errors.name?.message}
                  required={true}
                  animationDelay="0.2s"
                />

                {/* Username */}
                <TextInput
                  id="username"
                  label="Username"
                  placeholder="johndoe123"
                  icon={User}
                  setValue={setValue}
                  value={watch("username")}
                  error={errors.username?.message}
                  required={true}
                  animationDelay="0.25s"
                />

                {/* Email */}
                <TextInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  icon={Mail}
                  setValue={setValue}
                  value={watch("email")}
                  error={errors.email?.message}
                  required={true}
                  animationDelay="0.3s"
                />

                {/* Phone */}
                <TextInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  icon={Phone}
                  setValue={setValue}
                  value={watch("phone")}
                  error={errors.phone?.message}
                  required={false}
                  animationDelay="0.35s"
                />

                {/* User Type */}
                <SelectInput
                  id="userType"
                  label="User Type"
                  placeholder="Select user type"
                  icon={GraduationCap}
                  options={userTypeOptions}
                  value={userType}
                  onValueChange={(value) =>
                    setValue(
                      "userType",
                      value as "student" | "teacher" | "other"
                    )
                  }
                  error={errors.userType?.message}
                  required={true}
                  animationDelay="0.4s"
                />

                {/* Age */}
                <NumberInput
                  id="age"
                  label="Age"
                  placeholder="25"
                  icon={Calendar}
                  setValue={setValue}
                  value={watch("age")}
                  error={errors.age?.message}
                  required={true}
                  min={13}
                  max={120}
                  animationDelay="0.45s"
                />

                {/* Password */}
                <TextInput
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  icon={Lock}
                  setValue={setValue}
                  value={watch("password")}
                  error={errors.password?.message}
                  required={true}
                  showPasswordToggle={true}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  animationDelay="0.5s"
                />

                {/* Confirm Password */}
                <TextInput
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  icon={Lock}
                  setValue={setValue}
                  value={watch("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  required={true}
                  showPasswordToggle={true}
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  animationDelay="0.55s"
                />
              </div>

              {/* Conditional Institution Name */}
              {userType && userType !== "student" && (
                <div className="space-y-4 animate-fade-in">
                  <TextInput
                    id="institutionName"
                    label="Institution Name"
                    placeholder="Enter your institution name"
                    icon={Building2}
                    setValue={setValue}
                    value={watch("institutionName")}
                    error={errors.institutionName?.message}
                    required={true}
                  />

                  {/* Institution Logo Upload */}
                  <FileUpload
                    id="institution-logo"
                    label="Institution Logo"
                    accept="image/*"
                    preview={logoPreview}
                    onChange={handleLogoChange}
                    description="Upload your institution's logo"
                    required={false}
                  />
                  {isUploadingLogo && (
                    <div className="text-center text-sm text-muted-foreground">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Uploading logo...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isUploadingProfile || isUploadingLogo}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
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
              <p
                className="text-center text-sm text-muted-foreground animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Features Footer */}
        <div
          className="mt-8 grid md:grid-cols-3 gap-4 text-center animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">AI-Powered</h3>
            <p className="text-xs text-muted-foreground">
              Generate exams with advanced AI
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-xs text-muted-foreground">
              Create papers in minutes
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Secure</h3>
            <p className="text-xs text-muted-foreground">
              Your data is safe with us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
