// components/CustomLoader.tsx
import React from "react";

export const CustomLoader = () => (
  <div className="relative flex items-center justify-center w-16 h-16">
    <div
      className="absolute w-full h-full border-4 rounded-full animate-spin"
      style={{
        borderColor: "transparent",
        borderTopColor: "#f59e0b",
        borderRightColor: "#ec4899",
        background: "linear-gradient(to right, #f59e0b, #ec4899)",
        WebkitBackgroundClip: "text",
      }}
    ></div>
    <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg">
      <span className="text-2xl font-bold text-amber-500">P</span>
    </div>
  </div>
);

export default CustomLoader;
