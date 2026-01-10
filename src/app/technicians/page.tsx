"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TechnicianApi {
    id: string;
    full_name: string;
    mobile: string;
    current_address: string;
    aadhaar_number: string;
    aadhaar_front_url?: string | null;
    aadhaar_back_url?: string | null;
    selfie_url?: string | null;
    primary_skill: string;
    total_experience: number;
    verification_status?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    login_code?: string;
    is_verified?: boolean;
    code_active?: boolean;
    remark?: string | null;
    other_skills?: string[] | null;
    service_area?: string | null;
    pincode?: string | null;
}

// Helper function to format date
function formatDate(dateString?: string | null) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export default function TechniciansPage() {
    const [technicians, setTechnicians] = useState<TechnicianApi[]>([]);
    const [imageModal, setImageModal] = useState<{ url: string; label: string } | null>(null);
    const [verifyModal, setVerifyModal] = useState<{ tech: TechnicianApi; status: string } | null>(null);

    useEffect(() => {
        const commonHeaders = {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
        };
        async function fetchData() {
            try {
                const res = await fetch("https://upoafhtidiwsihwijwex.supabase.co/rest/v1/technicians", {
                    headers: commonHeaders,
                });
                const data: TechnicianApi[] = await res.json();
                setTechnicians(data);
            } catch {
                console.error("Failed to fetch technicians");
            }
        }
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Technicians</h1>
                    <p className="text-muted-foreground">
                        Manage technician onboarding, profiles, and performance.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Onboarding Requests</Button>
                    <Button>Add Technician</Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Mobile</TableHead>
                                    <TableHead>Current Address</TableHead>
                                    <TableHead>Aadhaar Number</TableHead>
                                    <TableHead>Aadhaar Front</TableHead>
                                    <TableHead>Aadhaar Back</TableHead>
                                    <TableHead>Selfie</TableHead>
                                    <TableHead>Primary Skill</TableHead>
                                    <TableHead>Other Skills</TableHead>
                                    <TableHead>Total Experience</TableHead>
                                    <TableHead>Verification Status</TableHead>
                                    <TableHead>Is Active</TableHead>
                                    <TableHead>Is Verified</TableHead>
                                    <TableHead>Code Active</TableHead>
                                    <TableHead>Login Code</TableHead>
                                    <TableHead>Remark</TableHead>
                                    <TableHead>Service Area</TableHead>
                                    <TableHead>Pincode</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Updated At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {technicians.map((tech) => (
                                    <TableRow key={tech.id}>
                                        <TableCell className="pl-6">{tech.id}</TableCell>
                                        <TableCell>{tech.full_name}</TableCell>
                                        <TableCell>{tech.mobile}</TableCell>
                                        <TableCell>{tech.current_address}</TableCell>
                                        <TableCell>{tech.aadhaar_number}</TableCell>
                                        <TableCell>
                                            {tech.aadhaar_front_url ? (
                                                <Button size="sm" variant="outline" onClick={() => setImageModal({ url: tech.aadhaar_front_url!, label: "Aadhaar Front" })}>Show</Button>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {tech.aadhaar_back_url ? (
                                                <Button size="sm" variant="outline" onClick={() => setImageModal({ url: tech.aadhaar_back_url!, label: "Aadhaar Back" })}>Show</Button>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {tech.selfie_url ? (
                                                <Button size="sm" variant="outline" onClick={() => setImageModal({ url: tech.selfie_url!, label: "Selfie" })}>Show</Button>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell>{tech.primary_skill}</TableCell>
                                        <TableCell>{tech.other_skills ? tech.other_skills.join(", ") : "-"}</TableCell>
                                        <TableCell>{tech.total_experience}</TableCell>
                                        <TableCell>{tech.verification_status ?? "pending"}</TableCell>
                                        <TableCell>{tech.is_active ? "Yes" : "No"}</TableCell>
                                        <TableCell>{tech.is_verified ? "Yes" : "No"}</TableCell>
                                        <TableCell>{tech.code_active ? "Yes" : "No"}</TableCell>
                                        <TableCell>{tech.login_code ?? "-"}</TableCell>
                                        <TableCell>{tech.remark ?? "-"}</TableCell>
                                        <TableCell>{tech.service_area ?? "-"}</TableCell>
                                        <TableCell>{tech.pincode ?? "-"}</TableCell>
                                        <TableCell>{formatDate(tech.created_at)}</TableCell>
                                        <TableCell>{formatDate(tech.updated_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 items-center">
                                                <select
                                                    className="border rounded px-2 py-1 text-sm"
                                                    value={tech.is_active ? "active" : "inactive"}
                                                    onChange={e => {
                                                        // For now, just update UI state locally. Replace with API call if needed.
                                                        setTechnicians(prev => prev.map(t => t.id === tech.id ? { ...t, is_active: e.target.value === "active" } : t));
                                                    }}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                                <Button size="sm" variant="default" onClick={() => setVerifyModal({ tech, status: tech.verification_status ?? "pending" })}>
                                                    Verify
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {/* Image Modal */}
            <Dialog open={!!imageModal} onOpenChange={() => setImageModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{imageModal?.label}</DialogTitle>
                    </DialogHeader>
                    {imageModal?.url && (
                        <Image src={imageModal.url} alt={imageModal.label} width={400} height={300} className="w-full h-auto rounded" />
                    )}
                </DialogContent>
            </Dialog>
            {/* Verify Modal */}
            <Dialog open={!!verifyModal} onOpenChange={() => setVerifyModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verify Technician</DialogTitle>
                    </DialogHeader>
                    {verifyModal?.tech && (
                        <form
                            onSubmit={async e => {
                                e.preventDefault();
                                const is_verified = verifyModal.status === "approved";
                                try {
                                    const res = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/technicians?id=eq.${verifyModal.tech.id}`, {
                                        method: "PATCH",
                                        headers: {
                                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                                            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ is_verified }),
                                    });
                                    if (!res.ok) throw new Error("Failed to update verification status");
                                    setTechnicians(prev => prev.map(t => t.id === verifyModal.tech.id ? { ...t, is_verified } : t));
                                } catch {
                                    // Optionally show error
                                } finally {
                                    setVerifyModal(null);
                                }
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <div className="font-medium mb-1">{verifyModal.tech.full_name}</div>
                                <div className="text-xs text-muted-foreground mb-2">ID: {verifyModal.tech.id}</div>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Status</label>
                                <select
                                    className="w-full border rounded px-2 py-1"
                                    value={verifyModal.status}
                                    onChange={e => setVerifyModal(v => v ? { ...v, status: e.target.value } : v)}
                                    required
                                >
                                    <option value="approved">Approve</option>
                                    <option value="rejected">Reject</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setVerifyModal(null)}>Cancel</Button>
                                <Button type="submit" variant="default">Submit</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
