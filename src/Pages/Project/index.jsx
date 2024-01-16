import Stack from 'react-bootstrap/Stack';
import { Container } from 'react-bootstrap';
import { FaGithub } from "react-icons/fa";
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import React from 'react';
import Frente from '../../images/frente.jpg'
import GH from '../../images/gh.jpg'
import Angulo from '../../images/angulo.jpg'
import './style.css'
function Projeto() {
    return (
        <>
            <Container>

                <h4 className='alinha'>Projects</h4>
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
                </div>
            </Container>
        </>
    );
}

export default Projeto;