import React from "react";
import {
  Search,
  Home as HomeIcon,
  Compass,
  Library,
  History,
  MoreHorizontal,
  Sparkles,
  Plus,
  User,
  Bell,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const NavItem = ({ icon, label, active }) => (
  <div
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
      active
        ? "bg-gray-100 text-[#6c5dd3]"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    )}
  >
    {icon} <span className="text-sm font-medium">{label}</span>
  </div>
);

const HistoryItem = ({ label }) => (
  <div className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer truncate transition-colors">
    {label}
  </div>
);

const Sidebar = ({
  user,
  chats,
  onNewChat,
  onLogout,
  onNavigate,
  isOpen,
  onClose
}) => {

  const renderChats = chats?.map((items, idx) => {


    return <HistoryItem key={items._id} label={items.title} />;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col border-r border-gray-100 py-6 px-4 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6 px-2">
           <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6c5dd3] text-white shadow-lg shadow-[#6c5dd3]/20">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900 tracking-wider">
              Nexus
            </span>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
            <LogOut size={20} className="rotate-180" /> 
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            if (window.innerWidth < 768) onClose();
          }}
          className="mx-2 mb-6 flex items-center justify-center gap-2 bg-[#6c5dd3] text-white py-3 rounded-xl font-medium shadow-lg shadow-[#6c5dd3]/20 hover:bg-[#5b4eb8] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          New Chat
        </button>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none ring-1 ring-transparent focus:ring-[#6c5dd3] transition-all placeholder:text-gray-400 focus:bg-white border border-transparent focus:border-gray-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            ⌘K
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-8">
          <NavItem icon={<HomeIcon size={18} />} label="Home" active />
          <NavItem icon={<Compass size={18} />} label="Explore" />
          <NavItem icon={<Library size={18} />} label="Library" />
        </nav>

        <NavItem icon={<History size={18} />} label="Chats History" />

        {/* History Section */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="mb-6">
            <div className="space-y-1">{renderChats}</div>
          </div>
        </div>

        {/* User Profile Popover */}
        <div className="mt-4 relative z-50">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full outline-none">
              <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 cursor-pointer transition-colors group border border-transparent hover:border-gray-100">
                <img
                  src="abc.jpeg"
                  alt="User"
                  className="h-9 w-9 rounded-full object-cover border border-gray-200 group-hover:border-gray-300 transition-colors"
                />
                <div className="flex-1 overflow-hidden text-left">
                  <div className="truncate text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {`${user?.fullname?.firstname} ${user?.fullname?.lastname}`}
                  </div>
                  <div className="truncate text-xs text-gray-400">
                    @{user?.username}
                  </div>
                </div>
                <MoreHorizontal
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600 transition-colors"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 mb-4 p-3 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-2xl ring-1 ring-black/5"
              side="top"
              align="center"
              sideOffset={12}
            >
              <div className="flex items-center gap-3 p-3 mb-3 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3387&auto=format&fit=crop"
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none">
                    {user?.fullname?.firstname}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>

              <DropdownMenuGroup className="space-y-1">
                <DropdownMenuItem
                  onClick={() => onNavigate("/profile")}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 focus:bg-gray-50 focus:text-[#6c5dd3] cursor-pointer transition-all"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 focus:bg-gray-50 focus:text-[#6c5dd3] cursor-pointer transition-all">
                  <Bell className="mr-3 h-4 w-4" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-[#6c5dd3]/10 text-[#6c5dd3] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    2
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 focus:bg-gray-50 focus:text-[#6c5dd3] cursor-pointer transition-all">
                  <CreditCard className="mr-3 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 focus:bg-gray-50 focus:text-[#6c5dd3] cursor-pointer transition-all">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <div className="h-px bg-gray-100 my-2 mx-1" />

              <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer transition-all">
                <LogOut className="mr-3 h-4 w-4" />
                <span onClick={onLogout} className="w-full h-full">
                  Log out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
