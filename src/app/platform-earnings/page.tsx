"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

interface PlatformEarning {
    id: string;
    booking_id: string;
    technician_id: string;
    earning_type: string;
    gross_amount: number;
    commission_amount: number;
    technician_amount: number;
    commission_percentage: number;
    payment_method?: string | null;
    payment_status?: string | null;
    created_at?: string | null;
}

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

export default function PlatformEarningsPage() {
    const [earnings, setEarnings] = useState<PlatformEarning[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEarnings() {
            setLoading(true);
            try {
                const res = await fetch("https://upoafhtidiwsihwijwex.supabase.co/rest/v1/platform_earnings", {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data: PlatformEarning[] = await res.json();
                setEarnings(data);
            } catch {
                setEarnings([]);
            } finally {
                setLoading(false);
            }
        }
        fetchEarnings();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Earnings</h1>
                    <p className="text-muted-foreground">
                        All platform earnings, commissions, and technician splits.
                    </p>
                </div>
            </div>
            <Card>
             
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">ID</TableHead>
                                        <TableHead>Booking ID</TableHead>
                                        <TableHead>Technician ID</TableHead>
                                        <TableHead>Earning Type</TableHead>
                                        <TableHead>Gross Amount</TableHead>
                                        <TableHead>Commission Amount</TableHead>
                                        <TableHead>Technician Amount</TableHead>
                                        <TableHead>Commission %</TableHead>
                                        <TableHead>Payment Method</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {earnings.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="pl-6 font-mono text-xs">{row.id}</TableCell>
                                            <TableCell>{row.booking_id}</TableCell>
                                            <TableCell>{row.technician_id}</TableCell>
                                            <TableCell>{row.earning_type}</TableCell>
                                            <TableCell>₹{Number(row.gross_amount).toFixed(2)}</TableCell>
                                            <TableCell>₹{Number(row.commission_amount).toFixed(2)}</TableCell>
                                            <TableCell>₹{Number(row.technician_amount).toFixed(2)}</TableCell>
                                            <TableCell>{Number(row.commission_percentage).toFixed(2)}%</TableCell>
                                            <TableCell>{row.payment_method || "-"}</TableCell>
                                            <TableCell>{row.payment_status || "-"}</TableCell>
                                            <TableCell>{formatDate(row.created_at)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {earnings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                No platform earnings found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
