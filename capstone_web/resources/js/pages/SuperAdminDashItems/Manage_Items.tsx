import React, { useState, useEffect, useRef } from 'react';

// Define the interface for a menu item
interface MenuItem {
  id: number;
  image: string;
  name: string;
  price: string;
  description: string;
}

const App = () => {
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState('10');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    image: null as File | null,
    number: '',
    name: '',
    price: '',
    description: '',
  });

  // Explicitly type the data array to resolve the implicit 'any[]' error
  const data: MenuItem[] = [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const filteredEntries = data.filter(entry =>
    Object.values(entry).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedEntries = filteredEntries.slice(0, parseInt(showEntries, 10));

  const handleNewMenuClick = () => {
    setIsAddingMenu(true);
  };

  const handleBackClick = () => {
    setIsAddingMenu(false);
    setFormData({
      image: null,
      number: '',
      name: '',
      price: '',
      description: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You would typically handle form submission logic here (e.g., API call)
    handleBackClick(); // Go back to the table after submission
  };
  
  const handleDropdownToggle = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const renderTable = () => (
    <>
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <button
          onClick={handleNewMenuClick}
          className="flex items-center px-4 py-2 bg-[#8CB662] text-white rounded-full shadow hover:bg-[#7a9d59] transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Menu
        </button>
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              className="rounded-md border border-gray-300 text-sm p-1.5 focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-64 pl-8 pr-4 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price (₱)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No data available in table
                  </td>
                </tr>
              ) : (
                paginatedEntries.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <img src={entry.image} alt={entry.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.price}</td>
                    <td className="px-4 py-4 whitespace-normal text-sm text-gray-900 max-w-xs">{entry.description}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                      <button onClick={() => handleDropdownToggle(entry.id)} className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 2a2 2 0 104 0 2 2 0 00-4 0z"></path>
                        </svg>
                      </button>
                      {activeDropdown === entry.id && (
                        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            <li>
                              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Edit
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                Archive
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Move to Trash
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-gray-600 space-y-2 sm:space-y-0">
          <span>Showing {data.length > 0 ? 1 : 0} to {data.length} of {data.length} entries</span>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-not-allowed"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );

 const renderForm = () => (
    <div className="p-5">
      <div className="flex items-center mb-2 max-h-screen">
        <button onClick={handleBackClick} className="mr-4 text-[#8cb662] hover:text-[#71964d] transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Add Menu</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <div className="mt-1 flex items-center space-x-3">
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8cb662] file:text-white hover:file:bg-[#7a9d59] cursor-pointer"
            />
            <span className="text-sm text-gray-500">{formData.image ? formData.image.name : 'No file chosen'}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Number</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8CB662] hover:bg-[#7a9d59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex justify-center items-center max-h-screen bg-gray-100 p-4 ">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-10xl">
        {isAddingMenu ? renderForm() : renderTable()}
      </div>
    </div>
  );
};

export default App;