import React from "react";
import Hero from "../components/Hero";
import CarCard from "../components/CarCard";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <>
      {/* <h1>Home</h1> */}
      <Hero />
      {/* <CarCard /> */}
      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </>
  );
};

export default Home;
