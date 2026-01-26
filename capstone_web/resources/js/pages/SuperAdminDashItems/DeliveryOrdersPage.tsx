import React, { useState, useEffect } from 'react';
import { Truck, Search, MapPin, ClipboardList, PlusCircle, Printer, Coffee, CheckCircle, Trash2, UserCheck, Phone, Users, Plus, Package, AlertCircle, X } from 'lucide-react';
import apiClient from '@/apiClient';

interface OrderItem {
  itemName: string;
  qty: number;
  price: number;
}

interface AddOn {
  name: string;
  price: number;
}

interface DeliveryOrder {
  id: number;
  name: string;
  phone: string;
  address: string;
  itemsList: OrderItem[]; 
  selectedAddOns: AddOn[];
  deliveryFee: number;
  totalPrice: number;
  status: 'Pending' | 'Rider Assigned' | 'Delivered';
  assignedRiderId?: number;
  assignedRiderName?: string;
  timestamp: string;
}

interface Rider {
  id: number;
  name: string;
  status: 'Available' | 'On Delivery' | 'Offline';
}

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);

  const [riders, setRiders] = useState<Rider[]>([
    { id: 101, name: "Marco Polo", status: 'Available' },
    { id: 102, name: "Lito Lapid", status: 'Available' },
    { id: 103, name: "Santi Alvarez", status: 'Offline' },
  ]);

  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [itemList, setItemList] = useState<OrderItem[]>([{ itemName: '', qty: 1, price: 0 }]);
  const [customAddOns, setCustomAddOns] = useState<AddOn[]>([]);
  const [deliveryFee] = useState<number>(0); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({ 
    show: false, 
    msg: '', 
    type: 'success' 
  });

  const getRolePrefix = () => {
    const role = sessionStorage.getItem('dashboard_role');

    if (role === 'super_admin') return '/superadmin';
    if (role === 'admin') return '/admin';

    throw new Error('Invalid dashboard role');
  };

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  const fetchDeliveryOrders = async () => {
    try {
      const prefix = getRolePrefix();

      const res = await apiClient.get(`${prefix}/delivery-orders`);

      console.log('DELIVERY ORDERS RESPONSE (first item):', res.data[0]);

      if (!Array.isArray(res.data)) {
        console.error('Unexpected response:', res.data);
        setOrders([]);
        return;
      }

      const mappedOrders: DeliveryOrder[] = res.data.map((o: any) => {
        // items is already an array of products
        let products: any[] = [];

        try {
          products = typeof o.items === 'string'
            ? JSON.parse(o.items)
            : Array.isArray(o.items)
            ? o.items
            : [];
        } catch {
          products = [];
        }

        return {
          id: o.id,
          name: o.customer_name,
          phone: '',
          address: o.customer_address,

          // map backend product → frontend item shape
          itemsList: products.map((p: any) => ({
            itemName: p.name,
            qty: p.quantity,
            price: Number(p.price),
          })),

          selectedAddOns: [],        // delivery orders have no addons
          deliveryFee: 0,            // already included in total
          totalPrice: Number(o.total_amount),

          status:
            o.status === 'pending'
              ? 'Pending'
              : o.status === 'paid'
              ? 'Rider Assigned'
              : 'Delivered',

          timestamp: o.created_at,
        };
      });

      setOrders(mappedOrders);
    } catch (err) {
      console.error('Failed to fetch delivery orders', err);
      setOrders([]);
    }
  };

  const showStatus = (msg: string, type: 'success' | 'error') => {
    setNotification({ show: true, msg, type });
    setTimeout(() => setNotification({ show: false, msg: '', type: 'success' }), 3000);
  };

  const addItemRow = () => setItemList([...itemList, { itemName: '', qty: 1, price: 0 }]);
  const removeItemRow = (index: number) => itemList.length > 1 && setItemList(itemList.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newList = [...itemList];
    newList[index] = { ...newList[index], [field]: value };
    setItemList(newList);
  };

  const addAddOnRow = () => {
  setCustomAddOns([...customAddOns, { name: '', price: 0 }]);
};

