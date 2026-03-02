import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    MapPin,
    Camera,
    Check,
    X,
    Edit2,
    ShieldAlert,
    Briefcase,
    Contact,
    CreditCard,
    Hash,
    Heart,
    Baby,
    Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { useUser } from "@/hooks/use-user";

const profileSchema = z.object({
    // Personal
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    nik: z.string().min(16, "NIK must be 16 characters").max(16, "NIK must be 16 characters"),
    gender: z.enum(["Male", "Female"]),
    birth_date: z.string().min(1, "Birth date is required"),
    birth_place: z.string().min(1, "Birth place is required"),
    marital_status: z.string().min(1, "Marital status is required"),
    religion: z.string().min(1, "Religion is required"),
    blood_type: z.string().optional(),

    // Contact
    phone: z.string().min(5, "Phone number is required"),
    personal_email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postal_code: z.string().min(1, "Postal code is required"),

    // Emergency
    emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
    emergency_contact_phone: z.string().min(5, "Emergency contact phone is required"),

    // Employment (Read-only in form)
    employee_code: z.string(),
    employment_type: z.string(),
    hire_date: z.string(),
    department: z.string(),
    branch: z.string(),
    position: z.string(),
    manager: z.string(),
    status: z.string(),
    bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const { user: userData, updateUser } = useUser();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: userData,
    });

    const onSubmit = (data: ProfileFormValues) => {
        updateUser(data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
    };

    const handleCancel = () => {
        reset(userData);
        setIsEditing(false);
    };

    const renderField = (label: string, value: string, icon?: React.ReactNode) => (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                {icon} {label}
            </p>
            <p className="text-sm font-semibold text-foreground">{value || "-"}</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section remains similar but updated */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Detailed employee profile information according to organization records.</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="gap-2 gradient-primary">
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column: Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden border-none shadow-premium bg-card">
                        <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
                        <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center">
                            <div className="relative group">
                                <Avatar className="w-28 h-28 border-4 border-background shadow-xl">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-3xl font-bold">
                                        {userData.full_name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </button>
                                )}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-foreground">{userData.full_name}</h2>
                            <p className="text-sm text-muted-foreground font-medium">{userData.position}</p>

                            <div className="w-full pt-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center lg:justify-start bg-muted/30 p-2 rounded-lg">
                                    <Hash className="w-4 h-4 text-primary shrink-0" />
                                    <span className="font-mono text-xs">{userData.employee_code}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center lg:justify-start">
                                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                                    <span>{userData.department}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center lg:justify-start">
                                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                                    <span>{userData.employment_type}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center lg:justify-start text-emerald-500 font-bold">
                                    <Check className="w-4 h-4 shrink-0" />
                                    <span>{userData.status}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Tabs */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid grid-cols-4 w-full h-12 bg-muted/50 p-1 rounded-xl mb-6">
                                <TabsTrigger value="personal" className="rounded-lg gap-2"><User className="w-4 h-4" /> Personal</TabsTrigger>
                                <TabsTrigger value="contact" className="rounded-lg gap-2"><Mail className="w-4 h-4" /> Contact</TabsTrigger>
                                <TabsTrigger value="emergency" className="rounded-lg gap-2"><ShieldAlert className="w-4 h-4" /> Emergency</TabsTrigger>
                                <TabsTrigger value="employment" className="rounded-lg gap-2"><Briefcase className="w-4 h-4" /> Employment</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-6 focus-visible:outline-none">
                                <Card className="border-none shadow-premium">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Information</CardTitle>
                                        <CardDescription>Individual identity and background details.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {isEditing ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="full_name">Full Name</Label>
                                                        <Input id="full_name" {...register("full_name")} className={errors.full_name ? "border-destructive" : ""} />
                                                        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nik">NIK (ID Number)</Label>
                                                        <Input id="nik" {...register("nik")} placeholder="16 digits" className={errors.nik ? "border-destructive" : ""} />
                                                        {errors.nik && <p className="text-xs text-destructive">{errors.nik.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="gender">Gender</Label>
                                                        <Controller
                                                            name="gender"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select gender" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Male">Male</SelectItem>
                                                                        <SelectItem value="Female">Female</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="birth_date">Birth Date</Label>
                                                        <Input id="birth_date" type="date" {...register("birth_date")} />
                                                        {errors.birth_date && <p className="text-xs text-destructive">{errors.birth_date.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="birth_place">Birth Place</Label>
                                                        <Input id="birth_place" {...register("birth_place")} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="marital_status">Marital Status</Label>
                                                        <Input id="marital_status" {...register("marital_status")} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="religion">Religion</Label>
                                                        <Input id="religion" {...register("religion")} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="blood_type">Blood Type</Label>
                                                        <Input id="blood_type" {...register("blood_type")} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {renderField("Full Name", userData.full_name, <User className="w-3 h-3 text-primary" />)}
                                                    {renderField("NIK", userData.nik, <CreditCard className="w-3 h-3 text-primary" />)}
                                                    {renderField("Gender", userData.gender, <User className="w-3 h-3 text-primary" />)}
                                                    {renderField("Birth Date", userData.birth_date, <Baby className="w-3 h-3 text-primary" />)}
                                                    {renderField("Birth Place", userData.birth_place, <MapPin className="w-3 h-3 text-primary" />)}
                                                    {renderField("Marital Status", userData.marital_status, <Smile className="w-3 h-3 text-primary" />)}
                                                    {renderField("Religion", userData.religion, <Heart className="w-3 h-3 text-primary" />)}
                                                    {renderField("Blood Type", userData.blood_type || "N/A", <ShieldAlert className="w-3 h-3 text-primary" />)}
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="contact" className="space-y-6 focus-visible:outline-none">
                                <Card className="border-none shadow-premium">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Contact Details</CardTitle>
                                        <CardDescription>Address and primary communication channels.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {isEditing ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone Number</Label>
                                                        <Input id="phone" {...register("phone")} />
                                                        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="personal_email">Personal Email</Label>
                                                        <Input id="personal_email" type="email" {...register("personal_email")} />
                                                        {errors.personal_email && <p className="text-xs text-destructive">{errors.personal_email.message}</p>}
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <Label htmlFor="address">Address</Label>
                                                        <Textarea id="address" {...register("address")} rows={3} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input id="city" {...register("city")} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="postal_code">Postal Code</Label>
                                                        <Input id="postal_code" {...register("postal_code")} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {renderField("Phone Number", userData.phone, <Phone className="w-3 h-3 text-primary" />)}
                                                    {renderField("Personal Email", userData.personal_email, <Mail className="w-3 h-3 text-primary" />)}
                                                    <div className="md:col-span-2">
                                                        {renderField("Address", userData.address, <MapPin className="w-3 h-3 text-primary" />)}
                                                    </div>
                                                    {renderField("City", userData.city, <Building2 className="w-3 h-3 text-primary" />)}
                                                    {renderField("Postal Code", userData.postal_code, <Hash className="w-3 h-3 text-primary" />)}
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="emergency" className="space-y-6 focus-visible:outline-none">
                                <Card className="border-none shadow-premium">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-primary" /> Emergency Contact</CardTitle>
                                        <CardDescription>Person to contact in case of emergency.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {isEditing ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="emergency_contact_name">Contact Name</Label>
                                                        <Input id="emergency_contact_name" {...register("emergency_contact_name")} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                                                        <Input id="emergency_contact_phone" {...register("emergency_contact_phone")} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {renderField("Contact Name", userData.emergency_contact_name, <User className="w-3 h-3 text-primary" />)}
                                                    {renderField("Contact Phone", userData.emergency_contact_phone, <Phone className="w-3 h-3 text-primary" />)}
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="employment" className="space-y-6 focus-visible:outline-none">
                                <Card className="border-none shadow-premium">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Employment Information</CardTitle>
                                        <CardDescription>Organization related details (Read-only).</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                                            {renderField("Employee Code", userData.employee_code, <Hash className="w-3 h-3 text-primary" />)}
                                            {renderField("Position", userData.position, <Briefcase className="w-3 h-3 text-primary" />)}
                                            {renderField("Department", userData.department, <Building2 className="w-3 h-3 text-primary" />)}
                                            {renderField("Branch", userData.branch, <MapPin className="w-3 h-3 text-primary" />)}
                                            {renderField("Employment Type", userData.employment_type, <Calendar className="w-3 h-3 text-primary" />)}
                                            {renderField("Hire Date", userData.hire_date, <Calendar className="w-3 h-3 text-primary" />)}
                                            {renderField("Manager", userData.manager, <User className="w-3 h-3 text-primary" />)}
                                            {renderField("Status", userData.status, <Check className="w-3 h-3 text-emerald-500" />)}
                                        </div>

                                        <div className="mt-8 pt-6 border-t">
                                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">About Me</Label>
                                            {isEditing ? (
                                                <Textarea {...register("bio")} className="mt-2 resize-none" rows={4} />
                                            ) : (
                                                <p className="mt-2 text-sm text-foreground italic leading-relaxed">
                                                    "{userData.bio}"
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {isEditing && (
                            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-sidebar-border/50">
                                <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" className="gap-2 gradient-primary shadow-lg shadow-primary/20" disabled={!isDirty}>
                                    <Check className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
