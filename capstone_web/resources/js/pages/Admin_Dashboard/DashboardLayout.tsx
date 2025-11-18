import React from "react";
import Admin_Navbar from "@/components/Admin_Navbar/Admin_Navbar";
import Dashboard from "@/pages/SuperAdminDashItems/Dashboard";
import Inventory from "@/pages/SuperAdminDashItems/Inventory";
import SalesOrder from "@/pages/SuperAdminDashItems/SalesOrder";
import CustomersContent from "@/pages/SuperAdminDashItems/Customer_View";
import ReportsContent from "@/pages/SuperAdminDashItems/Reports";
import AnalyticsContent from "@/pages/SuperAdminDashItems/Analytics";
import ManageItemsContent from "@/pages/SuperAdminDashItems/Manage_Items";

interface DashboardLayoutProps {
  subpage?: string;
}

export default function DashboardLayout({ subpage }: DashboardLayoutProps) {

  const renderContent = () => {
    switch(subpage) {
      case "inventory": return <Inventory />;
      case "salesorder": return <SalesOrder />;
      case "customers": return <CustomersContent />;
      case "reports": return <ReportsContent />;
      case "analytics": return <AnalyticsContent />;
      case "manage-items": return <ManageItemsContent />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <Admin_Navbar>
        {renderContent()}
      </Admin_Navbar>
    </>
  );
}
