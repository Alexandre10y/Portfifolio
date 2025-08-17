import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";
import futebol from '../../../assets/img/pessoal/bi-champions.jpg';
import dash from '../../../assets/img/pessoal/dashboard.png';
import jogo from '../../../assets/img/pessoal/unity.png';
import buscador from '../../../assets/img/pessoal/Buscador.png';

export const MeuDrigPessoal = ({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    {
      image: futebol,
      title: "Analise da Champions League",
      subtitle: "Utilizando PowerBI conecta a API de dados da champions conseguimos ter analises precisas.",
      handle: "@Alexandre10y",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg, #4F46E5, #000)",
      url: "https://app.powerbi.com/view?r=eyJrIjoiODQxZWRiNTgtNTI0OS00MzZjLTgyYzItM2JhYTQ2ZjdkODM2IiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9",
    },
    {
      image: dash,
      title: "Controle de metas empresarias",
      subtitle: "Com Power BI e suas ferramentas desenvolvemos um metódo para acompanhar metas",
      handle: "@Alexandre10y",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg, #10B981, #000)",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNDVjMTIxMDctNWI5OS00NWZlLTgxYzctZTM0N2ZmMmViYjZhIiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9",
    },
    {
      image: jogo,
      title: "Aracnidio - Jogo da Aranha",
      subtitle: "Desenvolvido durante a faculdade, intuito de desenvolver com o raciocinio lógico e orientação a objetos.",
      handle: "@Alexandre10y",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
      url: "https://play.unity.com/en/games/89c5b01e-a2bc-409f-b210-6f683feff0eb/jogo-aracnidio-pule-e-viva",
    },
    {
      image: buscador,
      title: "Buscador de CEP",
      subtitle: "Utilizando React e APIs do google, foi realizada a criação de localizador de CEP online",
      handle: "@Alexandre10y",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg, #EF4444, #000)",
      url: "https://github.com/Alexandre10y/BuscadorDeCep-React",
    },
    {
      image: buscador,
      title: "Controle de Loja - TCC",
      subtitle: "Buscando controlar vendas, metas, funcionários e fluxo. Foi desenvolido a GH MODAS",
      handle: "@Alexandre10y",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
      url: "https://github.com/",
    },
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        }
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card cursor-target"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={
            {
              "--card-border": c.borderColor || "transparent",
              "--card-gradient": c.gradient,
              cursor: c.url ? "pointer" : "default",
            }
          }
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default MeuDrigPessoal;
