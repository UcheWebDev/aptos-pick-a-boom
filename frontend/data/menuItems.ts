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
  { icon: Target, label: "Stake", path: "/stakings" },
  { icon: Coins, label: "Listings", path: "/super-picks" },
  // { icon: HelpCircle, label: "How to Play", path: "/how-to-play" },
  // { icon: Trophy, label: "Leaderboard" },
  // { icon: Users, label: "Refer A Friend" },
  // { icon: HelpCircleIcon, label: "FAQs" },
  // { icon: FileText, label: "Terms & Conditions" },
  // { icon: Lock, label: "Privacy Policy" },
  // { icon: Shield, label: "Responsible Gambling" },
];

