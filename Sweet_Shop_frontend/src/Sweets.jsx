import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role"); // 👈 KEY LINE
  const isAdmin = role === "admin";

  // -------------------------
  // AUTH + FETCH SWEETS
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
  // UI
  // -------------------------
  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff0f6, #ffe4ec)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          🍭 Sweet Shop Inventory{" "}
          {isAdmin && <span style={{ fontSize: "14px" }}>👑 Admin</span>}
        </h2>

        <button
          onClick={logout}
          style={{
            background: "#e53935",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* ADMIN ADD SWEET */}
      {isAdmin && (
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderRadius: "12px",
            marginTop: "1.5rem",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          }}
        >
          <h3>➕ Add Sweet</h3>

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
            placeholder="Quantity"
            value={newSweet.quantity}
            onChange={(e) =>
              setNewSweet({ ...newSweet, quantity: e.target.value })
            }
          />

          <button
            onClick={handleAddSweet}
            style={{
              marginTop: "10px",
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
          >
            Add Sweet
          </button>
        </div>
      )}

      {/* SWEETS GRID */}
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          marginTop: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {sweets.map((s) => (
          <div
            key={s.id}
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            }}
          >
            <h3>{s.name}</h3>
            <p>Category: {s.category}</p>
            <p>₹{s.price}</p>
            <p>Qty: {s.quantity}</p>

            {/* ADMIN-ONLY ACTIONS */}
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
