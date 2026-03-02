import { useAuth } from '@/features/auth';
import { workspaceSetupAtom } from '@/features/onboarding';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { OnboardingSidebarWidget } from '@/widgets/onboarding';
import { Link, useMatchRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Bot,
  BotMessageSquare,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Plus,
  Server,
  Settings,
  ShieldCheck,
  User,
  Users,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { wsid } = useParams({ strict: false }) as { wsid?: string };
  const matchRoute = useMatchRoute();
  const workspaceSetup = useAtomValue(workspaceSetupAtom);

  const wsBase = `/ws/${wsid ?? ''}`;
  const workspaceName = 'Workspace';

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
          {/* Workspace Name: hybrid link + collapsible */}
          <SidebarGroup className='pt-1 pb-3 px-3'>
            <SidebarMenu>
              <WorkspaceNavItem
                workspaceName={workspaceName}
                wsBase={wsBase}
                isActive={isActive}
                isOverviewActive={isOverviewActive}
              />
            </SidebarMenu>
          </SidebarGroup>

          {/* Operations: Events, Incidents, Agents */}
          <SidebarGroup className='py-1 px-3'>
            <SidebarMenu>
              <FlatNavItem icon={Zap} label='Events' href={`${wsBase}/events`} isActive={isActive} />
              <FlatNavItem icon={AlertCircle} label='Incidents' href={`${wsBase}/incidents`} isActive={isActive} />
              <FlatNavItem icon={Bot} label='Agents' href={`${wsBase}/agents`} isActive={isActive} />
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator className='bg-zinc-200 dark:bg-zinc-700 mx-3 my-2' />

          {/* Management: Members, Roles, Policies */}
          <SidebarGroup className='pt-1 pb-1 px-3'>
            <SidebarGroupLabel className='text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 h-7 px-2'>
              Management
            </SidebarGroupLabel>
            <SidebarMenu>
              <FlatNavItem icon={Users} label='Members' href={`${wsBase}/management/members`} isActive={isActive} />
              <FlatNavItem icon={FileText} label='Roles' href={`${wsBase}/management/roles`} isActive={isActive} />
              <FlatNavItem
                icon={ShieldCheck}
                label='Policies'
                href={`${wsBase}/management/policies`}
                isActive={isActive}
              />
            </SidebarMenu>
          </SidebarGroup>
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
          <div className='flex items-center gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground hover:text-foreground'>
                  <BookOpen className='h-4 w-4' />
                  <span className='sr-only'>Docs</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Docs</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground hover:text-foreground'>
                  <BotMessageSquare className='h-4 w-4' />
                  <span className='sr-only'>AI Assistant</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Assistant</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground hover:text-foreground relative'
                >
                  <Bell className='h-4 w-4' />
                  <span className='sr-only'>Notifications</span>
                  <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main Content */}
        <div className='flex-1 overflow-auto p-4 bg-background flex flex-col min-h-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** Workspace Name — hybrid link (→ Overview) + collapsible (→ Infrastructure) */
function WorkspaceNavItem({
  workspaceName,
  wsBase,
  isActive,
  isOverviewActive,
}: {
  workspaceName: string;
  wsBase: string;
  isActive: (href: string) => boolean;
  isOverviewActive: boolean;
}) {
  const [isWsOpen, setIsWsOpen] = useState(true);
  const [isInfraOpen, setIsInfraOpen] = useState(true);

  return (
    <Collapsible open={isWsOpen} onOpenChange={setIsWsOpen} asChild>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={workspaceName}
          className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
          onClick={() => setIsWsOpen((prev) => !prev)}
        >
          <Home />
          <span>{workspaceName}</span>
        </SidebarMenuButton>

        {/* ChevronDown click → toggle collapsible (separate click target) */}
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30 rounded-md'>
            <ChevronDown className={`transition-transform duration-200 ${isWsOpen ? '' : '-rotate-90'}`} />
            <span className='sr-only'>Toggle workspace menu</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>

        {/* Collapsible content: Overview + Infrastructure */}
        <CollapsibleContent>
          <SidebarMenuSub className='mr-0 pr-0'>
            {/* Overview */}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isOverviewActive}
                className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
              >
                <Link to={wsBase}>
                  <LayoutDashboard className='size-4' />
                  <span>Overview</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            {/* Infrastructure */}
            <Collapsible open={isInfraOpen} onOpenChange={setIsInfraOpen} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30 text-sm'
                  tooltip='Infrastructure'
                >
                  <Server className='size-4' />
                  <span>Infrastructure</span>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30 rounded-md'>
                    <ChevronDown className={`transition-transform duration-200 ${isInfraOpen ? '' : '-rotate-90'}`} />
                    <span className='sr-only'>Toggle infrastructure menu</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive(`${wsBase}/server/inventory-map`)}>
                        <Link to={`${wsBase}/server/inventory-map`}>
                          <span>Server Inventory Map</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/** Simple flat navigation item */
function FlatNavItem({
  icon: Icon,
  label,
  href,
  isActive,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: (href: string) => boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive(href)}
        tooltip={label}
        className='hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
      >
        <Link to={href}>
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
