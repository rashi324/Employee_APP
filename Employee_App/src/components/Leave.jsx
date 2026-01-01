import { useState } from "react";

function Leave() {
  const [leaves, setLeaves] = useState([]);

  const applyLeave = () => {
    setLeaves([...leaves, "Leave Applied"]);
  };

  return (
    <div>
      <h2>Leave Management</h2>
      <button onClick={applyLeave}>Apply Leave</button>

      <ul>
        {leaves.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

export default Leave;
