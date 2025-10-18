import React from "react";
import { assets } from "../assets/assets";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b"
      >
        <div>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            src={assets.Logo}
            alt="Logo"
            className=" h-8 md:h-9"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-80 mt-3"
          >
            Carvia is your trusted platform for finding, booking, and listing
            cars with ease. Stay connected with us for the latest deals,
            services, and updates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-6"
          >
            <a href="#">
              <Facebook className="w-5 h-5" />
            </a>

            <a href="#">
              <Instagram className="w-5 h-5" />
            </a>

            <a href="#">
              <Twitter className="w-5 h-5" />
            </a>

            <a href="#">
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-between w-1/2 gap-8"
        >
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
              <li>123 Main Street</li>
              <li>Colombo, Sri Lanka</li>
              <li>+94 000 000 0000</li>
              <li>carvia@example.com</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col md:flex-row gap-2 items-center justify-between py-5"
      >
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
      </motion.div>
    </motion.div>
  );
};

export default Footer;
