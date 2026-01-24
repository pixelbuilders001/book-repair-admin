"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Profile } from "@/lib/types";
import { useState, useEffect } from "react";
import { updateProfile } from "@/app/profiles/actions";
import { getTechnicians } from "@/app/technicians/actions";
import { useToast } from "@/components/ui/use-toast";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProfileVerificationProps {
    profile: Profile | null;
    isOpen: boolean;
    onClose: (updated?: boolean) => void;
}

export function ProfileVerification({ profile, isOpen, onClose }: ProfileVerificationProps) {
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const [isVerified, setIsVerified] = useState<string>("true");
    const [onboardingStatus, setOnboardingStatus] = useState<string>("approved");
    const [technicians, setTechnicians] = useState<any[]>([]);

    useEffect(() => {
        if (profile) {
            setPhone(profile.phone || "");
            setFullName(profile.full_name || "");
            setIsVerified(String(profile.is_verified));
            setOnboardingStatus(profile.onboarding_status || "approved");
        }
    }, [profile]);

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                const data = await getTechnicians();
                setTechnicians(data);

                // Try to find matching technician by email to suggest name
                if (profile && !profile.full_name) {
                    const match = data.find((t: any) => t.email === profile.email);
                    if (match) {
                        setFullName(match.full_name);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch technicians:", error);
            }
        };
        if (isOpen) {
            fetchTechs();
        }
    }, [isOpen, profile]);

    if (!profile) return null;

    const handleSave = async () => {
        setSubmitting(true);
        try {
            await updateProfile(profile.id, {
                is_verified: isVerified === "true",
                onboarding_status: onboardingStatus,
                phone: phone,
                full_name: fullName
            });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            onClose(true);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Verify Profile</DialogTitle>
                    <DialogDescription>
                        Update details for {profile.full_name || profile.email}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Verification Status</Label>
                        <Select value={isVerified} onValueChange={setIsVerified}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Verified</SelectItem>
                                <SelectItem value="false">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Onboarding Status</Label>
                        <Select value={onboardingStatus} onValueChange={setOnboardingStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <div className="flex gap-2">
                            <Input
                                id="fullname"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter full name"
                            />
                            {technicians.length > 0 && (
                                <Select onValueChange={setFullName}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Suggest from Techs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {technicians
                                            .filter(t => t.full_name)
                                            .map((t: any) => (
                                                <SelectItem key={t.id} value={t.full_name}>
                                                    {t.full_name} ({t.email || 'No Email'})
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Profile Email: {profile.email}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose()}>Cancel</Button>
                    <Button onClick={handleSave} disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
