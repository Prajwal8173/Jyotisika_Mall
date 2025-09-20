import React from "react";

const FooterFeatures = () => {
  return (
    <div className="container-fluid bg-warning bg-opacity-25 py-5 px-4">
      <div className="row g-3 align-items-start">
        <div className="col-4 col-md-4 d-flex flex-column align-items-start">
          <h3 className="text-dark fw-bold fs-2 mb-1">Free Delivery</h3>
          <p className="text-dark fs-5 mb-0">For all orders over $50, 
            consectetur adipim scing elit.</p>
        </div>
        <div className="col-4 col-md-4 d-flex flex-column align-items-start">
          <h3 className="text-dark fw-bold fs-2 mb-1">90 Days Return</h3>
          <p className="text-dark fs-5 mb-0">If goods have problems, 
            consectetur adipim scing elit.</p>
        </div>
        <div className="col-4 col-md-4 d-flex flex-column align-items-start">
          <h3 className="text-dark fw-bold fs-2 mb-1">Secure Payment</h3>
          <p className="text-dark fs-5 mb-0">100% secure payment,
             consectetur adipim scing elit.</p>
        </div>
      </div>
    </div>
  );
};

export default FooterFeatures;
