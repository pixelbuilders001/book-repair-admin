"use client";

import {
    walletUsers,
    walletTransactions
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
import { Input } from "@/components/ui/input";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    ArrowUpDown,
    History
} from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function WalletsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = walletUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User & Tech Wallets</h1>
                    <p className="text-muted-foreground">
                        Manage internal credits, transaction history, and manual adjustments.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Wallet Settings</Button>
                    <Button>Bulk Credit</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Wallet Balances List */}
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Wallet Balances</CardTitle>
                                <CardDescription>Current balances for all mobile numbers.</CardDescription>
                            </div>
                            <div className="relative w-48">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8 h-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">User / Mobile</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                    <TableHead className="text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.mobile}>
                                        <TableCell className="pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.mobile}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">{user.balance}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                                                        <ArrowUpDown size={14} /> Adjust
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Manual Wallet Adjustment</DialogTitle>
                                                        <DialogDescription>
                                                            Modify balance for {user.name} ({user.mobile})
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="amount" className="text-right">Amount</Label>
                                                            <Input id="amount" placeholder="₹0.00" className="col-span-3" />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="reason" className="text-right">Reason</Label>
                                                            <Input id="reason" placeholder="e.g. Compensation" className="col-span-3" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" type="button" onClick={() => { }}>Debit</Button>
                                                        <Button type="submit">Credit Amount</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Global Transaction History */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" /> Recent Transactions
                        </CardTitle>
                        <CardDescription>Global ledger across all users.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Mobile</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right pr-6">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {walletTransactions.map((txn) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{txn.mobile}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">{txn.date}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs">{txn.reason}</span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className={`flex items-center justify-end gap-1 font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {txn.type === 'Credit' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                                {txn.amount}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
