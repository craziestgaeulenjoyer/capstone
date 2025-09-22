import React, { useState } from "react";
import {
  MoreHorizontal,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
  SlidersHorizontal,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: string;
  status: "In Stock" | "Low" | "Expired Soon" | "Expired";
  lastUpdated: string;
}

const mockProducts: Product[] = [
  { id: 1, name: "Espresso Beans", category: "Beverage", quantity: 120, unit: "packs", expiry: "-", status: "In Stock", lastUpdated: "May 21, 2025" },
  { id: 2, name: "Milk Cartons", category: "Dairy", quantity: 4, unit: "boxes", expiry: "May 28, 2025", status: "Low", lastUpdated: "May 20, 2025" },
  { id: 3, name: "Croissants", category: "Pastry", quantity: 15, unit: "pcs", expiry: "May 25, 2025", status: "Expired Soon", lastUpdated: "May 21, 2025" },
  { id: 4, name: "Matcha Powder", category: "Beverage", quantity: 30, unit: "packs", expiry: "-", status: "In Stock", lastUpdated: "May 19, 2025" },
  { id: 5, name: "Chocolate Chips", category: "Baking", quantity: 2, unit: "packs", expiry: "Jun 1, 2025", status: "Expired", lastUpdated: "May 15, 2025" },
  { id: 6, name: "Coffee Creamer", category: "Dairy", quantity: 7, unit: "bottles", expiry: "May 27, 2025", status: "Low", lastUpdated: "May 20, 2025" },
  { id: 7, name: "Baguettes", category: "Pastry", quantity: 0, unit: "pcs", expiry: "May 24, 2025", status: "Expired", lastUpdated: "May 22, 2025" },
];

const statusColors: Record<Product["status"], string> = {
  "In Stock": "bg-emerald-100 text-emerald-700",
  Low: "bg-yellow-100 text-yellow-700",
  "Expired Soon": "bg-orange-100 text-orange-700",
  Expired: "bg-red-100 text-red-700",
};

const Inventory: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Filters
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-6 relative">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6CB74A] text-white rounded-lg shadow hover:bg-[#5aa03f] transition">
          <Upload size={16} /> Export
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-white rounded-lg shadow hover:bg-[#6CB74A] transition"
          >
            <SlidersHorizontal size={16} /> Sort By
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn z-10">
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Name (A-Z)</button>
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Stock (Low to High)</button>
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Expiry (Soonest)</button>
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-white rounded-lg shadow hover:bg-[#6CB74A] transition"
          >
            <Filter size={16} /> Filter By
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn z-10">
              <label className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <input type="checkbox" className="mr-2" /> In Stock
              </label>
              <label className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <input type="checkbox" className="mr-2" /> Low Stock
              </label>
              <label className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <input type="checkbox" className="mr-2" /> Expired Soon
              </label>
              <label className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <input type="checkbox" className="mr-2" /> Expired
              </label>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-white rounded-lg shadow hover:bg-[#6CB74A] transition">
          <Calendar size={16} />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {[
          { title: "Latest Products Restocked", value: "30 cans", sub: "+10 units", color: "emerald" },
          { title: "Lowest Items in Stock", value: "4 boxes", sub: "-2 sales", color: "red" },
          { title: "Stock Nearing Expiry", value: "3 days left", sub: "+11 items", color: "orange" },
          { title: "Total Active Products", value: "120 items", sub: "All categories", color: "blue" },
          { title: "Archived Products", value: "12 items", sub: "Removed or unused", color: "gray" },
          { title: "Suppliers Active", value: "8 partners", sub: "Updated May 20", color: "purple" },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`
             bg-white rounded-xl shadow-md p-5 border border-gray-200 transition transform hover:-translate-y-1 hover:shadow-2xl
               hover:bg-${card.color}-100 hover:border-${card.color}-400
             `}
            >
             <p className="text-sm text-gray-500">{card.title}</p>
             <h2 className={`text-2xl font-bold text-${card.color}-600 mt-1`}>{card.value}</h2>
             <span className="text-xs text-gray-400">{card.sub}</span>
          </div>
        ))}
     </div>

      {/* Product Inventory Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h3 className="font-bold text-lg">Product Inventory</h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-400 rounded-full  focus:outline-none focus:ring-2 focus:ring-[#6CB74A] transition"
            />
            <Search size={16} className="absolute left-2 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                {["Product Name", "Category", "Quantity", "Unit", "Expiry Date", "Status", "Last Updated", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.quantity}</td>
                  <td className="px-4 py-3">{p.unit}</td>
                  <td className="px-4 py-3">{p.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.lastUpdated}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <MoreHorizontal className="text-gray-500" />
                    </button>
                    {menuOpen === p.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Archive</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition">
            <ChevronLeft size={14} /> Previous
          </button>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-[#6CB74A] border border-gray-300 text-white rounded-full hover:bg-[#6CB74A] transition">1</span>
            <span className="px-3 py-1 border border-gray-300 rounded-full hover:text-white hover:bg-[#6CB74A] transition">2</span>
            <span className="px-3 py-1 border border-gray-300 rounded-full hover:text-white hover:bg-[#6CB74A] transition">3</span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Widgets Below Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#6CB74A] rounded-xl shadow-md p-4">
          <h3 className="font-bold text-lg mb-3 text-[#6CB74A]">Upcoming Expiry / Restock</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Mocha Syrup</span>
              <span className="text-emerald-600">Restock - May 23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Croissants</span>
              <span className="text-orange-600">Expiring - May 25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Milk Cartons</span>
              <span className="text-emerald-600">Restock - May 25</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#6CB74A] rounded-xl shadow-md p-4">
          <h3 className="font-bold text-lg mb-3 text-[#6CB74A]">Recent Inventory Activities</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <p className="text-gray-800 font-medium">Anna Velasco added restocked Espresso Beans</p>
              <span className="text-xs text-gray-500">May 22</span>
            </li>
            <li>
              <p className="text-gray-800 font-medium">Jomar Santos updated Sugar Pack</p>
              <span className="text-xs text-gray-500">May 21</span>
            </li>
            <li>
              <p className="text-gray-800 font-medium">Carla Mendez removed expired Milk Carton</p>
              <span className="text-xs text-gray-500">May 20</span>
            </li>
            <li>
              <p className="text-gray-800 font-medium">Renz Villanueva added new Matcha Powder</p>
              <span className="text-xs text-gray-500">May 19</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inventory;




