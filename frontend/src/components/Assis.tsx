

import { useState, useRef, useEffect } from "react";

type Mode = "translate" | "correct" | "explain";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Assis = () => {
  const [mode, setMode] = useState<Mode>("translate");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "👋 Mirë se vini! Shkruani pyetjen tuaj këtu dhe zgjidhni mënyrën: Përkthim, Korrigjim ose Shpjegim.",
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`https://localhost:7138/api/chat/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.result };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Ndodhi një gabim gjatë përpunimit." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      handleSendFile(e.target.files[0]); 
    }
  };

  const handleSendFile = async (file: File) => {
    const userMessage: Message = {
      role: "user",
      content: `📎 Dokument i ngarkuar: ${file.name}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await fetch(`https://localhost:7138/api/chat/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.result };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Gabim gjatë përpunimit të dokumentit." },
      ]);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="assistant-container">
      <div className="assistant-header">
        <h2>🤖 Asistent Gjuhësor</h2>
        <p>Asistent virtual për përkthime dhe ndihmë gjuhësore</p>
      </div>

      <div className="mode-selector">
        <button className={mode === "translate" ? "active" : ""} onClick={() => setMode("translate")}>Përkthim</button>
        <button className={mode === "correct" ? "active" : ""} onClick={() => setMode("correct")}>Korrigjim</button>
        <button className={mode === "explain" ? "active" : ""} onClick={() => setMode("explain")}>Shpjegim</button>
      </div>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role === "user" ? "user" : "assistant"}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant typing">🤖 Duke menduar...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT + + + SEND */}
      <div className="input-area" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {/* + hap file picker direkt */}
        <button
          onClick={() => fileInputRef.current?.click()}
        >
          +
        </button>

        <input
          type="text"
          placeholder="Shkruaj mesazhin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ flex: 1 }}
        />

        <button onClick={handleSend}>➤</button>
      <label htmlFor="fileUpload" style={{ display: "none" }}>Ngarko dokument (.txt)</label>
      <input
       id="fileUpload"
       type="file"
       accept=".txt"
       ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleFileChange}
      />
      </div>
    </div>
  );
};
export default Assis;