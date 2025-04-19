import React from 'react';
import { useParams } from 'react-router';
import { useGetProductQuery } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/lib/features/cart/cartSlice';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.value);

  // Get the cart quantity for this product
  const cartItem = cart.find(item => item.product._id === productId);
  const cartQuantity = cartItem?.quantity || 0;

  // Get default variant or first available variant
  const defaultVariant = product?.variants?.find(v => v.name === 'default') || product?.variants?.[0];
  const stock = defaultVariant?.stock || 0;
  const isOutOfStock = !defaultVariant || stock <= cartQuantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      variants: product.variants,
      variantName: defaultVariant.name,
    }));
    toast.success('Added to cart!');
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Error loading product</h2>
          <p>{error.message || 'Failed to load product details'}</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-2">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-sm">
                Stock: {stock - cartQuantity}
                {cartQuantity > 0 && ` (${cartQuantity} in cart)`}
              </p>
            </div>

            {/* Add to Cart Button */}
            <div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Stock Status */}
            {stock === 0 && (
              <Badge variant="destructive" className="w-full justify-center">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}