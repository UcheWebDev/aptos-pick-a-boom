import React from 'react';

const SidebarProfile: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-700">John Doe</p>
          <p className="text-xs text-gray-500">john@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;