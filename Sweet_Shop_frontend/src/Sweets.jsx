import { useEffect, useState } from "react";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      alert("You are not logged in");
      return;
    }

    fetch("http://127.0.0.1:8000/sweets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => setSweets(data))
      .catch(() => alert("Failed to fetch sweets"));
  }, []);

  return (
  <div style={{ padding: "2rem" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
      }}
    >
      <h2>🍭 Sweet Shop Inventory</h2>
      <button
        onClick={() => {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }}
        style={{
          padding: "8px 14px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {sweets.map((sweet) => (
        <div
          key={sweet.id}
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{sweet.name}</h3>
          <p>Category: {sweet.category}</p>
          <p>Price: ₹{sweet.price}</p>
          <p>Quantity: {sweet.quantity}</p>
        </div>
      ))}
    </div>
  </div>
);

}

export default Sweets;
