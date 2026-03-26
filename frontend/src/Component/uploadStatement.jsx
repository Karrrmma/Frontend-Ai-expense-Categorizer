import { useState } from "react";
import { uploadStatement } from "../Api/statementApi";

function UploadStatement() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
    setError("");
    setTransactions([]);
    setSelectedCategory("All");
    setSearchTerm("");
    setSortOrder("none");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const response = await uploadStatement(file);
      setFileName(response.fileName || "");
      setTransactions(response.transactions || response.transactionDTOList || []);
    } catch (error) {
      setError("Failed to upload statement.");
      console.error(error);
      setTransactions([]);
    } finally {
      setIsUploading(false);
    }
  };

  const categoryOptions = [
    "All",
    ...new Set((transactions || []).map((txn) => txn.category).filter(Boolean)),
  ];

  const filteredTransactions = (transactions || [])
    .filter((txn) => {
      const matchesCategory =
        selectedCategory === "All" || txn.category === selectedCategory;

      const matchesSearch =
        txn.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "low-to-high") return a.amount - b.amount;
      if (sortOrder === "high-to-low") return b.amount - a.amount;
      return 0;
    });

  const totalAmount = filteredTransactions.reduce(
    (sum, txn) => sum + (txn.amount || 0),
    0
  );

  const getCategoryStyle = (category) => {
    const baseStyle = {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#fff",
      textAlign: "center",
      minWidth: "110px",
    };

    switch (category) {
      case "Food & Dining":
        return { ...baseStyle, background: "linear-gradient(135deg, #ff7a18, #ffb347)" };
      case "Groceries":
        return { ...baseStyle, background: "linear-gradient(135deg, #43cea2, #185a9d)" };
      case "Shopping":
        return { ...baseStyle, background: "linear-gradient(135deg, #c471f5, #fa71cd)" };
      case "Transportation":
        return { ...baseStyle, background: "linear-gradient(135deg, #36d1dc, #5b86e5)" };
      case "Bills & Utilities":
        return { ...baseStyle, background: "linear-gradient(135deg, #11998e, #38ef7d)" };
      case "Entertainment":
        return { ...baseStyle, background: "linear-gradient(135deg, #f953c6, #b91d73)" };
      case "Health & Personal Care":
        return { ...baseStyle, background: "linear-gradient(135deg, #56ab2f, #a8e063)" };
      case "Travel":
        return { ...baseStyle, background: "linear-gradient(135deg, #4facfe, #00f2fe)" };
      case "Transfers & Payments":
        return { ...baseStyle, background: "linear-gradient(135deg, #7f00ff, #e100ff)" };
      case "Fees & Interest":
        return { ...baseStyle, background: "linear-gradient(135deg, #ff416c, #ff4b2b)" };
      default:
        return { ...baseStyle, background: "linear-gradient(135deg, #667eea, #764ba2)" };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        padding: "40px 20px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "28px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "2.4rem",
              fontWeight: "800",
              letterSpacing: "-1px",
            }}
          >
            AI Expense Categorizer
          </h1>
          <p style={{ marginTop: "10px", color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>
            Upload your Amex statement and explore categorized transactions in a beautiful dashboard.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.14)",
            borderRadius: "22px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Upload Statement</h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{
              color: "#fff",
              marginBottom: "14px",
            }}
          />

          <div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                border: "none",
                borderRadius: "14px",
                padding: "12px 22px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                background: isUploading
                  ? "linear-gradient(135deg, #7f8c8d, #95a5a6)"
                  : "linear-gradient(135deg, #ff6a00, #ee0979)",
                color: "#fff",
                boxShadow: "0 10px 24px rgba(238, 9, 121, 0.25)",
              }}
            >
              {isUploading ? "Uploading..." : "Upload Statement"}
            </button>
          </div>

          {error && (
            <p
              style={{
                marginTop: "14px",
                color: "#ffd6d6",
                background: "rgba(255, 77, 77, 0.18)",
                padding: "10px 14px",
                borderRadius: "12px",
              }}
            >
              {error}
            </p>
          )}

          {fileName && (
            <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.92)" }}>
              <strong>Uploaded File:</strong> {fileName}
            </p>
          )}
        </div>

        {Array.isArray(transactions) && transactions.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={summaryCardStyle("#00c6ff", "#0072ff")}>
                <p style={summaryLabelStyle}>Transactions</p>
                <h3 style={summaryValueStyle}>{filteredTransactions.length}</h3>
              </div>

              <div style={summaryCardStyle("#f7971e", "#ffd200")}>
                <p style={summaryLabelStyle}>Visible Total</p>
                <h3 style={summaryValueStyle}>${totalAmount.toFixed(2)}</h3>
              </div>

              <div style={summaryCardStyle("#8e2de2", "#4a00e0")}>
                <p style={summaryLabelStyle}>Selected Category</p>
                <h3 style={summaryValueStyle}>{selectedCategory}</h3>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.14)",
                borderRadius: "22px",
                padding: "22px",
                marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Filter Transactions</h2>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={inputStyle}
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={inputStyle}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={inputStyle}
                >
                  <option value="none">No Sort</option>
                  <option value="low-to-high">Amount: Low to High</option>
                  <option value="high-to-low">Amount: High to Low</option>
                </select>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.14)",
                borderRadius: "22px",
                padding: "22px",
                border: "1px solid rgba(255,255,255,0.12)",
                overflowX: "auto",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Transactions</h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 10px",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn, index) => (
                    <tr
                      key={index}
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
                      }}
                    >
                      <td style={tdStyle}>{txn.date}</td>
                      <td style={tdStyle}>{txn.description}</td>
                      <td style={tdStyle}>${Number(txn.amount).toFixed(2)}</td>
                      <td style={tdStyle}>
                        <span style={getCategoryStyle(txn.category)}>
                          {txn.category || "Other"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "10px" }}>
                  No transactions match your current filters.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const summaryCardStyle = (color1, color2) => ({
  background: `linear-gradient(135deg, ${color1}, ${color2})`,
  borderRadius: "20px",
  padding: "20px",
  color: "#fff",
  boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
});

const summaryLabelStyle = {
  margin: 0,
  fontSize: "0.95rem",
  opacity: 0.9,
};

const summaryValueStyle = {
  margin: "10px 0 0 0",
  fontSize: "1.7rem",
  fontWeight: "800",
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "14px",
  border: "none",
  minWidth: "200px",
  fontSize: "14px",
  background: "rgba(255,255,255,0.95)",
  color: "#222",
};

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  fontSize: "14px",
  color: "rgba(255,255,255,0.9)",
};

const tdStyle = {
  padding: "14px",
  color: "#fff",
  verticalAlign: "top",
};

export default UploadStatement;