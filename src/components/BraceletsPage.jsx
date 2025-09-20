import React from "react";
import productsData from "../Products";
import rakhi from '../assets/rakhi.png'

const BraceletsPage = () => {
  const bracelets = productsData.filter((p) => p.category === "bracelet");

  return (
    <div className="container mt-5 text-center">
      <h1>Bracelets Collection</h1>
      <div className="row">
        {bracelets.map((product) => (
          <div key={product.id ||rakhi } className="col-md-3 col-lg-3 mb-3">
            <div className="card product-card border-0 text-center h-100">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h6 className="card-title">{product.name}</h6>
                <p>₹{product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BraceletsPage;
