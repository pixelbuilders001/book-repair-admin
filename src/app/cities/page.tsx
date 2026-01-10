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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


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
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        city_name: "",
        is_active: true,
        inspection_multiplier: 1,
        repair_multiplier: 1,
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddCity = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            const payload = {
                city_name: form.city_name,
                is_active: form.is_active,
                created_at: new Date().toISOString(),
                inspection_multiplier: Number(form.inspection_multiplier),
                repair_multiplier: Number(form.repair_multiplier),
            };
            const res = await fetch("https://upoafhtidiwsihwijwex.supabase.co/rest/v1/serviceable_cities", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to add city");
            setModalOpen(false);
            setForm({ city_name: "", is_active: true, inspection_multiplier: 1, repair_multiplier: 1 });
            // Optionally, refresh cities from API or optimistically add
            setCities((prev) => [...prev, { ...payload, id: "temp-" + Date.now() }]);
        } catch (err: any) {
            setFormError(err.message || "Failed to add city");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (cityId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/serviceable_cities?id=eq.${cityId}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_active: !currentStatus }),
            });
            if (!res.ok) throw new Error("Failed to update city status");
            setCities((prev) => prev.map(city => city.id === cityId ? { ...city, is_active: !currentStatus } : city));
        } catch (err) {
            // Optionally show error to user
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cities & Serviceability</h1>
                    <p className="text-muted-foreground">Enable/disable cities and set local pricing multipliers based on operational costs.
                    </p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add New City
                </Button>
            </div>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New City</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCity} className="space-y-4">
                        <div>
                            <Label htmlFor="city_name">City Name</Label>
                            <Input id="city_name" name="city_name" value={form.city_name} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="inspection_multiplier">Inspection Multiplier</Label>
                            <Input id="inspection_multiplier" name="inspection_multiplier" type="number" min="1" step="0.01" value={form.inspection_multiplier} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="repair_multiplier">Repair Multiplier</Label>
                            <Input id="repair_multiplier" name="repair_multiplier" type="number" min="1" step="0.01" value={form.repair_multiplier} onChange={handleInputChange} required />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="is_active">Active</Label>
                            <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleInputChange} />
                        </div>
                        {formError && <div className="text-red-500 text-sm">{formError}</div>}
                        <DialogFooter>
                            <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add City"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card>
             
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
                                        <Switch checked={city.is_active} onCheckedChange={() => handleToggleActive(city.id, city.is_active)} />
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