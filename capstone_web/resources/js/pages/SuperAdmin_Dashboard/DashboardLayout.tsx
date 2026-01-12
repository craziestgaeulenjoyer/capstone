import SuperAdminNavbar from "@/components/SuperAdmin_Navbar/SuperAdminNavbar";
import Dashboard from "@/pages/SuperAdminDashItems/Dashboard";
import Inventory from "@/pages/SuperAdminDashItems/Inventory";
import SalesOrder from "@/pages/SuperAdminDashItems/SalesOrder";
import CustomersContent from "@/pages/SuperAdminDashItems/Customer_View";
import EventsTable from "../SuperAdminDashItems/EventsTable";
import ReportsContent from "@/pages/SuperAdminDashItems/Reports";
import AnalyticsContent from "@/pages/SuperAdminDashItems/Analytics";
import ManageItemsContent from "@/pages/SuperAdminDashItems/Manage_Items";
import TeamsContent from "@/pages/SuperAdminDashItems/Teams";


interface DashboardLayoutProps {
  subpage?: string;
}

export default function DashboardLayout({ subpage }: DashboardLayoutProps) {

  const renderContent = () => {
    switch(subpage) {
      case "inventory": return <Inventory />;
      case "salesorder": return <SalesOrder />;
      case "customers": return <CustomersContent />;
      case "events": return <EventsTable />;
      case "reports": return <ReportsContent />;
      case "analytics": return <AnalyticsContent />;
      case "manage-items": return <ManageItemsContent />;
      case "teams": return <TeamsContent />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <SuperAdminNavbar>
        {renderContent()}
      </SuperAdminNavbar>
    </>
  );
}
