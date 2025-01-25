import React from "react";
import { MenuItem } from "../../types/layout";
import { Link, useLocation } from "react-router-dom";

const NavItem: React.FC<MenuItem> = ({ icon: Icon, label, path }) => {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
        location.pathname === path ? "bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-white" : "text-gray-500"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export default NavItem;
