"use client";
import { useRouter } from "next/navigation";
import { FaHotel, FaUserCheck, FaPlus } from "react-icons/fa";

const AdminPage = () => {
  const router = useRouter();

  const options = [
    { title: "View Your Hotels", path: "/admin/hotels", icon: <FaHotel /> },
    { title: "Add New Hotel", path: "/admin/hotels/add", icon: <FaPlus /> },
    { title: "View Your Users", path: "/admin/your-users", icon: <FaUserCheck /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">👋 Hi Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => router.push(option.path)}
            className="cursor-pointer bg-white p-6 rounded-xl shadow-lg flex flex-col items-center transition transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-[var(--secBtn)] text-5xl mb-4">{option.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{option.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
