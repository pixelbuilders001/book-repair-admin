"use client";

import { getWallets } from "./actions";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    // ... inside component
    useEffect(() => {
        async function fetchWallets() {
            setLoading(true);
            try {
                const { data, totalCount } = await getWallets(currentPage, pageSize);
                setWallets(data || []);
                setTotalCount(totalCount || 0);
            } catch {
                setWallets([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }
        fetchWallets();
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
                        <>
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
                            <div className="flex items-center justify-between border-t p-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {wallets.length} of {totalCount} wallets
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
