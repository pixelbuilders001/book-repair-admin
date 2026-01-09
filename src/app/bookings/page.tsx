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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
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
    Search,
    Download,
    Calendar,
    Loader2
} from "lucide-react";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<DatabaseBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.mobile_number.includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

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
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, mobile, or ID..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                        }}>
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Booking ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Mobile</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Pincode</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="pl-6 font-medium font-mono text-xs">
                                            {booking.id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell>{booking.user_name}</TableCell>
                                        <TableCell>{booking.mobile_number}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {booking.full_address}
                                        </TableCell>
                                        <TableCell>{booking.pincode}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {formatDate(booking.created_at)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {formatAmount(booking.final_amount_paid || booking.total_estimated_price)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={booking.payment_status === 'paid' ? 'default' : 'outline'}>
                                                {booking.payment_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
            </div>
        </div>
    );
}
