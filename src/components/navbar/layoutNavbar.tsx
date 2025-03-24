import Navbar from "./navbar"
import { Outlet } from "react-router-dom"



export default function LayoutNavbar( ) {

  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20 container mx-auto p-4">
        <Outlet/>
      </main>
    </div>
  )
}
