"use client";

import { useEffect, useState } from "react";
import { getTechnicianStats } from "./actions";
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

interface TechnicianStat {
    id: string;
    technician_id: string;
    full_name: string;
    total_jobs_completed: number;
    total_jobs_assigned: number;
    total_jobs_cancelled: number;
    today_earnings: number;
    lifetime_earnings: number;
    average_rating: number;
    total_ratings: number;
    service_area?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    other_skills?: string[] | null;
}

export default function TechnicianStatsPage() {
    const [stats, setStats] = useState<TechnicianStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    // ... inside component
    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const { data, totalCount } = await getTechnicianStats(currentPage, pageSize);
                setStats(data || []);
                setTotalCount(totalCount || 0);
            } catch {
                setStats([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
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
                    <h1 className="text-3xl font-bold tracking-tight">Technician Stats</h1>
                    <p className="text-muted-foreground">
                        View and analyze technician performance and earnings.
                    </p>
                </div>
            </div>
            <Card>

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
                                            <TableHead className="pl-6">Full Name</TableHead>

                                            <TableHead>Technician ID</TableHead>
                                            <TableHead>Total Jobs Completed</TableHead>
                                            <TableHead>Total Jobs Assigned</TableHead>
                                            <TableHead>Total Jobs Cancelled</TableHead>
                                            <TableHead>Today's Earnings</TableHead>
                                            <TableHead>Lifetime Earnings</TableHead>
                                            <TableHead>Average Rating</TableHead>
                                            <TableHead>Total Ratings</TableHead>
                                            <TableHead>Service Area</TableHead>
                                            <TableHead>Other Skills</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead>Updated At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats.map((stat) => (
                                            <TableRow key={stat.id}>
                                                <TableCell className="pl-6 font-mono text-xs">{stat.id}</TableCell>
                                                <TableCell>{stat?.full_name ? stat.full_name : "-"}</TableCell>
                                                <TableCell>{stat.technician_id}</TableCell>
                                                <TableCell>{stat.total_jobs_completed}</TableCell>
                                                <TableCell>{stat.total_jobs_assigned}</TableCell>
                                                <TableCell>{stat.total_jobs_cancelled}</TableCell>
                                                <TableCell>₹{stat.today_earnings.toFixed(2)}</TableCell>
                                                <TableCell>₹{stat.lifetime_earnings.toFixed(2)}</TableCell>
                                                <TableCell>{stat.average_rating.toFixed(1)}</TableCell>
                                                <TableCell>{stat.total_ratings}</TableCell>
                                                <TableCell>{stat.service_area ?? "-"}</TableCell>
                                                <TableCell>{stat.other_skills ? stat.other_skills.join(", ") : "-"}</TableCell>
                                                <TableCell>{formatDate(stat.created_at)}</TableCell>
                                                <TableCell>{formatDate(stat.updated_at)}</TableCell>
                                            </TableRow>
                                        ))}
                                        {stats.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="h-24 text-center">
                                                    No technician stats found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between border-t p-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {stats.length} of {totalCount} records
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
