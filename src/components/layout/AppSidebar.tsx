import { Home, TrendingDown, TrendingUp, HandCoins, PiggyBank, Settings } from 'lucide-react';
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
  { title: 'Savings', url: '/savings', icon: PiggyBank },
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
    </Sidebar>
  );
}
