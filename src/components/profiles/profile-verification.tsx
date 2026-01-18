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
    const [isVerified, setIsVerified] = useState<string>("true");
    const [onboardingStatus, setOnboardingStatus] = useState<string>("approved");

    useEffect(() => {
        if (profile) {
            setPhone(profile.phone || "");
            setIsVerified(String(profile.is_verified));
            setOnboardingStatus(profile.onboarding_status || "approved");
        }
    }, [profile]);

    if (!profile) return null;

    const handleSave = async () => {
        setSubmitting(true);
        try {
            await updateProfile(profile.id, {
                is_verified: isVerified === "true",
                onboarding_status: onboardingStatus,
                phone: phone
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
