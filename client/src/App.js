import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AppComponent from "./appComponent/AppComponent";
import Navbar from "../src/components/navbar/Navbar";
import Footer from "../src/components/footer/Footer";
import HomePage from "../src/pages/homePage/HomePage";
import RegisterPage from "../src/pages/registerPage/RegisterPage";
import LoginPage from "../src/pages/loginPage/LoginPage";
import FormPage from "../src/pages/formPage/FormPage";
import ChatPage from "./pages/chatPage/ChatPage";
import Landing from "./pages/landing/Landing";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import ClientDetails from "./pages/clientDetails/ClientDetails";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/form",
    element: <FormPage />,
    // element: <AppComponent />
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/wizytowka",
    element: <Landing />,
  },

  {
    path: "/admin",
    element: <AdminPanel />,
  },
  {
    path: "/client/:id",
    element: <ClientDetails />,
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
