"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  LogOut,
  Edit2,
  Save,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  TextInput,
  NumberInput,
  FileUpload,
} from "@/components/common/form";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import Image from "next/image";
import { profileSchema } from "@/utils/schemas/profileSchema";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/lib/api/profileApi";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";


type ProfileFormData = z.infer<typeof profileSchema>;

export default function TeacherProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    // Fetch profile data
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      age: 18,
      institutionName: "",
      profilePicture: "",
      institutionLogo: "",
    },
  });

  useEffect(() => {
    if (profileData?.user) {
      const user = profileData.user;
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || 18,
        institutionName: user.institutionName || "",
        profilePicture: user.profilePicture || "",
        institutionLogo: user.institutionLogo || "",
      });
      setProfilePreview(user.profilePicture || null);
      setLogoPreview(user.institutionLogo || null);
    }
  }, [profileData, reset]);

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

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data).unwrap();

      toast({
        title: "Profile Updated!",
        description: result.message || "Your profile has been updated successfully.",
      });

      setIsEditing(false);
      refetch();
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Update Failed",
        description:
          error?.data?.error || error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profileData?.user) {
      const user = profileData.user;
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || 18,
        institutionName: user.institutionName || "",
        profilePicture: user.profilePicture || "",
        institutionLogo: user.institutionLogo || "",
      });
      setProfilePreview(user.profilePicture || null);
      setLogoPreview(user.institutionLogo || null);
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut({ redirect: false });
      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    }
  };

  if (isLoading || isUpdating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-800 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="shadow-lg max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load profile</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = profileData?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full mx-auto">
        {/* Header Card */}
        <Card className="shadow-lg mb-6 pt-0">
          <div className="h-32 bg-gradient-to-r from-green-800 via-green-800 to-green-700 rounded-t-lg"></div>
          <CardContent className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                    <Image
                      src={profilePreview || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  )}
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Teacher Profile
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your account information
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                {!isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center w-[150px] h-12 gap-2 bg-green-800 hover:bg-green-700"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="flex items-center h-12 gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isUploadingProfile || isUploadingLogo}
                      className="flex items-center gap-2 h-12 w-[120px] bg-green-800 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="flex items-center h-12 gap-2 bg-gray-600 hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isUploadingProfile && (
              <div className="text-center text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Uploading profile picture...
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                // disabled={!isEditing}
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
                // disabled={!isEditing}
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
                // disabled={!isEditing}
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
                required={true}
                // disabled={!isEditing}
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
                min={18}
                max={100}
                // disabled={!isEditing}
              />
            </div>

            {/* Institution Information Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Institution Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Institution Name */}
                <TextInput
                  id="institutionName"
                  label="Institution Name"
                  placeholder="Enter institution name"
                  icon={Building2}
                  setValue={setValue}
                  value={watch("institutionName")}
                  error={errors.institutionName?.message}
                  required={true}
                //   disabled={!isEditing}
                />

                {/* Institution Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg border border-gray-300 overflow-hidden bg-gray-100">
                      <Image
                        src={logoPreview || "/placeholder.svg"}
                        alt="Institution Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
                        Upload New Logo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    )}
                  </div>
                  {isUploadingLogo && (
                    <div className="text-sm text-muted-foreground mt-2">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Uploading logo...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Status Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">
                    Account Status
                  </p>
                  <p className="text-lg font-bold text-green-900 mt-1">Active</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium">
                    Member Since
                  </p>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    {new Date(user?.createdAt || "").toDateString()}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-700 font-medium">Role</p>
                  <p className="text-lg font-bold text-purple-900 mt-1 capitalize">
                    {user?.role?.toLocaleLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}