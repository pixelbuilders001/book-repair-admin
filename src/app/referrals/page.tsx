"use client";

import { getReferralBookings } from "./actions";

import { useEffect, useState } from "react";
import { referrals } from "@/lib/mock-data";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Gift,
    Plus,
    Copy,
    TrendingUp,
    Users
} from "lucide-react";

// Define the ReferralBooking type
interface ReferralBooking {
    id: string;
    referrer_mobile: string;
    referee_mobile: string;
    referee_booking_id: string;
    reward_amount: number | null;
    reward_status: string | null;
    created_at?: string | null;
    earned_at?: string | null;
    used_at?: string | null;
}

export default function ReferralsPage() {
    const [referralBookings, setReferralBookings] = useState<ReferralBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    // ... inside component
    useEffect(() => {
        async function fetchReferralBookings() {
            setLoading(true);
            try {
                const { data, totalCount } = await getReferralBookings(currentPage, pageSize);
                setReferralBookings(data || []);
                setTotalCount(totalCount || 0);
            } catch {
                setReferralBookings([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }
        fetchReferralBookings();
    }, [currentPage]);

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

    const totalReferralBookings = referralBookings.length;
    const totalRewardsCredited = referralBookings.reduce((sum, ref) => sum + (ref.reward_amount ?? 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Referral System</h1>
                    <p className="text-muted-foreground">
                        Monitor referral codes, viral growth, and reward payouts.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Campaign Code
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referral Bookings</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReferralBookings}</div>
                        <p className="text-xs text-muted-foreground">{totalReferralBookings > 0 ? `${((totalReferralBookings / 160) * 100).toFixed(1)}% of total bookings` : "No data"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Rewards Credited</CardTitle>
                        <Gift className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRewardsCredited}</div>
                        <p className="text-xs text-muted-foreground">Paid into user wallets</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Referral Bookings</CardTitle>
                    <CardDescription>
                        All referral bookings and their reward status.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">Loading...</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">ID</TableHead>
                                            <TableHead>Referrer Mobile</TableHead>
                                            <TableHead>Referee Mobile</TableHead>
                                            <TableHead>Referee Booking ID</TableHead>
                                            <TableHead>Reward Amount</TableHead>
                                            <TableHead>Reward Status</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead>Earned At</TableHead>
                                            <TableHead>Used At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {referralBookings.map((ref) => (
                                            <TableRow key={ref.id}>
                                                <TableCell className="pl-6 font-mono text-xs">{ref.id}</TableCell>
                                                <TableCell>{ref.referrer_mobile}</TableCell>
                                                <TableCell>{ref.referee_mobile}</TableCell>
                                                <TableCell className="font-mono text-xs">{ref.referee_booking_id}</TableCell>
                                                <TableCell>₹{ref.reward_amount ?? 0}</TableCell>
                                                <TableCell>{ref.reward_status ?? "pending"}</TableCell>
                                                <TableCell>{formatDate(ref.created_at)}</TableCell>
                                                <TableCell>{formatDate(ref.earned_at)}</TableCell>
                                                <TableCell>{formatDate(ref.used_at)}</TableCell>
                                            </TableRow>
                                        ))}
                                        {referralBookings.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-24 text-center">
                                                    No referral bookings found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between border-t p-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {referralBookings.length} of {totalCount} records
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1 || loading}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm font-medium">
                                        Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage * pageSize >= totalCount || loading}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
