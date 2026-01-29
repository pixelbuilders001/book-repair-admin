"use client";

import { useState, useEffect } from "react";
import { getBookings } from "./actions"; // Import server action
import { logout } from "../auth/actions"; // Import logout action
import { DatabaseBooking } from "@/lib/types";
import {
    Card,
    CardContent,
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
    Loader2,
    LogOut
} from "lucide-react";

import { AssignTechnicianModal } from "@/components/bookings/AssignTechnicianModal";
import { UserInfoModal } from "@/components/bookings/UserInfoModal";
import { Info } from "lucide-react";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<DatabaseBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    console.log(bookings);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            setLoading(true);
            const { data, error } = await getBookings();

            if (error) throw new Error(error);
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

    const formatStatus = (status: string) => {
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleAssignClick = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setIsAssignModalOpen(true);
    };

    const handleUserInfoClick = (userId: string) => {
        setSelectedUserId(userId);
        setIsUserInfoModalOpen(true);
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
                    {/* <Button variant="outline" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button> */}
                    <Button variant="outline" onClick={fetchBookings}>
                        Refresh
                    </Button>
                    {/* <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button>Create Booking</Button> */}
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
                                        <TableHead>User Info</TableHead>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Mobile</TableHead>
                                        <TableHead>Full Address</TableHead>
                                        <TableHead>Landmark</TableHead>
                                        <TableHead className="min-w-[250px]">Issue / Category</TableHead>
                                        <TableHead>Preferred Time/Date slot</TableHead>
                                        <TableHead>Media</TableHead>
                                        <TableHead>Secondary Media</TableHead>
                                        <TableHead>Created At</TableHead>
                                        {/* <TableHead>Pincode</TableHead> */}
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Note</TableHead>
                                        <TableHead>Referral Code</TableHead>
                                        <TableHead>Total Estimated Price</TableHead>
                                        <TableHead>Net Inspection Fee</TableHead>
                                        <TableHead>Final Amount Paid</TableHead>
                                        <TableHead>Technician</TableHead>
                                        <TableHead>Assigned At</TableHead>
                                        <TableHead>Accepted At</TableHead>
                                        <TableHead>Completed At</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead>Map URL</TableHead>
                                        <TableHead>Completion Code</TableHead>
                                        <TableHead>Completion Code Used</TableHead>
                                        <TableHead>Final Amount To Be Paid</TableHead>
                                        <TableHead>Payment Method</TableHead>
                                        <TableHead>wallet used</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="pl-6 font-mono text-xs">{booking.id}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => handleUserInfoClick(booking.user_id)}>
                                                    <Info className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>{booking.user_name}</TableCell>
                                            <TableCell>{formatStatus(booking.status)}</TableCell>
                                            <TableCell>
                                                {(booking.status === 'pending' || booking.status === 'job_rejected') && (
                                                    <Button size="sm" onClick={() => handleAssignClick(booking.id)}>
                                                        Assign Tech
                                                    </Button>
                                                )}
                                                {booking.status === 'assigned' && (
                                                    <Badge variant="secondary">Assigned</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{booking.mobile_number}</TableCell>
                                            <TableCell className="max-w-xs truncate">{booking.full_address},{booking.pincode}</TableCell>
                                            <TableCell>{booking.landmark ?? "-"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {booking.issue?.icon_url && (
                                                        <img
                                                            src={booking.issue.icon_url}
                                                            alt={booking.issue.name}
                                                            className="w-10 h-10 rounded-md object-cover"
                                                        />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{booking.issue?.name || 'Unknown Issue'}</span>
                                                        <span className="text-xs text-muted-foreground">{booking.category?.name || 'Unknown Category'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><h4 className="w-20">{booking.preferred_time_slot}</h4>{booking.preferred_service_date}</TableCell>
                                            <TableCell>
                                                {booking.media_url ? (
                                                    <a href={booking.media_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">View</a>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {booking.secondary_media_url ? (
                                                    <a href={booking.secondary_media_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">View</a>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell>{formatDate(booking.created_at)}</TableCell>
                                            {/* <TableCell>{booking.pincode}</TableCell> */}
                                            <TableCell>{booking.order_id}</TableCell>
                                            <TableCell>{booking.note ?? "-"}</TableCell>
                                            <TableCell>{booking.referral_code ?? "-"}</TableCell>
                                            <TableCell>{formatAmount(booking.total_estimated_price)}</TableCell>
                                            <TableCell>{formatAmount(booking.net_inspection_fee)}</TableCell>
                                            <TableCell>{formatAmount(booking.final_amount_paid)}</TableCell>
                                            <TableCell>{booking.technician?.name || booking.technician_id || "-"}</TableCell>
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
                                            <TableCell>{formatAmount(booking.wallet_used_amount ? Number(booking.wallet_used_amount) : null)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {bookings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={29} className="h-24 text-center">
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

            {selectedBookingId && (
                <AssignTechnicianModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    bookingId={selectedBookingId}
                    onSuccess={() => {
                        fetchBookings();
                        setIsAssignModalOpen(false);
                    }}
                />
            )}

            <UserInfoModal
                isOpen={isUserInfoModalOpen}
                onClose={() => setIsUserInfoModalOpen(false)}
                userId={selectedUserId}
            />
        </div>
    );
}
