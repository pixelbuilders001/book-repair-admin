"use client";

import React, { useEffect, useState } from "react";
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
    MapPin,
    Plus,
    Activity
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ServiceableCity {
    id: string;
    city_name: string;
    is_active: boolean;
    created_at?: string;
    inspection_multiplier: number;
    repair_multiplier: number;
}

export default function CitiesPage() {
    const [cities, setCities] = useState<ServiceableCity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const commonHeaders = {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
        };
        async function fetchData() {
            try {
                const res = await fetch("https://upoafhtidiwsihwijwex.supabase.co/rest/v1/serviceable_cities", {
                    headers: commonHeaders,
                });
                const data: ServiceableCity[] = await res.json();
                setCities(data);
            } catch {
                setError("Failed to fetch cities");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cities & Serviceability</h1>
                    <p className="text-muted-foreground">
                        Enable/disable cities and set local pricing multipliers based on operational costs.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New City
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Active Cities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Multiplier</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.12x</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Performing City</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">Patna</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Underperforming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">Indore</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Serviceable Cities Ledger</CardTitle>
                    <CardDescription>
                        Manage regional presence and operational status.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">City Name</TableHead>
                                <TableHead>Inspection Multiplier</TableHead>
                                <TableHead>Repair Multiplier</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Enable / Disable</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cities.map((city) => (
                                <TableRow key={city.id}>
                                    <TableCell className="pl-6 font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {city.city_name}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold">{city.inspection_multiplier}x</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold">{city.repair_multiplier}x</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={city.is_active ? "default" : "secondary"}>
                                            {city.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Switch checked={city.is_active} />
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
