import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrdersManager from "./pages/OrdersManager";
import OrderDetail from "./pages/OrderDetail";


export default function AppRoutes() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/orders" element={<OrdersManager />} />
<Route path="/orders/:id" element={<OrderDetail />} />
</Routes>
</BrowserRouter>
);
}