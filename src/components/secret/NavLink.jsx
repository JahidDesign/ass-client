// src/components/NavLink.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavLink = ({ to, children, onClick }) => {
  return (
    <Link to={to} onClick={onClick} className="relative inline-block group font-medium">
      <span className="relative z-10">{children}</span>
      <motion.span
        layoutId="underline"
        className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </Link>
  );
};

export default NavLink;
