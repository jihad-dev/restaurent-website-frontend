import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts & Static Page Imports
import MainLayout from "../components/layout/Mainlayout";
import Home from "../Pages/Home/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import PrivateRoute from "../utils/PrivateRoute";
import Profile from "../Pages/Profile/Profile";
import Cart from "../Pages/Cart/Cart";
import Unauthorized from "../utils/Unauthorized";
import MyOrder from "../Pages/My-order/My-order";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import FoodItems from "../Pages/FoodItems/FoodItems";
import PaymentSuccess from "../utils/PaymentSuccess";
import Preloader from "../utils/Preloader";
import Review from "../Pages/Review/Review";
import CheckoutPage from "../Pages/CheckOut/CheckoutPage";
import ViewUserInfo from "../Pages/AdminPage/ViewUserInfo";
import AllCustomerReviews from "../Pages/AdminPage/AllCustomerReviews";

// Lazy Loaded Dashboard Components
const Dashboard = lazy(() => import("../components/layout/Dashboard"));
const AdminHome = lazy(() => import("../Pages/AdminPage/AdminHome"));
const ViewAllOrders = lazy(() => import("../Pages/AdminPage/ViewAllOrders"));
const AllFoods = lazy(() => import("../Pages/AdminPage/AllProducts"));
const ViewProductFullDetails = lazy(
  () => import("../Pages/AdminPage/ViewProductFullDetails"),
);
const AddItemsForm = lazy(() => import("../Pages/AdminPage/AddProduct"));
const AllCategories = lazy(() => import("../Pages/AdminPage/AllCategories"));
const SalesAnalytics = lazy(() => import("../Pages/AdminPage/SalesAnalytics"));
const AddCategories = lazy(() => import("../Pages/AdminPage/AddCategories"));
const Customers = lazy(() => import("../Pages/AdminPage/Customers"));
const CreateAdmin = lazy(() => import("../Pages/AdminPage/CreateAdmin"));
const AllAdmin = lazy(() => import("./../Pages/AdminPage/AllAdmin"));

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/items",
        element: <FoodItems />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin", "user"]}>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin", "user"]}>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "/review/:id",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin", "user"]}>
            <Review />
          </PrivateRoute>
        ),
      },
      {
        path: "/order",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin", "user"]}>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/payment/success",
        element: <PaymentSuccess />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
        <Suspense fallback={<Preloader />}>
          <Dashboard />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/admin-home",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AdminHome />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-items",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AllFoods />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/customers",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <Customers />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/customers/:id",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <ViewUserInfo />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-admin",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AllAdmin />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/admin/create-admin",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <CreateAdmin />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/items/add-item",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AddItemsForm />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/items/view-item/:id",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <ViewProductFullDetails />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/categories",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AllCategories />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/categories/add-category",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AddCategories />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/orders",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <ViewAllOrders />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/sales-analytics",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <SalesAnalytics />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-reviews",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <Suspense fallback={<Preloader />}>
              <AllCustomerReviews />
            </Suspense>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/my-order",
    element: <MyOrder />,
  },
]);
