"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DatabaseBooking } from "@/lib/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
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
    Download,
    Loader2
} from "lucide-react";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<DatabaseBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('booking')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatAmount = (amount: number | null) => {
        if (!amount) return '₹0';
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor all service requests.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchBookings}>
                        Refresh
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button>Create Booking</Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">ID</TableHead>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Mobile</TableHead>
                                        <TableHead>Full Address</TableHead>
                                        <TableHead>Landmark</TableHead>
                                        <TableHead>Category ID</TableHead>
                                        <TableHead>Issue ID</TableHead>
                                        <TableHead>Preferred Time Slot</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Media</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Pincode</TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Note</TableHead>
                                        <TableHead>Referral Code</TableHead>
                                        <TableHead>Total Estimated Price</TableHead>
                                        <TableHead>Net Inspection Fee</TableHead>
                                        <TableHead>Final Amount Paid</TableHead>
                                        <TableHead>Technician ID</TableHead>
                                        <TableHead>Assigned At</TableHead>
                                        <TableHead>Accepted At</TableHead>
                                        <TableHead>Completed At</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead>Map URL</TableHead>
                                        <TableHead>Completion Code</TableHead>
                                        <TableHead>Completion Code Used</TableHead>
                                        <TableHead>Final Amount To Be Paid</TableHead>
                                        <TableHead>Payment Method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="pl-6 font-mono text-xs">{booking.id}</TableCell>
                                            <TableCell>{booking.user_name}</TableCell>
                                            <TableCell>{booking.mobile_number}</TableCell>
                                            <TableCell className="max-w-xs truncate">{booking.full_address}</TableCell>
                                            <TableCell>{booking.landmark ?? "-"}</TableCell>
                                            <TableCell>{booking.category_id}</TableCell>
                                            <TableCell>{booking.issue_id}</TableCell>
                                            <TableCell>{booking.preferred_time_slot}</TableCell>
                                            <TableCell>{booking.status}</TableCell>
                                            <TableCell>
                                                {booking.media_url ? (
                                                    <a href={booking.media_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">View</a>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell>{formatDate(booking.created_at)}</TableCell>
                                            <TableCell>{booking.pincode}</TableCell>
                                            <TableCell>{booking.order_id}</TableCell>
                                            <TableCell>{booking.note ?? "-"}</TableCell>
                                            <TableCell>{booking.referral_code ?? "-"}</TableCell>
                                            <TableCell>{formatAmount(booking.total_estimated_price)}</TableCell>
                                            <TableCell>{formatAmount(booking.net_inspection_fee)}</TableCell>
                                            <TableCell>{formatAmount(booking.final_amount_paid)}</TableCell>
                                            <TableCell>{booking.technician_id ?? "-"}</TableCell>
                                            <TableCell>{booking.assigned_at ? formatDate(booking.assigned_at) : "-"}</TableCell>
                                            <TableCell>{booking.accepted_at ? formatDate(booking.accepted_at) : "-"}</TableCell>
                                            <TableCell>{booking.completed_at ? formatDate(booking.completed_at) : "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant={booking.payment_status === 'paid' ? 'default' : 'outline'}>
                                                    {booking.payment_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {booking.map_url ? (
                                                    <a href={booking.map_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Map</a>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell>{booking.completion_code ?? "-"}</TableCell>
                                            <TableCell>{booking.completion_code_used ? "Yes" : "No"}</TableCell>
                                            <TableCell>{formatAmount(booking.final_amount_to_be_paid ? Number(booking.final_amount_to_be_paid) : null)}</TableCell>
                                            <TableCell>{booking.payment_method ?? "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                    {bookings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={28} className="h-24 text-center">
                                                No bookings found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {bookings.length} bookings
                </p>
            </div>
        </div>
    );
}
