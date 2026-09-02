import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { netflixConfig } from "./config.js";

const EXPORT_WIDTH = 2386;
const EXPORT_HEIGHT = 3567;
const STORAGE_KEY = "caratula-netflix-project-v1";

function getInitialProject() {
  const defaults = {
    title: netflixConfig.title,
    principalImage: netflixConfig.principalImage,
    avatar: netflixConfig.avatar,
    bottomImages: [...netflixConfig.bottomImages],
  };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return defaults;
    return {
      title: typeof parsed.title === "string" ? parsed.title : defaults.title,
      principalImage: typeof parsed.principalImage === "string" ? parsed.principalImage : defaults.principalImage,
      avatar: typeof parsed.avatar === "string" ? parsed.avatar : defaults.avatar,
      bottomImages: Array.from({ length: 5 }, (_, index) =>
        typeof parsed.bottomImages?.[index] === "string" ? parsed.bottomImages[index] : (defaults.bottomImages[index] || "")
      ),
    };
  } catch {
    return defaults;
  }
}

function ImageOrPlaceholder({ src, alt, className = "" }) {
  return src ? (
    <img className={className} src={src} alt={alt} crossOrigin="anonymous" />
  ) : (
    <div className={`${className} image-placeholder`} aria-label={alt} />
  );
}

function NetflixLogo() {
  return <div className="netflix-logo" aria-label="Netflix">NETFLIX</div>;
}

function App() {
  const [project, setProject] = useState(getInitialProject);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (error) {
      console.error("No se pudo guardar el proyecto automáticamente:", error);
    }
  }, [project]);

  const updateProject = (key, value) => {
    setProject((current) => ({ ...current, [key]: value }));
  };

  const updateBottomImage = (index, value) => {
    setProject((current) => ({
      ...current,
      bottomImages: current.bottomImages.map((image, imageIndex) =>
        imageIndex === index ? value : image
      ),
    }));
  };

  const fields = useMemo(() => [
    { key: "principalImage", label: "Foto principal", placeholder: "https://..." },
    { key: "avatar", label: "Foto avatar", placeholder: "https://..." },
  ], []);

  const exportPNG = async () => {
    if (!canvasRef.current || exporting) return;
    try {
      setExporting(true);
      const images = Array.from(canvasRef.current.querySelectorAll("img"));
      await Promise.all(images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }));

      const rect = canvasRef.current.getBoundingClientRect();
      const scale = EXPORT_WIDTH / rect.width;
      const rendered = await html2canvas(canvasRef.current, {
        backgroundColor: "#000000",
        useCORS: true,
        allowTaint: false,
        scale,
        width: rect.width,
        height: rect.height,
        logging: false,
      });

      const output = document.createElement("canvas");
      output.width = EXPORT_WIDTH;
      output.height = EXPORT_HEIGHT;
      output.getContext("2d").drawImage(rendered, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

      const link = document.createElement("a");
      link.download = `${project.title || "caratula-netflix"}-20.2x30.2cm.png`;
      link.href = output.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("No se pudo exportar la carátula:", error);
      window.alert("No se pudo exportar la imagen. Comprueba que las URLs de las fotos sean públicas y HTTPS.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="creator-app">
      <aside className="editor-panel" aria-label="Editor de proyecto">
        <div className="editor-header">
          <div>
            <span className="editor-kicker">EDITOR</span>
            <h1>Carátula Netflix</h1>
          </div>
          <span className="size-badge">20.2 × 30.2 cm</span>
        </div>

        <section className="editor-section">
          <h2>Contenido</h2>
          <label className="field">
            <span>Título</span>
            <input value={project.title} onChange={(event) => updateProject("title", event.target.value)} placeholder="Nombre de la Historia" />
          </label>
          {fields.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              <input value={project[field.key]} onChange={(event) => updateProject(field.key, event.target.value)} placeholder={field.placeholder} inputMode="url" />
            </label>
          ))}
        </section>

        <section className="editor-section">
          <h2>Fotos inferiores</h2>
          {project.bottomImages.map((image, index) => (
            <label className="field" key={index}>
              <span>Foto {index + 1}</span>
              <input value={image} onChange={(event) => updateBottomImage(index, event.target.value)} placeholder="https://..." inputMode="url" />
            </label>
          ))}
        </section>

        <div className="editor-footer">
          <div className="export-info">
            <strong>PNG de alta resolución</strong>
            <span>2386 × 3567 px · proporción 20.2:30.2</span>
          </div>
          <button className="export-button" onClick={exportPNG} disabled={exporting}>
            {exporting ? "Exportando…" : "Exportar PNG"}
          </button>
        </div>
      </aside>

      <section className="preview-panel" aria-label="Vista previa">
        <div className="preview-heading">
          <div>
            <span>VISTA PREVIA</span>
            <strong>El diseño que ves es el que se exporta</strong>
          </div>
          <span className="preview-dimensions">20.2 × 30.2 cm</span>
        </div>

        <div className="preview-stage">
          <div className="preview-canvas-wrap">
            <div className="page-shell" ref={canvasRef}>
              <section className="hero" aria-label="Carátula principal">
                <ImageOrPlaceholder src={project.principalImage} alt={`Foto principal de ${project.title}`} className="hero-image" />
                <div className="hero-overlay" />
                <header className="topbar">
                  <NetflixLogo />
                  <nav className="desktop-nav" aria-label="Navegación">
                    <span>Inicio</span><span>Series</span><span>Películas</span><span>Novedades</span>
                  </nav>
                  <div className="top-actions">
                    <button className="icon-button" aria-label="Buscar">⌕</button>
                    <button className="icon-button" aria-label="Notificaciones">♧</button>
                    <ImageOrPlaceholder src={project.avatar} alt="Avatar" className="avatar" />
                    <span className="chevron" aria-hidden="true">⌄</span>
                  </div>
                </header>
                <div className="hero-content">
                  <div className="movie-label">N&nbsp; PELÍCULA</div>
                  <h1>{project.title || "Nombre de la Historia"}</h1>
                  <div className="metadata" aria-label="Información"><span>2024</span><span className="age">13+</span><span>1h 45 min</span><span>HD</span></div>
                  <div className="ranking"><strong>TOP 10</strong><span>#1 en México hoy</span></div>
                  <p className="synopsis">Una historia inolvidable llena de momentos únicos, emociones reales y un amor que trasciende el tiempo.</p>
                  <div className="hero-actions">
                    <button className="play-button"><span>▶</span> Reproducir</button>
                    <button className="secondary-button"><span>＋</span> Mi lista</button>
                    <button className="reaction-button" aria-label="Me gusta">♡</button>
                    <button className="reaction-button" aria-label="No me gusta">♧</button>
                  </div>
                </div>
              </section>
              <section className="history-section">
                <h2>Nuestra Historia</h2>
                <div className="history-grid">
                  {project.bottomImages.map((image, index) => (
                    <article className="story-card" key={index}>
                      <ImageOrPlaceholder src={image} alt={`Foto ${index + 1} de ${project.title}`} className="story-image" />
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
