import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Offers from './pages/Offers';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Register from './pages/Register';
import AdminProducts from './pages/AdminProducts';
import AdminOffers from './pages/AdminOffers';
import AdminOrders from './pages/AdminOrders';
import './App.css';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout" data-testid="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/products"
              element={
                <AppLayout>
                  <Products />
                </AppLayout>
              }
            />
            <Route
              path="/offers"
              element={
                <AppLayout>
                  <Offers />
                </AppLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <AppLayout>
                  <Cart />
                </AppLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <AppLayout>
                  <Orders />
                </AppLayout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AppLayout>
                  <AdminProducts />
                </AppLayout>
              }
            />
            <Route
              path="/admin/offers"
              element={
                <AppLayout>
                  <AdminOffers />
                </AppLayout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AppLayout>
                  <AdminOrders />
                </AppLayout>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
