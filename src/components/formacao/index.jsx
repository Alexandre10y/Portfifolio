// EducationSection.jsx
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import './style.css'
export default function EducationSection() {
  const formacoes = [
    {
      titulo: "Engenheiro de Software",
      instituicao: "Centro Universitário Campo Real",
      periodo: "2020 — 2024",
      detalhes: "Foco em desenvolvimento web, bancos de dados, documentação e arquitetura de software.",
    },
    {
      titulo: "Tecnico de Informática",
      instituicao: "Colegio Tecnico Naiana Bavaresco de Souza",
      periodo: "2019 — 2021",
      detalhes: "Aprendizado focado em suporte de TI (redes, desktops, impressoras) e criação de web sites.",
    },
  ];

  // const cursos = [
  //   {
  //     titulo: "Bootcamp React + Firebase",
  //     carga: "40h",
  //     plataforma: "Alura",
  //     certificado: "#", // link do certificado
  //     tags: ["React", "Auth", "Firestore"],
  //   },
  //   {
  //     titulo: "Power BI para Negócios",
  //     carga: "30h",
  //     plataforma: "DIO",
  //     certificado: "#",
  //     tags: ["DAX", "Modelagem", "Dashboards"],
  //   },
  //   {
  //     titulo: "Arduino e Robótica Educacional",
  //     carga: "24h",
  //     plataforma: "Udemy",
  //     certificado: "#",
  //     tags: ["Arduino", "Sensores", "Projetos"],
  //   },
  // ];

  return (
    <section id="formacoes" className="py-5">
      <Container>
        <h2 className="text-left mb-4">Formações e Cursos</h2>
        {/* Formações */}
        <Row className="g-4 mb-4">
          {formacoes.map((f, i) => (
            <Col md={6} key={i}>
              <Card bg="dark" text="light" className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Badge bg="secondary" className="mb-2">Formação</Badge>
                  <Card.Title className="mb-1">{f.titulo}</Card.Title>
                  <Card.Subtitle className="text-muted2 mb-2">
                    {f.instituicao} • {f.periodo}
                  </Card.Subtitle>
                  <Card.Text className="text-secondary">{f.detalhes}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Cursos 
        <Row className="g-4">
          {cursos.map((c, i) => (
            <Col md={4} key={i}>
              <Card bg="dark" text="light" className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <Badge bg="warning" text="dark" className="mb-2">Curso</Badge>
                  <Card.Title className="mb-1">{c.titulo}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {c.plataforma} • {c.carga}
                  </Card.Subtitle>

                  <div className="mb-3">
                    {c.tags.map((t, idx) => (
                      <Badge bg="secondary" key={idx} className="me-1 mb-1">{t}</Badge>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="warning"
                      className="fw-semibold rounded-pill px-3"
                      href={c.certificado}
                      target="_blank"
                    >
                      Ver Certificado
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        */}
      </Container>
    </section>
  );
}
