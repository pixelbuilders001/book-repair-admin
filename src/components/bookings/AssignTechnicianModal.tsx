"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { getTechnicians, assignTechnician } from "@/app/bookings/actions";
import { useToast } from "@/components/ui/use-toast";

interface AssignTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    bookingPincode: string;
    onSuccess: () => void;
}

export function AssignTechnicianModal({ isOpen, onClose, bookingId, bookingPincode, onSuccess }: AssignTechnicianModalProps) {
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [selectedTech, setSelectedTech] = useState("");
    const [mapUrl, setMapUrl] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchTechnicians();
            setSelectedTech("");
            setMapUrl("");
        }
    }, [isOpen]);

    async function fetchTechnicians() {
        setLoading(true);
        const { data, error } = await getTechnicians(bookingPincode);
        if (error) {
            toast({ variant: "destructive", title: "Error", description: error });
            setTechnicians([]);
        } else {
            setTechnicians(data || []);
        }
        setLoading(false);
    }

    async function handleAssign() {
        if (!selectedTech || !mapUrl) {
            toast({ variant: "destructive", title: "Missing fields", description: "Please select a technician and enter a Map URL." });
            return;
        }

        setSubmitting(true);
        const { error } = await assignTechnician(bookingId, selectedTech, mapUrl);
        setSubmitting(false);

        if (error) {
            toast({ variant: "destructive", title: "Assignment Failed", description: error });
        } else {
            toast({ title: "Success", description: "Technician assigned successfully." });
            onSuccess();
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Technician</DialogTitle>
                    <DialogDescription>
                        Select a technician and provide the location map URL for this booking.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="technician">Technician</Label>
                        {loading ? (
                            <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading technicians...</div>
                        ) : (
                            <Select value={selectedTech} onValueChange={setSelectedTech}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select technician" />
                                </SelectTrigger>
                                <SelectContent>
                                    {technicians.length > 0 ? (
                                        technicians.filter((tech) => tech.is_verified && tech.is_active).map((tech) => (
                                            <SelectItem key={tech.id} value={tech.id}>
                                                {tech.full_name || "Unknown"} ({tech.service_area || "No Service Area"}) {tech.pincode || "No Pincode"}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            No technicians available for pincode {bookingPincode}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mapUrl">Map URL</Label>
                        <Input
                            id="mapUrl"
                            placeholder="https://maps.google.com/..."
                            value={mapUrl}
                            onChange={(e) => setMapUrl(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button onClick={handleAssign} disabled={submitting || loading}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
