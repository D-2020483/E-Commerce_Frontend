import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "./lib/features/cartSlice";
import { Link } from "react-router";

function ProductCard(props) {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();

  // Get default variant or first available variant
  const defaultVariant = props.variants?.find(v => v.name === 'default') || props.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  // Find this product in cart
  const cartItem = cart.find(item => item.product._id === props._id);
  const cartQuantity = cartItem?.quantity || 0;

  // Check if we can add more to cart
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= cartQuantity;

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigating when clicking the button
    if (isOutOfStock) return;

    dispatch(addToCart({
      _id: props._id,
      name: props.name,
      price: props.price,
      image: props.image,
      description: props.description,
      variants: props.variants,
      variantName: selectedVariant.name,
    }));
  };

  const handleRemove = (e) => {
    e.preventDefault(); // Prevent navigating when clicking the button
    dispatch(removeFromCart(props._id));
  };

  return (
    <Link to={`/shop/${props._id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 group">
        <div className="h-80 bg-card rounded-lg p-4 relative">
          <img src={props.image} className="block w-full h-full object-contain" alt={props.name} />
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        <div className="flex px-4 mt-4 items-center justify-between">
          <h2 className="text-2xl font-semibold">{props.name}</h2>
          <span className="block text-lg font-medium">${props.price}</span>
        </div>
        <div className="px-4 mt-2">
          <p className="text-sm">{props.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            {selectedVariant ? (
              <>
                <p>Stock: {selectedVariant.stock - cartQuantity}</p>
                {cartQuantity > 0 && (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-blue-500">In Cart: {cartQuantity}</p>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleRemove}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>No variants available</p>
            )}
          </div>
        </div>
        <div className="mt-1 p-4">
          <Button 
            className="w-full" 
            onClick={handleClick}
            disabled={isOutOfStock}
          > 
            {isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default ProductCard;