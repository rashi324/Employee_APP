import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

// Sidebar link component
const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

const DashboardLayout = ({ children, role }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-lg text-indigo-600 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Employee App
          </Link>
        </div>

        <nav className="flex-1 flex flex-col p-4 gap-2">
          <SidebarLink to="/" icon={Home} label="Dashboard" active={location.pathname === "/"} />
          {role === "admin" && (
            <SidebarLink
              to="/employees"
              icon={Users}
              label="Employees"
              active={location.pathname === "/employees"}
            />
          )}
          <SidebarLink
            to="/attendance"
            icon={Calendar}
            label="Attendance"
            active={location.pathname === "/attendance"}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white"></span>
            </Button>
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
              <DropdownMenuLabel className="text-gray-500">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-gray-100">Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100">Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-gray-100 text-red-500">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {/* Grid for KPI cards / charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
