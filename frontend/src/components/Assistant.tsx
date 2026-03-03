
import { useState } from "react";
import Select from "react-select";

type Mode = "translate" | "correct" | "explain";

const Assistant = () => {
  const [mode, setMode] = useState<Mode>("translate");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
  const [fromLanguage, setFromLanguage] = useState("English");
  const [toLanguage, setToLanguage] = useState("Albanian");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const languageOptions = [
  { value: "Albanian", label: "Albanian" },
  { value: "English", label: "English" },
  { value: "Croatian", label: "Croatian" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Arabic", label: "Arabic" },
  { value: "Hindi", label: "Hindi" },
  { value: "Bengali", label: "Bengali" },
  { value: "Turkish", label: "Turkish" },
  { value: "Persian", label: "Persian" },
  { value: "Polish", label: "Polish" },
  { value: "Swedish", label: "Swedish" },
  { value: "Dutch", label: "Dutch" }
];
   const swapLanguages = () => {
  if (fromLanguage === "Auto") return;

  setFromLanguage(toLanguage);
  setToLanguage(fromLanguage);
};


  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult("");

    try {
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
      <h3 className="text-center mb-3">Asistent Gjuhësore</h3>
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
      {/* <textarea
        className="form-control mb-3"
        rows={4}
        placeholder="Shkruaj tekstin këtu..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />


     {mode === "translate" && (
  <Select
    className="mb-3"
    options={languageOptions}
    value={languageOptions.find(l => l.value === language)}
    onChange={(option) => setLanguage(option?.value || "English")}
    placeholder="Zgjedh gjuhën"
  />
)}

      <button
        className="btn btn-primary w-100 mb-3"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Duke dërguar..." : "Dërgo"}
      </button> */}


        <textarea
  className="form-control mb-3"
  rows={4}
  placeholder="Shkruaj tekstin këtu..."
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

{mode === "translate" && (
  <div className="d-flex gap-2 mb-3">
   <select
  className="form-select"
  value={fromLanguage}
  onChange={(e) => setFromLanguage(e.target.value)}
>
  <option value="Auto">Auto-detect</option>

  {languageOptions.map((lang) => (
    <option key={lang.value} value={lang.value}>
      {lang.label}
    </option>
  ))}
</select>


    <button
      className="btn btn-outline-secondary"
      onClick={swapLanguages}
      type="button"
    >
      🔁
    </button>

   <select
  className="form-select"
  value={toLanguage}
  onChange={(e) => setToLanguage(e.target.value)}
>
  {languageOptions.map((lang) => (
    <option key={lang.value} value={lang.value}>
      {lang.label}
    </option>
  ))}
</select>

  </div>
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
