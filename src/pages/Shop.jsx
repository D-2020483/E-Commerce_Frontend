import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { addToCart } from '@/lib/features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { toast } from "sonner";

const ProductCard = ({
  _id, name, price, image, description, variants
}) => {
  const dispatch = useDispatch();
  
  // Get default variant or first available variant
  const defaultVariant = variants?.find(v => v.name === 'default') || variants?.[0];
  const stock = defaultVariant?.stock || 0;

  const handleAddToCart = () => {
    if (stock > 0) {
      dispatch(
        addToCart({
          _id,
          name,
          price,
          image,
          description,
        })
      );
      toast.success("Added to cart", {
        description: `${name} has been added to your cart`,
      });
    } else {
      toast.error("Out of stock", {
        description: "This product is currently out of stock",
      });
    }
  };
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="relative h-48 overflow-hidden p-0">
        <img src={image} alt={name} className="w-full h-full object-contain" />
        {stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">{name}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        <p className="text-sm text-muted-foreground">Stock: {stock}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xl font-bold text-primary">${Number(price).toFixed(2)}</div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('none');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  // Function to refresh products
  const refreshProducts = async () => {
    try {
      const productsResponse = await fetch("https://fed-storefront-backend-dinithi.onrender.com/api/products");
      if (!productsResponse.ok) throw new Error(`HTTP Error! Status: ${productsResponse.status}`);
      const productsData = await productsResponse.json();
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setIsLoading(true);

        // Fetch products
        const productsResponse = await fetch("https://fed-storefront-backend-dinithi.onrender.com/api/products");
        if (!productsResponse.ok) throw new Error(`HTTP Error! Status: ${productsResponse.status}`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Fetch categories
        const categoriesResponse = await fetch("https://fed-storefront-backend-dinithi.onrender.com/api/categories");
        if (!categoriesResponse.ok) throw new Error(`HTTP Error! Status: ${categoriesResponse.status}`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsAndCategories();

    // Listen for stock updates
    const handleStockUpdate = (event) => {
      const { productId, newStock } = event.detail;
      setProducts(prevProducts => 
        prevProducts.map(product => {
          if (product._id === productId) {
            return {
              ...product,
              variants: [{
                name: 'default',
                stock: newStock
              }]
            };
          }
          return product;
        })
      );
      
      setFilteredProducts(prevFiltered => 
        prevFiltered.map(product => {
          if (product._id === productId) {
            return {
              ...product,
              variants: [{
                name: 'default',
                stock: newStock
              }]
            };
          }
          return product;
        })
      );
    };

    window.addEventListener('stockUpdated', handleStockUpdate);

    return () => {
      window.removeEventListener('stockUpdated', handleStockUpdate);
    };
  }, []);

  const filterAndSortProducts = (categoryId, order) => {
    let result = [...products];

    // Filter by categoryId
    if (categoryId !== 'ALL') {
      result = result.filter(p => p.categoryId === categoryId);
    }

    // Sort by price
    if (order !== 'none') {
      result.sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
    }

    setFilteredProducts(result);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    filterAndSortProducts(categoryId, sortOrder);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    filterAndSortProducts(selectedCategoryId, order);
  };

  const getCategoryName = (categoryId) => {
    if (categoryId === 'ALL') return 'All Categories';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Filter className="text-muted-foreground" />
          <Select onValueChange={handleCategoryChange} value={selectedCategoryId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <ArrowUpDown className="text-muted-foreground" />
          <Select onValueChange={handleSortChange} value={sortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Sorting</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Show selected category heading */}
      <div className="mb-6 text-xl font-semibold">
        {getCategoryName(selectedCategoryId)}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              variants={product.variants}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;