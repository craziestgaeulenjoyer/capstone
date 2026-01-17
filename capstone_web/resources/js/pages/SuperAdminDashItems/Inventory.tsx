import React, { useEffect, useMemo, useState } from "react";
import api from "@/apiClient";
import {
  MoreHorizontal,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  SlidersHorizontal,
  Plus,
  X,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  supplier?: string | null;
  quantity: number;
  unit: string;
  expiry: string | null;
  status: "In Stock" | "Low" | "Expired Soon" | "Expired";
  updated_at: string | null;
  archived?: boolean;
}

const statusColors: Record<InventoryItem["status"], string> = {
  "In Stock": "bg-emerald-100 text-emerald-700",
  Low: "bg-yellow-100 text-yellow-700",
  "Expired Soon": "bg-orange-100 text-orange-700",
  Expired: "bg-red-100 text-red-700",
};

const Inventory: React.FC = () => {
  // ----- UI & data state -----
  const [inventory, setInventory] = useState<InventoryItem[]>([]); 
  const [archivedInventory, setArchivedInventory] = useState<InventoryItem[]>([]); 
  const [stableData, setStableData] = useState<InventoryItem[]>([]); 
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");

  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); 
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [noExpiry, setNoExpiry] = useState(false);
  const [activity, setActivity] = useState<any[]>([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);

  const calendarRef = React.useRef<HTMLDivElement>(null);

  const itemsPerPage = entriesPerPage;

  // ----- API / auth -----
  const dashboardRole = sessionStorage.getItem("dashboard_role") || "admin";
  const roleMap: Record<string, string> = {
    super_admin: "superadmin",
    admin: "admin",
  };
  const role = roleMap[dashboardRole] || "admin";
  const apiPrefix = `/api/${role}`;

  const token = localStorage.getItem("token");

  // ----- Fetch all inventory (single request) -----
  const fetchInventory = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/${role}/inventory`);
      const data: InventoryItem[] = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((d) => ({
        ...d,
        expiry: d.expiry || null,
        updated_at: d.updated_at || null,
        archived: !!d.archived,
      }));

      const currentItems = normalized.filter((i) => !i.archived);
      const archivedItems = normalized.filter((i) => i.archived);

      setInventory(currentItems);
      setArchivedInventory(archivedItems);

      // Keep the table stable depending on activeTab
      setStableData(activeTab === "current" ? currentItems : archivedItems);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      setInventory([]);
      setArchivedInventory([]);
      setStableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory filtered by month & year (updated_at)
  const fetchFilteredInventory = async (month: number, year: number) => {
    try {
      setLoading(true);

      const res = await api.get(`/${role}/inventory`, {
        params: { month, year },
      });

      const data: InventoryItem[] = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((d) => ({
        ...d,
        expiry: d.expiry || null,
        updated_at: d.updated_at || null,
        archived: !!d.archived,
      }));

      const currentItems = normalized.filter((i) => !i.archived);
      const archivedItems = normalized.filter((i) => i.archived);

      setInventory(currentItems);
      setArchivedInventory(archivedItems);
      setStableData(activeTab === "current" ? currentItems : archivedItems);

    } catch (err) {
      console.error("Filter fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    setStableData(activeTab === "current" ? inventory : archivedInventory);
    setCurrentPage(1);
  }, [activeTab, inventory, archivedInventory]);

  // ----- Derived metrics always from active (non-archived) inventory -----
  const activeItems = inventory;

  const totalActive = activeItems.length;

  const lowestInStock = useMemo(() => {
    if (activeItems.length === 0) return undefined;
    return activeItems.slice().sort((a, b) => a.quantity - b.quantity)[0];
  }, [activeItems]);

  const lowStockCount = activeItems.filter((i) => i.quantity > 0 && i.quantity <= 5).length;

  const today = new Date();
  const in7days = new Date();
  in7days.setDate(today.getDate() + 7);

  const nearingExpiry = activeItems.filter(
    (i) => i.expiry && new Date(i.expiry) >= today && new Date(i.expiry) <= in7days
  );

  const latestRestocked = useMemo(() => {
    if (activeItems.length === 0) return undefined;
    return activeItems
      .slice()
      .sort((a, b) => {
        const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return tb - ta;
      })[0];
  }, [activeItems]);

  const upcomingExpiry = activeItems
    .filter((i) => i.expiry)
    .slice()
    .sort((a, b) => new Date(a.expiry!).getTime() - new Date(b.expiry!).getTime())
    .slice(0, 5);

  const recentActivities = activeItems
    .slice()
    .sort((a, b) => {
      const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 6)
    .map((it) => ({
      title: `${it.name} updated`,
      date: it.updated_at
        ? new Date(it.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "-",
    }));

  // ----- Helpers -----
  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";

  // ----- CRUD operations (refresh data after each operation) -----
  const handleSave = async (payload: Partial<InventoryItem>) => {
    try {
      setLoading(true);
      if (editingItem) {
        await api.put(`/${role}/inventory/${editingItem.id}`, payload);
      } else {
        await api.post(`/${role}/inventory`, payload);
      }
      await fetchInventory();
      setModalOpen(false);
      setEditingItem(null);

      window.location.reload();
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        console.error("Unauthorized: Check your token or session role");
      } else if (err.response && err.response.data) {
        // optional: map backend validation errors into UI
        console.error(err.response.data);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await api.delete(`/${role}/inventory/${id}`);
      await fetchInventory();
      setMenuOpen(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      setLoading(true);
      await api.patch(`/${role}/inventory/archive/${id}`);
      await fetchInventory();
      setMenuOpen(null);
    } catch (err) {
      console.warn("Archive endpoint failed or not available, refreshing locally instead", err);
      // fallback: refresh locally by refetching
      await fetchInventory();
      setMenuOpen(null);
    } finally {
      setLoading(false);
    }
  };

  // ----- Table: search + pagination using stableData -----
  const filteredItems = useMemo(() => {
    let tempItems = [...stableData];

    // Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      tempItems = tempItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.category.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by Status
    if (selectedFilters.length > 0) {
      tempItems = tempItems.filter((item) => selectedFilters.includes(item.status));
    }

    // Remove UI month-year filtering if backend fetchFilteredInventory is already doing it
    if (!filterOpen && !sortOpen && selectedFilters.length === 0 && searchTerm === "") {
      // do NOT apply month filter again
    } else if (selectedDate) {
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();

      tempItems = tempItems.filter((item) => {
        if (!item.updated_at) return false;
        const updated = new Date(item.updated_at);
        return updated.getMonth() === selectedMonth && updated.getFullYear() === selectedYear;
      });
    }

    // Sort
    switch (selectedSort) {
      case "Name (A-Z)":
        tempItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Stock (Low to High)":
        tempItems.sort((a, b) => a.quantity - b.quantity);
        break;
      case "Stock (High to Low)":
        tempItems.sort((a, b) => b.quantity - a.quantity);
        break;
      case "Expiry (Soonest)":
        tempItems.sort(
          (a, b) => (a.expiry ? new Date(a.expiry).getTime() : Infinity) - (b.expiry ? new Date(b.expiry).getTime() : Infinity)
        );
        break;
      default:
        break;
    }

    return tempItems;
  }, [stableData, searchTerm, selectedFilters, selectedSort, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const paginatedItemsWithRefs = useMemo(
    () =>
      paginatedItems.map((p) => ({
        ...p,
        ref: React.createRef<HTMLDivElement>(),
      })),
    [paginatedItems]
  );

  // ----- Modal form state -----
  const [form, setForm] = useState<Partial<InventoryItem>>({
    name: "",
    category: "",
    quantity: 0,
    unit: "pcs",
    expiry: null,
    status: "In Stock",
  });

  useEffect(() => {
    if (editingItem) {
      setForm(editingItem);
    } else {
      setForm({ name: "", category: "", quantity: 0, unit: "pcs", expiry: null, status: "In Stock" });
    }

    setErrors({});
  }, [editingItem, modalOpen]);

  useEffect(() => {
    if (editingItem) {
      setNoExpiry(!editingItem.expiry);
    } else {
      setNoExpiry(false);
    }
  }, [editingItem, modalOpen]);

  const validateForm = (form: Partial<InventoryItem>) => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.trim() === "") errs.name = "Name is required.";
    if (!form.category || form.category.trim() === "") errs.category = "Category is required.";
    if (form.quantity === undefined || form.quantity < 0) errs.quantity = "Quantity must be >= 0.";
    if (!form.unit || form.unit.trim() === "") errs.unit = "Unit is required.";
    if (form.expiry && new Date(form.expiry) < new Date()) errs.expiry = "Expiry cannot be in the past.";
    if (!form.status) errs.status = "Status is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ----- DropdownPortal (keeps dropdown bound to table item ref) -----
  const DropdownPortal = ({
    children,
    targetRef,
    onClose,
  }: {
    children: React.ReactNode;
    targetRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
  }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom,
          left: rect.left,
        });
      }
    };

    useEffect(() => {
      updatePosition();
      const handleScrollResize = () => updatePosition();
      window.addEventListener("scroll", handleScrollResize, true);
      window.addEventListener("resize", handleScrollResize);

      const handleClickOutside = (e: MouseEvent) => {
        if (
          targetRef.current &&
          !targetRef.current.contains(e.target as Node) &&
          !(document.getElementById("dropdown-portal")?.contains(e.target as Node))
        ) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("scroll", handleScrollResize, true);
        window.removeEventListener("resize", handleScrollResize);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [targetRef, onClose]);

    if (!targetRef.current) return null;

    return createPortal(
      <div
        id="dropdown-portal"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width: "8%",
          zIndex: 9999,
        }}
      >
        {children}
      </div>,
      document.body
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
    fetchFilteredInventory(
      date.getMonth() + 1,
      date.getFullYear()
    );
  };

  const handleExportCSV = () => {
    const dataToExport = filteredItems.length > 0 ? filteredItems : stableData;

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Product Name", "Category", "Supplier", "Quantity", "Unit", "Expiry Date", "Status", "Last Updated"];

    const rows = dataToExport.map(item => [
      item.name,
      item.category,
      item.supplier || "No Supplier",
      item.quantity,
      item.unit,
      item.expiry ? new Date(item.expiry).toLocaleDateString() : "-",
      item.status,
      item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `inventory_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeSuppliersCount = useMemo(() => {
    const supplierSet = new Set(
      inventory
        .filter((i) => !i.archived && i.supplier && i.supplier.trim() !== "")
        .map((i) => i.supplier)
    );
    return supplierSet.size;
  }, [inventory]);

  const supplierStats = useMemo(() => {
    const map: Record<string, number> = {};

    activeItems.forEach((item) => {
      if (item.supplier && item.supplier.trim() !== "") {
        map[item.supplier] = (map[item.supplier] || 0) + 1;
      }
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]); 
  }, [activeItems]);

  const fetchActivity = async (page = 1) => {
    try {
      const res = await api.get(
        `/${role}/inventory/logs`,
        {
          params: { page },
        }
      );

      setActivity(res.data.data);
      setActivityPage(res.data.current_page);
      setActivityTotalPages(res.data.last_page);
    } catch (error) {
      console.error("Failed to fetch inventory activity logs:", error);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative">
        <div>
          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="bg-[#8cb662] text-white px-4 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#7ca551] cursor-pointer transition"
          >
            <Plus size={16} />
            Add Inventory Item
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#6CB74A] text-white rounded-lg shadow hover:bg-[#5aa03f] cursor-pointer transition"
          >
            <Upload size={16} /> Export
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-white rounded-lg shadow hover:bg-[#6CB74A] cursor-pointer transition"
            >
              <SlidersHorizontal size={16} /> {selectedSort || "Sort By"}
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn z-10">
                {[
                  "Name (A-Z)",
                  "Stock (Low to High)",
                  "Stock (High to Low)",
                  "Expiry (Soonest)",
                ].map((option) => (
                  <button
                    key={option}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setSelectedSort(option);
                      setSortOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-white rounded-lg shadow hover:bg-[#6CB74A] cursor-pointer transition"
            >
              <Filter size={16} /> {selectedFilters.length > 0 ? selectedFilters.join(", ") : "Filter By"}
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn z-10">
                {["In Stock", "Low", "Expired Soon", "Expired"].map((status) => (
                  <label key={status} className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedFilters.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFilters([...selectedFilters, status]);
                        } else {
                          setSelectedFilters(selectedFilters.filter((f) => f !== status));
                        }
                        setCurrentPage(1);
                      }}
                    />
                    {status}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Month-Year Only */}
          <div className="relative group" ref={calendarRef}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none 
                  text-gray-800 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
              </svg>
            </span>

            {/* Input */}
            <input
              type="text"
              value={`${currentDate.toLocaleString('en-US', { month: 'long' })} ${currentDate.getFullYear()}`}
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
              className="pl-10 pr-4 py-2 shadow rounded-lg text-gray-800 font-medium cursor-pointer text-center w-44
                        focus:outline-none hover:text-white hover:bg-[#6CB74A] 
                        transition-colors"
            />

            {showCalendar && (
              <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-xl z-10 w-64">

                {/* YEAR PICKER HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()))}
                    className="p-1 rounded-full hover:bg-[#8cb662] text-gray-700"
                  >
                    ‹
                  </button>

                  <span className="font-bold text-lg text-gray-800">
                    {currentDate.getFullYear()}
                  </span>

                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()))}
                    className="p-1 rounded-full hover:bg-[#8cb662] text-gray-700"
                  >
                    ›
                  </button>
                </div>

                {/* MONTH BUTTON GRID */}
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const monthDate = new Date(currentDate.getFullYear(), idx);
                    const isSelected = idx === currentDate.getMonth();

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentDate(monthDate);
                          setShowCalendar(false);
                          handleMonthChange(monthDate);
                        }}
                        className={`py-2 rounded-lg text-sm font-medium transition ${
                          isSelected
                            ? "bg-[#8cb662] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-[#8cb662] hover:text-white"
                        }`}
                      >
                        {monthDate.toLocaleString("en-US", { month: "short" })}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className={`bg-white rounded-xl border border-gray-200 shadow-md p-5`}>
          <p className="text-sm text-gray-500">Latest Products Restocked</p>
          <h2 className={`text-2xl font-bold text-emerald-600 mt-1`}>{latestRestocked ? `${latestRestocked.name}` : "—"}</h2>
          <span className="text-xs text-gray-400">{latestRestocked ? formatDate(latestRestocked.updated_at) : "Awaiting data"}</span>
        </div>

        <div className={`bg-white rounded-xl border border-gray-200 shadow-md p-5`}>
          <p className="text-sm text-gray-500">Lowest Items in Stock</p>
          <h2 className={`text-2xl font-bold text-red-600 mt-1`}>{lowestInStock ? `${lowestInStock.name} (${lowestInStock.quantity})` : "—"}</h2>
          <span className="text-xs text-gray-400">{lowStockCount > 0 ? `${lowStockCount} items low` : "None"}</span>
        </div>

        <div className={`bg-white rounded-xl border border-gray-200 shadow-md p-5`}>
          <p className="text-sm text-gray-500">Stock Nearing Expiry</p>
          <h2 className={`text-2xl font-bold text-orange-600 mt-1`}>{nearingExpiry.length}</h2>
          <span className="text-xs text-gray-400">items expiring within 7 days</span>
        </div>

        <div className={`bg-white rounded-xl border border-gray-200 shadow-md p-5`}>
          <p className="text-sm text-gray-500">Total Active Products</p>
          <h2 className={`text-2xl font-bold text-blue-600 mt-1`}>{totalActive}</h2>
          <span className="text-xs text-gray-400">All categories</span>
        </div>

        <div className={`bg-white rounded-xl border border-gray-200 shadow-md p-5`}>
          <p className="text-sm text-gray-500">Archived Products</p>
          <h2 className={`text-2xl font-bold text-gray-600 mt-1`}>{archivedInventory.length}</h2>
          <span className="text-xs text-gray-400">Archived items</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-5">
          <p className="text-sm text-gray-500">Suppliers Active</p>

          {supplierStats.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xl">
              {supplierStats.map(([name, count], i) => (
                <li key={i} className="font-semibold text-purple-700">
                  {name} <span className="text-gray-500">({count})</span>
                </li>
              ))}
            </ul>
          ) : (
            <h2 className="text-2xl font-bold text-purple-600 mt-1">—</h2>
          )}

          <span className="text-xs text-gray-400">
            {supplierStats.length > 0
              ? `Tracking ${supplierStats.length} supplier${supplierStats.length > 1 ? "s" : ""}`
              : "Awaiting data"}
          </span>
        </div>
      </div>

      {/* Product Inventory Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl border-[#8cb662]/40 mb-4">
          <div className="flex w-full relative overflow-hidden">
            <button
              onClick={() => {
                setActiveTab("current");
                setCurrentPage(1);
              }}
              className={`flex-1 text-center py-3 font-medium relative cursor-pointer ${
                activeTab === "current" ? "text-[#8cb662]" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Current Inventory
              {activeTab === "current" && (
                <motion.div
                  layoutId="inventory-underline"
                  className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#6CB74A]"
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("archived");
                setCurrentPage(1);
              }}
              className={`flex-1 text-center py-3 font-medium relative cursor-pointer ${
                activeTab === "archived" ? "text-[#8cb662]" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Archived Inventory
              {activeTab === "archived" && (
                <motion.div
                  layoutId="inventory-underline"
                  className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#6CB74A]"
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Entries & Search */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <label className="text-sm text-gray-600 mr-2">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600 ml-2">entries</span>
          </div>

          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search product or category"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6CB74A] transition"
            />
            <Search size={16} className="absolute left-2 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-hidden max-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.table
              key={activeTab + searchTerm + currentPage + entriesPerPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="w-full text-sm text-left rounded-lg overflow-hidden border border-gray-200"
            >
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  {["Product Name", "Category", "Supplier", "Quantity", "Unit", "Expiry Date", "Status", "Last Updated", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>

              <motion.tbody layout>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-4">
                      No data has been fetched.
                    </td>
                  </tr>
                ) : (
                  paginatedItemsWithRefs.map((p, idx) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className={`${p.supplier ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                          {p.supplier || "No Supplier"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.quantity}</td>
                      <td className="px-4 py-3">{p.unit}</td>
                      <td className="px-4 py-3">{p.expiry ? formatDate(p.expiry) : "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-sm rounded-full font-medium ${statusColors[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.updated_at ? formatDate(p.updated_at) : "-"}</td>
                      <td className="px-4 py-3 relative">
                        <button
                          ref={p.ref}
                          onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          <MoreHorizontal className="text-gray-500" />
                        </button>

                        {menuOpen === p.id && (
                          <DropdownPortal targetRef={p.ref} onClose={() => setMenuOpen(null)}>
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                onClick={() => {
                                  setEditingItem(p);
                                  setModalOpen(true);
                                  setMenuOpen(null);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                onClick={() => {
                                  handleArchive(p.id);
                                  setMenuOpen(null);
                                }}
                              >
                                Archive
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  handleDelete(p.id);
                                  setMenuOpen(null);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </DropdownPortal>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </motion.table>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <span
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-full cursor-pointer ${currentPage === i + 1 ? "bg-[#6CB74A] text-white border-gray-300" : "border-gray-300"}`}
              >
                {i + 1}
              </span>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
          <h3 className="font-bold text-lg mb-3 text-[#6CB74A]">Upcoming Expiry / Restock</h3>
          <div className="space-y-3 text-sm">

            {activeItems.length === 0 ? (
              <p className="text-gray-500">No data.</p>
            ) : (
              activeItems
                .filter((item) => item.expiry) // must have expiry date
                .sort((a, b) => new Date(a.expiry!).getTime() - new Date(b.expiry!).getTime())
                .slice(0, 5) // still show only 5 items
                .map((item) => {
                  const expiryDate = new Date(item.expiry!);
                  const isExpired = expiryDate < new Date();
                  const formatted = expiryDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  });

                  return (
                    <div
                      key={item.id}
                      className={`flex justify-between p-2 rounded-md ${
                        isExpired
                          ? "bg-red-100 text-red-700 font-semibold"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <span>{item.name}</span>
                      <span>
                        {isExpired
                          ? `Expired — Available for Restock`
                          : `Expiring: ${formatted}`}
                      </span>
                    </div>
                  );
                })
            )}

          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
          <h3 className="font-bold text-lg mb-3 text-[#6CB74A]">Recent Inventory Activities</h3>
          <ul className="space-y-3 text-sm">
            {activity.length === 0 ? (
              <p className="text-gray-500">No activity.</p>
            ) : (
              activity.map((log, i) => (
                <li key={i}>
                  <p className="text-gray-900 font-semibold capitalize">
                    {log.action} — {log.inventory?.name || "Deleted Item"}
                    {" — "}
                    <span className="text-blue-600">
                      {log.performed_by || "Unknown"}
                    </span>
                  </p>

                  {log.changed_fields && (
                    <div className="mt-1 text-xs text-gray-600 italic space-y-1">
                      <p>Modified:</p>
                      <ul className="ml-4 list-disc">
                        {Object.entries(log.changed_fields).map(
                          ([field, values]: any) => (
                            <li key={field}>
                              <span className="capitalize">{field}</span>:{" "}
                              <span className="text-gray-800">
                                {values.old ?? "none"}
                              </span>{" "}
                              →{" "}
                              <span className="text-gray-800">
                                {values.new ?? "none"}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <span className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>

          <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
            <button
              disabled={activityPage === 1}
              onClick={() => fetchActivity(activityPage - 1)}
              className="px-3 py-1 rounded-full border border-gray-300 hover:bg-[#6cb74a] hover:text-white disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex gap-2">
              {Array.from({ length: activityTotalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => fetchActivity(i + 1)}
                  className={`px-3 py-1 rounded-full border ${
                    activityPage === i + 1
                      ? "bg-[#6cb74a] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={activityPage === activityTotalPages}
              onClick={() => fetchActivity(activityPage + 1)}
              className="px-3 py-1 rounded-full border border-gray-300 hover:bg-[#6cb74a] hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray bg-opacity-20 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setModalOpen(false);
              setEditingItem(null);
            }}
          ></div>

          {/* Modal box */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-y-auto max-h-[90vh] border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingItem ? "Update Inventory" : "Add Inventory"}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition"
              >
                <X className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const payload: Partial<InventoryItem> = {
                  name: (e.target as any).name.value,
                  category: (e.target as any).category.value,
                  supplier: (e.target as any).supplier.value || null,
                  quantity: parseInt((e.target as any).quantity.value, 10) || 0,
                  unit: (e.target as any).unit.value,
                  expiry: noExpiry
                    ? null
                    : (e.target as any).expiry.value || null,
                  status: (e.target as any).status.value,
                };

                if (!validateForm(payload)) return;
                handleSave(payload);
              }}
              className="space-y-4 p-6"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name || ""}
                  placeholder="e.g., Caramel Iced Coffee"
                  className={`mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm placeholder:text-sm placeholder:text-gray-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#8cb662] transition ${
                    errors.name ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingItem?.category || ""}
                    placeholder="e.g., Coffee"
                    className={`mt-1 w-full border border-gray-300 rounded-lg p-2.5 bg-white shadow focus:ring-[#8cb662] ${errors.category ? "border-red-500" : ""}`}
                  />
                  {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                  <input
                    type="text"
                    name="supplier"
                    defaultValue={editingItem?.supplier || ""}
                    placeholder="e.g., Juan Dela Cruz Supplies"
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 bg-white shadow text-sm placeholder:text-gray-400 focus:ring-[#8cb662]"
                  />
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={editingItem?.quantity ?? 0}
                    className={`mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm placeholder:text-sm placeholder:text-gray-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#8cb662] transition ${
                      errors.quantity ? "border-red-500 ring-1 ring-red-500" : ""
                    }`}
                    required
                  />
                  {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue={editingItem?.unit || "pcs"}
                    className={`mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm placeholder:text-sm placeholder:text-gray-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#8cb662] transition ${
                      errors.unit ? "border-red-500 ring-1 ring-red-500" : ""
                    }`}
                  />
                  {errors.unit && <p className="text-sm text-red-500 mt-1">{errors.unit}</p>}
                </div>
              </div>

              {/* Expiry & Status */}
              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Expiry Date</label>

                  <input
                    type="date"
                    name="expiry"
                    disabled={noExpiry}
                    value={
                      noExpiry
                        ? ""
                        : editingItem?.expiry
                        ? new Date(editingItem.expiry).toISOString().slice(0, 10)
                        : form.expiry || ""
                    }
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, expiry: e.target.value }))
                    }
                    className={`mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm shadow-md
                      focus:outline-none focus:ring-2 focus:ring-[#8cb662] transition
                      ${errors.expiry ? "border-red-500 ring-1 ring-red-500" : ""}
                    `}
                  />

                  {/* Checkbox below input */}
                  <label className="flex gap-2 items-center mt-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={noExpiry}
                      onChange={(e) => {
                        setNoExpiry(e.target.checked);
                        if (e.target.checked) {
                          setForm((prev) => ({ ...prev, expiry: null }));
                        }
                      }}
                    />
                    No Expiry
                  </label>

                  {errors.expiry && (
                    <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Status</label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || "In Stock"}
                    className={`mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm shadow-md
                      focus:outline-none focus:ring-2 focus:ring-[#8cb662] transition
                      ${errors.status ? "border-red-500 ring-1 ring-red-500" : ""}
                    `}
                    required
                  >
                    <option>In Stock</option>
                    <option>Low</option>
                    <option>Expired Soon</option>
                    <option>Expired</option>
                  </select>
                  {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingItem(null);
                    setErrors({});
                  }}
                  className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 cursor-pointer rounded-lg bg-[#8cb662] text-white hover:bg-[#7ca551] transition">
                  {editingItem ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
