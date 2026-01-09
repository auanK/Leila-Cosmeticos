import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import { AuthProvider } from './contexts/AuthContext';

import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Loja */}
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<ProductListing />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Autenticação */}
        <Route path="/login" element={<Login />} />
        
        {/* Perfil do Usuário */}
        <Route path="/perfil" element={<Profile />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/enderecos" element={<Addresses />} />
        <Route path="/favoritos" element={<Wishlist />} />
        <Route path="/avaliacoes" element={<Reviews />} />
        
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/categorias" element={<AdminCategories />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
