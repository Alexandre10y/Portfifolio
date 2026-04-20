import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaBootstrap,
  FaNodeJs,
  FaPython,
  FaPhp,
  FaGitAlt,
  FaFigma,
  FaDatabase,
} from 'react-icons/fa6';
import { SiJavascript, SiFirebase, SiMysql, SiUnity, SiTailwindcss } from 'react-icons/si';
import { TbChartBar, TbBrandFramerMotion } from 'react-icons/tb';
import './SkillsMarquee.css';

const SKILLS = [
  { name: 'HTML',        icon: <FaHtml5 /> },
  { name: 'CSS',         icon: <FaCss3Alt /> },
  { name: 'JavaScript',  icon: <SiJavascript /> },
  { name: 'React',       icon: <FaReact /> },
  { name: 'Bootstrap',   icon: <FaBootstrap /> },
  { name: 'Tailwind',    icon: <SiTailwindcss /> },
  { name: 'Node.js',     icon: <FaNodeJs /> },
  { name: 'Python',      icon: <FaPython /> },
  { name: 'PHP',         icon: <FaPhp /> },
  { name: 'Power BI',    icon: <TbChartBar /> },
  { name: 'Firebase',    icon: <SiFirebase /> },
  { name: 'MySQL',       icon: <SiMysql /> },
  { name: 'SQL',         icon: <FaDatabase /> },
  { name: 'Unity',       icon: <SiUnity /> },
  { name: 'Git',         icon: <FaGitAlt /> },
  { name: 'Figma',       icon: <FaFigma /> },
  { name: 'Framer',      icon: <TbBrandFramerMotion /> },
];

export default function SkillsMarquee() {
  const renderRow = (reverse = false) => (
    <div className={`skills-track ${reverse ? 'skills-track--reverse' : ''}`}>
      {[...SKILLS, ...SKILLS].map((s, i) => (
        <div key={i} className="skill-item">
          <span className="skill-item__icon" aria-hidden="true">
            {s.icon}
          </span>
          <span className="skill-item__name">{s.name}</span>
          <span className="skill-item__sep" aria-hidden="true">✦</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="skills-marquee" aria-label="Tecnologias">
      <div className="skills-marquee__edge skills-marquee__edge--left" aria-hidden="true" />
      <div className="skills-marquee__edge skills-marquee__edge--right" aria-hidden="true" />

      <div className="skills-marquee__row">{renderRow(false)}</div>
      <div className="skills-marquee__row">{renderRow(true)}</div>
    </section>
  );
}
