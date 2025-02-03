import {
  Home,
  Target,
  HelpCircle,
  Trophy,
  Users,
  Download,
  HelpCircleIcon,
  FileText,
  Lock,
  Shield,
  User,
  Coins,
  Wallet,
} from "lucide-react"; import type { MenuItem } from '../types/layout';

export const menuItems: MenuItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Target, label: "Create Wager", path: "/wager" },
  { icon: Coins, label: "Listings", path: "/super-picks" },
  { icon: Trophy, label: "Leaderboard" , path:"/leaderboard"},
  // { icon: Users, label: "Refer A Friend" },
  // { icon: HelpCircleIcon, label: "FAQs" },
  // { icon: FileText, label: "Terms & Conditions" },
  // { icon: Lock, label: "Privacy Policy" },
  // { icon: Shield, label: "Responsible Gambling" },
];

