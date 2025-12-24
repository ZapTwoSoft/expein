import { Home, TrendingDown, TrendingUp, HandCoins, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

// Hard-coded admin email - should match AdminPage.tsx
const ADMIN_EMAIL = 'alkemy48@gmail.com';

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Expenses', url: '/expenses', icon: TrendingDown },
  { title: 'Income', url: '/income', icon: TrendingUp },
  { title: 'Loans', url: '/loans', icon: HandCoins },
];

export function AppSidebar() {
  const { user } = useAuth();
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
          <div className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md  transition-colors">
            <div className="flex !h-8 !w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold !h-8 !w-8 flex items-center justify-center">E</span>
            </div>
            {!isCollapsed && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Expein</span>
                <span className="truncate text-xs">Financial Management</span>
              </div>
            )}
          </div>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end onClick={handleNavClick}>
                      <item.icon />
                      <span>{item.title}</span>
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
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/admin')} tooltip="Admin Panel">
                    <NavLink to="/admin" onClick={handleNavClick}>
                      <Settings />
                      <span>Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
