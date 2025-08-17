import { useEffect, useRef, useState } from 'react';
import DarkVeil from '../../components/react-bits/DarkVeil';
import TextPressure from '../../components/react-bits/TextPressure';
import TargetCursor from '../../components/react-bits/TargetCursor';
import fotoPerfil from '../../assets/img/foto .png';
import './style.css';
import ChromaGrid from '../../components/react-bits/ChromaGrid';
import MeuDrigPessoal from '../../components/react-bits/MeuDrigPessoal';
import ProfileCard from '../../components/react-bits/card-sobre';
import SkillsMarquee from '../../components/linhaDev';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import HTML from '../../../src/assets/img/cursos/Project1.png';
import robotica from '../../../src/assets/img/cursos/Project2.png';
import prof from '../../../src/assets/img/cursos/Project5.png';
import EducationSection from '../../components/formacao';

export default function Home() {
    const [showGrid, setShowGrid] = useState(false);
    const gridRef = useRef(null);

    const [showPersonalGrid, setShowPersonalGrid] = useState(false);
    const personalGridRef = useRef(null);

    // assim que abrir o grid, rola suave até ele
    useEffect(() => {
        if (showGrid && gridRef.current) {
            gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showGrid]);


    useEffect(() => {
        if (showPersonalGrid && personalGridRef.current) {
            personalGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showPersonalGrid]);

    return (
        <>
            {/* SEÇÃO HERO */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden'
                }}
            >
                {/* FUNDO */}
                <DarkVeil
                    hueShift={50}
                    noiseIntensity={0.05}
                    scanlineIntensity={0.1}
                    speed={0.6}
                    warpAmount={0.05}
                />

                {/* CONTEÚDO */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 3,
                        display: 'grid',
                        placeItems: 'center',
                        textAlign: 'center',
                        color: '#fff',
                        padding: '0 24px'
                    }}
                >
                    <div>
                        <div style={{ position: 'relative', height: '150px' }}>
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
                        <h1 style={{ fontSize: '3.2rem', lineHeight: 1.15, marginBottom: 24, fontWeight: 800 }}>
                            Seja encorajado pela ambição.
                        </h1>
                        <p>
                            <span className='destaque-span' destaque>
                                Como dizia Sr. Clovis:
                            </span>
                            "Como pode um cara escrever uma coisa que eu não entenda?"
                        </p>
                        <img
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            className='perfil mt-4'
                            src={fotoPerfil}
                            alt="Foto de perfil"
                        />
                    </div>
                </div>
            </div>



            {/* SEÇÃO INTERATIVA */}
            <section
                style={{
                    padding: '0px 80px 20px',
                    textAlign: 'center',
                    background: 'black',
                    color: '#fff',

                }}
            >
                <h2 style={{ marginBottom: '20px', marginTop: '40px' }}>Conheça alguns de meus trabalhos:</h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', }}>
                    <button
                        type="button"
                        className="cursor-target"
                        style={{ padding: '15px 25px', background: '#333', color: 'white', borderRadius: '8px' }}
                        onClick={() => {
                            setShowGrid(true);
                            setShowPersonalGrid(false);
                        }}
                        aria-controls="grid-projetos"
                        aria-expanded={showGrid}
                    >
                        Projetos Empresariais
                    </button>

                    <button
                        type="button"
                        className="cursor-target"
                        style={{ padding: '15px 25px', background: '#333', color: 'white', borderRadius: '8px' }}
                        onClick={() => {
                            setShowGrid(false);
                            setShowPersonalGrid(true);
                        }}
                    >
                        Trabalhos Pessoais
                    </button>
                </div>
            </section >



            {/* BLOCO DO GRID (aparece só quando clicar) */}
            {
                showGrid && (
                    <div
                        id="grid-projetos"
                        ref={gridRef}
                        style={{
                            background: '#050505',
                            padding: '40px 24px'
                        }}

                    >
                        <ChromaGrid />
                    </div>
                )
            }

            {
                showPersonalGrid && (
                    <div
                        ref={personalGridRef}
                        style={{
                            background: '#050505',
                            padding: '40px 24px'
                        }}
                    >
                        {/* Aqui você coloca o componente do grid pessoal */}
                        <MeuDrigPessoal></MeuDrigPessoal>
                    </div>
                )
            }


            {/* CURSOR CUSTOMIZADO (global) */}
            <TargetCursor spinDuration={2} hideDefaultCursor={true} />


            <div className="container">
                <section className="sobre-wrapper">
                    {/* Texto */}
                    <div className="sobre-texto">
                        <h2 className="sobre-titulo cursor-target">Meu nome é Alexandre Belloni</h2>
                        <p className="sobre-paragrafo">
                            Sou apaixonado por ensinar e criar. Entre aulas, projetos e linhas de código,
                            transformo ideias em soluções reais. Atuo no desenvolvimento web e em projetos
                            de robótica, sempre buscando unir tecnologia, estética e propósito.
                            <br />
                            <strong>Cada desafio é uma oportunidade de aprender e inovar.</strong>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="sobre-cardbox">
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
                    </div>
                </section>
            </div>

            <SkillsMarquee></SkillsMarquee>

            <section>
                <div className='text-white container mt-4' >
                    <h3 className='text-center '>Explore alguns dos projetos que marcaram minha trajetória profissional.</h3>

                    <Container className='mt-5'>
                        <Row className="g-3">
                            <Col md={3}>
                                <Card bg="dark" text="white" className="mb-2 h-100 cursor-target">
                                    <Card.Header className="text-center fw-bold ">Aulas de Robótica Básica</Card.Header>
                                    <Card.Body>
                                        <Card.Img variant="top" src={HTML} />
                                        <Card.Text className="mt-2 text-secondary">
                                            Com o intuito de fortalecer o mercado de trabalho e motivar os jovens a se aperfeiçoarem em tecnologia, disponibilizei-me, durante três anos,
                                            para oferecer gratuitamente aulas noturnas no Colégio Técnico Naiana Bavaresco.
                                        </Card.Text>
                                        <Button className='btn-saiba-mais' href="#" target="_blank" variant="light">Saiba Mais</Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card bg="dark" text="white" className="mb-2 h-100 cursor-target">
                                    <Card.Header className="text-center fw-bold">Licenciando Programação e Robótica</Card.Header>
                                    <Card.Body>
                                        <Card.Img className='card-img-uniform' variant="top" src={prof} />
                                        <Card.Text className="mt-2 text-secondary">
                                            Atuando em escolas estaduais, ministro aulas de programação para alunos de 14 a 17 anos, ensinando desde conceitos básicos, como lógica computacional por meio do Scratch, até conteúdos avançados,
                                            como programação em HTML, CSS e JavaScript, nas disciplinas de Pensamento Computacional e Matemática II.
                                        </Card.Text>
                                        <Button href="#" target="_blank" variant="warning" className="fw-bold btn-saiba-mais">Saiba Mais</Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card bg="dark" text="white" className="mb-2 h-100 cursor-target">
                                    <Card.Header className="text-center fw-bold ">Aula de HTML e CSS Gratuitas</Card.Header>
                                    <Card.Body>
                                        <Card.Img variant="top" src={robotica} />
                                        <Card.Text className="mt-2 text-secondary">
                                            Em parceria com o Centro Universitário Campo Real, iniciamos uma imersão em robótica com o objetivo de incentivar jovens a se envolverem mais com o setor tecnológico, especialmente voltado para a área de robótica inicial.
                                        </Card.Text>
                                        <Button className='btn-saiba-mais' href="#" target="_blank" variant="light">Saiba Mais</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>


                    </Container>

                </div>
            </section>


            <section>
                <EducationSection></EducationSection>
            </section>


            <section>
                <Container>
                    <h3 className="mb-2 text-muted22">Atualmente trabalho como:</h3>
                    <Row xs={1} md={3} className="g-3 g-lg-4 mt-1">
                        <Col>
                            <div className="h-100 p-3 rounded bg-muted">
                                <h5 className="fw-bold text-white">Professor de Programação e Robótica</h5>
                                <p>
                                    Contratado pelo Estado para ministrar aulas que vão desde o básico em lógica computacional
                                    até projetos mais avançados, como sistemas de automação com robótica e desenvolvimento de sites
                                    simples utilizando <strong>HTML, CSS e JavaScript</strong>, além do framework <strong>Bootstrap</strong>.
                                </p>
                            </div>
                        </Col>

                        <Col>
                            <div className="h-100 p-3 rounded bg-muted">
                                <h5 className="fw-bold text-white">Serviços de Marketing e Suporte de TI</h5>
                                <p>
                                    Responsável pelo suporte de TI no <strong>Hotel Marechal Express</strong>, cuidando da organização e do
                                    desenvolvimento de campanhas de marketing, além da administração da plataforma <strong>Booking</strong>.
                                </p>
                            </div>
                        </Col>

                        <Col>
                            <div className="h-100 p-3 rounded bg-muted ">
                                <h5 className="fw-bold text-white">Freelancer em Front-End</h5>
                                <p>
                                    Desenvolvimento de interfaces modernas e responsivas, sempre priorizando usabilidade e estética.
                                    Experiência em projetos personalizados para clientes de diferentes segmentos.
                                </p>
                            </div>
                        </Col>
                    </Row>


                </Container>
            </section>
        </>
    );
}
