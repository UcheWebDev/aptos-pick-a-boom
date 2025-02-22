import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Profile"
        className="h-8 w-8 rounded-full"
      />
    </div>
  );
};

export default UserProfile;