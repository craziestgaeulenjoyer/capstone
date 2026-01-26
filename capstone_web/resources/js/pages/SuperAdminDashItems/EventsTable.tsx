import React, { useState, useEffect } from 'react';
import { 
    MoreHorizontal, ChevronLeft, ChevronRight, Search, Calendar, 
    MapPin, Phone, Eye, Download, Inbox, Filter, CheckCircle2, Clock, AlertCircle,
    SearchX, Users, X
} from "lucide-react";
import api from "@/apiClient";
import { createPortal } from "react-dom";

const DropdownPortal = ({ children }: { children: React.ReactNode }) => {
    return createPortal(children, document.body);
};

// --- INTERFACES ---
interface EventItem {
    id: number;
    full_name: string;
    phone_number: string;
    event_type: string;
    event_date: string;
    estimated_pax: number;
    venue_location: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const EventsTable: React.FC = () => {
    // --- STATES ---
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showEntries, setShowEntries] = useState<string>('10');
    const [tableData, setTableData] = useState<EventItem[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

    // --- MODAL STATES ---
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    const brandGreen = "#5A8531"; 
    const brandBrown = "#2D1A11"; 

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    const StatusBadge = ({ status }: { status: EventItem['status'] }): React.JSX.Element => {
        const styles = {
            Pending: "bg-amber-50 text-amber-600 border-amber-200",
            Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
            Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
        };
        const icons = {
            Pending: <Clock size={12} />,
            Confirmed: <CheckCircle2 size={12} />,
            Cancelled: <AlertCircle size={12} />,
        };

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
                {icons[status]} {status}
            </span>
        );
    };

    const getApiRolePrefix = () => {
        const role = sessionStorage.getItem('dashboard_role');

        if (role === 'super_admin') return 'superadmin';
        if (role === 'admin') return 'admin';

        // fallback safety
        return 'admin';
    };

    const normalizeStatus = (status: string): EventItem['status'] => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Pending';
            case 'confirmed':
                return 'Confirmed';
            case 'cancelled':
            case 'canceled':
                return 'Cancelled';
            default:
                return 'Pending'; 
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const rolePrefix = getApiRolePrefix();

            const response = await api.get(`/${rolePrefix}/events`);

            const mapped = response.data.events.map((item: any) => ({
                id: item.id,
                full_name: item.name,
                phone_number: item.phone,
                event_type: item.event_type,
                event_date: item.event_date,
                estimated_pax: item.estimated_pax,
                venue_location: item.event_location,
                status: normalizeStatus(item.status),
            }));

            setTableData(mapped);
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const updateStatus = async (
        id: number,
        newStatus: EventItem['status']
    ) => {
        try {
            const rolePrefix = getApiRolePrefix();

            await api.patch(
                `/${rolePrefix}/events/${id}/status`,
                { status: newStatus }
            );

            setTableData(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, status: newStatus } : item
                )
            );

