const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 shadow-md navbar z-50">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">Fpl</span>
        </div>

        <div className="hidden md:flex space-x-6">
          <a
            href="#"
            className="nav-item text-white hover:text-blue-600 active:text-blue-600"
          >
            L2 Bridge
          </a>
          <a href="#" className="nav-item text-white hover:text-blue-600">
            Create
          </a>
          <a href="#" className="nav-item text-white hover:text-blue-600">
            Join
          </a>
          <a href="#" className="nav-item text-white hover:text-blue-600">
            Leagues
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-black">
            <span className="text-white">0 O-Points</span>
          </div>
          <button className="flex items-center space-x-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
            <span>Connect wallet</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
