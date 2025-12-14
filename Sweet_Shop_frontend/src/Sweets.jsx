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
      <h2>Sweets List</h2>

      {sweets.length === 0 ? (
        <p>No sweets available</p>
      ) : (
        <ul>
          {sweets.map((sweet) => (
            <li key={sweet.id}>
              <strong>{sweet.name}</strong> — ₹{sweet.price} (Qty:{" "}
              {sweet.quantity})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sweets;
