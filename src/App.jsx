import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFeature = async (type) => {
  if (!input.trim()) return;

  let prompt = "";

  if (type === "summarize") {
    prompt = "Summarize this: " + input;
  } else if (type === "grammar") {
    prompt = "Fix grammar: " + input;
  } else if (type === "linkedin") {
    prompt = "Write a professional LinkedIn post about: " + input;
  }

  const newMessage = { role: "user", content: prompt };
  const updatedMessages = [...messages, newMessage];

  setMessages(updatedMessages);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/chat", {
      messages: updatedMessages,
    });

    const aiMessage = {
      role: "assistant",
      content: res.data.content,
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.log(error);
  }

  setLoading(false);
};

  const styles = {
    container: {
      height: "100vh",
      backgroundColor: "#121212",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      fontFamily: "Arial",
    },
    heading: { margin: "20px 0" },
    chatBox: {
      flex: 1,
      width: "100%",
      maxWidth: "800px",
      overflowY: "auto",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
    },
    message: {
      display: "flex",
      marginBottom: "10px",
    },
    bubble: {
      padding: "12px 16px",
      borderRadius: "15px",
      maxWidth: "70%",
      fontSize: "14px",
    },
    inputContainer: {
      display: "flex",
      width: "100%",
      maxWidth: "800px",
      padding: "10px",
      borderTop: "1px solid #333",
    },
    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      outline: "none",
    },
    button: {
      marginLeft: "10px",
      padding: "12px 20px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      cursor: "pointer",
    },
    copyBtn: {
      marginLeft: "10px",
      fontSize: "10px",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      color: "#ccc",
    },
    featureBtn: {
  marginRight: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#333",
  color: "white"
}
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        messages: updatedMessages,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.content,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>AI Assistant</h1>

      
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                backgroundColor:
                  msg.role === "user" ? "#4CAF50" : "#2C2C2C",
              }}
            >
              {msg.content}

              {msg.role === "assistant" && (
                <button
                  onClick={() => copyText(msg.content)}
                  style={styles.copyBtn}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ color: "gray", margin: "10px" }}>
            AI is typing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

    <div style={{ marginBottom: "10px" }}>
  <button style={styles.featureBtn} onClick={() => handleFeature("summarize")}>
    Summarize
  </button>

  <button style={styles.featureBtn} onClick={() => handleFeature("grammar")}>
    Fix Grammar
  </button>

  <button style={styles.featureBtn} onClick={() => handleFeature("linkedin")}>
    LinkedIn Post
  </button>
</div>

      <div style={styles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;