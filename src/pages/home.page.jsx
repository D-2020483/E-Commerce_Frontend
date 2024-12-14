import Navigation from "@/Navigation";
import Hero from "@/Hero";
import Products from "@/Products";


function HomePage() {
    const name = null;
  const cartCount = 2;

  return (
    <div>
      {/*<Navbar/>*/}
      <Navigation name={name} cartCount={cartCount}/>
      <Hero/>
      <Products/>
    </div>
  );
    
}

export default HomePage;