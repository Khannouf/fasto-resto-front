import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { CalendarClock, ChefHat, CookingPot, FileStack, Home, LayoutDashboard, Utensils, UtensilsCrossed } from "lucide-react"
import {
  useSidebar,
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
import { useCart } from "../../context/cartContext"

// Menu items.
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
  { title: "Commandes", url: "order", icon: UtensilsCrossed },
  { title: "Menu", url: "menu", icon: ChefHat },
  { title: "Categorie", url: "categories", icon: FileStack },
  { title: "Plats", url: "dishes", icon: CookingPot },
  { title: "Tables", url: "tables", icon: Utensils },
  { title: "Horaires", url: "schedules", icon: CalendarClock },
]

export function AppSidebar() {
  const { open } = useSidebar(); // Récupère l'état de la sidebar
  

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <HoverableLink item={item} />
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

const HoverableLink = ({ item }: { item: { title: string; url: string; icon: React.ComponentType } }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={item.url} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 rounded-lg transition text-black">
        <motion.div
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <item.icon className="w-6 h-6 mr-2" />
        </motion.div>
        <span>{item.title}</span>
      </Link>
    </motion.div>
  )
}
