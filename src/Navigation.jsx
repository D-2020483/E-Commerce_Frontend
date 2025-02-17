import React from "react"; 
import { Link } from "react-router"; 
import { ShoppingCart } from "lucide-react"; 
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"; 
import { useSelector } from "react-redux"; 
import { Button } from "@/components/ui/button";

function Navigation() {
  const cart = useSelector((state) => state.cart.value);

  const getCartQuantity = () => {
    let count = 0;
    cart.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent 
            transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/50"
          >
            Mebius
          </Link>
          <div className="flex items-center gap-6">
            {['Home', 'Shop'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/shop`}
                className="text-sm font-medium text-muted-foreground 
                hover:text-primary transition-colors duration-300 
                relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] 
                after:bg-primary after:transition-all after:duration-300 
                hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/shop/cart"
            className="flex items-center gap-2 group hover:text-primary transition-colors duration-300"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {getCartQuantity() > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full 
                bg-primary text-[10px] font-medium text-primary-foreground 
                flex items-center justify-center 
                animate-pulse group-hover:animate-none">
                  {getCartQuantity()}
                </span>
              )}
            </div>
            <span className="text-sm font-medium group-hover:font-semibold transition-all">
              Cart
            </span>
          </Link>

          <SignedOut>
            <div className="flex items-center gap-4">
              <Link to="/sign-in">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-primary/10 hover:text-primary transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button 
                  size="sm" 
                  className="hover:brightness-110 transition-all"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                to="/account"
                className="text-sm font-medium text-muted-foreground 
                hover:text-primary transition-colors duration-300 
                relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] 
                after:bg-primary after:transition-all after:duration-300 
                hover:after:w-full"
              >
                Account
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;