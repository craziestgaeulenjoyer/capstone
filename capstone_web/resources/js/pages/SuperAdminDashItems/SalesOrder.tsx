import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Download, MoreHorizontal, List, History, Utensils, Truck, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import axios from 'axios';

interface OrderRow {
  orderId: string;
  customerName: string;
  orderDate: string;
  orderType: string;
  items: number;
  totalAmount: string;
  paymentMethod: string;
  status: string;
  fulfillmentMethod?: string;
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

const SalesOrder = () => {
  const [activeTab, setActiveTab] = useState('All orders');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'GCash' | 'Pay on Pickup'>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { label: 'All orders', icon: List },
    { label: 'Payment History', icon: History },
    { label: 'Preparing Orders', icon: Utensils },
    { label: 'Delivery Orders', icon: Truck },
  ];

  useEffect(() => {
    setLoading(true);
    const storedRole = sessionStorage.getItem('dashboard_role');
    const apiRoleSegment = storedRole === 'super_admin' ? 'superadmin' : 'admin';
    const token = localStorage.getItem('token');

    if (activeTab === 'Payment History') {
      axios.get(`/api/${apiRoleSegment}/payment_history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const mapped: PaymentRow[] = res.data.map((p: any) => ({
            transactionId: p.transaction_id,
            customer: p.customer_name,
            paymentDate: new Date(p.created_at).toLocaleDateString(),
            amount: `₱${Number(p.amount).toFixed(2)}`,
            method: p.method,
            status: p.status,
          }));
          setTableData(mapped);
        })
        .catch((err) => console.error('Error fetching payment history:', err))
        .finally(() => setLoading(false));

      return;
    }

    // Fetch orders
    axios.get(`/api/${apiRoleSegment}/sales_orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let data: OrderRow[] = res.data.map((o: any) => ({
          orderId: o.order_code,
          customerName: o.customer_name,
          orderDate: new Date(o.created_at).toLocaleDateString(),
          orderType: o.status === 'preparing' ? 'Preparing' : 'Delivery',
          items: Array.isArray(o.items) ? o.items.length : 0,
          totalAmount: `₱${Number(o.total_amount).toFixed(2)}`,
          paymentMethod: o.payment_method,
          status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
          fulfillmentMethod: o.fulfillment_method,
        }));

        // ===========================
        // APPLY FULFILLMENT FILTERS
        // ===========================
        if (activeTab === 'Preparing Orders') {
          data = data.filter(
            (d) => d.fulfillmentMethod === 'To Pickup on Counter'
          );
        }

        if (activeTab === 'Delivery Orders') {
          data = data.filter((d) => d.fulfillmentMethod === 'To Deliver');
        }

        setTableData(data);
      })
      .catch((err) => console.error('Error fetching orders:', err))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Filter payment history
  const filteredTableData = useMemo(() => {
    if (activeTab !== 'Payment History' || paymentFilter === 'All')
      return tableData;

    return tableData.filter((row) => {
      const r = row as PaymentRow;
      return r.method === paymentFilter;
    });
  }, [tableData, paymentFilter, activeTab]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // --- Table headers & sorting ---
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
        return ['Transaction ID', 'Customer', 'Payment Date', 'Amount', 'Method', 'Status'];

      default:
        return [];
    }
  };

  const currentTableHeaders = getTableHeaders(activeTab);

  const handleHeaderClick = (header: string) => {
    const dataKeyMap: Record<string, keyof (OrderRow & PaymentRow)> = {
      'Order #': 'orderId',
      'Customer Name': 'customerName',
      'Order Date': 'orderDate',
      'Order Type': 'orderType',
      Items: 'items',
      'Total Amount': 'totalAmount',
      'Payment Method': 'paymentMethod',
      Status: 'status',
      'Transaction ID': 'transactionId',
      Customer: 'customer',
      'Payment Date': 'paymentDate',
      Amount: 'amount',
      Method: 'method',
    };

    const newSortColumn = dataKeyMap[header];

    if (sortColumn === newSortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(newSortColumn);
      setSortDirection('asc');
    }
  };

  const sortedTableData = useMemo(() => {
    if (!sortColumn) return filteredTableData;

    return [...filteredTableData].sort((a, b) => {
      const valA = a[sortColumn as keyof TableRow];
      const valB = b[sortColumn as keyof TableRow];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredTableData, sortColumn, sortDirection]);

  // --- Dropdown click outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (action: string, id: string) => {
    console.log(`${action} clicked on ID: ${id}`);
    setOpenDropdownId(null);
  };

  // --- Render Table Rows ---
  const renderTableRow = (row: TableRow, index: number) => {
    const isOrder = 'orderId' in row;

    const dropdownId = isOrder
      ? `order-${(row as OrderRow).orderId}-${index}`
      : `payment-${(row as PaymentRow).transactionId}-${index}`;

    return (
      <tr key={dropdownId}>
        {isOrder ? (
          <>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).orderId}</td>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).customerName}</td>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).orderDate}</td>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).orderType}</td>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).items}</td>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).totalAmount}</td>
            <td className="px-6 py-4 text-gray-900 text-sm">{(row as OrderRow).paymentMethod}</td>
            <td className="px-6 py-4 flex items-center justify-between">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                  (row as OrderRow).status
                )}`}
              >
                {(row as OrderRow).status}
              </span>

              {/* ACTION DROPDOWN */}
              <div className="relative inline-block text-left ml-2" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === dropdownId ? null : dropdownId
                    )
                  }
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  <MoreHorizontal size={20} />
                </button>

                {openDropdownId === dropdownId && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                    <div className="py-1">
                      <button
                        onClick={() =>
                          handleActionClick('Edit', (row as OrderRow).orderId)
                        }
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleActionClick('Archive', (row as OrderRow).orderId)
                        }
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
                      >
                        Archive
                      </button>

                      <button
                        onClick={() =>
                          handleActionClick(
                            'Move to trash',
                            (row as OrderRow).orderId
                          )
                        }
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
                      >
                        Move to trash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="px-6 py-4">{(row as PaymentRow).transactionId}</td>
            <td className="px-6 py-4">{(row as PaymentRow).customer}</td>
            <td className="px-6 py-4">{(row as PaymentRow).paymentDate}</td>
            <td className="px-6 py-4">{(row as PaymentRow).amount}</td>
            <td className="px-6 py-4">{(row as PaymentRow).method}</td>
            <td className="px-6 py-4 flex items-center justify-between">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                  (row as PaymentRow).status
                )}`}
              >
                {(row as PaymentRow).status}
              </span>
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
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
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Filter search orders"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
          />
        </div>

        <button className="flex items-center px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* PAYMENT FILTER */}
      {activeTab === 'Payment History' && (
        <div className="mb-4 text-gray-900 text-sm">
          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value as 'All' | 'GCash' | 'Pay on Pickup')
            }
            className="border px-3 py-2 rounded"
          >
            <option value="All">All</option>
            <option value="GCash">GCash</option>
            <option value="Pay on Pickup">Pay on Pickup</option>
          </select>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#e0f2f7]">
            <tr>
              {currentTableHeaders.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleHeaderClick(header)}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={currentTableHeaders.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : sortedTableData.length ? (
              sortedTableData.map(renderTableRow)
            ) : (
              <tr>
                <td
                  colSpan={currentTableHeaders.length}
                  className="text-center py-4 text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesOrder;
