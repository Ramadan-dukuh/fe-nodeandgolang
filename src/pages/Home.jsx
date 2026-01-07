import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronRight } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  API_BASE_URL,
  DEFAULT_PAGE_SIZE,  
} from "../constants";

function Home() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [kategori, setKategori] = useState("");

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: DEFAULT_PAGE_SIZE,
        ...(kategori && { kategori: kategori }),
      });
      const response = await fetch(`${API_BASE_URL}/barang?${params}`);
      const data = await response.json();
      setBarang(data.result || []);
      setTotalPages(Math.ceil(data.total / DEFAULT_PAGE_SIZE) || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, [page, kategori]);

  const handleAddToCart = (barangId) => {
    // TODO: Integrate with cart context
    console.log("Added to cart:", barangId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to ShopHub
        </h1>
        <p className="text-lg text-indigo-100 mb-6">
          Discover amazing products at unbeatable prices
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setKategori("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            kategori === ""
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          All Products
        </button>
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setKategori(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              kategori === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : barang.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {barang.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                  {product.gambar ? (
                    <img
                      src={product.gambar}
                      alt={product.nama_barang}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <p>No Image</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-indigo-600 font-semibold mb-2 uppercase">
                    {product.kategori}
                  </p>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {product.nama_barang}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.deskripsi}
                  </p>

                  {/* Price & Stock */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        Rp{product.harga.toLocaleString("id-ID")}
                      </p>
                      <p
                        className={`text-sm ${
                          product.stok > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.stok > 0
                          ? `${product.stok} in stock`
                          : "Out of stock"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                    >
                      View
                      <ChevronRight size={16} />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stok === 0}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}

export default Home;
