// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const Dashboard = () => {
//     const router = useRouter();
//     const [user, setUser] = useState<any>(null);

//     useEffect(() => {
//         // Check if user is logged in
//         const token = localStorage.getItem('token');
//         const userData = localStorage.getItem('user');

//         if (!token || !userData) {
//             router.push('/LogIn');
//             return;
//         }

//         try {
//             setUser(JSON.parse(userData));
//         } catch (error) {
//             console.error('Error parsing user data:', error);
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             router.push('/LogIn');
//         }
//     }, [router]);

//     if (!user) {
//         return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//                 <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//                 <p className="mb-4">Welcome, {user.username}!</p>
//                 <p>Email: {user.email}</p>

//                 <button
//                     className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                     onClick={() => {
//                         localStorage.removeItem('token');
//                         localStorage.removeItem('user');
//                         router.push('/LogIn');
//                     }}
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;