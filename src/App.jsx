import {  createBrowserRouter,createRoutesFromElements, Route, RouterProvider} from "react-router-dom";

//Public page
import HomePage from "./pages/HomePage";

//Protected page
import DataLayout from "./Layouts/DataLayout";

//Authentication
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";

// Layouts
import NavLayout from "./Layouts/NavLayout";
// import FavouritePage from "./pages/FavouritePage";

//Error page
import NotFound from "./ErrorPage/NotFound";

//context
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./Authentication/ProtectedRoute";

function App() {
  const route = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavLayout/>}>
        <Route index element={<HomePage/>}/>
        {/* <Route path="/favourite" element={<FavouritePage/>}/> */}
        
        <Route 
          path="/QuoteAccount" 
          element={
            <ProtectedRoute>
              <DataLayout />
            </ProtectedRoute>
          }
        />
        
        
        <Route path="/login" element={<Login/>}/>
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    )
  )
  return (
    <UserAuthContextProvider>
      <RouterProvider router={route}/>
    </UserAuthContextProvider>
    
  )
}

export default App