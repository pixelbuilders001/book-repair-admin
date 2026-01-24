"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/constants";
import { Wrench } from "lucide-react";

export function SidebarContent() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col bg-card text-card-foreground">
            <div className="flex h-16 items-center justify-left border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-primary">
                    <img
                        src="/logo.png"
                        alt="HELLOFIXO Logo"
                        className="h-40 w-auto object-contain"
                    />
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Support
                    </p>
                    <p className="mt-1 text-sm text-foreground">Need help? contact engineering team</p>
                </div>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <div className="hidden border-r md:flex h-screen w-64 flex-col">
            <SidebarContent />
        </div>
    );
}
