import {
    createBrowserRouter,
} from "react-router";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import Dashboard from "../Pages/Dashboard";
import PrivateRoute from "../Context/PrivateRoute";


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
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    }
]);
