import "./SkillsMarquee.css";

export default function SkillsMarquee() {
  return (
    <>
      <div className="skills-marquee">
        <div className="skills-track">
          {/* Repita os itens para o loop infinito */}
          <div className="skill-item">HTML</div>
          <div className="skill-item">CSS</div>
          <div className="skill-item">JavaScript</div>
          <div className="skill-item">React</div>
          <div className="skill-item">Bootstrap</div>
          <div className="skill-item">Node.js</div>
          <div className="skill-item">Python</div>
          <div className="skill-item">PHP</div>
          <div className="skill-item">Power BI</div>
          <div className="skill-item">Firebase</div>

          {/* Copia para fazer o loop contínuo */}
          <div className="skill-item">HTML</div>
          <div className="skill-item">CSS</div>
          <div className="skill-item">JavaScript</div>
          <div className="skill-item">React</div>
          <div className="skill-item">Bootstrap</div>
          <div className="skill-item">Node.js</div>
          <div className="skill-item">Python</div>
          <div className="skill-item">PHP</div>
          <div className="skill-item">Power BI</div>
          <div className="skill-item">Firebase</div>
        </div>
      </div>
    </>
  );
}
