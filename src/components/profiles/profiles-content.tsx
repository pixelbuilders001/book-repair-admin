"use client";

import { useState } from "react";
import { Profile } from "@/lib/types";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileVerification } from "@/components/profiles/profile-verification";
import { CheckCircle2, XCircle, UserCircle } from "lucide-react";
import { getProfiles } from "@/app/profiles/actions";

interface ProfilesContentProps {
    initialProfiles: Profile[];
}

export function ProfilesContent({ initialProfiles }: ProfilesContentProps) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
    const [loading, setLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshProfiles = async () => {
        try {
            setLoading(true);
            const data = await getProfiles();
            setProfiles(data);
        } catch (error) {
            console.error('Error refreshing profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClick = (profile: Profile) => {
        setSelectedProfile(profile);
        setIsModalOpen(true);
    };

    const handleModalClose = (updated?: boolean) => {
        setIsModalOpen(false);
        if (updated) {
            refreshProfiles();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
                    <p className="text-muted-foreground">
                        Manage user profiles, verification status, and contact information.
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6 w-[300px]">Profile</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verified</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && profiles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            Loading profiles...
                                        </TableCell>
                                    </TableRow>
                                ) : profiles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            No profiles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    profiles.map((profile) => (
                                        <TableRow key={profile.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    {profile.selfie_url ? (
                                                        <img
                                                            src={profile.selfie_url}
                                                            alt={profile.full_name || "Profile"}
                                                            className="h-10 w-10 rounded-full object-cover border"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                            <UserCircle className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">
                                                            {profile.full_name || "N/A"}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {profile.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {profile.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{profile.phone || "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={profile.onboarding_status === 'approved' ? 'default' : 'secondary'}
                                                    className="capitalize"
                                                >
                                                    {profile.onboarding_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {profile.is_verified ? (
                                                    <div className="flex items-center gap-1 text-emerald-600">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <XCircle className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Unverified</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleVerifyClick(profile)}
                                                >
                                                    Verify
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ProfileVerification
                profile={selectedProfile}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}
