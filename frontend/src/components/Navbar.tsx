
// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext, CartContext } from '../context';

// interface User {
//   id: string | number;
//   name: string;
//   role: 'user' | 'admin';
//   // Add other user fields as needed
// }

// interface CartItem {
//   id: string | number;
//   quantity: number;
//   // Add other fields as needed
// }

// interface AuthContextType {
//   user: User | null;
//   logout: () => Promise<void>;
//   // Add other fields if needed
// }

// interface CartContextType {
//   cart: CartItem[];
//   // Add other fields if needed
// }

// const Navbar: React.FC = () => {
//   const authContext = useContext(AuthContext);
//   const cartContext = useContext(CartContext);

//   if (!authContext || !cartContext) {
//     throw new Error('Navbar must be used within AuthContext and CartContext providers');
//   }

//   const { user, logout } = authContext;
//   const { cart } = cartContext;

//   const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="text-2xl font-bold text-gray-800">
//               KAYNET ARTSPHERE
//             </Link>
//           </div>
//           <div className="flex items-center space-x-6">
//             <Link to="/shop" className="text-gray-700 hover:text-gray-900">
//               Shop
//             </Link>
//             <Link to="/custom-order" className="text-gray-700 hover:text-gray-900">
//               Custom Order
//             </Link>
//             {user ? (
//               <>
//                 <Link to="/orders" className="text-gray-700 hover:text-gray-900">
//                   My Orders
//                 </Link>
//                 <Link to="/cart" className="text-gray-700 hover:text-gray-900 relative">
//                   Cart
//                   {cartItemCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </Link>
//                 {user.role === 'admin' && (
//                   <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
//                     Admin
//                   </Link>
//                 )}
//                 <button
//                   onClick={logout}
//                   className="text-gray-700 hover:text-gray-900"
//                 >
//                   Logout ({user.name})
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/cart" className="text-gray-700 hover:text-gray-900 relative">
//                   Cart
//                   {cartItemCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </Link>
//                 <a
//                   href={`${import.meta.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/auth/google`}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Login with Google
//                 </a>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
