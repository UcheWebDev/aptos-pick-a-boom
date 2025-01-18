import React from "react";

const SpinButton = () => {
  return (
    <div className="flex items-center text-center justify-center">
      <div className="w-5 h-5 border-4 border-white border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
};

export default SpinButton;
