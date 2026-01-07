import { useEffect, useState } from "react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ nama: "", email: "" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = () => {
    fetch(`http://localhost:8000/user?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          setUsers(data.result);
          setTotalPages(Math.ceil(data.total / limit));
        } else {
          console.error("API result is not an array:", data);
          setUsers([]);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUserId) {
      fetch(`http://localhost:8000/user/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(() => {
          fetchUsers();
          setEditingUserId(null);
          setFormData({ nama: "", email: "" });
          setIsModalOpen(false);
        });
    } else {
      fetch("http://localhost:8000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(() => {
          fetchUsers();
          setFormData({ nama: "", email: "" });
          setIsModalOpen(false);
        });
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({ nama: user.nama, email: user.email });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:8000/user/${id}`, {
        method: "DELETE",
      }).then(() => {
        fetchUsers();
      });
    }
  };

  const openAddModal = () => {
    setEditingUserId(null);
    setFormData({ nama: "", email: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
        <p className="text-indigo-100">
          Manage and organize your users efficiently
        </p>
      </div>

      {/* Add User Button */}
      <button
        onClick={openAddModal}
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
      >
        + Add New User
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {editingUserId ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  placeholder="Enter user name"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {editingUserId ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table Card */}
      {Array.isArray(users) && users.length > 0 ? (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <th className="px-4 md:px-6 py-4 text-left text-white font-semibold text-sm md:text-base">
                    Name
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-white font-semibold text-sm md:text-base">
                    Email
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-white font-semibold">
                    Created At
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-white font-semibold">
                    Updated At
                  </th>
                  <th className="px-4 md:px-6 py-4 text-center text-white font-semibold text-sm md:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    } hover:bg-indigo-100 cursor-pointer transition-colors duration-200 border-b border-gray-200`}
                    onClick={() => handleEdit(user)}
                  >
                    <td className="px-4 md:px-6 py-4 text-gray-800 font-medium text-sm md:text-base">
                      {user.nama}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 text-sm md:text-base break-all">
                      {user.email}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-gray-600 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-gray-600 text-sm">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200">
            <button
              onClick={goToPreviousPage}
              disabled={page === 1}
              className="w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-gray-700 font-semibold text-sm md:text-base">
              Page <span className="text-indigo-600">{page}</span> of{" "}
              <span className="text-indigo-600">{totalPages}</span>
            </span>
            <button
              onClick={goToNextPage}
              disabled={page === totalPages}
              className="w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">
            No users found. Add your first user to get started!
          </p>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
