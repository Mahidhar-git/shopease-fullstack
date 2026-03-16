import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "axios";

const Home = () => {
  const { data, addToCart, user } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedId, setAddedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = ["All", "Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const updated = await Promise.all(
        data.map(async (product) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/product/${product.id}/image`,
              { responseType: "blob" }
            );
            const imageUrl = URL.createObjectURL(response.data);
            return { ...product, imageUrl };
          } catch {
            return { ...product, imageUrl: null };
          }
        })
      );
      setProducts(updated);
      setFilteredProducts(updated);
    };
    if (data.length > 0) fetchImages();
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  }, [location.search, products]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    await addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="page-content" style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
        <p style={styles.heroSubtitle}>
          Shop the latest tech, fashion, and more at unbeatable prices
        </p>
      </div>

      {/* Category Filter */}
      <div style={styles.categorySection}>
        <div style={styles.categoryRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              style={selectedCategory === cat ? styles.catBtnActive : styles.catBtn}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Count */}
      <div style={styles.productsHeader}>
        <p style={styles.productsCount}>
          Showing <strong>{filteredProducts.length}</strong> products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>🛍️ No products found</p>
          <p style={styles.emptySubtext}>Try a different category</p>
        </div>
      ) : (
        <div style={{
          ...styles.grid,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={styles.card}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div style={styles.imageWrapper}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>📦</div>
                )}
                {product.productAvailable ? (
                  <span style={styles.badgeAvailable}>In Stock</span>
                ) : (
                  <span style={styles.badgeUnavailable}>Out of Stock</span>
                )}
              </div>

              <div style={styles.cardContent}>
                <p style={styles.brand}>{product.brand}</p>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.category}>📁 {product.category}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.price}>₹{product.price}</span>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    style={
                      !product.productAvailable ? styles.addBtnDisabled
                      : addedId === product.id ? styles.addBtnSuccess
                      : styles.addBtn
                    }
                    disabled={!product.productAvailable}
                  >
                    {!product.productAvailable ? "Unavailable"
                      : addedId === product.id ? "✅ Added!"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f0c29 0%, #1a1a2e 100%)",
    paddingTop: "70px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "60px 24px 40px",
    background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 12px",
    letterSpacing: "-1px",
  },
  heroSubtitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
  },
  categorySection: {
    padding: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  categoryRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  catBtn: {
    padding: "8px 20px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
    fontFamily: "'Segoe UI', sans-serif",
  },
  catBtnActive: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "700",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 4px 15px rgba(102,126,234,0.5)",
  },
  productsHeader: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "20px 24px 0",
  },
  productsCount: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
    margin: 0,
  },
 grid: {
    display: "grid",
    gap: "16px",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "16px",
    boxSizing: "border-box",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  },
  imageWrapper: {
    position: "relative",
    height: "200px",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: { fontSize: "60px" },
  badgeAvailable: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(17,153,142,0.9)",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: "600",
  },
  badgeUnavailable: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(255,77,77,0.9)",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: "600",
  },
  cardContent: { padding: "20px" },
  brand: {
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 6px",
  },
  productName: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 8px",
    lineHeight: "1.3",
  },
  category: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    margin: "0 0 16px",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "800",
  },
  addBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  addBtnSuccess: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #11998e, #38ef7d)",
    border: "none",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  addBtnDisabled: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "none",
    borderRadius: "50px",
    color: "rgba(255,255,255,0.3)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "not-allowed",
    fontFamily: "'Segoe UI', sans-serif",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
  },
  emptyText: {
    color: "#ffffff",
    fontSize: "24px",
    margin: "0 0 8px",
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
    margin: 0,
  },
};

export default Home;