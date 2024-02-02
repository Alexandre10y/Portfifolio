import Stack from 'react-bootstrap/Stack';
import { Container } from 'react-bootstrap';
import { FaGithub } from "react-icons/fa";
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import React from 'react';
import Frente from '../../images/frente.jpg'
import GH from '../../images/gh.jpg'
import alexandreAulas from '../../images/prof..png'
import Angulo from '../../images/angulo.jpg'
import Jogo from '../../images/Jogo/unity.png'
import './style.css'
function Projeto() {
    return (
        <>
            <Container>

                <h4 className='alinha'>Projetos Empresáriais</h4>
                <div>
                    {/* Hotel Laranjeiras */}
                    <div className='p-2 d-flex border'>
                        <div className="img-hotel">
                            <Image className="img-hotel" src={Frente} thumbnail />
                        </div>
                        <Col className='text-hotel pt-2'>
                            <h3>Laranjeiras Palace Hotel</h3>
                            <p><strong>Repositório</strong></p>
                            <p>GitHub -<a target='_blank' className='textfinal' href="https://github.com/Alexandre10y/SiteLaranjeriasPalace.git"> PALACE HOTEL<FaGithub /> </a></p>
                            <p>
                                Gostaríamos de ressaltar que o projeto desenvolvido do Laranjeiras
                                Palace Hotel foi realizado de forma gratuita. Essa iniciativa foi
                                proposta com o intuito de aprimorar meu conhecimento
                                como programador e construir um portfólio mais completo para uma possível vaga
                                de Front-End.
                                Valorizei a oportunidade de colaborar com negócios locais
                                e continuei buscando maneiras de oferecer minhas habilidades
                                à comunidade.
                            </p>
                            <a class="textfinal" target='_blank' href="https://laranjeiraspalacehotel.vercel.app">Link do Site</a>
                            <p class="tamanho" >Design: <a class="textfinal" href="tel:+5542984022669">AllSistem</a></p>
                        </Col>
                    </div>
                    <br />
                    {/* Gh Treinamento */}
                    <div className='p-2 d-flex border'>
                        <div className="img-hotel">
                            <Image className="img-hotel" src={GH} thumbnail />
                        </div>
                        <Col className='text-hotel'>
                            <h3 className='pt-5'>GH TREINAMENTOS</h3>
                            <p><strong>Repositório</strong></p>
                            <p>GitHub -<a target='_blank' className='textfinal' href="https://github.com/Alexandre10y/GH-TREINAMENTOS.git"> GH TREINAMENTOS<FaGithub /> </a></p>
                            <p>
                                O projeto da GH TREINAMENTOS foi realizado de forma monetizada.
                                Essa Landing Page foi onde aprendi vários conceitos novos na area do JavaScript.
                                O intuito de aprimorar meu conhecimento como programador evolui muito com este projeto.
                                Valorizei esta oportunidade e contudo ganhei um novo cliente.
                                O site ficou hospedado na plataforma VERCELL de maneira gratuita, sem nenhum custo mensal ou anual.
                            </p>
                            <a class="textfinal" target='_blank' href="https://gh-treinamentos.vercel.app">Link do Site</a>
                            <p class="tamanho" >Design: <a class="textfinal" href="tel:+5542984022669">AllSistem</a></p>
                        </Col>

                    </div>
                    <br />
                    {/* Anguloz */}
                    <div className='p-2 d-flex border'>
                        <div className="img-hotel">
                            <Image className="img-hotel" src={Angulo} thumbnail />
                        </div>
                        <Col className='text-hotel'>
                            <h3 className='pt-5'>AnguloZ</h3>
                            <p><strong>Repositório</strong></p>
                            <p>GitHub -<a target='_blank' className='textfinal' href="https://github.com/1Baldasso/angulozFront.git"> ANGULO Z<FaGithub /> </a></p>
                            <p>
                                O projeto dO AnguloZ foi realizado de forma monetizada.
                                O projeto de desenvolvimdo envolveu trabalho de várias linguagens com React, Js, .NET e SQL.
                                Além da construição de 2 Api para a telas de adminitradores e com tradutor automático.
                                Este projeto foi desenvolvido em equipe por Alexandre Belloni e Lucas Baldasso.
                                O site ficou hospedado na plataforma VERCELL de maneira gratuita, sem nenhum custo mensal ou anual.
                            </p>
                            <a class="textfinal" target='_blank' href="https://anguloz.vercel.app">Link do Site</a>
                            <p class="tamanho" >Design: <a class="textfinal" href="tel:+5542984022669">AllSistem</a></p>
                        </Col>

                    </div>
                    <br />
                    {/* Gh Treinamento */}
                    <div className='p-2 d-flex border'>
                        <div className="img-hotel">
                            <Image className="img-hotel" src={alexandreAulas} thumbnail />
                        </div>
                        <Col className='text-hotel'>
                            <h3 className='pt-5'>Site De Aulas Gratuitas</h3>
                            <p><strong>Repositório</strong></p>
                            <p>GitHub -<a target='_blank' className='textfinal' href="https://github.com/Alexandre10y/aulas-prof-alunos.git"> Aulas Gratuitas<FaGithub /> </a></p>
                            <p>
                                Nosso site visa apoiar professores, alunos e entusiastas da educação. Queremos simplificar o acesso a recursos educacionais, promover a colaboração entre professores, oferecer feedback personalizado aos alunos e compartilhar informações relevantes sobre práticas educacionais. Buscamos criar uma comunidade vibrante e integrada, inspirando o crescimento intelectual e a aprendizagem coletiva.
                            </p>
                            <a class="textfinal" target='_blank' href="https://alexandreaulas.vercel.app/index.html">Link do Site</a>
                            <p class="tamanho" >Design: <a class="textfinal" href="tel:+5542984022669">AllSistem</a></p>
                        </Col>

                    </div>
                </div>

                <h4 className='alinha'>Jogos Desenvolvidos</h4>
                <div>
                    {/* Hotel Laranjeiras */}
                    <div className='p-2 d-flex border'>
                        <div className="img-hotel " >
                            <Image className="img-hotel h-1" src={Jogo} thumbnail />
                        </div>
                        <Col className='text-hotel pt-2'>
                            <h3>Aracnídio</h3>
                            <p><strong>Repositório</strong></p>
                            <p>Unity -<a target='_blank' className='textfinal' href="https://play.unity.com/mg/other/deusolibre?signup=true"> Aracnídio<FaGithub /> </a></p>
                            <p>
                                Visando um perfil profíssional mais completo e fugindo da um pouco da área
                                também me aperfeiçoei em games, conhecendo a linguagem C#
                                Ressaltando que o projeto "Jogo Aracnídio" foi desenvolvido com intuito apenas de adquirir
                                conhecimento e uma experiência diferente do que estou acostumado a trabalhar.
                            </p>
                            <a class="textfinal" target='_blank' href="https://play.unity.com/mg/other/deusolibre?signup=true">Link do Site</a>
                            <p class="tamanho" >Design: <a class="textfinal" href="tel:+5542984022669">AllSistem</a></p>
                        </Col>
                    </div>
                    <br />
                </div>
            </Container>
        </>
    );
}

export default Projeto;