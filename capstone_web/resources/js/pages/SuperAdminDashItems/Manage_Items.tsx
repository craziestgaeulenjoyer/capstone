import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "@/apiClient";

interface MenuItem {
  id: number;
  image_path?: string;
  image: string;
  name: string;
  type: 'food' | 'drink';
  price: string | { regular: string; large?: string };
  categories: string[];
  subcategories: string[];
  description: string;
}

const Manage_Items = () => {
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState('10');
  const [tableData, setTableData] = useState<MenuItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"back" | "discard" | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [regularPrice, setRegularPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");

  const [regularEnabled, setRegularEnabled] = useState(true);
  const [largeEnabled, setLargeEnabled] = useState(true);
  const buttonRefs = useRef<{ [key: number]: HTMLElement | null }>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const DropdownPortal = ({ children }: any) => {
    const el = document.getElementById("dropdown-root");
    return el ? createPortal(children, el) : null;
  };

  const startIndex = (currentPage - 1) * Number(showEntries);

  const [formData, setFormData] = useState<{
    image: File | null;
    existingImagePath?: string | null;
    name: string;
    type: string;
    price: string;
    regularPrice: string;
    largePrice: string;
    categories: string[];
    subcategories: string[];
    description: string;
  }>({
    image: null,
    existingImagePath: null, 
    name: '',
    type: '',
    price: '',
    regularPrice: '',
    largePrice: '',
    categories: [],
    subcategories: [],
    description: '',
  });

  // Category options
  const categories = [
    'Popular',
    'Coffees',
    'Milktea',
    'Lemonade and Fruitti Juice',
    'Premium Matcha',
    'Foods',
  ];

  // Subcategory options
  const subcategoriesMap: Record<string, string[]> = {
    popular: [
      'Coffee',
      'Milktea',
      'Premium Matcha',
      'Specialty Coffee',
      'Lemonade and Fruit Juices',
      'Snacks',
      'Platters',
      'Quesadillas and Korean Corndogs',
      'Croffles',
    ],
    coffees: ['Coffee', 'Specialty Coffee'],
    milktea: ['Classic', 'Special'],
    'lemonade and fruitti juice': ['Lemonade', 'Fruit'],
    'premium matcha': [],
    foods: ['Snacks', 'Platters', 'Croffles', 'Quesadillas & Korean Corndogs'],
  };

  const getApiBase = () => {
    const role = sessionStorage.getItem("dashboard_role") || "";
    const normalizedRole = role.toLowerCase().replace(/[_\s]/g, "");
    return normalizedRole === "superadmin" ? "/superadmin" : "/admin";
  };

  const fetchItems = async () => {
    try {
      const base = getApiBase(); 
      const response = await apiClient.get(`${base}/menu-items`);

      setTableData(response.data.items || []);
    } catch (error: any) {
      console.error("Error fetching menu items:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewMenuClick = () => {
    setEditingItemId(null);

    setRegularPrice("");
    setLargePrice("");
    setRegularEnabled(false);
    setLargeEnabled(false);

    setFormData({
      image: null,
      existingImagePath: null,
      name: '',
      type: '',
      price: '',
      regularPrice: '',
      largePrice: '',
      categories: [],
      subcategories: [],
      description: '',
    });

    setErrors({});
    setIsAddingMenu(true);
  };

  const handleDiscardClick = () => {
    setPendingAction("discard");
    setShowDiscardModal(true);
  };

  const cancelDiscard = () => {
    setShowDiscardModal(false);
    setPendingAction(null);
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    setPendingAction(null);

    setFormData({
      image: null,
      name: "",
      type: "",
      price: "",
      regularPrice: "",
      largePrice: "",
      categories: [],
      subcategories: [],
      description: "",
    });

    setIsAddingMenu(false);
  };

  const handleDropdownToggle = (id: number) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
      return;
    }

    const btn = buttonRefs.current[id];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.right - 120,
    });

    setActiveDropdown(id);
  };

  useEffect(() => {
    const updatePosition = () => {
      if (!activeDropdown) return;

      const btn = buttonRefs.current[activeDropdown];
      if (!btn) return;

      const rect = btn.getBoundingClientRect();

      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 120, // dropdown width
      });
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [activeDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;

    // IMAGE VALIDATION
    if (files && files.length > 0) {
      const file = files[0];

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      // Type validation
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: "Only JPG, JPEG, or PNG files are allowed." }));
        return;
      }

      // Size validation
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, image: "Image must be less than 2MB." }));
        return;
      }

      // Reset error if valid
      setErrors(prev => ({ ...prev, image: "" }));

      setFormData(prev => ({
        ...prev,
        image: file,
        existingImagePath: null,
      }));

      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); 
  };

  const handleMultiSelect = (name: 'categories' | 'subcategories', value: string) => {
    setFormData(prev => {
      const current = prev[name];
      const exists = current.includes(value);
      const updated = exists ? current.filter(c => c !== value) : [...current, value];
      return { ...prev, [name]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let hasError = false;
    const newErrors: { [key: string]: string } = {};

    // --- VALIDATION (same as before) ---
    if (!formData.name.trim()) { newErrors.name = "Name is required."; hasError = true; }
    if (!formData.type) { newErrors.type = "Type is required."; hasError = true; }
    if (formData.categories.length === 0) { newErrors.categories = "Select at least one category."; hasError = true; }

    if (!editingItemId && !formData.image && !formData.existingImagePath) {
      newErrors.image = "Image is required."; hasError = true;
    }

    if (formData.type === "drink" || formData.type === "food") {
      if (!regularEnabled && !largeEnabled) {
        newErrors.regularPrice = "Enable at least one price option.";
        newErrors.largePrice = "Enable at least one price option.";
        hasError = true;
      }
      if (regularEnabled && (!regularPrice.trim() || isNaN(Number(regularPrice)))) {
        newErrors.regularPrice = !regularPrice.trim() ? "Regular price is required." : "Must be a number.";
        hasError = true;
      }
      if (largeEnabled && (!largePrice.trim() || isNaN(Number(largePrice)))) {
        newErrors.largePrice = !largePrice.trim() ? "Large price is required." : "Must be a number.";
        hasError = true;
      }
    } else {
      if (!formData.price.trim() || isNaN(Number(formData.price))) {
        newErrors.price = !formData.price.trim() ? "Price is required." : "Must be a number.";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const base = getApiBase();
      const form = new FormData();

      // --- COMMON FIELDS ---
      form.append("name", formData.name);
      form.append("type", formData.type);
      form.append("description", formData.description || "");

      // --- PRICE ---
      if (formData.type === "drink" || formData.type === "food") {
        if (regularEnabled) form.append("price[regular]", regularPrice);
        if (largeEnabled) form.append("price[large]", largePrice);
      } else {
        form.append("price", formData.price);
      }

      // --- CATEGORIES & SUBCATEGORIES ---
      formData.categories.forEach(cat => form.append("categories[]", cat));
      formData.subcategories.forEach(sub => form.append("subcategories[]", sub));

      // --- IMAGE ---
      if (formData.image) form.append("image", formData.image);

      // --- CREATE OR UPDATE ---
      if (editingItemId) {
        form.append("_method", "PUT");
        await updateMenuItem(editingItemId, form);
      } else {
        await apiClient.post(`${base}/menu-items`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Menu item created successfully!");
        setIsAddingMenu(false);
        setEditingItemId(null);
        fetchItems();
      }
    } catch (error: any) {
      console.error("Error saving:", error.response?.data || error.message);
      alert("Failed to save item. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const updateMenuItem = async (id: number, form: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const base = getApiBase();

      console.log(`PUT ${base}/menu-items/${id}`);
      console.log("FormData for update:", form);

      await apiClient.post(`${base}/menu-items/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Menu item updated successfully!");
      fetchItems();
      setIsAddingMenu(false);
      setEditingItemId(null);
    } catch (error: any) {
      console.error("Error updating menu item:", error.response?.data);
      alert(error.response?.data?.message || "Failed to update.");
    }
  };

  const deleteMenuItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const base = getApiBase();
      await apiClient.delete(`${base}/menu-items/${id}`);

      alert("Menu item deleted successfully!");
      fetchItems();
    } catch (error: any) {
      console.error("Error deleting menu item:", error.response?.data || error.message);
      alert("Failed to delete menu item.");
    }
  };

  const handleSubcategorySelect = (category: string, sub: string) => {
    const key = `${category}:${sub}`;

    setFormData(prev => {
      const exists = prev.subcategories.includes(key);
      return {
        ...prev,
        subcategories: exists
          ? prev.subcategories.filter(s => s !== key)
          : [...prev.subcategories, key]
      };
    });
  };

  const filteredData = tableData.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const entriesPerPage = Number(showEntries);
  const totalFilteredPages = Math.ceil(filteredData.length / entriesPerPage);

  useEffect(() => {
    setTotalPages(totalFilteredPages);
    if (currentPage > totalFilteredPages) setCurrentPage(1);
  }, [filteredData.length, showEntries]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [showEntries, searchTerm]);

  const getPageNumbers = (current: number, total: number) => {
    const delta = 1; 
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | null = null;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l !== null) {
        if (Number(i) - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (Number(i) - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = Number(i);
    }

    return rangeWithDots;
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItemId(item.id);

    let regular = "";
    let large = "";
    let regularEnabled = false;
    let largeEnabled = false;

    // DRINK & FOOD LOGIC
    if ((item.type === "drink" || item.type === "food") && typeof item.price !== "string") {
      regular = item.price.regular || "";
      large = item.price.large || "";

      // Enable inputs if price exists
      if (regular) regularEnabled = true;
      if (large) largeEnabled = true;
    } else if (item.type === "food" && typeof item.price === "string") {
      // fallback: old food price stored as string -> set as regular
      regular = item.price;
      regularEnabled = true;
    }

    setRegularPrice(regular);
    setLargePrice(large);
    setRegularEnabled(regularEnabled);
    setLargeEnabled(largeEnabled);

    // Main form data
    setFormData({
      image: null, 
      name: item.name,
      type: item.type,
      price: "", // keep empty, using regular/large instead
      regularPrice: regular,
      largePrice: large,
      categories: Array.isArray(item.categories)
        ? item.categories
        : String(item.categories).split(",").map((s) => s.trim()),
      subcategories: Array.isArray(item.subcategories)
        ? item.subcategories
        : String(item.subcategories).split(",").map((s) => s.trim()),
      description: item.description,
      existingImagePath: item.image_path || null,
    });

    setIsAddingMenu(true);
  };

  const discardModal = (
    showDiscardModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">

        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            showDiscardModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={cancelDiscard}
        />

        {/* MODAL BOX */}
        <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm z-50">
          <h2 className="text-lg font-semibold text-gray-900">Discard Changes?</h2>
          <p className="text-sm text-gray-600 mt-2">
            Are you sure you want to close? All unsaved changes will be lost.
          </p>

          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={cancelDiscard}
              className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={confirmDiscard}
              className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderTable = () => (
    <>
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <button
          onClick={handleNewMenuClick}
          className="cursor-pointer flex items-center px-4 py-2 bg-[#8CB662] text-white rounded-full shadow hover:bg-[#7a9d59] transition"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Item
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              className="border rounded-md text-sm p-1.5 focus:ring-[#8cb662] text-gray-900"
              value={showEntries}
              onChange={e => setShowEntries(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-64 pl-8 pr-4 py-2 text-sm border rounded-md focus:ring-[#8cb662] text-gray-900"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="w-full text-sm text-left rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-200">
              <tr>
                <th className="w-12 px-4 py-3 text-center text-xs font-bold text-gray-600">#</th>
                <th className="w-24 px-4 py-3 text-center text-xs font-bold text-gray-600">Image</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold text-gray-600">Name</th>
                <th className="w-24 px-4 py-3 text-center text-xs font-bold text-gray-600">Type</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold text-gray-600">Category</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold text-gray-600">Subcategories</th>
                <th className="w-24 px-4 py-3 text-center text-xs font-bold text-gray-600">Price</th>
                <th className="w-64 px-4 py-3 text-center text-xs font-bold text-gray-600">Description</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4 text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, i) => (
                  <tr key={item.id} className="border-t">
                    <td className="text-gray-600 text-center text-sm">{startIndex + i + 1}</td>
                    <td className="text-center">
                      <img
                        src={item.image_path ? `/storage/${item.image_path}` : "/images/placeholder.png"}
                        className="w-12 h-12 object-cover rounded mx-auto"
                      />
                    </td>
                    <td className="text-gray-600 text-center text-sm">{item.name}</td>
                    <td className="text-gray-600 text-center text-sm capitalize">{item.type}</td>
                    <td className="text-gray-600 text-center text-sm">{item.categories.join(", ")}</td>
                    <td className="text-gray-600 text-center text-sm">
                      {[
                        ...new Set(
                          item.subcategories.map((entry) => entry.split(":")[1]) 
                        )
                      ].join(", ")}
                    </td>
                    <td className="text-gray-600 text-center text-sm">
                      {typeof item.price === "string"
                        ? item.price
                        : [
                            item.price.regular ? `${item.price.regular}` : null,
                            item.price.large ? `${item.price.large}` : null
                          ]
                            .filter(Boolean)
                            .join(" / ")}
                    </td>
                    <td className="text-gray-600 text-left text-sm px-4 py-2">
                      {item.description
                        ? item.description.split(" ").slice(0, 10).join(" ") + (item.description.split(" ").length > 10 ? "..." : "")
                        : "-"}
                    </td>
                    <td className="text-center text-xs relative">
                      <button
                        ref={(el) => { buttonRefs.current[item.id] = el; }}
                        onClick={() => handleDropdownToggle(item.id)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                      >
                        <MoreHorizontal className="text-gray-500" />
                      </button>    
                    </td>
                    {activeDropdown === item.id && dropdownPosition && (
                      <DropdownPortal>
                        <div
                          className="fixed z-[9999] bg-white w-24 ml-12 border border-gray-200 rounded-md shadow-lg"
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left
                          }}
                        >
                          <button
                            onClick={() => {
                              handleEditClick(item);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              deleteMenuItem(item.id);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      </DropdownPortal>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition disabled:opacity-50"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-3 py-1 text-gray-500">...</span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(Number(page))}
                      className={`px-3 py-1 border border-gray-300 rounded-full transition
                        ${Number(page) === currentPage ? "bg-[#6CB74A] text-white border-[#6CB74A]" : "hover:text-white hover:bg-[#6CB74A]"}`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full hover:text-white hover:bg-[#6CB74A] transition disabled:opacity-50"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderForm = () => (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold ml-4 text-gray-800">
          {editingItemId ? 'Update Item' : 'Add Item'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        {/* Image Upload */}
        <div className={`mb-4 ${errors.image ? "border border-red-500 rounded-md p-1" : ""}`}>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>

          {formData.image ? (
            <div className="relative w-32 h-32 mt-2">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-full h-full object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, image: null }));
                  setErrors(prev => ({ ...prev, image: "Please upload a new image." }));
                }}
                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : formData.existingImagePath ? (
            <div className="relative w-32 h-32 mt-2">
              <img
                src={`/storage/${formData.existingImagePath}`}
                alt="Existing"
                className="w-full h-full object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, existingImagePath: null }));
                  setErrors(prev => ({ ...prev, image: "Please upload a new image." }));
                }}
                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-1 text-sm text-gray-600 file:bg-[#8cb662] file:text-white file:rounded-full file:px-4 file:py-2"
              />

              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Caramel Iced Coffee"
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 w-full border rounded-md p-2 focus:ring-[#8cb662] text-gray-900 
              ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`mt-1 w-full border rounded-md p-2 focus:ring-[#8cb662] text-gray-700
              ${errors.name ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="" disabled>Select Type</option>
            <option value="food">Food</option>
            <option value="drink">Drink</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type}</p>
          )}
        </div>

        {/* Price Inputs */}
        {(formData.type === "drink" || formData.type === "food") ? (
          <div className="grid grid-cols-2 gap-4">
            {/* REGULAR PRICE */}
            <div className="flex flex-col w-full min-h-[90px]">
              <label className="text-sm font-medium mb-2 text-gray-900">
                Regular Price
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={regularPrice}
                  onChange={(e) => {
                    setRegularPrice(e.target.value);
                    setErrors(prev => ({ ...prev, regularPrice: "" }));
                  }}
                  placeholder="e.g., 120"
                  disabled={!regularEnabled}
                  className={`mt-1 w-full border border-gray-400 rounded-md p-2 focus:ring-[#8cb662] text-gray-700
                    ${errors.regularPrice ? "border-red-500" : ""}
                    ${
                      !regularEnabled
                        ? "bg-gray-200 text-gray-500 placeholder-gray-500 cursor-not-allowed"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    }
                  `}
                />

                <input
                  type="checkbox"
                  checked={regularEnabled}
                  onChange={() => {
                    setRegularEnabled(!regularEnabled);
                    setErrors(prev => ({ ...prev, regularPrice: "" }));
                    if (regularEnabled) setRegularPrice("");
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              {errors.regularPrice && (
                <p className="text-red-600 text-xs mt-1">{errors.regularPrice}</p>
              )}
            </div>

            {/* LARGE PRICE */}
            <div className="flex flex-col w-full min-h-[90px]">
              <label className="text-sm font-medium mb-2 text-gray-900">
                Large Price
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={largePrice}
                  onChange={(e) => {
                    setLargePrice(e.target.value);
                    setErrors(prev => ({ ...prev, largePrice: "" }));
                  }}
                  placeholder="e.g., 150"
                  disabled={!largeEnabled}
                  className={`mt-1 w-full border border-gray-400 rounded-md p-2 focus:ring-[#8cb662] text-gray-700
                    ${errors.largePrice ? "border-red-500" : ""}
                    ${
                      !largeEnabled
                        ? "bg-gray-200 text-gray-500 placeholder-gray-500 cursor-not-allowed"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    }
                  `}
                />

                <input
                  type="checkbox"
                  checked={largeEnabled}
                  onChange={() => {
                    setLargeEnabled(!largeEnabled);
                    setErrors(prev => ({ ...prev, largePrice: "" }));
                    if (largeEnabled) setLargePrice("");
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              {errors.largePrice && (
                <p className="text-red-600 text-xs mt-1">{errors.largePrice}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              placeholder="e.g., 150"
              value={formData.price}
              onChange={handleInputChange}
              className={`mt-1 w-full border border-gray-400 rounded-md p-2 focus:ring-[#8cb662] text-gray-700
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
          </div>
        )}

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => handleMultiSelect('categories', cat)}
                className={`px-3 py-1 text-sm border rounded-full text-gray-900 ${
                  formData.categories.includes(cat)
                    ? 'bg-[#8cb662] text-white border-[#8cb662]'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.categories && (
            <p className="text-red-600 text-xs mt-1">{errors.categories}</p>
          )}
        </div>

        {/* Subcategories */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Subcategories</label>

          {formData.categories.map(category => {
            const subcats = subcategoriesMap[category.toLowerCase()] || [];

            return (
              <div key={category} className="mt-4 rounded-md p-3 bg-gray-50">
                {/* Category header */}
                <div className="bg-[#8cb662] text-white px-3 py-1 rounded-md inline-block mb-2 text-sm font-medium">
                  {category}
                </div>

                {/* Subcategory list */}
                <div className="flex flex-wrap gap-2">
                  {subcats.length === 0 ? (
                    <span className="text-gray-500 text-sm">No subcategories</span>
                  ) : (
                    subcats.map(sub => {
                      const key = `${category}:${sub}`;
                      const isSelected = formData.subcategories.includes(key);

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSubcategorySelect(category, sub)}
                          className={`px-3 py-1 text-sm border rounded-full ${
                            isSelected
                              ? "bg-[#8cb662] text-white border-[#8cb662]"
                              : "border-gray-300 text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            placeholder='e.g., A delicious blend of...'
            onChange={handleInputChange}
            rows={3}
            className={`mt-1 w-full border rounded-md p-2 focus:ring-[#8cb662] text-gray-900
              ${errors.description ? "border-red-500" : "border-gray-300"}`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleDiscardClick}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
          >
            Discard
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              loading ? "bg-green-300 text-white cursor-not-allowed" : "bg-[#8CB662] text-white hover:bg-[#7a9d59]"
            } flex items-center justify-center gap-2`}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {editingItemId ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex justify-center items-start bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-6xl">
        {isAddingMenu ? renderForm() : renderTable()}
        {discardModal}
      </div>
    </div>
  );
};

export default Manage_Items;
