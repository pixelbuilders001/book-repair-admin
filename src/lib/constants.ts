import {
    LayoutDashboard,
    Package,
    Users,
    CreditCard,
    Gift,
    Wallet,
    Settings,
    MapPin,
    ClipboardList
} from "lucide-react";

export const navItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Bookings",
        href: "/bookings",
        icon: ClipboardList,
    },
    {
        title: "Technicians",
        href: "/technicians",
        icon: Users,
    },
    {
        title: "Technician Stats",
        href: "/technician-stats",
        icon: Users,
    },
    {
        title: "Payments",
        href: "/payments",
        icon: CreditCard,
    },
    {
        title: "Referrals",
        href: "/referrals",
        icon: Gift,
    },
    {
        title: "Wallets",
        href: "/wallets",
        icon: Wallet,
    },
    {
        title: "Categories",
        href: "/categories",
        icon: Package,
    },
    {
        title: "Cities",
        href: "/cities",
        icon: MapPin,
    },
];
