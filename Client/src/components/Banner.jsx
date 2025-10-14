import React from "react";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#5C3A21] to-[#D9A66A] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden">
      {/* <div>
        <h2>Do You Own a Luxury Car?</h2>
        <p>Monetize your vwchicle effortessly by lisiting it on CarRental.</p>
        <p>
          We take care of insurance, driver verification and secure payments -
          so you can earn passive income, stress-free.
        </p>
      </div> */}

      <div className="text-white">
        <h2 className="text-3xl font-medium">Turn Your Car into Income</h2>
        <p className="mt-2">
          Earn effortlessly by listing your luxury vehicle on CarRental.
        </p>
        <p className="max-w-130">
          We handle insurance, driver checks, and secure payments — letting you
          generate passive income without any hassle.
        </p>
        {/* <button>List your car</button> */}
        <button className="px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer">
          Start Earning with Your Car
        </button>
      </div>

      <img src={assets.Banner_Car_Image} alt="Car" className="max-h-45 mt-10" />
    </div>
  );
};

export default Banner;
