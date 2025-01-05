import { Separator } from "@/components/ui/separator";
import { useGetProductsQuery , useGetCategoriesQuery} from "@/lib/api";
import { useState } from "react";
import { Skeleton } from "./components/ui/skeleton";
import ProductCards from "./ProductCards";
import Tab from "./Tab";


function Products(props) {
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery();


  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
 // const [sortOrder, setSortOrder] = useState("ascending")
  const filteredProducts =
    selectedCategoryId === "ALL"
      ? products
      : products.filter((product) => product.categoryId === selectedCategoryId);


  {/*const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return sortOrder === "ascending" ? priceA - priceB : priceB - priceA;
      });*/}

  const handleTabClick = (_id) => {
        setSelectedCategoryId(_id)
    }

  //const handleSort = (order) => {
  //      setSortOrder(order);
  //    };

 

  if (isProductsLoading || isCategoriesLoading){
    return(
      <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />
      <div className="mt-4 flex items-center gap-4">
      <Skeleton className="h-16" />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
      </div>
    </section>
    );
  }

  if (isProductsError || isCategoriesError){
    return(
      <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />
      <div className="mt-4 flex items-center gap-4">
        {categories.map((category) => (
          <Tab
            key={category._id}  
            _id={category._id}
            selectedCategoryId={selectedCategoryId}
            name={category.name}
            onTabClick={handleTabClick}
          />
        ))}
      </div>
      <div className="mt-4">
          <p className="text-red-500">{`${productsError.message} ${categoriesError.message}`}</p>
        </div>
    </section>
    )
  }

  return (
    <section className="px-8 py-8">
    <h2 className="text-4xl font-bold">Our Top Products</h2>
    <Separator className="mt-2" />
    <div className="mt-4 flex items-center gap-4">
      {[...categories, { _id: "ALL", name: "All" }].map((category) => (
        <Tab
          key={category._id}
          _id={category._id}
          selectedCategoryId={selectedCategoryId}
          name={category.name}
          onTabClick={handleTabClick}
        />
      ))}
    </div>
    <ProductCards products={filteredProducts} />
  </section>
  );
}

export default Products;