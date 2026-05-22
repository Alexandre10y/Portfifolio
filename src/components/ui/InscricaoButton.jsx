import { FaArrowRight } from 'react-icons/fa6';
import { INSCRICAO } from '../../constants/contact';
import './InscricaoButton.css';

export default function InscricaoButton({
  variant = 'primary',
  className = '',
  showIcon = true,
}) {
  const isExternal = INSCRICAO.formUrl.startsWith('http');

  return (
    <a
      href={INSCRICAO.formUrl}
      className={`inscricao-btn inscricao-btn--${variant} ${className}`.trim()}
      {...(isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {INSCRICAO.formLabel}
      {showIcon && <FaArrowRight aria-hidden="true" />}
    </a>
  );
}
