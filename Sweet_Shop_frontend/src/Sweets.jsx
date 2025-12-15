import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState(""); // ✅ SEARCH STATE
  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");
  const isAdmin = role === "admin";

  // -------------------------
  // FETCH SWEETS
  // -------------------------
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch("http://127.0.0.1:8000/sweets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setSweets)
      .catch(() => {
        localStorage.clear();
        navigate("/login", { replace: true });
      });
  }, [token, navigate]);

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // -------------------------
  // USER: PURCHASE
  // -------------------------
  const handlePurchase = async (id) => {
    const res = await fetch(
      `http://127.0.0.1:8000/sweets/${id}/purchase`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      alert("Unable to purchase");
      return;
    }

    setSweets((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: s.quantity - 1 } : s
      )
    );
  };

  // -------------------------
  // ADMIN ACTIONS
  // -------------------------
  const handleAddSweet = async () => {
    const res = await fetch("http://127.0.0.1:8000/sweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSweet),
    });

    if (!res.ok) {
      alert("Only admins can add sweets");
      return;
    }

    const data = await res.json();
    setSweets((prev) => [...prev, data]);
    setNewSweet({ name: "", category: "", price: "", quantity: "" });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Only admins can delete sweets");
      return;
    }

    setSweets((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRestock = async (id) => {
    const res = await fetch(
      `http://127.0.0.1:8000/sweets/${id}/restock?amount=5`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      alert("Only admins can restock sweets");
      return;
    }

    setSweets((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: s.quantity + 5 } : s
      )
    );
  };

  // -------------------------
  // FILTERED SWEETS (SEARCH)
  // -------------------------
  const filteredSweets = sweets.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  // -------------------------
  // UI
  // -------------------------
  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "#fdecef",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2>🍭 Sweet Shop Inventory</h2>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#e53935",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px",
          marginBottom: "2rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {/* ADMIN ADD SWEET */}
      {/* ADMIN ADD SWEET */}
{isAdmin && (
  <div
    style={{
      background: "white",
      padding: "1rem",
      borderRadius: "10px",
      marginBottom: "2rem",
      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: "1rem" }}>➕ Add Sweet</h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 1fr",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <input
        placeholder="Name"
        value={newSweet.name}
        onChange={(e) =>
          setNewSweet({ ...newSweet, name: e.target.value })
        }
      />

      <input
        placeholder="Category"
        value={newSweet.category}
        onChange={(e) =>
          setNewSweet({ ...newSweet, category: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Price"
        value={newSweet.price}
        onChange={(e) =>
          setNewSweet({ ...newSweet, price: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Qty"
        value={newSweet.quantity}
        onChange={(e) =>
          setNewSweet({ ...newSweet, quantity: e.target.value })
        }
      />

      <button
        onClick={handleAddSweet}
        style={{
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          height: "42px",
        }}
      >
        Add Sweet
      </button>
    </div>
  </div>
)}


      {/* SWEETS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredSweets.map((s) => (
          <div
            key={s.id}
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "14px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          >
            <h3>{s.name}</h3>
            <p>Category: {s.category}</p>
            <p>₹{s.price}</p>
            <p>Qty: {s.quantity}</p>

            {!isAdmin && (
              <button
                disabled={s.quantity === 0}
                onClick={() => handlePurchase(s.id)}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  backgroundColor:
                    s.quantity === 0 ? "#ccc" : "#e53935",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  cursor: s.quantity === 0 ? "not-allowed" : "pointer",
                }}
              >
                {s.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>
            )}

            {isAdmin && (
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button
                  onClick={() => handleRestock(s.id)}
                  style={{
                    flex: 1,
                    background: "#43a047",
                    color: "white",
                    border: "none",
                    padding: "6px",
                    borderRadius: "6px",
                  }}
                >
                  Restock
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  style={{
                    flex: 1,
                    background: "#e53935",
                    color: "white",
                    border: "none",
                    padding: "6px",
                    borderRadius: "6px",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sweets;
