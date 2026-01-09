"use client";

import { useState } from "react";
import {
    technicians,
    techStatuses,
    cities
} from "@/lib/mock-data";
import { Technician } from "@/lib/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { TechVerification } from "@/components/technicians/tech-verification";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
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
    Search,
    MoreVertical,
    UserCheck,
    UserX,
    Info,
    MapPin,
    Star
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TechniciansPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [cityFilter, setCityFilter] = useState("all");
    const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);

    const filteredTechs = technicians.filter((tech) => {
        const matchesSearch =
            tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || tech.status === statusFilter;
        const matchesCity = cityFilter === "all" || tech.city === cityFilter;

        return matchesSearch && matchesStatus && matchesCity;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Technicians</h1>
                    <p className="text-muted-foreground">
                        Manage technician onboarding, profiles, and performance.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Onboarding Requests</Button>
                    <Button>Add Technician</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search name or ID..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {techStatuses.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={cityFilter} onValueChange={setCityFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="City" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cities</SelectItem>
                                {cities.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setCityFilter("all");
                        }}>
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Technician</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Jobs Done</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTechs.map((tech) => (
                                <TableRow key={tech.id}>
                                    <TableCell className="pl-6">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{tech.name}</span>
                                            <span className="text-xs text-muted-foreground">{tech.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {tech.skills.slice(0, 2).map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 h-auto">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {tech.skills.length > 2 && (
                                                <span className="text-[10px] text-muted-foreground">+{tech.skills.length - 2} more</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {tech.city}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-medium">{tech.rating > 0 ? tech.rating : "New"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{tech.jobsCompleted}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                tech.status === "Active" ? "default" :
                                                    tech.status === "Pending Approval" ? "secondary" :
                                                        tech.status === "Suspended" ? "destructive" :
                                                            "outline"
                                            }
                                            className={tech.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                                        >
                                            {tech.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedTech(tech as Technician);
                                                    setIsVerifyOpen(true);
                                                }}>
                                                    <Info className="mr-2 h-4 w-4" /> View Profile
                                                </DropdownMenuItem>
                                                {tech.status === "Pending Approval" && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-emerald-600 font-medium"
                                                            onClick={() => {
                                                                setSelectedTech(tech as Technician);
                                                                setIsVerifyOpen(true);
                                                            }}
                                                        >
                                                            <UserCheck className="mr-2 h-4 w-4" /> Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <UserX className="mr-2 h-4 w-4" /> Reject
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {tech.status === "Active" && (
                                                    <DropdownMenuItem className="text-destructive">
                                                        Disable / Suspend
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TechVerification
                tech={selectedTech}
                isOpen={isVerifyOpen}
                onClose={() => setIsVerifyOpen(false)}
            />
        </div>
    );
}
