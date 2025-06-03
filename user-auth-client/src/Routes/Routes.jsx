import {
    createBrowserRouter,
} from "react-router";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: SignIn,
    },
    {
        path: "/signup",
        Component: SignUp,
    }
]);
