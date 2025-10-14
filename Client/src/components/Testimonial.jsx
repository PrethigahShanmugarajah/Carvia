import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Anjali Kumar",
      location: "Jaffna, Sri Lanka",
      image: assets.testimonial_image_1,
      testimonial:
        "Amazing service! Renting a car was so smooth and hassle-free. Highly recommend for anyone looking for luxury vehicles.",
    },
    {
      name: "Meena Rajan",
      location: "Trincomalee, Sri Lanka",
      image: assets.testimonial_image_2,
      testimonial:
        "The experience was fantastic! The staff was friendly and the car was in perfect condition.",
    },
    {
      name: "Karthik Selvan",
      location: "Batticaloa, Sri Lanka",
      image: assets.testimonial_image_1,
      testimonial:
        "Very professional and reliable service. Renting a car has never been this easy in Sri Lanka!",
    },

    {
      name: "Nadeesha Perera",
      location: "Colombo, Sri Lanka",
      image: assets.testimonial_image_2,
      testimonial:
        "Excellent service and top-quality cars. I will definitely rent from here again!",
    },
    {
      name: "Dilan Fernando",
      location: "Kandy, Sri Lanka",
      image: assets.testimonial_image_1,
      testimonial:
        "Smooth and seamless process. The car was exactly as advertised. Highly satisfied!",
    },
    {
      name: "Kasun Jayawardena",
      location: "Galle, Sri Lanka",
      image: assets.testimonial_image_2,
      testimonial:
        "Very trustworthy service and easy booking. I had a great experience renting a luxury car!",
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="Hear From Our Clients"
        subTitle="See why luxury car enthusiasts trust CarRental for their premium vehicle experiences."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  // <img src={assets.star_icon} alt="Star Icon" key={index} />
                  <Star
                    key={index}
                    style={{
                      fill: "var(--color-primary)",
                      // stroke: "var(--color-primary)",
                      strokeWidth: "0",
                    }}
                  />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
