import { Link } from "react-router-dom";
import {
  Clock,
  Gift,
  History,
  List,
  Bell,
  Settings,
  User,
  Database,
  GamepadIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const UserProfile = () => {
  const menuItems = [
    { icon: <List className="w-6 h-6 text-gray-600" />, title: "My Bets" },
    { icon: <Database className="w-6 h-6 text-gray-600" />, title: "Bonuses" },
    {
      icon: <Clock className="w-6 h-6 text-gray-600" />,
      title: "Transaction History",
    },
    { icon: <Gift className="w-6 h-6 text-gray-600" />, title: "Gifts" },
    { icon: <User className="w-6 h-6 text-gray-600" />, title: "Networks" },
    { icon: <Bell className="w-6 h-6 text-gray-600" />, title: "Alerts" },
  ];

  return (
    <div className="min-h-screen bg-[#0a1428]">
      {/* Header Section */}
      <div className="mb-6  p-4 ">
        <div className="flex items-center gap-3 mb-4 p-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div>
            <p className="text-white text-sm">UID: 8125808</p>
          </div>
        </div>

        {/* Balance Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400"> Total Balance</span>
            <span className="font-medium text-gray-400">APT 33.69</span>
          </div>

          <div className="flex gap-4">
            <Link
              to="/stake"
              className="flex-1 py-2 px-4 rounded-full border border-gray-300 text-center text-gray-300
             hover:bg-gray-700 
            hover:text-white font-medium"
            >
              STAKE
            </Link>
            <Link
              to="/play"
              className="flex-1 py-2 px-4 rounded-full
                  bg-emerald-400 text-center
                 text-gray-800 font-semibold  
                 hover:bg-blue-500 hover:text-white font-medium"
            >
              PLAY
            </Link>
          </div>
        </div>

        {/* Profile Settings Section */}
        <div>
          <h2 className="text-gray-400 mb-4 p-2">Explore Transactions ...</h2>
          {/* <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="p-4 flex flex-col  items-center justify-center gap-2 cursor-pointer"
              >
                {item.icon}
                <span className="text-gray-600 text-sm text-center">
                  {item.title}
                </span>
              </Card>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
