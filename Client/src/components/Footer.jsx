import React from "react";
import { assets } from "../assets/assets";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500">
      <div className="flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b">
        <div>
          <img src={assets.Logo} alt="logo" className=" h-8 md:h-9" />
          <p className="max-w-80 mt-3">
            Carvia is your trusted platform for finding, booking, and listing
            cars with ease. Stay connected with us for the latest deals,
            services, and updates.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {/* -------- Facebook -------- */}
            <a href="#">
              {/* <img
                src={assets.facebook_logo}
                alt="Facebook"
                className="w-5 h-5"
              /> */}
              <Facebook className="w-5 h-5" />
            </a>

            {/* -------- Instagram -------- */}
            <a href="#">
              {/* <img
                src={assets.instagram_logo}
                alt="Facebook"
                className="w-5 h-5"
              /> */}
              <Instagram className="w-5 h-5" />
            </a>

            {/* -------- Twitter -------- */}
            <a href="#">
              {/* <img
                src={assets.twitter_logo}
                alt="Facebook"
                className="w-5 h-5"
              /> */}
              <Twitter className="w-5 h-5" />
            </a>

            {/* -------- Gmail -------- */}
            <a href="#">
              {/* <img src={assets.gmail_logo} alt="Facebook" className="w-5 h-5" /> */}
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Quick Links
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Browse Cars</a>
            </li>
            <li>
              <a href="#">List Your Cars</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Resources
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Insurance</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Contact
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            <li>Stree address</li>
            <li>City and Country</li>
            <li>Phone Number</li>
            <li>email</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} Carvia. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Cookies</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
