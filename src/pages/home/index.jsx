import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Container } from 'react-bootstrap';
import { FaArrowDown } from 'react-icons/fa6';

import DarkVeil from '../../components/react-bits/DarkVeil';
import TextPressure from '../../components/react-bits/TextPressure';
import TargetCursor from '../../components/react-bits/TargetCursor';
import ChromaGrid from '../../components/react-bits/ChromaGrid';
import MeuDrigPessoal from '../../components/react-bits/MeuDrigPessoal';
import ProfileCard from '../../components/react-bits/card-sobre';
import SkillsMarquee from '../../components/linhaDev';
import Timeline from '../../components/formacao/Timeline';
import Navbar from '../../components/nav/Navbar';
import SocialDock from '../../components/ui/SocialDock';
import MagneticButton from '../../components/ui/MagneticButton';
import Reveal from '../../components/ui/Reveal';
import StatsSection from '../../components/stats/StatsSection';
import AtuacaoSection from '../../components/atuacao/AtuacaoSection';
import JourneySection from '../../components/jornada/JourneySection';
import ContactSection from '../../components/contato/ContactSection';
import NoiseOverlay from '../../components/ui/NoiseOverlay';

import fotoPerfil from '../../assets/img/foto .png';

import './style.css';

export default function Home() {
  const [mode, setMode] = useState('empresarial'); // 'empresarial' | 'pessoal'
  const gridRef = useRef(null);
  const heroRef = useRef(null);
  const hasInteractedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasInteractedRef.current) return;
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mode]);

  const handleModeChange = (next) => {
    hasInteractedRef.current = true;
    setMode(next);
  };

  return (
    <>
      <Navbar />
      <SocialDock />
      <NoiseOverlay />

      {/* HERO */}
      <section
        id="inicio"
        ref={heroRef}
        className="hero"
      >
        <motion.div
          className="hero__bg"
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        >
          <DarkVeil
            hueShift={50}
            noiseIntensity={0.05}
            scanlineIntensity={0.1}
            speed={0.6}
            warpAmount={0.05}
          />
        </motion.div>

        <div className="hero__grid" aria-hidden="true" />

        <div className="hero__content">
          <motion.div
            className="hero__tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="hero__tag-dot" />
            Portfólio v2 · 2026
          </motion.div>

          <div className="hero__pressure">
            <TextPressure
              text="Alexandre_Belloni!"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={22}
            />
          </div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Seja encorajado <em>pela ambição</em>.
          </motion.h1>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
          >
            O conhecimento só tem valor quando inspira ação e transforma realidades.
            Desenvolvo produtos digitais com estética, performance e propósito.
          </motion.p>

          <motion.div
            className="hero__avatar-wrap"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero__avatar-ring" aria-hidden="true" />
            <img
              className="hero__avatar"
              src={fotoPerfil}
              alt="Foto de perfil de Alexandre Belloni"
            />
            <span className="hero__avatar-badge" aria-hidden="true">
              <span className="hero__avatar-badge-dot" /> disponível
            </span>
          </motion.div>

          <motion.a
            href="#trabalhos"
            className="hero__scroll cursor-target"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <span>Role para explorar</span>
            <FaArrowDown />
          </motion.a>
        </div>
      </section>

      {/* TRABALHOS */}
      <section id="trabalhos" className="work-section">
        <Container>
          <Reveal className="work-section__head">
            <span className="section-kicker">
              <span className="section-kicker__dot" />
              Portfólio selecionado
            </span>
            <h2 className="section-title">
              Projetos que <em>resolvem problemas</em> reais.
            </h2>
            <p className="section-lead">
              Clientes, marcas e ideias próprias que saíram do rascunho e viraram produto
              disponível para o mundo. Explore por categoria.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="work-section__switch">
            <MagneticButton
              active={mode === 'empresarial'}
              onClick={() => handleModeChange('empresarial')}
              ariaControls="grid-projetos"
              ariaExpanded={mode === 'empresarial'}
            >
              Projetos Empresariais
            </MagneticButton>
            <MagneticButton
              active={mode === 'pessoal'}
              onClick={() => handleModeChange('pessoal')}
              ariaControls="grid-projetos"
              ariaExpanded={mode === 'pessoal'}
              variant="ghost"
            >
              Trabalhos Pessoais
            </MagneticButton>
          </Reveal>
        </Container>

        <div id="grid-projetos" ref={gridRef} className="work-section__grid">
          <AnimatePresence mode="wait">
            {mode === 'empresarial' ? (
              <motion.div
                key="emp"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChromaGrid />
              </motion.div>
            ) : (
              <motion.div
                key="pes"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <MeuDrigPessoal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <TargetCursor spinDuration={2} hideDefaultCursor={true} />

      {/* SOBRE */}
      <section id="sobre" className="about-section">
        <Container>
          <div className="sobre-wrapper">
            <div className="sobre-texto">
              <Reveal>
                <span className="section-kicker">
                  <span className="section-kicker__dot" />
                  Sobre mim
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="section-title sobre-titulo cursor-target">
                  Meu nome é <em>Alexandre Belloni</em>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="sobre-paragrafo">
                  Sou <strong>Engenheiro de Software</strong> e pós-graduado em{' '}
                  <strong>Inteligência Artificial</strong>. Hoje atuo como <strong>Analista
                  de Dados</strong> na <strong>Cresol</strong>, a 3ª maior cooperativa de
                  crédito do Brasil, desenvolvendo painéis gerenciais de BI para decisões
                  estratégicas.
                  <br />
                  <br />
                  Em paralelo, ministro aulas de programação e robótica em escolas estaduais
                  e em iniciativas comunitárias — todas <strong>100% gratuitas</strong> —,
                  além de prestar suporte de TI e automações (chatbots, robôs, sites, e-mail
                  corporativo e Booking) para redes hoteleiras e clientes freelance.
                  <br />
                  <br />
                  <strong>Acredito que tecnologia só faz sentido quando gera impacto real.</strong>
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <ul className="sobre-highlights">
                  <li>
                    <span>01</span>Engenheiro de Software + Pós em Inteligência Artificial
                  </li>
                  <li>
                    <span>02</span>Analista de BI na Cresol · 3ª maior cooperativa do Brasil
                  </li>
                  <li>
                    <span>03</span>Robótica já ministrada no Centro Universitário Campo Real
                  </li>
                  <li>
                    <span>04</span>Aulas de programação <strong>100% gratuitas</strong> há 4+ anos
                  </li>
                </ul>
              </Reveal>
            </div>

            <Reveal direction="right" delay={0.15} className="sobre-cardbox">
              <ProfileCard
                name="Alexandre Belloni"
                title="Software Engineer"
                handle="alexandre10y"
                status="Online"
                contactText="Fale comigo"
                avatarUrl="/images/avatar.png"
                centerImageUrl="/images/foto-central.png"
                showUserInfo
                enableTilt
                enableMobileTilt={false}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <SkillsMarquee />

      <StatsSection />

      <JourneySection />

      <Timeline />

      <AtuacaoSection />

      <ContactSection />
    </>
  );
}
