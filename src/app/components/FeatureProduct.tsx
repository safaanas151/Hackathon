'use client';

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allProducts, four } from "@/sanity/lib/queries";
import { Product } from '@/../types/products';
import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { addToCard } from "../actions/actions";
import Swal from "sweetalert2";

const FeaturedProducts = () => {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts : Product[] = await client.fetch(allProducts);
      setProducts(fetchedProducts);
    }
    fetchProducts();
  },[]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    Swal.fire({
      position: "top-right",
      icon : "success",
      title: `${product.name} added to cart`,
      showConfirmButton: false,
      timer : 1000
    })
    addToCard(product)
    
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
    <h1 className="text-2x1 font-bold mb-6 text-center">Our Products</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

    {products.map((product) => (
      <div
       key={product._id}
      className="border rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
        <Link href={`/product/${product._id}`}>
        {product.image && (
          <Image
          src={urlFor(product.image).url()}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-48 object-cover rounded-md"
          />
        )}
        <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
        <p className="text-gray-500 mt-2">
          {product.price ? `$${product.price}` : "Price not available"}
        </p>
        <button
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg 
        hover:scale-110 transition-transform duration-300 ease-in-out
        "
        onClick={(e) => handleAddToCart(e, product)}
        >
          Add To Cart
        </button>
        </Link>
      </div>
    ) )}
    </div>
  </div>
  );
};

export default FeaturedProducts;
