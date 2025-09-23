import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import Home from "./components/Home";             // ✅ Import Home
import ProductPage from "./components/ProductPage";
import CartPage from "./components/user/cart/CartPage.jsx";     // ✅ Import CartPage
import Home from "./components/Home";
import HeroBanner from "./components/HeroBanner";
import ShopSection from "./components/ShopSection";
import Shoppage from "./components/Shoppage.jsx";
// import ShopSection2 from "./components/Shopsection2";
// import ShopSection2 from "./components/Shopsection2";
import CheckSession from "./components/CheckSession.jsx";

import FilterSection from "./components/FilterSection";
import Rudraksha from "./components/Rudraksha";
import Footer from "./components/FooterFeatures";
import Myaccount from "./components/Myaccount.jsx";
import BraceletsPage from "./components/BraceletsPage.jsx";
import PendantsPage from "./components/PendantsPage.jsx";
import StonesPage from "./components/StonesPage.jsx";
import AccountForm from "./components/AccountForm.jsx";
import AuthPage from "./components/user/login";
import AddressPage from "./components/AddressPage";
import ShippingPage from "./components/user/ShippingPage";
import Payment from "./components/user/payment";
import ProductFooter from "./components/ProductFooter.jsx";
import { useState } from "react";

function App() {
  const isLoggedIn = !!localStorage.getItem("user_id");
  const [cartCount, setCartCount] = useState(0); // ✅ cart items count
  return (
    <Router>
      <Routes>
        {/* Home page */}
        {/* <Route path="/home" element={<Home />} /> */}
        {/* To resolve conflicts commented by sakshi patil*/}
        {/* <Route path="/" element={<>
        < Home/>
        < Herobanner/>
        < ShopSection/>
        </>} /> */}
        {/* <Route path="/bracelets" element={<BraceletsPage />} />
        <Route path="/pendants" element={<PendantsPage />} />
        <Route path="/stones" element={<StonesPage />} /> */}
        <Route
          path="/"

          element={
            <>
              <Home setCartCount={setCartCount} cartCount={cartCount} />
              <HeroBanner />
              <div style={{ backgroundColor: "#fefaea", }}>
                <ShopSection setCartCount={setCartCount} cartCount={cartCount} />
              </div>
              <ProductFooter />

            </>
          }
        />

        {/* My account page*/}
        <Route
          path="/profile/:id" element={isLoggedIn ? <Myaccount /> : <Navigate to="/login" />} />
        {/* <Route path="/profile/:id"
          element={
            <>
              <Myaccount />
            </>
          }
        />*/}

        <Route path="/checkSession" element={<> <CheckSession />
        </>} />

        {/* second shopping page */}
        <Route
          path="/shop"
          element={
            <>
              <Home setCartCount={setCartCount} cartCount={cartCount} />
              <ShopSection setCartCount={setCartCount} cartCount={cartCount} />
              <ProductFooter />
            </>
          }
        />

        {/* second  shopping page */}
        <Route path="/shop" element={<>
          <Shoppage />
          < ShopSection setCartCount={setCartCount} cartCount={cartCount}/>
          <ProductFooter />
        </>} />
        {/* User authentication */}
        <Route path="/user/login" element={<AuthPage />} />

        {/* Product page with Home + Footer */}
        <Route
          path="/product/:id"
          element={
            <>
              <Home setCartCount={setCartCount} cartCount={cartCount} />
              <ProductPage setCartCount={setCartCount} cartCount={cartCount} />
              {/* <Footer /> */}
              <ProductFooter />
            </>
          }
        />

        {/* Cart page (dynamic) */}
        <Route
          path="/cart/:id" element={
            <>
              <Home setCartCount={setCartCount} cartCount={cartCount} />
              <CartPage setCartCount={setCartCount} cartCount={cartCount} />
              <ProductFooter />
            </>
          } />


        {/* Address page */}

        <Route path="/address" element={<><Home setCartCount={setCartCount} cartCount={cartCount} /><AddressPage /></>} />
        {/* Shipping page */}
        <Route path="/shipping" element={<><Home setCartCount={setCartCount} cartCount={cartCount} /><ShippingPage /></>} />
        {/* Payment page */}
        <Route path="/payment" element={<><Home setCartCount={setCartCount} cartCount={cartCount} /><Payment /></>} />

      </Routes>
    </Router> 
  );
}

export default App;
