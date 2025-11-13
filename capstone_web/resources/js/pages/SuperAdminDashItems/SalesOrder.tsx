import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Download, Plus, MoreHorizontal, List, History, Utensils, Truck, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface OrderRow {
  orderId: string;
  customerName: string;
  orderDate: string;
  orderType: string;
  items: number;
  totalAmount: string;
  paymentMethod: string;
  status: string;
}

interface PaymentRow {
  transactionId: string;
  customer: string;
  paymentDate: string;
  amount: string;
  method: string;
  status: string;
}

type TableRow = OrderRow | PaymentRow;

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-screen flex items-center justify-center font-sans">
      <SalesOrder />
    </div>
  );
};

const SalesOrder = () => {
  const [activeTab, setActiveTab] = useState('All orders');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { label: 'All orders', icon: List },
    { label: 'Payment History', icon: History },
    { label: 'Preparing Orders', icon: Utensils },
    { label: 'Delivery Orders', icon: Truck },
  ];

  const getRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now.setDate(now.getDate() - daysAgo));
    return date.toISOString().split('T')[0];
  };

  const generateMockOrderData = (count: number): OrderRow[] => {
    const mockOrders: OrderRow[] = [];
    const customerNames = ["Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Ethan Hunt", "Fiona Glenanne", "George Costanza", "Hannah Abbott", "Ivy Green", "Jack Reacher"];
    const orderTypes = ["Dine-in", "Take-out", "Delivery"];
    const paymentMethods = ["Credit Card", "Cash", "Online Payment"];
    const statuses = ["Pending", "Preparing", "Delivering", "Completed", "Cancelled"];

    for (let i = 1; i <= count; i++) {
      mockOrders.push({
        orderId: `#${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        orderDate: getRandomDate(),
        orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
        items: Math.floor(1 + Math.random() * 10),
        totalAmount: `₱${(Math.random() * 1000 + 50).toFixed(2)}`,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
    return mockOrders;
  };

  const generateMockPaymentData = (count: number): PaymentRow[] => {
    const mockPayments: PaymentRow[] = [];
    const customerNames = ["Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Ethan Hunt", "Fiona Glenanne", "George Costanza", "Hannah Abbott", "Ivy Green", "Jack Reacher"];
    const methods = ["Credit Card", "Online Transfer", "PayPal"];
    const statuses = ["Success", "Failed", "Refunded"];

    for (let i = 1; i <= count; i++) {
      mockPayments.push({
        transactionId: `TXN${Math.floor(1000000 + Math.random() * 9000000)}`,
        customer: customerNames[Math.floor(Math.random() * customerNames.length)],
        paymentDate: getRandomDate(),
        amount: `₱${(Math.random() * 5000 + 100).toFixed(2)}`,
        method: methods[Math.floor(Math.random() * methods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
    return mockPayments;
  };

  const getTableHeaders = (tab: string) => {
    switch (tab) {
      case 'All orders':
      case 'Preparing Orders':
      case 'Delivery Orders':
        return [
          'Order #',
          'Customer Name',
          'Order Date',
          'Order Type',
          'Items',
          'Total Amount',
          'Payment Method',
          'Status',
        ];
      case 'Payment History':
        return [
          'Transaction ID',
          'Customer',
          'Payment Date',
          'Amount',
          'Method',
          'Status',
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    setLoading(true);
    setSortColumn(null);
    setSortDirection('asc');
    setOpenDropdownId(null);

    const timer = setTimeout(() => {
      setTableData([]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const currentTableHeaders = getTableHeaders(activeTab);

  const handleHeaderClick = (header: string) => {
    const dataKeyMap: { [key: string]: keyof OrderRow | keyof PaymentRow } = {
      'Order #': 'orderId',
      'Customer Name': 'customerName',
      'Order Date': 'orderDate',
      'Order Type': 'orderType',
      'Items': 'items',
      'Total Amount': 'totalAmount',
      'Payment Method': 'paymentMethod',
      'Status': 'status',
      'Transaction ID': 'transactionId',
      'Customer': 'customer',
      'Payment Date': 'paymentDate',
      'Amount': 'amount',
      'Method': 'method',
    };

    const newSortColumn = dataKeyMap[header] || header;

    if (sortColumn === newSortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(newSortColumn);
      setSortDirection('asc');
    }
  };

  const sortedTableData = useMemo(() => {
    if (!sortColumn || tableData.length === 0) {
      return tableData;
    }

    const sortableData = [...tableData];

    sortableData.sort((a, b) => {
      const valA = a[sortColumn as keyof TableRow];
      const valB = b[sortColumn as keyof TableRow];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    return sortableData;
  }, [tableData, sortColumn, sortDirection]);

  const handleActionClick = (action: string, id: string) => {
    console.log(`${action} item with ID: ${id}`);
    setOpenDropdownId(null);
  };

  const renderTableRow = (row: Record<string, any>, index: number) => {
    const renderEmptyCell = (widthClass: string) => (
      <div className={`h-4 ${widthClass} bg-gray-200 rounded animate-pulse`}></div>
    );

    if (loading) {
        switch (activeTab) {
            case 'All orders':
            case 'Preparing Orders':
            case 'Delivery Orders':
                return (
                    <tr key={`loading-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{renderEmptyCell('w-16')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-24')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-20')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-16')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-8')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-12')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-16')}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center justify-between">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {renderEmptyCell('w-16')}
                            </span>
                             {renderEmptyCell('w-8 ml-2')}
                        </td>
                    </tr>
                );
            case 'Payment History':
                return (
                    <tr key={`loading-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{renderEmptyCell('w-20')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-24')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-20')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-12')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderEmptyCell('w-16')}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center justify-between">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {renderEmptyCell('w-16')}
                            </span>
                            {renderEmptyCell('w-8 ml-2')}
                        </td>
                    </tr>
                );
            default:
                return null;
        }
    }

    switch (activeTab) {
        case 'All orders':
        case 'Preparing Orders':
        case 'Delivery Orders':
            const orderRow = row as OrderRow;
            const dropdownId = `order-${orderRow.orderId}-${index}`;

            return (
                <tr key={dropdownId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{orderRow.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderRow.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderRow.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderRow.orderType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderRow.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderRow.totalAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderRow.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center justify-between">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            orderRow.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            orderRow.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                            orderRow.status === 'Delivering' ? 'bg-blue-100 text-blue-800' :
                            orderRow.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {orderRow.status}
                        </span>
                        <div className="relative inline-block text-left ml-2" ref={dropdownRef}>
                            <button
                                type="button"
                                className="inline-flex justify-center items-center p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setOpenDropdownId(openDropdownId === dropdownId ? null : dropdownId)}
                                aria-expanded={openDropdownId === dropdownId ? 'true' : 'false'}
                                aria-haspopup="true"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {openDropdownId === dropdownId && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                    tabIndex={-1}
                                >
                                    <div className="py-1" role="none">
                                        <button
                                            onClick={() => handleActionClick('Edit', orderRow.orderId)}
                                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleActionClick('Archive', orderRow.orderId)}
                                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                        >
                                            Archive
                                        </button>
                                        <button
                                            onClick={() => handleActionClick('Move to trash', orderRow.orderId)}
                                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                        >
                                            Move to trash
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            );
        case 'Payment History':
            const paymentRow = row as PaymentRow;
            const paymentDropdownId = `payment-${paymentRow.transactionId}-${index}`;
            return (
                <tr key={paymentDropdownId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paymentRow.transactionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paymentRow.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paymentRow.paymentDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paymentRow.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paymentRow.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center justify-between">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            paymentRow.status === 'Success' ? 'bg-green-100 text-green-800' :
                            paymentRow.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {paymentRow.status}
                        </span>
                        <div className="relative inline-block text-left ml-2" ref={dropdownRef}>
                            <button
                                type="button"
                                className="inline-flex justify-center items-center p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setOpenDropdownId(openDropdownId === paymentDropdownId ? null : paymentDropdownId)}
                                aria-expanded={openDropdownId === paymentDropdownId ? 'true' : 'false'}
                                aria-haspopup="true"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {openDropdownId === paymentDropdownId && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                    tabIndex={-1}
                                >
                                    <div className="py-1" role="none">
                                        <button
                                            onClick={() => handleActionClick('Edit', paymentRow.transactionId)}
                                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleActionClick('Archive', paymentRow.transactionId)}
                                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                        >
                                            Archive
                                        </button>
                                        <button
                                            onClick={() => handleActionClick('Move to trash', paymentRow.transactionId)}
                                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                        >
                                            Move to trash
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            );
        default:
            return null;
    }
  };


  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg w-full">
      {/* Header and Tabs Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Updated Tab Navigation */}
        <div className="flex flex-wrap flex-grow sm:flex-grow-0 relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`relative z-10 -mr-4 px-6 py-3 transition-all duration-200 text-sm font-medium shadow-md ${
                  isActive
                    ? 'bg-white text-[#8e674a] font-bold z-20'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-50'
                } rounded-t-xl`}
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter search orders"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8cb662] focus:border-transparent transition-colors text-sm"
          />
        </div>
        <button className="flex items-center justify-center px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors w-full sm:w-auto">
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#e0f2f7]">
            <tr>
              {currentTableHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleHeaderClick(header)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {['Order #', 'Customer Name', 'Order Date', 'Order Type', 'Items', 'Total Amount', 'Payment Method', 'Status', 'Transaction ID', 'Customer', 'Payment Date', 'Amount', 'Method'].includes(header) && (
                        sortColumn === (header === 'Order #' ? 'orderId' : header === 'Customer Name' ? 'customerName' : header === 'Order Date' ? 'orderDate' : header === 'Order Type' ? 'orderType' : header === 'Items' ? 'items' : header === 'Total Amount' ? 'totalAmount' : header === 'Payment Method' ? 'paymentMethod' : header === 'Status' ? 'status' : header === 'Transaction ID' ? 'transactionId' : header === 'Customer' ? 'customer' : header === 'Payment Date' ? 'paymentDate' : header === 'Amount' ? 'amount' : header) ? (
                            sortDirection === 'asc' ? (
                                <ArrowUp size={14} className="ml-1" />
                            ) : (
                                <ArrowDown size={14} className="ml-1" />
                            )
                        ) : (
                            <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array(10).fill(null).map((_, index) => renderTableRow({}, index))
            ) : (
              sortedTableData.length > 0 ? (
                sortedTableData.map((row, index) => renderTableRow(row, index))
              ) : (
                <tr>
                  <td colSpan={currentTableHeaders.length} className="px-6 py-4 text-center text-sm text-gray-500">
                    No data available for this section.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesOrder;
