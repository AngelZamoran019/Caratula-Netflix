import { netflixConfig } from "./config.js";

function ImageOrPlaceholder({ src, alt, className = "" }) {
  return src ? (
    <img className={className} src={src} alt={alt} />
  ) : (
    <div className={`${className} image-placeholder`} aria-label={alt} />
  );
}

function NetflixLogo() {
  return <div className="netflix-logo" aria-label="Netflix">NETFLIX</div>;
}

function App() {
  const { title, principalImage, avatar, bottomImages } = netflixConfig;

  return (
    <main className="page-shell">
      <section className="hero" aria-label="Carátula principal">
        <ImageOrPlaceholder
          src={principalImage}
          alt={`Foto principal de ${title}`}
          className="hero-image"
        />
        <div className="hero-overlay" />

        <header className="topbar">
          <NetflixLogo />
          <nav className="desktop-nav" aria-label="Navegación">
            <span>Inicio</span>
            <span>Series</span>
            <span>Películas</span>
            <span>Novedades</span>
          </nav>
          <div className="top-actions">
            <button className="icon-button" aria-label="Buscar">⌕</button>
            <button className="icon-button" aria-label="Notificaciones">♧</button>
            <ImageOrPlaceholder src={avatar} alt="Avatar" className="avatar" />
            <span className="chevron" aria-hidden="true">⌄</span>
          </div>
        </header>

        <div className="hero-content">
          <div className="movie-label">N&nbsp; PELÍCULA</div>
          <h1>{title}</h1>

          <div className="metadata" aria-label="Información">
            <span>2024</span>
            <span className="age">13+</span>
            <span>1h 45 min</span>
            <span>HD</span>
          </div>

          <div className="ranking">
            <strong>TOP 10</strong>
            <span>#1 en México hoy</span>
          </div>

          <p className="synopsis">
            Una historia inolvidable llena de momentos únicos, emociones reales y un amor que trasciende el tiempo.
          </p>

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
          {bottomImages.map((image, index) => (
            <article className="story-card" key={index}>
              <ImageOrPlaceholder
                src={image}
                alt={`Foto ${index + 1} de ${title}`}
                className="story-image"
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
