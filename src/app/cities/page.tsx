"use client";

import {
    cityConfigs
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
    MapPin,
    Plus,
    Edit3,
    Power,
    TrendingUp,
    Activity
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function CitiesPage() {
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
                                <TableHead>Price Multiplier</TableHead>
                                <TableHead className="text-center">Total Bookings</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Enable / Disable</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cityConfigs.map((city) => (
                                <TableRow key={city.name}>
                                    <TableCell className="pl-6 font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {city.name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{city.multiplier}x</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6"><Edit3 size={12} /></Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{city.bookings}</TableCell>
                                    <TableCell>
                                        <Badge variant={city.status === "Active" ? "default" : "secondary"}>
                                            {city.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Switch
                                            checked={city.status === "Active"}
                                        // onCheckedChange would go here
                                        />
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
