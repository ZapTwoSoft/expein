
import { Home, TrendingDown, TrendingUp, HandCoins, LogOut } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Expenses', url: '/expenses', icon: TrendingDown },
  { title: 'Income', url: '/income', icon: TrendingUp },
  { title: 'Loans', url: '/loans', icon: HandCoins },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <SidebarTrigger className="mb-2" />
          {!isCollapsed && (
            <div className="text-xl font-bold text-slate-800">
              Financial Tracker
            </div>
          )}
        </div>
        
        <SidebarContent className="flex-1 p-3">
          <SidebarGroup>
            <SidebarGroupLabel className={`text-slate-600 font-medium ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="space-y-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive 
                              ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm font-medium' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`
                        }
                      >
                        <item.icon className={`h-5 w-5 ${isActive(item.url) ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
                        {!isCollapsed && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                        {isActive(item.url) && !isCollapsed && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </div>
    </Sidebar>
  );
}
