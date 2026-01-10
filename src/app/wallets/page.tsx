"use client";

import { useEffect, useState } from "react";
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

// Define the Wallet type
interface Wallet {
    id: string;
    mobile_number: string;
    balance: number;
    created_at?: string;
    updated_at?: string;
}

export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWallets() {
            setLoading(true);
            try {
                const res = await fetch("https://upoafhtidiwsihwijwex.supabase.co/rest/v1/wallets", {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data: Wallet[] = await res.json();
                setWallets(data);
            } catch {
                setWallets([]);
            } finally {
                setLoading(false);
            }
        }
        fetchWallets();
    }, []);

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
                    <p className="text-muted-foreground">
                        View and manage user wallet balances.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Wallets</CardTitle>
                    <CardDescription>
                        All user wallets and balances.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">ID</TableHead>
                                        <TableHead>Mobile Number</TableHead>
                                        <TableHead>Balance</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Updated At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {wallets.map((wallet) => (
                                        <TableRow key={wallet.id}>
                                            <TableCell className="pl-6 font-mono text-xs">{wallet.id}</TableCell>
                                            <TableCell>{wallet.mobile_number}</TableCell>
                                            <TableCell>₹{wallet.balance.toFixed(2)}</TableCell>
                                            <TableCell>{formatDate(wallet.created_at)}</TableCell>
                                            <TableCell>{formatDate(wallet.updated_at)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {wallets.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No wallets found.
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
