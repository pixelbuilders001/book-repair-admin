"use client";

import {
    payments
} from "@/lib/mock-data";
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
    Download,
    TrendingUp,
    DollarSign,
    ArrowUpRight
} from "lucide-react";

export default function PaymentsPage() {
    const totalRevenue = payments.reduce((acc, p) => acc + p.totalAmount, 0);
    const totalCommission = payments.reduce((acc, p) => acc + p.platformComm, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments & Earnings</h1>
                    <p className="text-muted-foreground">
                        Track all completed jobs, technician payouts, and platform revenue.
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Earnings (CSV)
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue Managed</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+₹12,400 from yesterday</p>
                    </CardContent>
                </Card>
                <Card className="border-emerald-100 bg-emerald-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-800">Platform Commission</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">₹{totalCommission.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600">Avg. 15% per booking</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹2,450</div>
                        <p className="text-xs text-muted-foreground">To be settled by Monday</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Earnings Table</CardTitle>
                    <CardDescription>
                        Detailed breakdown of income and technician splits for each booking.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Booking ID</TableHead>
                                <TableHead>Technician</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Total Amount</TableHead>
                                <TableHead className="text-right">Tech Earnings</TableHead>
                                <TableHead className="text-right">Platform Comm.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.bookingId}>
                                    <TableCell className="pl-6 font-medium">{payment.bookingId}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{payment.techName}</span>
                                            <span className="text-xs text-muted-foreground">{payment.techId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{payment.date}</TableCell>
                                    <TableCell className="text-right font-medium">₹{payment.totalAmount}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">₹{payment.techEarning}</TableCell>
                                    <TableCell className="text-right font-semibold text-emerald-600">₹{payment.platformComm}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === "Paid" ? "default" : "outline"}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
