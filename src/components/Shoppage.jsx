import React from 'react'
import home from '../assets/Rectangle.png'

function Shoppage() {
    return (


        <div>
            <div className="row" style={{ backgroundColor: "#fefaea" }}>
                <div className='col-2 '>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/bxn4s0bj_expires_30_days.png"}
                        className="ml-5 mt-3 " style={{ height: "100px", width: "200px", objectFit: "contain" }}
                        alt="Logo"
                    />
                </div>
                <div className=" col-8 flex items-center mt-3" style={{ fontSize: "20px", fontWeight: "500" }} >
                    <span className="text-center" >
                        {"Products"}
                    </span>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/2eksad0c_expires_30_days.png"}
                        className="w-6 h-6 mr-[26px] object-fill"
                        alt="Arrow"
                    />
                    <span className="text-[#1E1E1E] text-base mr-[3px]" >
                        {"Shop by purpose"}
                    </span>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/0xrbgk8b_expires_30_days.png"}
                        className="w-6 h-6 mr-[26px] object-fill"
                        alt="Arrow"
                    />
                    <span className="text-[#1E1E1E] text-base mr-[3px]" >
                        {"Siddh collection"}
                    </span>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/04d5owxb_expires_30_days.png"}
                        className="w-6 h-6 mr-[26px] object-fill"
                        alt="Arrow"
                    />
                    <span className="text-[#1E1E1E] text-base mr-0.5" >
                        {"Sawan Sale"}
                    </span>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/m3pjo81t_expires_30_days.png"}
                        className="w-6 h-6 mr-[26px] object-fill"
                        alt="Arrow"
                    />
                    <span className="text-[#1E1E1E] text-base mr-[3px]" >
                        {"Astro Stone"}
                    </span>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/9qfvy7ii_expires_30_days.png"}
                        className="w-6 h-6 mr-[26px] object-fill"
                        alt="Arrow"
                    />
                    <span className="text-[#1E1E1E] text-base mr-[3px]" >
                        {"Festival"}
                    </span>
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/zc73xk90_expires_30_days.png"}
                        className="w-6 h-6 object-fill"
                        alt="Arrow"
                    />


                </div>
                <div className='col-2 mt-3 ' style={{ display: "grid", gridTemplateColumns: " repeat(5, 1fr)" }} >
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/usti218l_expires_30_days.png"}
                        className="icon-img"
                        alt="Icon"
                    />
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/rdyh30hu_expires_30_days.png"}
                        className="icon-img"
                        alt="Icon"
                    />
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/206cicc1_expires_30_days.png"}
                        className="icon-img "
                        alt="Icon"
                    />
                </div>
            </div>


            <div
                id="carouselExampleIndicators"
                className="carousel slide "
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="0"
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                    ></button>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src={home}
                            className="d-block w-100"
                            alt="Slide 1"
                        />
                    </div>

                </div>

            </div>
        </div>

    )
}

export default Shoppage;