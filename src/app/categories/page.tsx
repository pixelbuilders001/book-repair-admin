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
    Plus,
    Settings2,
    Pencil,
    Trash2,
    ChevronRight
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Types for API data
interface Issue {
    id: string;
    category_id: string;
    title: string;
    description?: string | null;
    icon_url?: string;
    estimated_price?: number;
    is_active: boolean;
    sort_order?: number;
    created_at?: string;
    base_min_fee?: number;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    icon_url?: string;
    description?: string;
    is_active: boolean;
    sort_order?: number;
    created_at?: string;
    base_inspection_fee?: number;
    issues: Issue[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
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
                const catRes = await fetch("https://upoafhtidiwsihwijwex.supabase.co/rest/v1/categories", {
                    headers: commonHeaders,
                });
                const catData: Omit<Category, "issues">[] = await catRes.json();
                const categoriesWithIssues: Category[] = await Promise.all(
                    catData.map(async (cat) => {
                        const issuesRes = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/issues?category_id=eq.${cat.id}&is_active=eq.true`, {
                            headers: commonHeaders,
                        });
                        const issuesData: Issue[] = await issuesRes.json();
                        return {
                            ...cat,
                            issues: issuesData,
                        };
                    })
                );
                setCategories(categoriesWithIssues);
            } catch {
                setError("Failed to fetch data");
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
                    <h1 className="text-3xl font-bold tracking-tight">Service Categories</h1>
                    <p className="text-muted-foreground">
                        Manage service types, base fees, and specific repair issues with pricing.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="grid gap-6">
                {categories.map((cat) => (
                    <Card key={cat.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl">{cat.name}</CardTitle>
                                    <Badge variant={cat.is_active ? "default" : "secondary"}>
                                        {cat.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    {cat.description}
                                    {typeof cat.base_inspection_fee !== "undefined" && (
                                        <span className="block mt-1">Base Inspection Fee: <span className="font-bold text-primary">₹{cat.base_inspection_fee}</span></span>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" /> Edit</Button>
                                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[300px] pl-4">Issue Name</TableHead>
                                            <TableHead className="text-right">Min Price</TableHead>
                                            <TableHead className="text-right">Max Price</TableHead>
                                            <TableHead className="text-right pr-4">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cat.issues.length > 0 ? cat.issues.map((issue) => (
                                            <TableRow key={issue.id}>
                                                <TableCell className="pl-4 font-medium">{issue.title}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">₹{issue.base_min_fee ?? issue.estimated_price ?? "-"}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">₹{issue.estimated_price ?? "-"}</TableCell>
                                                <TableCell className="text-right pr-4">
                                                    <Button variant="ghost" size="sm">Edit Price</Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground">No issues found</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell colSpan={4} className="p-0">
                                                <Button variant="ghost" className="w-full h-10 rounded-none border-t border-dashed gap-2 text-muted-foreground hover:text-primary">
                                                    <Plus className="h-4 w-4" /> Add Issue to {cat.name}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
