"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    User,
    MapPin,
    Phone,
    Wrench,
    CreditCard,
    Calendar,
    AlertCircle
} from "lucide-react";
import { Booking } from "@/lib/types";

interface BookingDetailsProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingDetails({ booking, isOpen, onClose }: BookingDetailsProps) {
    if (!booking) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader className="pb-4">
                    <div className="flex items-center justify-between pr-8">
                        <SheetTitle className="text-2xl font-bold">{booking.id}</SheetTitle>
                        <Badge
                            variant={
                                booking.status === "Completed" ? "default" :
                                    booking.status === "Pending" ? "outline" :
                                        booking.status === "Cancelled" ? "destructive" :
                                            "secondary"
                            }
                            className="text-sm px-3 py-1"
                        >
                            {booking.status}
                        </Badge>
                    </div>
                    <SheetDescription>
                        Booking created on January 9, 2026 at 10:30 AM
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 pt-4 pb-10">
                    {/* Customer Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Customer Information
                        </h3>
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">{booking.customer}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Phone size={14} /> +91 98765 43210
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pt-2">
                                <MapPin size={18} className="text-muted-foreground mt-0.5" />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Flat 402, Shanti Niketan Apartments, Boring Canal Road, {booking.city}, Bihar - 800001
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Service Details */}
                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Service Details
                        </h3>
                        <div className="rounded-lg border p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Category</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        <Wrench size={16} className="text-primary" /> {booking.category}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Preferred Date</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        <Calendar size={16} className="text-primary" /> {booking.date}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Issue Description</p>
                                <div className="mt-2 p-3 bg-muted rounded-md text-sm italic">
                                    "AC is making loud noises and cooling has significantly decreased in the last 2 days."
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technician Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Assigned Technician
                        </h3>
                        <div className="rounded-lg border p-4">
                            {booking.technician !== "Unassigned" ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{booking.technician[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{booking.technician}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                ⭐ 4.8 | 120 jobs completed
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Reassign</Button>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-amber-50 rounded-md border-amber-100 border text-amber-800 flex flex-col items-center">
                                    <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="font-medium">No Technician Assigned</p>
                                    <Button className="mt-3 bg-amber-600 hover:bg-amber-700">Assign Now</Button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Payment Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Payment & Billing
                        </h3>
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Inspection Fee</span>
                                <span>₹199</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estimated Repair</span>
                                <span>{booking.amount === "₹0" ? "TBD" : booking.amount}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Final Paid Amount</span>
                                <span className="text-primary">{booking.amount === "₹0" ? "₹199" : booking.amount}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-2 text-xs text-muted-foreground">
                                <CreditCard size={14} />
                                <span>Payment via UPI (Transaction ID: TXN_8192837)</span>
                            </div>
                        </div>
                    </section>

                    <div className="flex gap-3 pt-6">
                        <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
                        {booking.status === "Pending" && (
                            <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground">Cancel Booking</Button>
                        )}
                        {booking.status === "In Progress" && (
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Mark Completed</Button>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Minimal Avatar fallback to avoid missing components
function Avatar({ children, className }: any) {
    return <div className={`overflow-hidden rounded-full ${className}`}>{children}</div>;
}

function AvatarFallback({ children }: any) {
    return <div className="flex h-full w-full items-center justify-center bg-muted font-medium">{children}</div>;
}
