
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, Shield, User, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile } from "@/app/profiles/actions";
import { Profile } from "@/lib/types";

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export function UserInfoModal({ isOpen, onClose, userId }: UserInfoModalProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchProfile();
        } else {
            setProfile(null);
            setError(null);
        }
    }, [isOpen, userId]);

    const fetchProfile = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getProfile(userId);
            setProfile(data);
        } catch (err: any) {
            setError(err.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                        Complete information about the user.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">
                        {error}
                    </div>
                ) : profile ? (
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col items-center space-y-3">
                            <Avatar className="h-20 w-20 border-2 border-primary/10">
                                <AvatarImage src={profile.selfie_url || undefined} />
                                <AvatarFallback className="text-xl">
                                    {profile.full_name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {profile.full_name || "Unknown User"}
                                </h3>
                                <Badge variant={profile.is_verified ? "default" : "secondary"} className="mt-1">
                                    {profile.is_verified ? "Verified User" : "Unverified"}
                                </Badge>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-4 border rounded-lg p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Email</span>
                                    <span className="text-sm font-medium">{profile.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Phone</span>
                                    <span className="text-sm font-medium">{profile.phone || "N/A"}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Role</span>
                                    <span className="text-sm font-medium capitalize">{profile.role}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Onboarding Status</span>
                                    <span className="text-sm font-medium capitalize">{profile.onboarding_status.replace(/_/g, " ")}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Joined At</span>
                                    <span className="text-sm font-medium">{formatDate(profile.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No profile data available
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
