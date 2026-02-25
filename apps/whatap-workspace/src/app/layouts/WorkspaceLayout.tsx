import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
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
import { Link, useMatchRoute, useParams } from '@tanstack/react-router';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  LifeBuoy,
  type LucideIcon,
  MessageSquare,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
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

  const wsBase = `/ws/${wsid ?? ''}`;

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        title: 'Workspace',
        items: [
          {
            label: 'Server Inventories',
            icon: Server,
            href: `${wsBase}/server/inventory-map`,
          },
          {
            label: 'Events',
            icon: AlertTriangle,
            href: `${wsBase}/events`,
          },
          {
            label: 'Incidents',
            icon: Shield,
            href: `${wsBase}/incidents`,
          },
          {
            label: 'Settings',
            icon: Settings,
            href: `${wsBase}/settings`,
          },
        ],
      },
      {
        title: 'Management',
        items: [
          {
            label: 'Members',
            icon: Users,
            href: `${wsBase}/management/members`,
          },
          {
            label: 'Policies',
            icon: ShieldCheck,
            href: `${wsBase}/management/policies`,
          },
          {
            label: 'Roles',
            icon: FileText,
            href: `${wsBase}/management/roles`,
          },
          {
            label: 'Audit Logs',
            icon: Activity,
            href: `${wsBase}/management/audit-logs`,
          },
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
        className='border-r bg-[#EFF6FF] [&_[data-sidebar=sidebar]]:bg-[#EFF6FF] [&_[data-sidebar=inner]]:bg-[#EFF6FF]'
      >
        {/* Header: Logo + Search (Figma: Header section) */}
        <SidebarHeader className='gap-3 p-3'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild className='hover:bg-blue-100/60'>
                <Link to={wsBase}>
                  <div className='bg-[#1E3A8A] text-white flex items-center justify-center rounded-lg size-8 shrink-0'>
                    <span className='font-bold text-sm'>O</span>
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-semibold text-sm'>OpsGent</span>
                    <span className='text-[11px] text-zinc-500'>v1.0.0</span>
                  </div>
                  <ChevronDown className='ml-auto size-4 text-zinc-400' />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Search Input (Figma: Input component with border) */}
          <div className='group-data-[collapsible=icon]:hidden'>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400' />
              <SidebarInput placeholder='Search...' className='h-9 pl-9 bg-white border-zinc-200' />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className='gap-0'>
          {/* Overview - standalone item */}
          <SidebarGroup className='py-1'>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isOverviewActive}
                  tooltip='Overview'
                  className='hover:bg-blue-100/60'
                >
                  <Link to={wsBase}>
                    <Home />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Nav Groups (Figma: Collapsible SidebarGroup with Title) */}
          {navGroups.map((group) => (
            <NavGroupSection key={group.title} group={group} isActive={isActive} />
          ))}
        </SidebarContent>

        {/* Footer (Figma: bottom section with Support/Feedback + User) */}
        <SidebarFooter className='gap-1 p-3'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip='Support' className='hover:bg-blue-100/60 text-zinc-600'>
                <a href='#'>
                  <LifeBuoy />
                  <span>Support</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip='Feedback' className='hover:bg-blue-100/60 text-zinc-600'>
                <a href='#'>
                  <MessageSquare />
                  <span>Feedback</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator className='bg-zinc-200' />

          {/* User (Figma: Avatar item at bottom) */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' tooltip='Account' className='hover:bg-blue-100/60'>
                <Avatar size='sm' className='shrink-0'>
                  <AvatarFallback className='bg-blue-100 text-blue-900 text-xs'>U</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-0.5 leading-none min-w-0'>
                  <span className='font-medium text-sm truncate'>User</span>
                  <span className='text-[11px] text-zinc-500 truncate'>user@example.com</span>
                </div>
                <ChevronDown className='ml-auto size-4 text-zinc-400 shrink-0' />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Top Header Bar */}
        <header className='flex h-14 items-center gap-2 bg-white px-4'>
          <SidebarTrigger />
          <div className='flex-1' />
        </header>

        {/* Main Content */}
        <main className='flex-1 overflow-auto p-6 bg-background'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** Collapsible Nav Group (Figma: Title + Collapsible SidebarGroup) */
function NavGroupSection({ group, isActive }: { group: NavGroup; isActive: (href: string) => boolean }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarGroup className='py-1 px-3'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2 group-data-[collapsible=icon]:hidden'>
          <span className='text-sm font-semibold text-zinc-500'>{group.title}</span>
          <ChevronRight
            className={`size-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
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
                    className='hover:bg-blue-100/60'
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
        </CollapsibleContent>
      </Collapsible>

      {/* Icon-only mode: show items without collapsible wrapper */}
      <SidebarMenu className='hidden group-data-[collapsible=icon]:flex'>
        {group.items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.href)}
              tooltip={item.label}
              className='hover:bg-blue-100/60'
            >
              <Link to={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/** Collapsible Nav Item with sub-menu (Figma: vertical separator + indented items) */
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
          <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label} className='hover:bg-blue-100/60'>
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
