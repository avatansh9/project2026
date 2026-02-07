import { useMemo, useRef, useState } from "react";
import {
  Camera,
  Sparkles,
  Wand2,
  Upload,
  Download,
  Copy,
  Check,
} from "lucide-react";

const TONES = [
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed, witty captions with a light vibe.",
    icon: Sparkles,
  },
  {
    value: "professional",
    label: "Professional",
    description: "Polished and business-ready language.",
    icon: Wand2,
  },
  {
    value: "promotional",
    label: "Promotional",
    description: "Bold calls-to-action with marketing flair.",
    icon: Download,
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm, upbeat energy for everyday sharing.",
    icon: Camera,
  },
  {
    value: "informative",
    label: "Informative",
    description: "Clear, descriptive explanations of the scene.",
    icon: Upload,
  },
];

const gradientBg =
  "linear-gradient(135deg, rgba(102,126,234,1) 0%, rgba(118,75,162,1) 100%)";

export default function Home() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tone, setTone] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const step = useMemo(() => {
    if (!file) return 1;
    if (!tone) return 2;
    return 3;
  }, [file, tone]);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setTone(null);
    setCaptions([]);
    setCopiedIndex(null);
    setError(null);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const onFileChange = (event) => {
    const selected = event.target.files?.[0];
    handleFile(selected);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const selected = event.dataTransfer.files?.[0];
    handleFile(selected);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const generateCaptions = async (nextTone = tone) => {
    if (!file || !nextTone) return;
    setLoading(true);
    setCopiedIndex(null);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("tone", nextTone);
      form.append("num_captions", "3");

      const response = await fetch(`${apiBase}/generate`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();
      setCaptions(data.styled || data.captions || []);
    } catch (err) {
      setError(err.message || "Failed to generate captions.");
    } finally {
      setLoading(false);
    }
  };

  const onSelectTone = (value) => {
    setTone(value);
    generateCaptions(value);
  };

  const onCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1600);
    } catch (err) {
      setCopiedIndex(null);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setTone(null);
    setCaptions([]);
    setCopiedIndex(null);
    setLoading(false);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: gradientBg,
      padding: "48px 20px 72px",
      fontFamily: '"Instrument Sans", "Helvetica Neue", sans-serif',
      color: "#1a1a1a",
    },
    shell: {
      maxWidth: 1200,
      margin: "0 auto",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      marginBottom: 36,
      color: "#fff",
      animation: "fadeIn 0.8s ease",
    },
    title: {
      fontFamily: '"Playfair Display", serif',
      fontSize: "clamp(2.6rem, 4vw, 4rem)",
      margin: 0,
      letterSpacing: "-0.02em",
    },
    tagline: {
      marginTop: 10,
      fontSize: "1.05rem",
      opacity: 0.88,
      maxWidth: 620,
    },
    card: {
      background: "rgba(255,255,255,0.92)",
      borderRadius: 28,
      boxShadow: "0 30px 70px rgba(34, 20, 64, 0.35)",
      padding: "32px",
      backdropFilter: "blur(18px)",
    },
    stepper: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: 24,
    },
    stepBadge: (active) => ({
      padding: "8px 16px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: "0.85rem",
      background: active
        ? "rgba(102,126,234,0.2)"
        : "rgba(255,255,255,0.6)",
      border: "1px solid rgba(255,255,255,0.7)",
      color: active ? "#3c2a70" : "#5a5475",
      boxShadow: active ? "0 8px 20px rgba(99,102,241,0.25)" : "none",
      backdropFilter: "blur(12px)",
      transition: "all 0.3s ease",
    }),
    uploadZone: {
      border: dragActive
        ? "2px solid rgba(118,75,162,0.8)"
        : "2px dashed rgba(118,75,162,0.5)",
      borderRadius: 24,
      padding: "36px",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      background: dragActive
        ? "rgba(118,75,162,0.12)"
        : "rgba(255,255,255,0.6)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    circleIcon: {
      width: 84,
      height: 84,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: "rgba(118,75,162,0.15)",
      marginBottom: 16,
      boxShadow: "inset 0 0 20px rgba(118,75,162,0.2)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
      gap: 16,
      marginTop: 24,
    },
    toneCard: (active) => ({
      padding: 18,
      borderRadius: 20,
      border: active
        ? "1px solid rgba(118,75,162,0.9)"
        : "1px solid rgba(120,120,140,0.2)",
      background: active
        ? "rgba(118,75,162,0.12)"
        : "rgba(255,255,255,0.85)",
      boxShadow: active
        ? "0 18px 30px rgba(118,75,162,0.25)"
        : "0 10px 20px rgba(40, 20, 80, 0.08)",
      transition: "all 0.25s ease",
      cursor: "pointer",
    }),
    toneIcon: {
      display: "inline-flex",
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(118,75,162,0.16)",
      marginBottom: 12,
    },
    captionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 16,
      marginTop: 24,
    },
    captionCard: {
      padding: 18,
      borderRadius: 18,
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(120,120,140,0.2)",
      boxShadow: "0 12px 24px rgba(48, 30, 90, 0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minHeight: 160,
      position: "relative",
      overflow: "hidden",
      animation: "fadeIn 0.5s ease",
    },
    captionIndex: {
      fontWeight: 700,
      color: "rgba(118,75,162,0.9)",
    },
    buttonRow: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 20,
    },
    buttonPrimary: {
      background: "linear-gradient(135deg, #6c63ff 0%, #b074ff 100%)",
      color: "#fff",
      border: "none",
      padding: "12px 22px",
      borderRadius: 999,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 12px 24px rgba(102, 86, 214, 0.35)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    buttonGhost: {
      background: "rgba(255,255,255,0.6)",
      color: "#4a3f72",
      border: "1px solid rgba(120,120,140,0.2)",
      padding: "12px 22px",
      borderRadius: 999,
      fontWeight: 600,
      cursor: "pointer",
    },
    previewImage: {
      width: "100%",
      maxHeight: 340,
      objectFit: "cover",
      borderRadius: 20,
      boxShadow: "0 18px 40px rgba(48, 30, 90, 0.2)",
      marginTop: 18,
    },
    shimmer: {
      height: 160,
      borderRadius: 18,
      background:
        "linear-gradient(110deg, rgba(120,120,140,0.1) 8%, rgba(140,120,200,0.25) 18%, rgba(120,120,140,0.1) 33%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    },
    spinner: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      border: "4px solid rgba(118,75,162,0.2)",
      borderTopColor: "#6c63ff",
      animation: "spin 1s linear infinite",
      margin: "0 auto 12px",
    },
    error: {
      background: "rgba(255, 208, 208, 0.7)",
      border: "1px solid rgba(186, 45, 45, 0.2)",
      color: "#7a1e1e",
      padding: "12px 16px",
      borderRadius: 12,
    },
  };

  return (
    <div style={styles.page}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap");
        * { box-sizing: border-box; }
        button:hover { transform: translateY(-2px); }
        button:active { transform: translateY(0); }
        .lift:hover { transform: translateY(-6px); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
      `}</style>

      <div style={styles.shell}>
        <header style={styles.header}>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            AI Image Captioning
          </p>
          <h1 style={styles.title}>Caption Magic</h1>
          <p style={styles.tagline}>
            Transform any image into polished, on-brand captions with a single
            flow.
          </p>
        </header>

        <section style={styles.card}>
          <div style={styles.stepper}>
            {[
              "Upload Image",
              "Select Tone",
              "View Captions",
            ].map((label, index) => (
              <span key={label} style={styles.stepBadge(step === index + 1)}>
                {index + 1}. {label}
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <div
              style={styles.uploadZone}
              onClick={() => inputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div style={styles.circleIcon}>
                <Camera size={34} color="#6c63ff" />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.4rem" }}>
                Drop your image here
              </h3>
              <p style={{ margin: "8px 0 0", color: "#585070" }}>
                Drag and drop or browse your files to get started.
              </p>
              <button style={{ ...styles.buttonPrimary, marginTop: 16 }}>
                Browse Files
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
            </div>

            {preview ? (
              <img src={preview} alt="Preview" style={styles.previewImage} />
            ) : null}

            {file ? (
              <div>
                <h2
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    marginBottom: 6,
                  }}
                >
                  Choose a tone
                </h2>
                <p style={{ marginTop: 0, color: "#585070" }}>
                  Each tone shifts the language, pacing, and energy of your
                  captions.
                </p>
                <div style={styles.grid}>
                  {TONES.map((toneOption, index) => {
                    const Icon = toneOption.icon;
                    const active = tone === toneOption.value;
                    return (
                      <div
                        key={toneOption.value}
                        style={{
                          ...styles.toneCard(active),
                          animation: `slideIn 0.5s ease ${index * 0.08}s both`,
                        }}
                        className="lift"
                        onClick={() => onSelectTone(toneOption.value)}
                      >
                        <div style={styles.toneIcon}>
                          <Icon size={20} color="#6c63ff" />
                        </div>
                        <h3 style={{ margin: "4px 0" }}>{toneOption.label}</h3>
                        <p style={{ margin: 0, color: "#585070" }}>
                          {toneOption.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {tone ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        marginBottom: 6,
                      }}
                    >
                      Generated captions
                    </h2>
                    <p style={{ marginTop: 0, color: "#585070" }}>
                      Tone selected: <strong>{tone}</strong>
                    </p>
                  </div>
                  <button
                    style={styles.buttonPrimary}
                    onClick={() => generateCaptions(tone)}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Try Different Tone"}
                  </button>
                </div>

                {error ? <div style={styles.error}>{error}</div> : null}

                {loading ? (
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <div style={styles.spinner} />
                    <p style={{ color: "#585070" }}>
                      Captions are coming to life...
                    </p>
                    <div style={styles.captionGrid}>
                      {[0, 1, 2].map((idx) => (
                        <div key={idx} style={styles.shimmer} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={styles.captionGrid}>
                    {captions.map((caption, idx) => (
                      <div
                        key={`${caption}-${idx}`}
                        style={{
                          ...styles.captionCard,
                          animation: `fadeIn 0.4s ease ${idx * 0.1}s both`,
                        }}
                      >
                        <span style={styles.captionIndex}>0{idx + 1}</span>
                        <p style={{ margin: 0 }}>{caption}</p>
                        <button
                          style={{
                            ...styles.buttonGhost,
                            alignSelf: "flex-start",
                            display: "inline-flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                          onClick={() => onCopy(caption, idx)}
                        >
                          {copiedIndex === idx ? (
                            <Check size={16} color="#1f9d55" />
                          ) : (
                            <Copy size={16} />
                          )}
                          {copiedIndex === idx ? "Copied" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.buttonRow}>
                  <button style={styles.buttonGhost} onClick={resetAll}>
                    Start Over
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

