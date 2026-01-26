import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Download, MoreHorizontal, List, History, Utensils, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '@/apiClient';

interface OrderItem {
  name: string;
  type: string;
  size?: string;
  quantity: number;
  price: number;
  is_free: boolean;
  instructions?: string;
}

interface OrderRow {
  orderId: string;
  customerName: string;
  orderDate: string;
  orderType: string;
  items: number;
  itemsRaw?: OrderItem[]; 
  totalAmount: string;
  paymentMethod: string;
  status: string;
  fulfillmentMethod?: string;
}

interface PaymentRow {
  transactionId: string;
  orderId?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<OrderRow | null>(null);

  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { label: 'All orders', icon: List },
    { label: 'Payment History', icon: History },
    { label: 'Preparing Orders', icon: Utensils },
    { label: 'Delivery Orders', icon: Truck },
    { label: 'Archived Orders', icon: History },
  ];

  const statusLabelMap: Record<string, string> = {
    pending: 'Pending',
    preparing: 'Paid',
    completed: 'Completed',
    canceled: 'Canceled',
  };

  const statusToApiMap: Record<string, string> = {
    Pending: 'pending',
    Paid: 'preparing',
    Completed: 'completed',
    Canceled: 'canceled',
  };

  const formatFulfillment = (value?: string) => {
    if (!value) return '—';
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getApiRoleBase = () => {
    const role = sessionStorage.getItem('dashboard_role') || '';
    const normalized = role.toLowerCase().replace(/[_\s]/g, '');
    return normalized === 'superadmin' ? '/superadmin' : '/admin';
  };

  const storedRole = sessionStorage.getItem('dashboard_role');
  const apiRoleSegment =
    storedRole === 'super_admin' ? 'superadmin' : 'admin';

  const token = localStorage.getItem('token') ?? '';

  useEffect(() => {
    if (activeTab === 'Archived Orders') {
      setLoading(false);
      return;
    }

    setLoading(true);
    const base = getApiRoleBase();

    if (activeTab === 'Payment History') {
      apiClient
        .get(`${base}/sales_orders`)
        .then((res) => {
          const mapped: PaymentRow[] = res.data
            .filter((o: any) => o.status === 'completed' || o.status === 'paid')
            .map((o: any) => ({
              transactionId: o.transaction_id ?? '—',
              orderId: o.order_code, 
              customer: o.customer_name,
              paymentDate: new Date(o.created_at).toLocaleDateString(),
              amount: `₱${Number(o.total_amount).toFixed(2)}`,
              method: o.payment_method,
              status: 'Completed',
            }));

          setTableData(mapped);
        })
        .catch((err) =>
          console.error('Error fetching payment history:', err)
        )
        .finally(() => setLoading(false));

      return;
    }

    // Fetch orders
    apiClient
      .get(`${base}/sales_orders`)
      .then((res) => {
        let data: OrderRow[] = res.data.map((o: any) => ({
          orderId: o.order_code,
          customerName: o.customer_name,
          orderDate: new Date(o.created_at).toLocaleDateString(),
          orderType: formatFulfillment(o.fulfillment_method),
          items: Array.isArray(o.items) ? o.items.length : 0,
          itemsRaw: Array.isArray(o.items) ? o.items : [], 
          totalAmount: `₱${Number(o.total_amount).toFixed(2)}`,
          paymentMethod: o.payment_method,
          status: statusLabelMap[o.status] ?? o.status,
          fulfillmentMethod: o.fulfillment_method,
        }));

        // ===========================
        // APPLY FULFILLMENT FILTERS
        // ===========================
        if (activeTab === 'Preparing Orders') {
          data = data.filter(
            (d) => d.status === 'Pending' || d.status === 'Paid'
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
      case 'ARCHIVED_UI_ONLY':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchArchivedOrders = async () => {
    const base = getApiRoleBase();

    const res = await apiClient.get(`${base}/sales_orders/archived`);

    const mapped: OrderRow[] = res.data.map((o: any) => ({
      orderId: o.order_code,
      customerName: o.customer_name,
      orderDate: new Date(o.created_at).toLocaleDateString(),
      orderType: formatFulfillment(o.fulfillment_method),
      items: Array.isArray(o.items) ? o.items.length : 0,
      itemsRaw: Array.isArray(o.items) ? o.items : [],
      totalAmount: `₱${Number(o.total_amount).toFixed(2)}`,
      paymentMethod: o.payment_method ?? '—',
      status: 'ARCHIVED_UI_ONLY',
    }));

    setTableData(mapped);
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
      return [
        'Transaction ID',
        'Customer',
        'Payment Date',
        'Amount',
        'Method',
        'Status',
      ];
      case 'Archived Orders':
      return [
        'Order ID',
        'Customer',
        'Order Date',
        'Order Type',
        'Items',
        'Total',
        'Payment',
        'Status',
      ];

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

  const totalPages = Math.ceil(sortedTableData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedTableData.slice(start, end);
  }, [sortedTableData, currentPage, rowsPerPage]);

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

  const handleActionClick = async (action: string, id: string) => {
    try {
      if (action === 'Edit') {
        const order = tableData.find(
          (row) => 'orderId' in row && row.orderId === id
        ) as OrderRow | undefined;

        if (!order) return;

        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsEditModalOpen(true);
        return;
      }

      if (action === 'Archive') {
        const base = getApiRoleBase();

        await apiClient.patch(`${base}/sales_orders/${id}/archive`);

        setTableData((prev) =>
          prev.filter(
            (row) => !('orderId' in row && row.orderId === id)
          )
        );
      }

      if (action === 'Trash') {
        if (!confirm('Are you sure you want to permanently delete this order?')) {
          return;
        }

        const base = getApiRoleBase();

        await apiClient.delete(`${base}/sales_orders/${id}`);

        setTableData((prev) =>
          prev.filter(
            (row) => !('orderId' in row && row.orderId === id)
          )
        );
      }
    } catch (err) {
      console.error(`Failed to ${action}`, err);
      alert(`Failed to ${action.toLowerCase()} order.`);
    } finally {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, paymentFilter]);

  // --- Render Table Rows ---
  const renderTableRow = (row: TableRow, index: number) => {
    if (activeTab === 'Payment History') {
      const payment = row as PaymentRow;
      const dropdownId = `payment-${payment.transactionId}-${index}`;

      return (
        <tr key={dropdownId}>
          <td className="px-6 py-4 text-gray-900 text-sm">
            {payment.transactionId}
          </td>
          <td className="px-6 py-4 text-gray-900 text-sm">
            {payment.customer}
          </td>
          <td className="px-6 py-4 text-gray-900 text-sm">
            {payment.paymentDate}
          </td>
          <td className="px-6 py-4 text-gray-900 text-sm">
            {payment.amount}
          </td>
          <td className="px-6 py-4 text-gray-900 text-sm">
            {payment.method}
          </td>

          {/* STATUS + ACTIONS */}
          <td className="px-6 py-4 flex items-center justify-between">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                payment.status
              )}`}
            >
              {payment.status}
            </span>

            {/* ACTION DROPDOWN */}
            <div
              className="relative inline-block text-left ml-2"
              ref={dropdownRef}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();

                  setDropdownPosition({
                    top: rect.bottom + 6,
                    left: rect.right - 180,
                    width: 180,
                  });

                  setOpenDropdownId(
                    openDropdownId === dropdownId ? null : dropdownId
                  );
                }}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    const order = row as OrderRow;
    const dropdownId = `order-${order.orderId}-${index}`;

    return (
      <tr key={dropdownId}>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.orderId}
        </td>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.customerName}
        </td>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.orderDate}
        </td>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.orderType}
        </td>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.items}
        </td>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.totalAmount}
        </td>
        <td className="px-6 py-4 text-gray-900 text-sm">
          {order.paymentMethod}
        </td>
        <td className="px-6 py-4 flex items-center justify-between">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
              order.status
            )}`}
          >
            {order.status === 'ARCHIVED_UI_ONLY' ? 'Archived' : order.status}
          </span>

          {/* ACTION DROPDOWN */}
          <div
            className="relative inline-block text-left ml-2"
            ref={dropdownRef}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                setDropdownPosition({
                  top: rect.bottom + 6,
                  left: rect.right - 180,
                  width: 180,
                });

                setOpenDropdownId(
                  openDropdownId === dropdownId ? null : dropdownId
                );   
              }}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const exportCurrentTabToCSV = () => {
    if (!sortedTableData.length) {
      alert('No data to export.');
      return;
    }

    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeTab === 'Payment History') {
      headers = [
        'Transaction ID',
        'Customer',
        'Payment Date',
        'Amount',
        'Method',
        'Status',
      ];

      rows = sortedTableData.map((row) => {
        const r = row as PaymentRow;
        return [
          r.transactionId,
          r.customer,
          r.paymentDate,
          r.amount,
          r.method,
          r.status,
        ];
      });
    } else {
      headers = [
        'Order #',
        'Customer Name',
        'Order Date',
        'Order Type',
        'Items',
        'Total Amount',
        'Payment Method',
        'Status',
      ];

      rows = sortedTableData.map((row) => {
        const r = row as OrderRow;
        return [
          r.orderId,
          r.customerName,
          r.orderDate,
          r.orderType,
          r.items,
          r.totalAmount,
          r.paymentMethod,
          r.status === 'ARCHIVED_UI_ONLY' ? 'Archived' : r.status,
        ];
      });
    }

    const csvContent =
      [
        headers.join(','),
        ...rows.map((row) =>
          row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab.replace(/\s+/g, '_').toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeTab === 'Archived Orders') {
      setLoading(true);
      fetchArchivedOrders()
        .catch((err) => console.error('Failed to fetch archived orders', err))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <div className="w-full">
      <div className="relative bg-white border border-gray-200 rounded-3xl shadow-lg w-full">
        {/* TABS + EXPORT */}
        <div className="flex items-center justify-between px-6 pt-6">
          {/* Tabs */}
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.label;

              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`-mr-2 px-5 py-3 text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'bg-white text-[#8e674a] font-bold border-b-2 border-[#8e674a]'
                        : 'cursor-pointer text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Export button */}
          <button
            onClick={exportCurrentTabToCSV}
            className="cursor-pointer flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      
        <div className="px-6 pb-6 pt-4">
          {/* SEARCH */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            {/* ROWS PER PAGE */}
            <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <span>Rows:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
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
          <div className="overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 relative z-0">
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

              <tbody className="bg-white divide-y divide-gray-200 relative overflow-visible">
                {loading ? (
                  <tr>
                    <td colSpan={currentTableHeaders.length} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : sortedTableData.length ? (
                  paginatedData.map(renderTableRow)
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

            <div className="flex justify-between items-center mt-6 px-2 pb-3 text-sm text-gray-600">
              {/* PREVIOUS */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center gap-2 px-4 py-1.5 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              {/* PAGE NUMBERS */}
              <div className="flex items-center gap-3 mx-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`min-w-[36px] text-center px-3 py-1.5 border rounded-full transition ${
                      currentPage === i + 1
                        ? 'bg-[#6CB74A] text-white border-gray-300'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* NEXT */}
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="flex items-center gap-2 px-4 py-1.5 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Edit Order Status</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Order #
              </label>
              <div className="text-sm font-medium text-gray-900">
                {selectedOrder.orderId}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border text-gray-900 rounded-lg px-3 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                disabled={savingStatus}
                onClick={async () => {
                  try {
                    setSavingStatus(true);
                    const base = getApiRoleBase();

                    await apiClient.put(
                      `${base}/sales_orders/${selectedOrder.orderId}/status`,
                      { status: statusToApiMap[newStatus] }
                    );

                    setTableData((prev) =>
                      prev.map((row) =>
                        'orderId' in row && row.orderId === selectedOrder.orderId
                          ? { ...row, status: newStatus }
                          : row
                      )
                    );

                    setIsEditModalOpen(false);
                  } catch (err) {
                    console.error('Failed to update status', err);
                    alert('Failed to update order status.');
                  } finally {
                    setSavingStatus(false);
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#6CB74A] text-white hover:bg-green-600 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailsOpen && detailsOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Details — {detailsOrder.orderId}
            </h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {detailsOrder.itemsRaw?.map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl p-4 flex flex-col gap-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.type} {item.size ? `• ${item.size}` : ''}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-900">Qty: {item.quantity}</p>
                      <p className="text-gray-900">₱{item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {item.is_free && (
                      <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 mr-2">
                        Free Item
                      </span>
                    )}
                  </div>

                  {item.instructions && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Instructions:</span>{' '}
                      {item.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="cursor-pointer px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openDropdownId && dropdownPosition && (
        <div
          className="fixed z-[9999]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {activeTab !== 'Payment History' && (
                <button
                  onClick={async () => {
                    if (!openDropdownId) return;

                    const row = tableData.find(
                      (r): r is OrderRow =>
                        'orderId' in r &&
                        typeof r.orderId === 'string' &&
                        openDropdownId.includes(r.orderId)
                    );

                    if (!row) return;

                    try {
                      const base = getApiRoleBase();

                      const res = await apiClient.get(
                        `${base}/sales_orders/${row.orderId}`
                      );

                      setDetailsOrder({
                        orderId: res.data.orderId,
                        customerName: res.data.customerName,
                        orderDate: res.data.orderDate,
                        orderType: res.data.orderType,
                        items: res.data.itemsRaw.length,
                        itemsRaw: res.data.itemsRaw,
                        totalAmount: res.data.totalAmount,
                        paymentMethod: res.data.paymentMethod,
                        status: res.data.status,
                      });

                      setIsDetailsOpen(true);
                      setOpenDropdownId(null);
                    } catch (err) {
                      console.error('Failed to load order details', err);
                    }
                  }}
                  className="cursor-pointer w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
                >
                  View Details
                </button>
              )}

              {activeTab !== 'Payment History' && activeTab !== 'Archived Orders' && (
                <>
                  <button
                    onClick={() => {
                      const order = tableData.find(
                        (r): r is OrderRow =>
                          'orderId' in r &&
                          typeof r.orderId === 'string' &&
                          openDropdownId?.includes(r.orderId)
                      );
                      if (!order) return;
                      handleActionClick('Edit', order.orderId);
                    }}
                    className="cursor-pointer w-full px-4 py-2 text-left text-gray-900 text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      const order = tableData.find(
                        (r): r is OrderRow =>
                          'orderId' in r &&
                          typeof r.orderId === 'string' &&
                          openDropdownId?.includes(r.orderId)
                      );
                      if (!order) return;
                      handleActionClick('Archive', order.orderId);
                    }}
                    className="cursor-pointer w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-yellow-50"
                  >
                    Archive
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  const order = tableData.find(
                    (r): r is OrderRow =>
                      'orderId' in r &&
                      typeof r.orderId === 'string' &&
                      openDropdownId?.includes(r.orderId)
                  );
                  if (!order) return;
                  handleActionClick('Trash', order.orderId);
                }}
                className="cursor-pointer w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrder;
