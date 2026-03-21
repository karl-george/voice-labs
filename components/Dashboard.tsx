import HeroPattern from '@/components/HeroPattern';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import TextInputPanel from '@/components/TextInputPanel';
import QuickActionsPanel from '@/components/QuickActionsPanel';

const Dashboard = () => {
  return (
    <div className="relative">
      <Header title="Dashboard" className="lg:hidden" />
      <HeroPattern />

      <div className="relative space-y-8 p-4 lg:p-16">
        <DashboardHeader />
        <TextInputPanel />
        <QuickActionsPanel />
      </div>
    </div>
  );
};
export default Dashboard;
