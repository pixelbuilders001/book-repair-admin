"use client";

import {
    referrals
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
    Gift,
    Plus,
    Copy,
    TrendingUp,
    Users
} from "lucide-react";

export default function ReferralsPage() {
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
                        <div className="text-2xl font-bold">160</div>
                        <p className="text-xs text-muted-foreground">12.5% of total bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Referral Codes</CardTitle>
                        <Copy className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">428</div>
                        <p className="text-xs text-muted-foreground">+18 new this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Rewards Credited</CardTitle>
                        <Gift className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹2,400</div>
                        <p className="text-xs text-muted-foreground">Paid into user wallets</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Referral Codes Performance</CardTitle>
                    <CardDescription>
                        High-performing codes and their impact on platform growth.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Code</TableHead>
                                <TableHead>Owner / Mobile</TableHead>
                                <TableHead className="text-center">Total Signups</TableHead>
                                <TableHead className="text-center">Bookings</TableHead>
                                <TableHead className="text-right">Rewards Earned</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {referrals.map((ref) => (
                                <TableRow key={ref.code}>
                                    <TableCell className="pl-6 font-mono font-bold text-primary">{ref.code}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{ref.ownerName}</span>
                                            <span className="text-xs text-muted-foreground">{ref.owner}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{ref.usageCount}</TableCell>
                                    <TableCell className="text-center">{ref.bookingsCount}</TableCell>
                                    <TableCell className="text-right font-medium">{ref.totalRewards}</TableCell>
                                    <TableCell>
                                        <Badge variant={ref.status === "Active" ? "default" : "secondary"}>
                                            {ref.status}
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
