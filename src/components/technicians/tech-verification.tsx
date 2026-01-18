"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Technician } from "@/lib/types";
import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    FileText,
    Camera,
    ExternalLink,
    ShieldCheck
} from "lucide-react";
import { verifyTechnician } from "@/app/technicians/actions";

interface TechVerificationProps {
    tech: Technician | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TechVerification({ tech, isOpen, onClose }: TechVerificationProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Added for fetchTech
    const [technicianData, setTechnicianData] = useState<Technician | null>(null); // Added for fetchTech

    if (!tech) return null;



    // ... inside component
    // PATCH API call for verification
    const handleVerify = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await verifyTechnician(tech.id, { is_verified: true });
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to verify technician");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-xl">Verify Technician: {tech.name}</DialogTitle>
                        <Badge variant="secondary">{tech.id}</Badge>
                    </div>
                    <DialogDescription>
                        Review uploaded documents and background check results for {tech.city}.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Document Preview Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                                <FileText size={14} /> Aadhaar Card (Front/Back)
                            </label>
                            <div className="aspect-[3/2] rounded-lg bg-muted border-2 border-dashed flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                <div className="text-center p-4">
                                    <p className="text-xs text-muted-foreground">aadhaar_front_01.jpg</p>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm"><ExternalLink size={14} className="mr-2" /> View Large</Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                                <Camera size={14} /> Live Selfie
                            </label>
                            <div className="aspect-[3/2] rounded-lg bg-muted border-2 border-dashed flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                <div className="text-center p-4">
                                    <p className="text-xs text-muted-foreground">selfie_verification.jpg</p>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm"><ExternalLink size={14} className="mr-2" /> View Large</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Check / Details */}
                    <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <ShieldCheck size={18} className="text-emerald-500" /> Automated Verification Status
                        </h4>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <span className="text-muted-foreground">Aadhaar Auth:</span>
                            <span className="text-emerald-600 font-medium">Verified (DigiLocker)</span>
                            <span className="text-muted-foreground">Name Match:</span>
                            <span className="text-emerald-600 font-medium">98% Match</span>
                            <span className="text-muted-foreground">Criminal Record Check:</span>
                            <span className="text-emerald-600 font-medium">Clean</span>
                        </div>
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="flex-1">Close</Button>
                    <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10">
                        <XCircle className="mr-2 h-4 w-4" /> Reject Application
                    </Button>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleVerify} disabled={submitting}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> {submitting ? "Verifying..." : "Approve & Enable"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
