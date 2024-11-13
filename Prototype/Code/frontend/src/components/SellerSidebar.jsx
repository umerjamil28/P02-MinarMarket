// import React, { useState } from 'react';
// import { ChevronRight, ChevronDown } from 'lucide-react';

// const SellerSidebar = () => {
//     const [openSubMenu, setOpenSubMenu] = useState({
//       'My Listings': true // Set to true by default to match the design
//     });
  
//     const toggleSubMenu = (menu) => {
//       setOpenSubMenu((prev) => ({
//         ...prev,
//         [menu]: !prev[menu],
//       }));
//     };
  
//     return (
//       <div className="w-64 min-h-screen bg-white border-r border-gray-200">
//         <div className="p-4">
//           <div className="space-y-4">
//             {/* Seller Header */}
//             <div className="text-lg font-semibold text-gray-800">
//               Seller
//             </div>
  
//             {/* Dashboard Item */}
//             <div className="flex items-center space-x-2 text-blue-600">
//               <span className="text-lg">⊞</span>
//               <span>Dashboard</span>
//             </div>
  
//             {/* My Listings Section */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <button
//                   onClick={() => toggleSubMenu('My Listings')}
//                   className="flex items-center space-x-2 text-gray-600"
//                 >
//                   <span className="text-lg">◎</span>
//                   <span>My Listings</span>
//                   {openSubMenu['My Listings'] ? (
//                     <ChevronDown className="w-4 h-4 ml-auto" />
//                   ) : (
//                     <ChevronRight className="w-4 h-4 ml-auto" />
//                   )}
//                 </button>
//               </div>
              
//               {openSubMenu['My Listings'] && (
//                 <div className="ml-6 space-y-2">
//                   <div className="text-blue-600">Products</div>
//                   <div className="text-gray-600">Services</div>
//                 </div>
//               )}
//             </div>
  
//             {/* Settings Item */}
//             <div className="flex items-center space-x-2 text-gray-600">
//               <span className="text-lg">⚙</span>
//               <span>Settings</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };


//   export default SellerSidebar;


import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const SellerSidebar = () => {
    const [openSubMenu, setOpenSubMenu] = useState({
        'My Listings': true // Set to true by default to match the design
    });

    const toggleSubMenu = (menu) => {
        setOpenSubMenu((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
            <div className="p-4">
                <div className="space-y-4">
                    {/* Seller Header */}
                    <div className="text-lg font-semibold text-gray-800">
                        Seller
                    </div>

                    {/* Dashboard Item */}
                    <div className="flex items-center space-x-2 text-blue-600">
                        <span className="text-lg">⊞</span>
                        <span>Dashboard</span>
                    </div>

                    {/* My Listings Section */}
                    <div>
                        <div className="flex items-center mb-2">
                            <button
                                onClick={() => toggleSubMenu('My Listings')}
                                className="flex items-center space-x-2 text-gray-600"
                            >
                                <span className="text-lg">◎</span>
                                <span>My Listings</span>
                                {openSubMenu['My Listings'] ? (
                                    <ChevronDown className="w-4 h-4 ml-auto" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                )}
                            </button>
                        </div>

                        {openSubMenu['My Listings'] && (
                            <div className="ml-6 space-y-2">
                                <div className="text-blue-600">Products</div>
                                <div className="text-gray-600">Services</div>
                            </div>
                        )}
                    </div>

                    {/* Settings Item */}
                    <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-lg">⚙</span>
                        <span>Settings</span>
                    </div>

                    <div className="p-4 flex justify-center">
                      <button className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600">
                        <a href='/buyer-dashboard'>Switch to Buyer</a>
                     </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SellerSidebar;





// import React, { useState } from 'react';
// import { ChevronRight, ChevronDown } from 'lucide-react';

// const SellerSidebar = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [openSubMenu, setOpenSubMenu] = useState({});

//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     const toggleSubMenu = (menu) => {
//         console.log('toggleSubmenu being pressed');
//         setOpenSubMenu((prev) => ({
//             ...prev,
//             [menu]: !prev[menu],
//         }));
//     };

//     return (
//         <div>       

//             {/* Sidebar and Main Content Wrapper */}
//             <div className="flex">
//                 {/* Sidebar */}
//                 <aside
//                     className={`bg-dashboardGray text-center text-darkGray h-screen p-4 transition-all duration-300 ${
//                         isSidebarOpen ? 'w-64' : 'w-24'
//                     }`}
//                 >
//                     <button
//                         onClick={toggleSidebar}
//                         className="mb-6 text-darkGray focus:outline-none"
//                     >
//                         {isSidebarOpen ? 'Collapse' : 'Expand'}
//                     </button>

//                     {/* Sidebar Menu */}
//                     <nav className="space-y-5 flex flex-col items-center">
//                         <SidebarItem
//                             label="Dashboard"
//                             isSidebarOpen={isSidebarOpen}
//                             hasSubMenu={false}
//                         />
//                         <SidebarItem
//                             label="My Listings"
//                             isSidebarOpen={isSidebarOpen}
//                             hasSubMenu={true}
//                             openSubMenu={openSubMenu}
//                             onClick={() => toggleSubMenu('My Listings')}
//                             submenuItems={[
//                                 { label: 'Products' },
//                                 { label: 'Services' },
//                             ]}
//                         />
//                         {/* <SidebarItem
//                             label="Reports"
//                             isSidebarOpen={isSidebarOpen}
//                             hasSubMenu={true}
//                             openSubMenu={openSubMenu}
//                             onClick={() => toggleSubMenu('Reports')}
//                             submenuItems={[
//                                 { label: 'Sales Report' },
//                                 { label: 'Expense Report' },
//                                 { label: 'Customer Report' },
//                             ]}
//                         /> */}
//                         <SidebarItem
//                             label="Settings"
//                             isSidebarOpen={isSidebarOpen}
//                             hasSubMenu={false}
//                         />
//                     </nav>
//                 </aside>

//                 {/* Main Content */}
//                 <main className="flex-1 p-4">
//                     <h1 className="text-2xl font-bold">Welcome to the Seller Dashboard</h1>
//                     <p className="mt-4">Here is the main content area.</p>
//                 </main>
//             </div>
//         </div>
//     );
// };

// // Sidebar Item Component
// const SidebarItem = ({
//     label,
//     isSidebarOpen,
//     hasSubMenu,
//     openSubMenu,
//     onClick,
//     submenuItems = [],
// }) => {
//     return (
//         <div>
//             <button
//                 className="flex items-center w-full text-left focus:outline-none"
//                 onClick={onClick}
//             >
//                 <span className="flex-1">{label}</span>
//                 {hasSubMenu && (
//                     <span>
//                         {openSubMenu[label] ? (
//                             <ChevronDown className="w-4 h-4" />
//                         ) : (
//                             <ChevronRight className="w-4 h-4" />
//                         )}
//                     </span>
//                 )}
//             </button>
//             {hasSubMenu && openSubMenu[label] && (
//                 <div className={`ml-4 mt-2 ${isSidebarOpen ? 'block' : 'hidden'}`}>
//                     {submenuItems.map((item, index) => (
//                         <div key={index} className="mt-1 pl-2">
//                             {item.label}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SellerSidebar;
