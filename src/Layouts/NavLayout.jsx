import { Outlet } from "react-router-dom"

import Navigation from "../components/Navigation"

function NavLayout() {
  return (
    <>
        <Navigation/>
        <main>
            <Outlet/>
        </main>
    </>
  )
}

export default NavLayout