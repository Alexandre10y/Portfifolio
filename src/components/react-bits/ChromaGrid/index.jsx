import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";
import palace from '../../../assets/img/projetos/palace.jpg';
import gh from '../../../assets/img/projetos/gh.jpg';
import AnguloZ from '../../../assets/img/projetos/angulo.jpg';
import Marechal from '../../../assets/img/projetos/marechal.jpeg';
import Farmacia from '../../../assets/img/projetos/Farmacia.png';
import noFoco from '../../../assets/img/projetos/nofoco.png';

export const ChromaGrid = ({
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
            image: palace,
            title: "Laranjeiras Palace Hotel",
            subtitle: "Projeto teste autorizado para treinamento de desenvolvimento.",
            handle: "@Alexandre10y",
            borderColor: "#e5c346ff",
            gradient: "linear-gradient(145deg, #e5d246ff, #000)",
            url: "https://laranjeiraspalacehotel.vercel.app/",
        },
        {
            image: gh,
            title: "GH Treinamentos",
            subtitle: "Sistema web para treinamentos corporativos com interface intuitiva.",
            handle: "@Alexandre10y",
            borderColor: "#10B981",
            gradient: "linear-gradient(210deg, #10B981, #000)",
            url: "https://www.ghtreinamento.com.br/",
        },
        {
            image: AnguloZ,
            title: "AnguloZ - Arquitetura",
            subtitle: "Sistema de arquitetura com gerenciamento de arquivos pelo proprietário.",
            handle: "@Alexandre10y ",
            handle2: "",
            borderColor: "#0b36f5ff",
            gradient: "linear-gradient(165deg, #220bf5ff, #000)",
            url: "https://anguloz.vercel.app",
        },
        {
            image: Marechal,
            title: "Hotel Marechal Express",
            subtitle: "Sistema Web com imagem 360º Graus para visualização",
            handle: "@Alexandre10y",
            borderColor: "#efef44ff",
            gradient: "linear-gradient(195deg, #efef44ff, #000)",
            url: "https://www.hotelmarechal.com.br",
        },
        {
            image: Farmacia,
            title: "Farmácia Solidaria - PRIVADO",
            subtitle: "Projeto de organização e controle de medicamentos",
            handle: "@Alexandre10y",
            borderColor: "#8B5CF6",
            gradient: "linear-gradient(225deg, #8B5CF6, #000)",
            url: "https://farmacia-solidaria-ara.vercel.app",
        },
        
        {
            image: noFoco,
            title: "No Foco da Noticia - PRIVADO",
            subtitle: "Desenvolvido através da plataform Hostinger para terceiros",
            handle: "@Alexandre10y",
            borderColor: "#5c95f6ff",
            gradient: "linear-gradient(225deg, #5c8af6ff, #000)",
            url: "https://nofocodanoticia.com.br/",
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

export default ChromaGrid;
