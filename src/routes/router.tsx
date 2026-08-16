import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/Mainlayout";
import Home from "../Pages/Home/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
// import Products from "../Pages/FoodItems/FoodItems";
// import Dashboard from "../components/layout/Dashboard";
// import AdminHome from "../Pages/AdminPage/AdminHome";
// import Customers from "../Pages/AdminPage/Customers";
import PrivateRoute from "../utils/PrivateRoute";
import Profile from "../Pages/Profile/Profile";
// import DynamicCategory from "../utils/DynamicCategory";
import Cart from "../Pages/Cart/Cart";
// import ViewUserInfo from "../Pages/AdminPage/ViewUserInfo";
// import ChangeStatus from "../Pages/AdminPage/ChangeStatus";
// // import AllProducts from "../Pages/AdminPage/AllProducts";
// import AllAdmin from "../Pages/AdminPage/AllAdmin";
// import CreateAdmin from "../Pages/AdminPage/CreateAdmin";
// import ViewAdminInfo from "../Pages/AdminPage/ViewAdminInfo";
// // import AddProduct from "../Pages/AdminPage/AddProduct";
// import ViewProductFullDetails from "../Pages/AdminPage/ViewProductFullDetails";
// // import AllCategories from "../Pages/AdminPage/AllCategories";
// import ViewAllOrders from "../Pages/AdminPage/ViewAllOrders";
// import AddCategories from "../Pages/AdminPage/AddCategories";
// import ProductDetails from "../Pages/FoodItems/ProductDetails";
import Unauthorized from "../utils/Unauthorized";
import Order from "../Pages/Order/Order";
import MyOrder from "../Pages/My-order/My-order";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import FoodItems from "../Pages/FoodItems/FoodItems";
import Dashboard from "../components/layout/Dashboard";
import AdminHome from "../Pages/AdminPage/AdminHome";
import ViewAllOrders from "../Pages/AdminPage/ViewAllOrders";
import AllFoods from "../Pages/AdminPage/AllProducts";
import ViewProductFullDetails from "../Pages/AdminPage/ViewProductFullDetails";
import AddItemsForm from "../Pages/AdminPage/AddProduct";
import AllCategories from "../Pages/AdminPage/AllCategories";
import PaymentSuccess from "../utils/PaymentSuccess";
import SalesAnalytics from "../Pages/AdminPage/SalesAnalytics";
import AddCategories from "../Pages/AdminPage/AddCategories";
import Customers from "../Pages/AdminPage/Customers";

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
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/category/:category",
      //   element: <DynamicCategory />,
      // },
      {
        path: "/cart",
        element: <Cart />,
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
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/admin-home",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminHome />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-items",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <AllFoods />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/customers",
        element: (
          <PrivateRoute allowedRoles={["admin","superAdmin"]}>
            <Customers />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/dashboard/customers/:id",
      //   element: (
      //     <PrivateRoute allowedRoles={["admin"]}>
      //       <ViewUserInfo />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/dashboard/customers/change-status/:id",
      //   element: (
      //     <PrivateRoute allowedRoles={["admin"]}>
      //       <ChangeStatus />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/dashboard/All-admin",
      //   element: (
      //     <PrivateRoute allowedRoles={["admin"]}>
      //       <AllAdmin />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/dashboard/admin/create-admin",
      //   element: (
      //     <PrivateRoute allowedRoles={["admin"]}>
      //       <CreateAdmin />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/dashboard/admin/admin-info/:id",
      //   element: (
      //     <PrivateRoute allowedRoles={["admin"]}>
      //       <ViewAdminInfo />
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "/dashboard/items/add-item",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <AddItemsForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/items/view-item/:id",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <ViewProductFullDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/categories",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <AllCategories />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/categories/add-category",
        element: (
          <PrivateRoute allowedRoles={["admin","superAdmin"]}>
            <AddCategories />
          </PrivateRoute>
        ),
      },

      {
        path: "/dashboard/orders",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <ViewAllOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/sales-analytics",
        element: (
          <PrivateRoute allowedRoles={["admin", "superAdmin"]}>
            <SalesAnalytics />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  // {
  //   path: "/product/:id",
  //   element: <ProductDetails />,
  // },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/my-order",
    element: <MyOrder />,
  },
]);