const updateAddOn = (index: number, field: keyof AddOn, value: any) => {
  const newList = [...customAddOns];
  
  let formattedValue = value;
  if (field === 'price') {
    formattedValue = value === '' ? 0 : parseFloat(value);
  }

  newList[index] = { 
    ...newList[index], 
    [field]: formattedValue 
  };
  
  setCustomAddOns(newList);
};

  const calculateTotal = () => {
    const itemsTotal = itemList.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const addOnsTotal = customAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0);
    return itemsTotal + addOnsTotal + deliveryFee;
  };

  const handleAddOrder = async () => {
    const total = calculateTotal();

    if (!customerInfo.name || !itemList[0].itemName) {
      showStatus("Submission Failed: Please provide Customer Name and Item.", "error");
      return;
    }

    try {
      const prefix = getRolePrefix();

      const res = await apiClient.post(`${prefix}/delivery-orders`, {
        customer: {
          name: customerInfo.name,
          address: customerInfo.address,
        },
        items: itemList.map(item => ({
          itemName: item.itemName,  
          qty: item.qty,
          price: item.price
        })),
        totalPrice: total,
      });

      const o = res.data;
      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;

      const newOrder: DeliveryOrder = {
        id: o.id,
        name: o.customer_name,
        phone: '',
        address: o.customer_address,

        itemsList: items.map((p: any) => ({
          itemName: p.name,
          qty: p.quantity,
          price: Number(p.price),
        })),

        selectedAddOns: [],
        deliveryFee: 0,
        totalPrice: Number(o.total_amount),
        status: 'Pending',
        timestamp: o.created_at,
      };

      setOrders(prev => [newOrder, ...prev]);

      setCustomerInfo({ name: '', phone: '', address: '' });
      setItemList([{ itemName: '', qty: 1, price: 0 }]);
      setCustomAddOns([]);

      showStatus("Order successfully created!", "success");
    } catch (err) {
      console.error(err);
      showStatus("Failed to create delivery order", "error");
    }
  };

  const handleDispatch = (rider: Rider) => {
    setOrders(prev => prev.map(o => o.id === selectedOrderId ? { ...o, status: 'Rider Assigned', assignedRiderId: rider.id, assignedRiderName: rider.name } : o));
    setRiders(prev => prev.map(r => r.id === rider.id ? { ...r, status: 'On Delivery' } : r));
    setIsModalOpen(false);
  };

  const handlePrint = (order: DeliveryOrder) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.itemsList.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <div style="flex: 1;">
          <div style="font-weight: bold;">${item.itemName}</div>
          <div style="font-size: 11px; color: #555;">${item.qty} x ₱${item.price.toFixed(2)}</div>
        </div>
        <div style="font-weight: bold; align-self: center;">₱${(item.qty * item.price).toFixed(2)}</div>
      </div>
    `).join('');

    const addOnsHtml = order.selectedAddOns.length > 0 
      ? `<div style="border-top: 1px dashed #ccc; padding-top: 5px; margin-top: 5px;">
          <div style="font-size: 11px; font-weight: bold; margin-bottom: 3px;">ADD-ONS:</div>
          ${order.selectedAddOns.map(a => `
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
              <span>+ ${a.name}</span>
              <span>₱${a.price.toFixed(2)}</span>
            </div>
          `).join('')}
         </div>`
      : '';

    const receiptHtml = `
      <html>
        <head>
          <title>Print Receipt - #${order.id}</title>
          <style>
            @page { size: 72mm auto; margin: 0; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              width: 72mm; 
              padding: 6mm; 
              font-size: 12px; 
              color: #000;
              line-height: 1.4;
            }
            .center { text-align: center; }
            .bold { font-weight: 800; }
            .divider { border-top: 2px solid #000; margin: 10px 0; }
            .dashed-divider { border-top: 1px dashed #888; margin: 10px 0; }
            .header-title { font-size: 18px; letter-spacing: 1px; margin-bottom: 2px; }
            .order-info { font-size: 11px; margin-bottom: 10px; }
            .total-section { font-size: 16px; margin-top: 10px; display: flex; justify-content: space-between; }
            .footer { margin-top: 20px; font-size: 10px; color: #444; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px;}
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #76B13A; }
          </style>
        </head>
        <body>
          <div class="center">
            <div class="header-title bold">MI AMORE CAFE</div>
            <div style="font-size: 10px; text-transform: uppercase;">Logistics & Dispatch</div>
            <div style="font-size: 10px;">Santa Rosa, Laguna</div>
          </div>

          <div class="divider"></div>

          <div class="order-info">
            <div style="display: flex; justify-content: space-between;">
              <span>Order ID: <span class="bold">#${order.id}</span></span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
            <div>Customer: <span class="bold">${order.name}</span></div>
            <div>Phone: ${order.phone || 'N/A'}</div>
          </div>

          <div class="dashed-divider"></div>
          
          <div class="bold" style="font-size: 10px; margin-bottom: 8px;">ORDER SUMMARY</div>
          ${itemsHtml}
          ${addOnsHtml}

          <div class="divider"></div>

          <div class="total-section bold">
            <span>GRAND TOTAL</span>
            <span>₱${order.totalPrice.toFixed(2)}</span>
          </div>

          <div class="footer center">
            <div class="bold" style="margin-bottom: 5px;">DELIVERY ADDRESS:</div>
            <div style="margin-bottom: 15px;">${order.address}</div>
            <div class="dashed-divider"></div>
            <div style="margin-top: 10px;">Thank you for choosing Mi Amore!</div>
          </div>
        </body>
      </html>
    `;

    printWindow?.document.write(receiptHtml);
    printWindow?.document.close();
    
    setTimeout(() => { 
      printWindow?.focus();
      printWindow?.print(); 
      printWindow?.close(); 
    }, 500);
  };

  //  Updated visibility
  const inputBaseStyle = "w-full pl-10 p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-bold outline-none placeholder:text-slate-400 focus:border-[#76B13A] focus:ring-1 focus:ring-[#76B13A] transition-all shadow-sm";
  const miniInputStyle = "relative z-10 p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 placeholder:text-slate-400 bg-white focus:border-[#76B13A] focus:ring-1 focus:ring-[#76B13A] outline-none shadow-sm";
  const actionButtonStyle = "bg-[#76B13A] hover:bg-[#659a32] text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition-transform active:scale-95 shadow-md";

    const removeAddOnRow = (index: number) => {
      setCustomAddOns(customAddOns.filter((_, i) => i !== index));
    };

  return (
    <div className="p-4 md:p-8 bg-slate-100 min-h-screen font-sans">
      {/* NOTIFICATION */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' ? 'bg-[#76B13A] text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
          <span className="font-bold text-sm uppercase tracking-tight">{notification.msg}</span>
        </div>
      )}
    
      <div className="max-w-[1400px] mx-auto space-y-6">
        
{/* HEADER */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-md border border-slate-200">
  <div>
    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
      <div className="p-2 bg-[#76B13A] rounded-xl text-white">
        <Truck size={28} />
      </div>
      DELIVERY <span className="text-[#76B13A]">DASHBOARD</span>
    </h1>
    <p className="text-slate-500 font-bold text-sm mt-1">
      Manage Customer Orders, Item Prices, and Rider Assignments
    </p>
  </div>
  
  <div className="relative w-full lg:w-96">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input 
      type="text" 
      placeholder="Search Customer Name here..." 
      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold focus:border-[#76B13A] shadow-inner" 
      value={searchTerm} 
      onChange={(e) => setSearchTerm(e.target.value)} 
    />
  </div>
</div>

        {/* ORDER ENTRY FORM */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-200">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left side: Customer Info */}
            <div className="flex-1 space-y-4">
              <h2 className="text-xs font-black uppercase text-[#76B13A] mb-2 flex items-center gap-2 tracking-widest">
                <UserCheck size={18}/> New Order
              </h2>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3.5 text-slate-400" size={16}/>
                <input className={inputBaseStyle} placeholder="Customer Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-400" size={16}/>
                <input className={inputBaseStyle} placeholder="Phone Number" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={16}/>
                <textarea className="w-full pl-10 p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-bold outline-none focus:border-[#76B13A] min-h-[100px] placeholder:text-slate-400 shadow-sm" placeholder="Delivery Address" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
              </div>
            </div>

            {/* Right side: Items and Add-ons */}
            <div className="flex-[2] bg-slate-50 p-6 rounded-[2rem] border border-slate-200 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ITEMS SECTION */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-slate-600 uppercase flex items-center gap-1 tracking-tighter"><Package size={14} className="text-[#76B13A]"/> Items List</span>
                    <button onClick={addItemRow} className={actionButtonStyle}>
                      <PlusCircle size={12}/> ADD ROW
                    </button>
                  </div>
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                    {itemList.map((item, idx) => (
                      <div key={idx} className="flex gap-2 group animate-in slide-in-from-right-2 duration-200">
                        <input
                          type="number"
                          min={1}
                          step={1}
                          onWheel={(e) => e.currentTarget.blur()} 
                          className={`${miniInputStyle} w-14 text-center`}
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(idx, 'qty', Math.max(1, Number(e.target.value) || 1))
                          }
                        />
                        <input className={`${miniInputStyle} flex-1`} placeholder="Item name (e.g. Latte)" value={item.itemName} onChange={(e) => updateItem(idx, 'itemName', e.target.value)} />
                        <input type="number" className={`${miniInputStyle} w-20`} placeholder="Price" value={item.price || ''} onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value) || 0)} />
                        <button onClick={() => removeItemRow(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>

        {/* ADD-ONS SECTION */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-slate-600 uppercase flex items-center gap-1 tracking-tighter"><Plus size={14} className="text-[#76B13A]"/> Add-ons</span>
                    <button onClick={addAddOnRow} className={actionButtonStyle}>
                      <PlusCircle size={12}/> ADD OPTION
                    </button>
                  </div>
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                    {customAddOns.map((addon, idx) => (
                      <div key={idx} className="flex gap-2 animate-in slide-in-from-right-2 duration-200">
                        <input className={`${miniInputStyle} flex-1`} placeholder="Extra Pearl, etc." value={addon.name} onChange={(e) => updateAddOn(idx, 'name', e.target.value)} />
                        <input type="number" className={`${miniInputStyle} w-20`} placeholder="Price" value={addon.price || ''} onChange={(e) => updateAddOn(idx, 'price', parseFloat(e.target.value) || 0)} />
                        <button onClick={() => removeAddOnRow(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    {customAddOns.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase">No Add-ons Added</div>
                    )}
                  </div>
                </div>
              </div>

              {/* FOOTER OF FORM */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                  <p className="text-4xl font-black text-slate-900">₱{calculateTotal().toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <button onClick={handleAddOrder} className="w-full md:w-auto bg-[#76B13A] text-white px-12 py-4 rounded-2xl font-black shadow-lg hover:shadow-[#76B13A]/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-tighter">
                  <Printer size={20}/> Confirm & Print
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL: RIDERS & QUEUE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                <Users size={14} className="text-[#76B13A]"/> Riders Status
              </h3>
              <div className="space-y-3">
                {riders.map(rider => (
                  <div key={rider.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                    <span className="font-black text-slate-800 text-xs">{rider.name}</span>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                      rider.status === 'Available' ? 'bg-green-100 text-green-600' : 
                      rider.status === 'On Delivery' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {rider.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 bg-white border-b flex justify-between items-center">
                <h2 className="font-black flex items-center gap-2 text-slate-800 uppercase text-xs tracking-wider"><ClipboardList className="text-[#76B13A]"/> Order Queue</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="p-5">Customer</th>
                      <th className="p-5">Order Details</th>
                      <th className="p-5 text-right">Amount</th>
                      <th className="p-5 text-center">Status</th>
                      <th className="p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Array.isArray(orders) &&
                    orders
                      .filter(o =>
                        o.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <p className="font-black text-slate-800 text-sm">{order.name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold"><MapPin size={10}/> {order.address}</p>
                        </td>
                        <td className="p-5">
                          <div className="text-[10px] font-bold text-slate-700">
                            {order.itemsList.map((it, i) => <span key={i}>{it.qty}x {it.itemName}{i < order.itemsList.length - 1 ? ', ' : ''}</span>)}
                          </div>
                          {order.selectedAddOns.length > 0 && (
                            <p className="text-[9px] text-[#76B13A] font-black uppercase">Notes: {order.selectedAddOns.map(a => a.name).join(', ')}</p>
                          )}
                        </td>
                        <td className="p-5 text-right font-black text-slate-800">₱{order.totalPrice.toFixed(2)}</td>
                        <td className="p-5 text-center">
                          <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                              order.status === 'Rider Assigned' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <div className="flex justify-center gap-2">
                            {order.status === 'Pending' ? (
                              <button onClick={() => {setSelectedOrderId(order.id); setIsModalOpen(true);}} className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 shadow-md transition-all active:scale-95" title="Assign Rider"><Truck size={16}/></button>
                            ) : (
                               <button onClick={() => handlePrint(order)} className="border-2 border-slate-200 text-slate-500 p-2.5 rounded-xl hover:bg-slate-50 transition-all"><Printer size={16}/></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-400 uppercase text-xs">No active orders in queue</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIDER DISPATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                  <Truck className="text-[#76B13A]"/> Select Rider
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
            </div>
            <div className="space-y-3">
              {riders.filter(r => r.status === 'Available').map(rider => (
                <button 
                  key={rider.id} 
                  onClick={() => handleDispatch(rider)} 
                  className="w-full p-5 bg-slate-50 hover:bg-[#76B13A] hover:text-white rounded-2xl flex justify-between items-center transition-all group border border-slate-100 shadow-sm"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-base font-black text-slate-800 group-hover:text-white uppercase tracking-tight">{rider.name}</span>
                    <span className="text-[10px] opacity-70 font-bold uppercase group-hover:text-white/80">Ready to Ship</span>
                  </div>
                  <PlusCircle size={24} className="text-[#76B13A] group-hover:text-white"/>
                </button>
              ))}
              {riders.filter(r => r.status === 'Available').length === 0 && (
                <p className="text-center text-slate-500 text-sm font-bold py-4">No Available Riders</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOrdersPage;