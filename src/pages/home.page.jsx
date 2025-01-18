import Navigation from "@/Navigation";
import Hero from "@/Hero";
import Products from "@/Products";
import { useState } from "react";
import { store } from "@/lib/store";
import {Provider, useSelector} from "react-redux";


function HomePage() {
  return (
    <main>
      {/*<Navbar/>*/}
      <Hero/>
      <Products/>
    </main>
  );
    
}

export default HomePage;