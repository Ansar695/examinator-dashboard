"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { addUserSchema } from "@/utils/schemas/registerSchema";
import {
  TextInput,
  SelectInput,
  NumberInput,
  FileUpload,
} from "@/components/common/form";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

type RegistrationFormData = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: any | null;
  updateUser?: (data: any) => void;
  createUser: (data: any) => void;
  isLoading?: boolean;
  refetch: () => void;
}

export function AddUserModal({
  isOpen,
  onOpenChange,
  editingUser,
  createUser,
  updateUser,
  refetch,
  isLoading = false,
}: AddUserModalProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(addUserSchema),
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

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const role = data.userType === "student" ? "STUDENT" : "TEACHER";
      if (editingUser) {
        await updateUser!({
          id: editingUser?.id,
          data: { ...data, role, age: parseInt(data.age.toString()) },
        });
        toast({
          title: "Success!",
          description: "User Updated Successful.",
        });
      } else {
        await createUser({
          ...data,
          role,
          age: parseInt(data.age.toString()),
        });
        toast({
          title: "Success!",
          description: "User added Successful.",
        });
      }

      refetch();
      onOpenChange(false);
    } catch (error: any) {
      console.error("error:", error);
      toast({
        title: "User Registration Failed",
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

  useEffect(() => {
    if (editingUser) {
      reset({
        email: editingUser.email || "",
        username: editingUser.username || "",
        name: editingUser.name || "",
        userType: editingUser.role?.toLowerCase() ?? "",
        institutionName: editingUser.institutionName || "",
        age: editingUser.age || undefined,
        phone: editingUser.phone || "",
        profilePicture: editingUser.profilePicture || "",
        institutionLogo: editingUser.institutionLogo || "",
      });
      console.log("editingUser ", editingUser);
      setProfilePreview(editingUser.profilePicture || null);
      setLogoPreview(editingUser.institutionLogo || null);
    }
  }, [editingUser, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Toaster />
      <DialogContent className="w-full sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Update user information and settings"
              : "Create a new user account in the system"}
          </DialogDescription>
        </DialogHeader>

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
                setValue("userType", value as "student" | "teacher" | "other")
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
            disabled={isLoading || isUploadingProfile || isUploadingLogo}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {editingUser ? "Updating..." : "Adding..."}
              </span>
            ) : editingUser ? (
              "Update User"
            ) : (
              "Add User"
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
      </DialogContent>
    </Dialog>
  );
}
