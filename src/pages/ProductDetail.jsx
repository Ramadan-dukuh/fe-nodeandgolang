import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/barang/${id}`);
        const data = await response.json();
        setProduct(data.result || data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // TODO: Integrate with cart context
    console.log(`Added ${quantity} of product ${id} to cart`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-semibold"
      >
        <ChevronLeft size={20} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl p-8">
        {/* Image */}
        <div className="bg-gray-100 rounded-xl flex items-center justify-center min-h-96">
          {product.gambar ? (
            <img
              src={product.gambar}
              alt={product.nama_barang}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <p>No Image Available</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-indigo-600 font-semibold uppercase text-sm mb-2">
              {product.kategori}
            </p>
            <h1 className="text-4xl font-bold mb-4">{product.nama_barang}</h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-5xl font-bold text-indigo-600 mb-2">
                Rp{product.harga.toLocaleString("id-ID")}
              </p>
              <p
                className={`text-lg font-semibold ${
                  product.stok > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stok > 0
                  ? `${product.stok} items in stock`
                  : "Out of stock"}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.deskripsi || "No description available"}
              </p>
            </div>

            {/* Quantity & Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  max={product.stok}
                  className="w-16 text-center border-0 focus:outline-none"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stok, quantity + 1))
                  }
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stok}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stok === 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart size={24} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-2">🚚 Free Shipping</h3>
          <p className="text-gray-600">On orders over Rp500.000</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-2">✓ Quality Guaranteed</h3>
          <p className="text-gray-600">100% authentic products</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-2">↩️ Easy Returns</h3>
          <p className="text-gray-600">30-day return policy</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
