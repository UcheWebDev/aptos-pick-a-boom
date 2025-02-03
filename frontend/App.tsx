import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";

import StakePage from "./pages/StakePage";
import BetDetails from "./pages/BetDetails";
import HistoryPage from "./pages/HistoryPage";
import PickPage from "./pages/PickPage";
import WalletPage from "./pages/Wallet";
import HowTo from "./pages/HowTo";
import StakingPage from "./pages/StakingPage";
import MatchesPage from "./pages/MatchesPage";
import StakeResultsPage from "./pages/StakeResultsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import IndexPage from "./pages/IndexPage";

import Layout from './components/Layout/Layout';
import StakeLayout from './components/Layout/StakeLayout';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout><IndexPage/></Layout>} />
      <Route path="/stake" element={<StakePage />} />
      <Route path="/super-picks" element={<Layout><PickPage /></Layout>} />
      <Route path="/super-picks/:id" element={<StakeLayout><PickPage /></StakeLayout>} />
      <Route path="/leaderboard" element={<Layout><LeaderboardPage /></Layout>} />
      <Route path="/details" element={<BetDetails />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/how-to-play" element={<HowTo />} />
      <Route path="/wager" element={<Layout><StakingPage /></Layout>} />
      <Route path="/matches-page/:id" element={<MatchesPage />} />
      <Route path="/stake-results/:id" element={<StakeResultsPage />} />

    </>,
  ),
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