            if (selectedEvent?.id === id) {
                setSelectedEvent({ ...selectedEvent, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update inquiry status", error);
        }
    };

    const handleViewDetails = (id: number) => {
        const item = tableData.find(d => d.id === id);
        if (item) {
            setSelectedEvent(item);
            setIsModalOpen(true);
            setActiveDropdown(null);
        }
    };

    const filteredData = tableData.filter((item) => {
        const matchesSearch = item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.venue_location.toLowerCase().includes(searchTerm.toLowerCase());
        const eventDate = new Date(item.event_date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        const matchesDate = (!start || eventDate >= start) && (!end || eventDate <= end);
        return matchesSearch && matchesDate;
    });

    const entriesPerPage = Number(showEntries);
    const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handleDropdownToggle = (
        id: number,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();

        if (activeDropdown === id) {
            setActiveDropdown(null);
            setDropdownPos(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();

        setDropdownPos({
            top: rect.bottom + window.scrollY + 8,
            left: rect.right + window.scrollX - 256, // dropdown width
        });

        setActiveDropdown(id);
    };

    const exportToCSV = () => {
        if (!tableData.length) return;

        const headers = [
            'ID',
            'Customer Name',
            'Phone Number',
            'Event Type',
            'Event Date',
            'Estimated Pax',
            'Venue Location',
            'Status',
        ];

        const rows = tableData.map(item => [
            item.id,
            `"${item.full_name}"`,
            `"${item.phone_number}"`,
            `"${item.event_type}"`,
            item.event_date,
            item.estimated_pax,
            `"${item.venue_location}"`,
            item.status,
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `event_inquiries_${new Date().toISOString().split('T')[0]}.csv`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!activeDropdown) return;

            if (!(e.target as HTMLElement).closest('[data-dropdown]')) {
                setActiveDropdown(null);
                setDropdownPos(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    useEffect(() => {
        console.log("Dashboard role:", sessionStorage.getItem('dashboard_role'));
        fetchEvents();
    }, []);

    return (
        <div className="p-4 md:p-10 bg-[#F8F8F6] min-h-screen font-sans text-slate-900">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
                <div className="w-full">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter" style={{ color: brandBrown }}>
                        Inquiry <span style={{ color: brandGreen }}>Management</span>
                    </h1>
                    <p className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mt-3">
                        <Inbox size={16} className="text-blue-600" /> Super Admin Portal
                    </p>
                </div>

                <div className="flex flex-col w-full xl:w-auto gap-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                        <Filter size={12}/> Filter by Event Date
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex items-center bg-white border-2 border-slate-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
                            <input type="date" className="text-xs font-bold outline-none bg-transparent text-slate-700 w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <div className="w-0.5 h-4 bg-slate-200 mx-2"></div>
                            <input type="date" className="text-xs font-bold outline-none bg-transparent text-slate-700 w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2D1A11] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all w-full sm:w-auto"
                        >
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SEARCH & ENTRIES --- */}
            <div className="bg-white rounded-t-3xl border-x-2 border-t-2 border-slate-200 p-4 md:p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#5A8531] transition-all text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                    />
                </div>
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Show Entries:</span>
                    <select className="bg-slate-50 border-2 border-slate-100 px-3 py-2 rounded-xl text-sm font-bold outline-none text-slate-700 flex-1 md:flex-none" value={showEntries} onChange={e => setShowEntries(e.target.value)}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            {/* --- DATA DISPLAY --- */}
            <div className="bg-white rounded-b-3xl border-2 border-slate-200 shadow-xl">
                {filteredData.length > 0 ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                        <th className="px-8 py-5 text-left">Customer Info</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5 text-left">Venue Location</th>
                                        <th className="px-8 py-5 text-center">Event Details</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="text-base font-black text-slate-800">{item.full_name}</div>
                                                <div className="text-blue-600 font-bold text-xs flex items-center gap-1.5 mt-0.5"><Phone size={12}/> {item.phone_number}</div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-start gap-2 max-w-xs">
                                                    <MapPin size={14} className="text-slate-300 mt-1 shrink-0" />
                                                    <span className="text-xs font-bold text-slate-600 leading-relaxed">{item.venue_location}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="text-[#5A8531] font-black text-[10px] uppercase mb-1">{item.event_type}</div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                                        <Calendar size={12} /> {item.event_date}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                        <Users size={10} /> {item.estimated_pax} PAX
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right relative">
                                                <button
                                                    data-dropdown
                                                    onClick={(e) => handleDropdownToggle(item.id, e)}
                                                    className="w-10 h-10 border-2 border-slate-100 rounded-xl flex items-center justify-center ml-auto hover:border-slate-900 transition-all text-slate-600"
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View  */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {paginatedData.map((item) => (
                                <div key={item.id} className="p-5 space-y-4 relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-lg font-black text-slate-800 leading-tight">{item.full_name}</div>
                                            <div className="text-blue-600 font-bold text-xs mt-1 flex items-center gap-1.5"><Phone size={12}/> {item.phone_number}</div>
                                        </div>
                                        <button 
                                            data-dropdown
                                            onClick={(e) => handleDropdownToggle(item.id, e)}
                                            className="p-2 border-2 border-slate-100 rounded-xl text-slate-600"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <StatusBadge status={item.status} />
                                        <div className="bg-[#5A8531]/10 text-[#5A8531] text-[10px] font-black px-3 py-1 rounded-full uppercase">{item.event_type}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase text-slate-400">Date & Pax</div>
                                            <div className="text-xs font-bold text-slate-600">{item.event_date} • {item.estimated_pax} PAX</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase text-slate-400">Location</div>
                                            <div className="text-xs font-bold text-slate-600 line-clamp-1">{item.venue_location}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-12 md:p-20 text-center flex flex-col items-center">
                        <SearchX size={48} className="text-slate-200 mb-4" />
                        <h3 className="text-lg font-black text-slate-800 uppercase">No Records Found</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase">Try adjusting your filters</p>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {filteredData.length > 0 && (
                    <div className="p-4 md:p-6 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 gap-4">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest order-2 sm:order-1">Page {currentPage} of {totalPages || 1}</span>
                        <div className="flex items-center gap-2 order-1 sm:order-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg border-2 border-slate-200 bg-white disabled:opacity-30 transition-opacity"><ChevronLeft size={18}/></button>
                            <div className="min-w-10 h-10 flex items-center justify-center bg-[#2D1A11] text-white rounded-lg text-sm font-black px-3">{currentPage}</div>
                            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg border-2 border-slate-200 bg-white disabled:opacity-30 transition-opacity"><ChevronRight size={18}/></button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- DETAILS MODAL --- */}
            {activeDropdown && dropdownPos && (
                <DropdownPortal>
                    <div
                        data-dropdown
                        style={{
                            position: "absolute",
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            zIndex: 9998,
                        }}
                        className="bg-white w-64 rounded-2xl shadow-2xl border-2 border-[#2D1A11]"
                    >
                        <div className="rounded-[14px] overflow-hidden bg-white">
                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                Manage Inquiry
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();    
                                    handleViewDetails(activeDropdown);
                                }}
                                className="flex items-center gap-4 w-full px-5 py-4 text-[11px] font-black uppercase text-slate-700 border-b border-slate-200 hover:bg-slate-50 text-left"
                            >
                                <Eye size={16} className="text-[#5A8531]" /> View Full Details
                            </button>

                            <div className="p-2 flex flex-col gap-1">
                                <button
                                    onClick={() => updateStatus(activeDropdown, 'Confirmed')}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black uppercase rounded-xl hover:bg-emerald-50 text-emerald-700 text-left"
                                >
                                    <CheckCircle2 size={16} /> Confirm Inquiry
                                </button>

                                <button
                                    onClick={() => updateStatus(activeDropdown, 'Cancelled')}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black uppercase rounded-xl hover:bg-rose-50 text-rose-700 text-left"
                                >
                                    <AlertCircle size={16} /> Cancel Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </DropdownPortal>
            )}

            {/* --- DETAILS MODAL --- */}
            {isModalOpen && selectedEvent && (
                <DropdownPortal>
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        
                        {/* Modal Container  */}
                        <div className="relative bg-white w-full max-w-xl rounded-4xl md:rounded-[40px] shadow-2xl border-2 border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
                            
                            {/* Modal Header */}
                            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-800 leading-none">Inquiry Details</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">ID: #EVENT-{selectedEvent.id}</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="w-10 h-10 flex items-center justify-center bg-slate-50 border-2 border-slate-100 rounded-full hover:border-slate-300 transition-all"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Customer Name</label>
                                        <p className="text-lg font-black text-slate-800 leading-tight">{selectedEvent.full_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Contact Number</label>
                                        <p className="text-lg font-bold text-blue-600 flex items-center gap-2">
                                            <Phone size={16}/> {selectedEvent.phone_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1 p-4 md:p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="text-center border-r border-slate-200">
                                        <label className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 block mb-1">Date</label>
                                        <p className="text-[10px] md:text-xs font-black text-slate-700">{selectedEvent.event_date}</p>
                                    </div>
                                    <div className="text-center border-r border-slate-200">
                                        <label className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 block mb-1">Guests</label>
                                        <p className="text-[10px] md:text-xs font-black text-slate-700">{selectedEvent.estimated_pax} PAX</p>
                                    </div>
                                    <div className="text-center flex flex-col items-center justify-center">
                                        <label className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                        <StatusBadge status={selectedEvent.status} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Event & Venue Information</label>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/50 border border-green-100">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-[#5A8531] shrink-0">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Event Type</p>
                                                <p className="font-black text-slate-700 text-sm md:text-base uppercase">{selectedEvent.event_type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 mt-1">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Venue Location</p>
                                                <p className="font-bold text-slate-600 text-sm leading-relaxed">{selectedEvent.venue_location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 md:p-8 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => { updateStatus(selectedEvent.id, 'Confirmed'); setIsModalOpen(false); }}
                                    className="flex-1 px-6 py-4 bg-[#5A8531] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16}/> Confirm Inquiry
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </DropdownPortal>
            )}
        </div>
    );
};

export default EventsTable;