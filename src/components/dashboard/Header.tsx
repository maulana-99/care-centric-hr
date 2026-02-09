import { useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { PageType } from "@/pages/Index";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onNavigate: (page: PageType) => void;
}

const notifications = [
  { id: 1, title: "Leave request pending", message: "Michael Chen requested annual leave", time: "2 hours ago", unread: true },
  { id: 2, title: "New employee joined", message: "Alex Thompson joined Engineering", time: "3 hours ago", unread: true },
  { id: 3, title: "Payroll processed", message: "December payroll completed", time: "Yesterday", unread: false },
];

export function Header({ onNavigate }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Good morning, Sarah</h1>
        <p className="text-sm text-muted-foreground">{currentDate}</p>
      </div>

      <div className="flex items-center gap-3">

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2.5 rounded-lg hover:bg-card transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => toast.info(`Opening: ${notification.title}`)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-sm">{notification.title}</span>
                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary ml-auto" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{notification.message}</span>
                <span className="text-xs text-muted-foreground/60 mt-1">{notification.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary cursor-pointer"
              onClick={() => toast.info("Opening all notifications...")}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
