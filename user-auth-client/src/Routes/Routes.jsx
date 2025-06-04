import {
    createBrowserRouter,
} from "react-router";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import Dashboard from "../Pages/Dashboard";
import ShopPage from "../Pages/ShopPage";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: SignIn,
    },
    {
        path: "/signup",
        Component: SignUp,
    },
    {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
    },
    {
        path: "/dashboard/:shopName",
        element: <ShopPage></ShopPage>,
    }
]);
