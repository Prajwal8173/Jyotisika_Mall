import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FilterSection from "./FilterSection";

const ShopSection2 = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("best");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const navigate = useNavigate();

  // Fetch products based on category
  useEffect(() => {
    let apiUrl = "https://jyotisika.in/jyotisika_test/User_Api_Controller/getproduct";
    

    if (categoryFilter === "rudraksha") {
      apiUrl = "https://jyotisika.in/jyotisika_test/User_Api_Controller/show_rudraksh";
      console.log("The Data is"+apiUrl);
    } else if (categoryFilter === "stone") {
      apiUrl = "https://jyotisika.in/jyotisika_test/User_Api_Controller/show_energy_stones";
    }

    axios
      .get(apiUrl)
      .then((response) => {
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [categoryFilter]);

  // Apply filters (price, availability, sort)
  useEffect(() => {
    let updated = [...products];

    // Price Filter
    if (priceFilter !== "all") {
      updated = updated.filter((p) => {
        const price = parseFloat(p.discount_price);
        if (priceFilter === "0-499") return price >= 0 && price <= 499;
        if (priceFilter === "500-999") return price >= 500 && price <= 999;
        if (priceFilter === "1000-1999") return price >= 1000 && price <= 1999;
        if (priceFilter === "2000+") return price >= 2000;
        return true;
      });
    }

    // Availability
    if (availabilityFilter !== "all") {
      updated = updated.filter((p) => {
        const stock = parseInt(p.stock || p.quantity || 0);
        if (availabilityFilter === "in") return stock > 0;
        if (availabilityFilter === "out") return stock === 0;
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-asc") {
      updated.sort((a, b) => a.discount_price - b.discount_price);
    } else if (sortBy === "price-desc") {
      updated.sort((a, b) => b.discount_price - a.discount_price);
    } else if (sortBy === "new") {
      updated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredProducts(updated);
  }, [priceFilter, availabilityFilter, sortBy, products]);

  const handleAddToCart = (product) => {
    navigate("/product");
  };

  return (
    <div
      className="pt-5 text-center"
      style={{ backgroundColor: "#fefaea", padding: "20px", borderRadius: "10px", color: "#6D1D11" }}
    >
      {/* ✅ Filter UI */}
      <FilterSection
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onPriceChange={setPriceFilter}
        onSortChange={setSortBy}
        onAvailabilityChange={setAvailabilityFilter}
        onClearFilters={() => {
          setCategoryFilter("all");
          setPriceFilter("all");
          setSortBy("best");
          setAvailabilityFilter("all");
        }}
      />

      <h1>Shop Our Best Seller</h1>

      {/* Products */}
      <div className="row mt-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.product_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">

              <div className="card product-card border-0 text-center h-100" style={{backgroundColor:"rgb(254, 250, 234)"}}>
                <div  className="position-relative" style={{ aspectRatio: "303 / 304"}}>
                  <img
                    src={`https://jyotisika.in/jyotisika_test/uploads/products/${product.product_image}`}
                    className="card-img-top product-image"
                    alt={product.product_name}
                    style={{ height: "499px", width: "303px", objectFit: "cover" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.product_name}</h5>
                  <p className="small text-muted">
                    {product.product_description?.substring(0, 50)}...
                  </p>
                  <div className="row">
                    <div className="col-6">
                      <span className="current-price">₹{product.discount_price}</span>
                      {product.product_price !== product.discount_price && (
                        <del className="ms-2">₹{product.product_price}</del>
                      )}
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleAddToCart(product)}
                       
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

    </div>
  );
};

export default ShopSection2;
