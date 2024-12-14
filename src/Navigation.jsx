import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";

function Navigation(props) {
  return (
    <nav className="flex items-center justify-between p-8 mx-16">
      <div className="flex gap-x-16">
        <a className="font-semibold text-3xl" href="/">
          Mebius
        </a>
        <div className="flex items-center gap-4">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <a href="/cart" className="flex items-center gap-4 relative">
            <p className="text-xl">{props.cartCount}</p>
            <div className="flex items-center gap-2">
              <ShoppingCart />
              Cart
            </div>
          </a>
        </div>
        {
           props.name && (<p>Hi, {props.name}</p>)
        }
        {
          !props.name && (<div className="flex items-center gap-4">
              <Link to="/signin">Sign-In</Link>
              <Link to="/signup">Sign-Up</Link>
          </div>)
        }
      </div>
    </nav>
  );
}

export default Navigation;