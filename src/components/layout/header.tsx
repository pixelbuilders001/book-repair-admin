"use client";

import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { logout, getProfile } from "@/app/auth/actions";
import { Profile } from "@/lib/types";

import { SidebarContent } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await getProfile();
      if (data) {
        setProfile(data as Profile);
      }
    }

    fetchProfile();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-8">
      <div className="flex flex-1 items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        {/* <div className="relative w-full max-w-sm md:max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings, technicians..."
            className="pl-10"
          />
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <div className="flex items-center gap-2">
          {profile ? (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.selfie_url || "/avatars/admin.png"} alt={profile.full_name || "User"} />
                <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{profile.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback>...</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="h-3 w-32 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </>
          )}
          <form action={logout}>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
