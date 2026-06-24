import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const submitData = async () => {
    try {
      const data = input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const response = await fetch(
        "https://chitkara-full-stack-challenge.onrender.com/bfhl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        }
      );

      if (!response.ok) {
        throw new Error("API returned an error");
      }

      const json = await response.json();

      console.log("API Response:", json);
      setResult(json);
    } catch (error) {
      console.error("Frontend Error:", error);
      alert("API Error. Check browser console (F12).");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
        color: "white",
      }}
    >
      <h1>Chitkara Full Stack Engineering Challenge</h1>

      <textarea
        rows="8"
        cols="60"
        placeholder="A->B, A->C, B->D"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
        }}
      />

      <br />
      <br />

      <button
        onClick={submitData}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      <h2>Response</h2>

      <pre
        style={{
          textAlign: "left",
          background: "#222",
          padding: "15px",
          borderRadius: "10px",
          overflow: "auto",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        {result ? JSON.stringify(result, null, 2) : "No response yet"}
      </pre>
    </div>
  );
}

export default App;