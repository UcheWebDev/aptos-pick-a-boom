import { Search, Maximize2, Grid } from "lucide-react";

const HomeHeader = () => {
  return (
    <div className="bg-blue-900 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Grid className="w-8 h-8 text-white" />

        <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2 flex-1 mx-8">
          <button className="px-4 py-1 rounded-full text-white hover:bg-gray-700/50">Exchange</button>
          <button className="px-4 py-1 rounded-full text-white hover:bg-gray-700/50">WEB3</button>
        </div>

        <div className="flex gap-4">
          <Search className="w-6 h-6 text-white" />
          <Maximize2 className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
