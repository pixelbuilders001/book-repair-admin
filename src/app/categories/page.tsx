"use client";

import {
    categoryDetails
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

export default function CategoriesPage() {
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
                {categoryDetails.map((cat) => (
                    <Card key={cat.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl">{cat.name}</CardTitle>
                                    <Badge variant={cat.status === "Active" ? "default" : "secondary"}>
                                        {cat.status}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Base Inspection Fee: <span className="font-bold text-primary">₹{cat.baseFee}</span>
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
                                        {cat.issues.map((issue) => (
                                            <TableRow key={issue.id}>
                                                <TableCell className="pl-4 font-medium">{issue.name}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">₹{issue.minPrice}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">₹{issue.maxPrice}</TableCell>
                                                <TableCell className="text-right pr-4">
                                                    <Button variant="ghost" size="sm">Edit Price</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
