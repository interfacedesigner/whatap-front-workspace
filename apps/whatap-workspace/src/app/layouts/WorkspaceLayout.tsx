import { useAuth } from '@/features/auth';
import { workspaceSetupAtom } from '@/features/onboarding';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { OnboardingSidebarWidget } from '@/widgets/onboarding';
import { Link, useMatchRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Home,
  LogOut,
  type LucideIcon,
  Plus,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

interface NavGroup {
  title: string;
  items: {
    label: string;
    icon: LucideIcon;
    href: string;
    children?: { label: string; href: string }[];
  }[];
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { wsid } = useParams({ strict: false }) as { wsid?: string };
  const matchRoute = useMatchRoute();
  const workspaceSetup = useAtomValue(workspaceSetupAtom);

  const wsBase = `/ws/${wsid ?? ''}`;
  const workspaceName = workspaceSetup.name || 'My Workspace';

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        title: 'Workspace',
        items: [
          {
            label: 'Infrastructure',
            icon: Server,
            href: wsBase,
            children: [{ label: 'Server Inventories', href: `${wsBase}/server/inventory-map` }],
          },
          {
            label: 'Preferences',
            icon: SlidersHorizontal,
            href: `${wsBase}/preferences`,
            children: [
              { label: 'Events', href: `${wsBase}/events` },
              { label: 'Incidents', href: `${wsBase}/incidents` },
              { label: 'Agents', href: `${wsBase}/agents` },
            ],
          },
        ],
      },
      {
        title: 'Management',
        items: [
          { label: 'Members', icon: Users, href: `${wsBase}/management/members` },
          { label: 'Roles', icon: FileText, href: `${wsBase}/management/roles` },
          { label: 'Policies', icon: ShieldCheck, href: `${wsBase}/management/policies` },
        ],
      },
    ],
    [wsBase],
  );

  const isActive = useCallback(
    (href: string) => {
      return !!matchRoute({ to: href, fuzzy: true });
    },
    [matchRoute],
  );

  const isOverviewActive = !!matchRoute({ to: wsBase, fuzzy: false });

  return (
    <SidebarProvider>
      <Sidebar
        collapsible='icon'
        className='border-r bg-[#EFF6FF] dark:bg-slate-950 [&_[data-sidebar=sidebar]]:bg-[#EFF6FF] dark:[&_[data-sidebar=sidebar]]:bg-slate-950 [&_[data-sidebar=inner]]:bg-[#EFF6FF] dark:[&_[data-sidebar=inner]]:bg-slate-950'
      >
        {/* Header: Workspace Switcher Dropdown */}
        <SidebarHeader className='p-3'>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30 data-[state=open]:bg-blue-100/60 dark:data-[state=open]:bg-blue-900/30'
                  >
                    <div className='bg-[#1E3A8A] text-white flex items-center justify-center rounded-lg size-8 shrink-0'>
                      <span className='font-bold text-sm'>O</span>
                    </div>
                    <div className='flex flex-col gap-0.5 leading-none min-w-0'>
                      <span className='font-semibold text-sm truncate'>OpsGent</span>
                      <span className='text-[11px] text-zinc-500 dark:text-zinc-400'>{workspaceName}</span>
                    </div>
                    <ChevronsUpDown className='ml-auto size-4 text-zinc-400 shrink-0' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start' className='w-[--radix-dropdown-menu-trigger-width]'>
                  <DropdownMenuItem className='gap-2'>
                    <div className='bg-[#1E3A8A] text-white flex items-center justify-center rounded size-6 shrink-0'>
                      <span className='font-bold text-xs'>{workspaceName.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className='font-medium'>{workspaceName}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='gap-2 text-zinc-500'>
                    <Plus className='size-4' />
                    <span>Create Workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className='gap-0'>
          {/* Overview - standalone item */}
          <SidebarGroup className='py-1 px-3'>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isOverviewActive}
                  tooltip='Overview'
                  className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
                >
                  <Link to={wsBase}>
                    <Home />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Nav Groups */}
          {navGroups.map((group) => (
            <NavGroupSection key={group.title} group={group} isActive={isActive} />
          ))}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className='gap-1 p-3'>
          {/* Onboarding Progress Widget (미완료 시에만 표시) */}
          <div className='group-data-[collapsible=icon]:hidden mb-1'>
            <OnboardingSidebarWidget />
          </div>

          <SidebarSeparator className='bg-zinc-200 dark:bg-zinc-700' />

          {/* User Dropdown */}
          <SidebarMenu>
            <SidebarMenuItem>
              <UserDropdown wsBase={wsBase} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Top Header Bar */}
        <header className='flex h-14 items-center gap-2 bg-white dark:bg-slate-950 px-4'>
          <SidebarTrigger />
          <div className='flex-1' />
        </header>

        {/* Main Content */}
        <div className='flex-1 overflow-auto p-4 bg-background flex flex-col min-h-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** Static Nav Group — title always visible, no collapsible toggle */
function NavGroupSection({ group, isActive }: { group: NavGroup; isActive: (href: string) => boolean }) {
  return (
    <SidebarGroup className='py-1 px-3'>
      {/* Static title (hidden in icon-only mode) */}
      <div className='flex w-full items-center py-2 group-data-[collapsible=icon]:hidden'>
        <span className='text-sm font-semibold text-zinc-500 dark:text-zinc-400'>{group.title}</span>
      </div>

      <SidebarMenu>
        {group.items.map((item) => {
          if (item.children && item.children.length > 0) {
            return <CollapsibleNavItem key={item.label} item={item} isActive={isActive} />;
          }

          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
                className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
              >
                <Link to={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/** Collapsible Nav Item with sub-menu */
function CollapsibleNavItem({
  item,
  isActive,
}: {
  item: {
    label: string;
    icon: LucideIcon;
    href: string;
    children?: { label: string; href: string }[];
  };
  isActive: (href: string) => boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isActive(item.href)}
            tooltip={item.label}
            className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
          >
            <Icon />
            <span>{item.label}</span>
            <ChevronRight
              className={`ml-auto size-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.label}>
                <SidebarMenuSubButton asChild isActive={isActive(child.href)}>
                  <Link to={child.href}>
                    <span>{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/** User Dropdown (Profile / Settings / Log-out) */
function UserDropdown({ wsBase }: { wsBase: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate({ to: '/login' });
  }, [logout, navigate]);

  const displayName = user?.name ?? 'User';
  const displayEmail = user?.email ?? '';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size='lg' tooltip='Account' className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'>
          <Avatar size='sm' className='shrink-0'>
            <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-xs'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-0.5 leading-none min-w-0'>
            <span className='font-medium text-sm truncate'>{displayName}</span>
            <span className='text-[11px] text-zinc-500 truncate'>{displayEmail}</span>
          </div>
          <ChevronDown className='ml-auto size-4 text-zinc-400 shrink-0' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='top' align='start' className='w-56'>
        <DropdownMenuItem asChild>
          <a href={`${wsBase}/profile`} className='gap-2'>
            <User className='size-4' />
            <span>Profile</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`${wsBase}/settings`} className='gap-2'>
            <Settings className='size-4' />
            <span>Settings</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='gap-2 text-red-600 focus:text-red-600'>
          <LogOut className='size-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
