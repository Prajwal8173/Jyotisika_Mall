import React, { useState, useEffect } from "react";
import "./filter.css";
import filterimg from "../assets/filter.png";
import axios from "axios";

const FilterSection = ({
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onAvailabilityChange,
  onClearFilters,
} = {}) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("best");
  const [availability, setAvailability] = useState("all");

  const availabilityLabel =
    availability === "all"
      ? "Availability"
      : availability === "in"
      ? "Out of stock"
      : "In stock";

  // Fetch categories from API
  useEffect(() => {
    axios
      .get("https://jyotisika.in/jyotisika_test/User_Api_Controller/show_category")
      .then((res) => {
        if (res.data.status === "success") {
          const uniqueCategories = [
            ...new Set(res.data.data.map((item) => item.category)),
          ];
          setCategories(uniqueCategories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleCategory = (value) => {
    setCategory(value);
    if (typeof onCategoryChange === "function") onCategoryChange(value);
  };

  const handlePrice = (value) => {
    setPriceRange(value);
    if (typeof onPriceChange === "function") onPriceChange(value);
  };

  const handleSort = (value) => {
    setSortBy(value);
    if (typeof onSortChange === "function") onSortChange(value);
  };

  const handleAvailability = (value) => {
    setAvailability(value);
    if (typeof onAvailabilityChange === "function") onAvailabilityChange(value);
  };

  const handleClear = () => {
    setCategory("all");
    setPriceRange("all");
    setSortBy("best");
    setAvailability("all");
    if (typeof onClearFilters === "function") onClearFilters();
  };

  return (
    <div
      className="container "
      style={{
        backgroundColor: "#fefaea",
        padding: "20px",
        borderRadius: "10px",
        color: "#6D1D11",
        width : "100%"
      }}
    >
      <div className="filter-controls d-flex flex-wrap gap-3 align-items-center">
        {/* Filter title */}
        <div className="dropdown-wrapper">
          <button className="btn " type="button">
            <img src={filterimg} alt="" />
            <span style={{ fontSize: "20px", paddingLeft: "20px" }}>Filter</span>
          </button>
        </div>

        {/* Availability */}
        <div className="dropdown-wrapper">
          <button className="filter-dropdown-btn" type="button" data-bs-toggle="dropdown">
            <span>{availabilityLabel}</span>
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" onClick={() => handleAvailability("all")}>All</button></li>
            <li><button className="dropdown-item" onClick={() => handleAvailability("in")}>Out of stock</button></li>
            <li><button className="dropdown-item" onClick={() => handleAvailability("out")}>In stock</button></li>
          </ul>
        </div>

        {/* Category */}
        <div className="dropdown-wrapper">
          <button className="filter-dropdown-btn" type="button" data-bs-toggle="dropdown">
            <span>{category === "all" ? "All Products" : category}</span>
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" onClick={() => handleCategory("all")}>All</button></li>
            {categories.map((cat, index) => (
              <li key={index}>
                <button className="dropdown-item" onClick={() => handleCategory(cat)}>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="dropdown-wrapper">
          <button className="filter-dropdown-btn" type="button" data-bs-toggle="dropdown">
            <span>{priceRange === "all" ? "Price" : priceRange}</span>
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" onClick={() => handlePrice("all")}>All</button></li>
            <li><button className="dropdown-item" onClick={() => handlePrice("0-499")}>₹0 - ₹499</button></li>
            <li><button className="dropdown-item" onClick={() => handlePrice("500-999")}>₹500 - ₹999</button></li>
            <li><button className="dropdown-item" onClick={() => handlePrice("1000-1999")}>₹1000 - ₹1999</button></li>
            <li><button className="dropdown-item" onClick={() => handlePrice("2000+")}>₹2000+</button></li>
          </ul>
        </div>

        {/* Sort */}
        <div className="dropdown-wrapper ms-auto">
          <button className="btn" type="button" data-bs-toggle="dropdown">
            <span>
              {sortBy === "best"
                ? "Sort: Best Selling"
                : sortBy === "price-asc"
                ? "Price: Low to High"
                : sortBy === "price-desc"
                ? "Price: High to Low"
                : "Newest"}
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><button className="dropdown-item" onClick={() => handleSort("best")}>Best Selling</button></li>
            <li><button className="dropdown-item" onClick={() => handleSort("price-asc")}>Price: Low to High</button></li>
            <li><button className="dropdown-item" onClick={() => handleSort("price-desc")}>Price: High to Low</button></li>
            <li><button className="dropdown-item" onClick={() => handleSort("new")}>Newest</button></li>
          </ul>
        </div>

        {/* Clear */}
        <button className="btn btn-sm ms-3" style={{ borderColor: "#FD8B07" }} onClick={handleClear}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
