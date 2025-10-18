import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Car,
  Check,
  Edit,
  LayoutDashboard,
  List,
  PlusSquare,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

export const ownerMenuLinks = [
  {
    name: "Dashboard",
    path: "/owner",
    icon: <LayoutDashboard className="w-5 h-5 text-black" />,
    coloredIcon: <LayoutDashboard className="w-5 h-5 text-primary" />,
  },
  {
    name: "Add car",
    path: "/owner/add-car",
    icon: <PlusSquare className="w-5 h-5 text-black" />,
    coloredIcon: <PlusSquare className="w-5 h-5 text-primary" />,
  },
  {
    name: "Manage Cars",
    path: "/owner/manage-cars",
    icon: <Car className="w-5 h-5 text-black" />,
    coloredIcon: <Car className="w-5 h-5 text-primary" />,
  },
  {
    name: "Manage Bookings",
    path: "/owner/manage-bookings",
    icon: <List className="w-5 h-5 text-black" />,
    coloredIcon: <List className="w-5 h-5 text-primary" />,
  },
];

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();

  const location = useLocation();
  const [image, setImage] = useState("");

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/update-image", formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://images.unplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
            }
            alt=""
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <Edit className="w-4 h-4 text-white" />
          </div>
        </label>
      </div>

      {image && (
        <button
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
          onClick={updateImage}
        >
          Save <Check className="w-3.5 h-3.5 cursor-pointer" />
        </button>
      )}

      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            {link.path === location.pathname ? link.coloredIcon : link.icon}

            <span className="max-md:hidden">{link.name}</span>

            <div
              className={`${
                link.path === location.pathname && "bg-primary"
              } w-1.5 h-8 rounded-l right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
