import { useEffect, useState } from "react";
import { Trash2, Edit, Plus } from "lucide-react";

function Admin() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_barang: "",
    deskripsi: "",
    kategori: "",
    harga: "",
    stok: "",
    gambar: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBarang();
  }, [page]);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/barang?page=${page}&limit=10`
      );
      const data = await response.json();
      setBarang(data.result || []);
      setTotalPages(Math.ceil((data.total || 0) / 10) || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      harga: parseInt(formData.harga),
      stok: parseInt(formData.stok),
    };

    try {
      if (editingId) {
        // Update
        const response = await fetch(
          `http://localhost:8000/barang/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          fetchBarang();
          setShowForm(false);
          setEditingId(null);
          setFormData({
            nama_barang: "",
            deskripsi: "",
            kategori: "",
            harga: "",
            stok: "",
            gambar: "",
          });
        }
      } else {
        // Create
        const response = await fetch("http://localhost:8000/barang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          fetchBarang();
          setShowForm(false);
          setFormData({
            nama_barang: "",
            deskripsi: "",
            kategori: "",
            harga: "",
            stok: "",
            gambar: "",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`http://localhost:8000/barang/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBarang();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nama_barang: "",
      deskripsi: "",
      kategori: "",
      harga: "",
      stok: "",
      gambar: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleInputChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="gambar"
                  value={formData.gambar}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingId ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Name
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-white font-semibold">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Price
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-white font-semibold">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {barang.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                      } border-b hover:bg-indigo-100 transition-colors`}
                    >
                      <td className="px-6 py-4 font-medium">
                        {product.nama_barang}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-gray-600">
                        {product.kategori}
                      </td>
                      <td className="px-6 py-4 text-indigo-600 font-bold">
                        Rp{product.harga.toLocaleString("id-ID")}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                            product.stok > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stok}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded transition-colors"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-gray-700 font-semibold">
                Page <span className="text-indigo-600">{page}</span> of{" "}
                <span className="text-indigo-600">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
