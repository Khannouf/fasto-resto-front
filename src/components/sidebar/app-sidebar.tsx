import { CalendarClock, ChefHat, CookingPot, FileStack, Home, LayoutDashboard, Utensils, UtensilsCrossed } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { Link } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Commandes",
    url: "/order",
    icon: UtensilsCrossed
  },
  {
    title: "Menu",
    url: "/menu",
    icon: ChefHat,
  },
  {
    title: "Categorie",
    url: "/categorie",
    icon: FileStack
  },
  {
    title: "Plats",
    url: "/dish",
    icon: CookingPot,
  },
  {
    title: "Tables",
    url: "/order",
    icon: Utensils
  },
  {
    title: "Horaires",
    url: "/schedules",
    icon: CalendarClock,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild> 
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
