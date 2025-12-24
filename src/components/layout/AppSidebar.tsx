import { Home, TrendingDown, TrendingUp, HandCoins, PiggyBank, Settings, LogOut, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Hard-coded admin email - should match AdminPage.tsx
const ADMIN_EMAIL = 'alkemy48@gmail.com';

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Expenses', url: '/expenses', icon: TrendingDown },
  { title: 'Income', url: '/income', icon: TrendingUp },
  { title: 'Savings', url: '/savings', icon: PiggyBank },
  { title: 'Loans', url: '/loans', icon: HandCoins },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }
    return currentPath === path;
  };
  const isCollapsed = state === 'collapsed';
  const isAdmin = user?.email === ADMIN_EMAIL;

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavLink to="/dashboard" onClick={handleNavClick} className="block">
          <div className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-3 transition-colors">
            {!isCollapsed && (
              <span className="text-2xl text-brand font-bold">Expein.</span>
            )}
            {isCollapsed && (
              <div className="flex !h-10 !w-10 items-center justify-center">
                <span className="text-xl text-brand font-bold">E</span>
              </div>
            )}
          </div>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3">App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end onClick={handleNavClick}>
                      <item.icon />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only show for admin users */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/admin')} tooltip="Admin Panel">
                    <NavLink to="/admin" onClick={handleNavClick}>
                      <Settings />
                      <span className="font-medium">Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Profile Section at Bottom */}
      <SidebarFooter className="p-2">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start bg-white/10 hover:bg-white/5 p-3 h-auto"
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-brand to-brand-400 text-black text-sm font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate w-full">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-400 truncate w-full">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-white/10" align="end" side="top">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-white/5">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center hover:bg-white/5 p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-brand to-brand-400 text-black text-sm font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-white/10" align="end" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={signOut} className="text-red-400 focus:text-red-400 focus:bg-white/5">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
