import { FaCube, FaTableCellsLarge } from 'react-icons/fa6';
import './project-city-chooser.css';

export default function ProjectCityChooser({ onLoad3D, onClassic }) {
  return (
    <div className="city-chooser">
      <div className="city-chooser__card">
        <span className="city-chooser__kicker">Escolha como explorar</span>
        <h3>Como você quer ver os projetos?</h3>
        <p>
          A avenida 3D carrega sob demanda (mais pesada, mais imersiva). A grade clássica
          abre na hora, leve e direta.
        </p>

        <div className="city-chooser__actions">
          <button type="button" className="city-chooser__btn city-chooser__btn--3d" onClick={onLoad3D}>
            <FaCube />
            <span>
              <strong>Toque para carregar a avenida 3D</strong>
              <small>Dirija entre os empreendimentos</small>
            </span>
          </button>

          <button
            type="button"
            className="city-chooser__btn city-chooser__btn--classic"
            onClick={onClassic}
          >
            <FaTableCellsLarge />
            <span>
              <strong>Ver modelo clássico</strong>
              <small>Grade de cards tradicional</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
