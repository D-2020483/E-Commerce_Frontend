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
import { cartSlice } from '@/lib/features/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const ProductCard = ({
  _id, name, price, image, description,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const item = { _id, name, price, image, quantity: 1 };
    dispatch(cartSlice.actions.addToCart({ product: item }));
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="relative h-48 overflow-hidden p-0">
        <img src={image} alt={name} className="w-full h-full object-contain" />
        <Badge variant="secondary" className="absolute top-2 right-2">New</Badge>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">{name}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xl font-bold text-primary">${Number(price).toFixed(2)}</div>
        <Button size="sm" variant="outline" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('none');
  const [sortOrder, setSortOrder] = useState('none');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://fed-storefront-backend-dinithi.onrender.com/api/products");
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterAndSortProducts = (category, order) => {
    let result = [...products];
    if (category !== 'none') result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (order !== 'none') {
      result.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }
    setFilteredProducts(result);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterAndSortProducts(category, sortOrder);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    filterAndSortProducts(selectedCategory, order);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Filter className="text-muted-foreground" />
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Categories</SelectItem>
              <SelectItem value="none">Headphones</SelectItem>
              <SelectItem value="none">Earbuds</SelectItem>
              <SelectItem value="none">Speakers</SelectItem>
              <SelectItem value="none">Mobile Phones</SelectItem>
              <SelectItem value="none">Smart Watches</SelectItem>
              {categories.filter(Boolean).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
        {selectedCategory === 'none'
          ? 'All Products'
          : `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
