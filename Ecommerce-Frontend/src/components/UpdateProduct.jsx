import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const UpdateProduct = () => {
  const { id } = useParams();
  const { refreshData } = useContext(AppContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.get(`${API}/api/product/${id}`);
        setUpdateProduct(response.data);

        const responseImage = await axios.get(
          `${API}/api/product/${id}/image`,
          { responseType: "blob" }
        );
        const file = new File(
          [responseImage.data],
          response.data.imageName,
          { type: responseImage.data.type }
        );
        setImage(file);
        setPreview(URL.createObjectURL(responseImage.data));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const t = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("imageFile", image);
      formData.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
      );
      await axios.put(`${API}/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${t}`,
        },
      });
      await refreshData();
      alert("Product updated successfully! ✅");
      navigate(`/product/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>✏️ Update Product</h1>
          <p style={styles.subtitle}>Edit the details below to update this product</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.grid,
            gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
          }}>

            {/* Left Column */}
            <div style={styles.leftCol}>
              <div style={styles.imageUploadBox}>
                {preview ? (
                  <img src={preview} alt="preview" style={styles.previewImg} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <p style={styles.uploadIcon}>📷</p>
                    <p style={styles.uploadText}>Click to change image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
              </div>

              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id="productAvailable"
                  checked={updateProduct.productAvailable}
                  onChange={(e) =>
                    setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                  }
                  style={styles.checkbox}
                />
                <label htmlFor="productAvailable" style={styles.checkboxLabel}>
                  ✅ Product Available
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.rightCol}>

              <div style={{
                ...styles.row,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updateProduct.name}
                    onChange={handleChange}
                    placeholder="e.g. iPhone 15 Pro"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={updateProduct.brand}
                    onChange={handleChange}
                    placeholder="e.g. Apple"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={updateProduct.description}
                  onChange={handleChange}
                  placeholder="Describe the product..."
                  style={styles.textarea}
                  rows={3}
                  required
                />
              </div>

              <div style={{
                ...styles.row,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={updateProduct.price}
                    onChange={handleChange}
                    placeholder="e.g. 49999"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={updateProduct.stockQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={{
                ...styles.row,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={updateProduct.category}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Laptop">💻 Laptop</option>
                    <option value="Headphone">🎧 Headphone</option>
                    <option value="Mobile">📱 Mobile</option>
                    <option value="Electronics">⚡ Electronics</option>
                    <option value="Toys">🧸 Toys</option>
                    <option value="Fashion">👗 Fashion</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={updateProduct.releaseDate
                      ? updateProduct.releaseDate.split("T")[0]
                      : ""}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.btnRow}>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${id}`)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={loading ? styles.submitBtnDisabled : styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "✏️ Update Product"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f0c29 0%, #1a1a2e 100%)",
    paddingTop: "90px",
    fontFamily: "'Segoe UI', sans-serif",
    overflowX: "hidden",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 24px 60px",
    boxSizing: "border-box",
    width: "100%",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "32px",
    width: "100%",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gap: "32px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  imageUploadBox: {
    position: "relative",
    height: "280px",
    background: "rgba(255,255,255,0.04)",
    border: "2px dashed rgba(255,255,255,0.15)",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  uploadPlaceholder: {
    textAlign: "center",
  },
  uploadIcon: {
    fontSize: "48px",
    margin: "0 0 8px",
  },
  uploadText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    margin: 0,
  },
  fileInput: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  checkboxLabel: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "grid",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "'Segoe UI', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "12px 24px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  submitBtn: {
    flex: 1,
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
  },
  submitBtnDisabled: {
    flex: 1,
    padding: "12px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "not-allowed",
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default UpdateProduct;