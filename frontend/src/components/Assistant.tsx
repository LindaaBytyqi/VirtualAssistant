

// import { useState } from "react";

// type Mode = "translate" | "correct" | "explain";

// const Assistant = () => {
//   const [mode, setMode] = useState<Mode>("translate");
//   const [text, setText] = useState("");
//   const [language, setLanguage] = useState("English");
//   const [result, setResult] = useState("");

//   const handleSubmit = async () => {
//     const response = await fetch(
//       `https://localhost:7138/api/chat/${mode}`, // endpoint ndryshon sipas mode
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // body: JSON.stringify(text),
//         body: JSON.stringify({ text, targetLanguage: language })
//       }
//     );

//     const data = await response.json();
//     setResult(data.result);
//   };

//   return (
//     <div className="card shadow p-4">
//       <h3 className="text-center mb-3">Language Assistant</h3>
//       <p className="text-center text-muted">
//         Asistent virtual për përkthime dhe ndihmë gjuhësore
//       </p>

//       {/* Zgjedhja e funksionit */}
//       <div className="btn-group mb-3 w-100">
//         <button
//           className={`btn btn-outline-primary ${mode === "translate" ? "active" : ""}`}
//           onClick={() => setMode("translate")}
//         >
//           Përkthim
//         </button>
//         <button
//           className={`btn btn-outline-primary ${mode === "correct" ? "active" : ""}`}
//           onClick={() => setMode("correct")}
//         >
//           Korrigjim sintakse
//         </button>
//         <button
//           className={`btn btn-outline-primary ${mode === "explain" ? "active" : ""}`}
//           onClick={() => setMode("explain")}
//         >
//           Shpjegim fjale
//         </button>
//       </div>

//       {/* Input */}
//       <textarea
//         className="form-control mb-3"
//         rows={4}
//         placeholder="Shkruaj tekstin këtu..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       {/* Gjuha vetëm për përkthim (vetëm vizuale) */}
//       {mode === "translate" && (
//         <select
//           className="form-select mb-3"
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//         >
//           <option>English</option>
//           <option>Albanian</option>
//           <option>German</option>
//           <option>French</option>
//         </select>
//       )}

//       <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit}>
//         Dërgo
//       </button>

//       {result && (
//         <div className="alert alert-secondary mt-3">
//           <strong>Përgjigja:</strong>
//           <p className="mb-0">{result}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Assistant;


import { useState } from "react";

type Mode = "translate" | "correct" | "explain";

const Assistant = () => {
  const [mode, setMode] = useState<Mode>("translate");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!text.trim()) return; // mos dërgo bosh

    setLoading(true);

    setResult("");

    try {
      // Vendos body sipas mode
      let bodyData: any;
      if (mode === "translate") {
        bodyData = { text, targetLanguage: language };
      } else {
        bodyData = text;
      }

      const response = await fetch(
        `https://localhost:7138/api/chat/${mode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error from server");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4">
      <h3 className="text-center mb-3">Language Assistant</h3>
      <p className="text-center text-muted">
        Asistent virtual për përkthime dhe ndihmë gjuhësore
      </p>

      {/* Zgjedhja e funksionit */}
      <div className="btn-group mb-3 w-100">
        <button
          className={`btn btn-outline-primary ${mode === "translate" ? "active" : ""}`}
          onClick={() => setMode("translate")}
        >
          Përkthim
        </button>
        <button
          className={`btn btn-outline-primary ${mode === "correct" ? "active" : ""}`}
          onClick={() => setMode("correct")}
        >
          Korrigjim sintakse
        </button>
        <button
          className={`btn btn-outline-primary ${mode === "explain" ? "active" : ""}`}
          onClick={() => setMode("explain")}
        >
          Shpjegim fjale
        </button>
      </div>

      {/* Input */}
      <textarea
        className="form-control mb-3"
        rows={4}
        placeholder="Shkruaj tekstin këtu..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Gjuha vetëm për translate */}
      {mode === "translate" && (
        <select
          className="form-select mb-3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Albanian</option>
          <option>German</option>
          <option>French</option>
        </select>
      )}

      <button
        className="btn btn-primary w-100 mb-3"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Duke dërguar..." : "Dërgo"}
      </button>
    </div>
  );
};

export default Assistant;
