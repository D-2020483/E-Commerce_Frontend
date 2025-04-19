import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Routes , Route } from 'react-router';

import HomePage from './pages/home.page.jsx';
import SignUpPage from './pages/sign-up.page.jsx';
import SignInPage from './pages/sing-in.page.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import CartPage from './pages/cart.page.jsx';
import CheckoutPage from './pages/checkout.page.jsx';
import PaymentPage from './pages/payment.page.jsx';
import AdminCreateProductPage from './pages/admmin-product-create.page.jsx';
import Shop from './pages/Shop';
import MyOrdersPage from './pages/myorder.page.jsx';
import ProductDetailsPage from './pages/product-details.page.jsx';

import { store } from "@/lib/store";
import {Provider} from "react-redux";
import RootLayout from './layouts/root.layout.jsx';
import AccountPage from './pages/account.page.jsx';
import CompletePage from './pages/complete.page.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout/>}>
           <Route path="/" element={<HomePage/>}/>
           <Route path="/shop/cart" element={<CartPage/>}/>
           <Route path="/account" element={<AccountPage/>}/>
           <Route path="/shop/checkout" element={<CheckoutPage/>}/>
           <Route path="/shop/payment" element={<PaymentPage/>}/>
           <Route path="/shop/complete" element={<CompletePage/>}/>
           <Route path="/admin/products/create" element={<AdminCreateProductPage/>}/>
           <Route path="/shop" element={<Shop />} />
           <Route path="/shop/:productId" element={<ProductDetailsPage />} />
           <Route path="/myorders" element={<MyOrdersPage/>}/>
        </Route> 
        <Route path="/sign-up" element={<SignUpPage/>}/>
        <Route path="/sign-in" element={<SignInPage/>}/>
      </Routes>
    </BrowserRouter>
  </Provider>
  </ClerkProvider>
);
