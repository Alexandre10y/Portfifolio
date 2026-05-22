import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa6';
import { CONTACT } from '../../constants/contact';
import './SocialDock.css';

const LINKS = [
  {
    href: CONTACT.github,
    label: 'GitHub',
    icon: <FaGithub />,
  },
  {
    href: CONTACT.linkedin,
    label: 'LinkedIn',
    icon: <FaLinkedinIn />,
  },
  {
    href: CONTACT.instagram,
    label: 'Instagram',
    icon: <FaInstagram />,
  },
  {
    href: CONTACT.whatsapp,
    label: 'WhatsApp',
    icon: <FaWhatsapp />,
  },
  {
    href: `mailto:${CONTACT.email}`,
    label: 'Email',
    icon: <FaEnvelope />,
  },
];

export default function SocialDock() {
  return (
    <motion.aside
      className="social-dock"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Redes sociais"
    >
      <span className="social-dock__line" aria-hidden="true" />
      <ul className="social-dock__list">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-dock__link cursor-target"
              aria-label={l.label}
            >
              <span className="social-dock__icon">{l.icon}</span>
              <span className="social-dock__tooltip">{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
