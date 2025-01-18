import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, LogOut } from 'lucide-react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: 'Profile' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { icon: <LogOut className="w-5 h-5" />, label: 'Logout' },
  ];

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-50">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className="text-xs md:text-sm w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          onClick={() => {
            console.log(`Clicked ${item.label}`);
            onClose();
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Dropdown;