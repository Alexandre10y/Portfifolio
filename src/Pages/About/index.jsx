import React from 'react';
import Perfil from '../../images/perfil.jpg'
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import './style.css';
function about() {
    
    return (
        <>
            <div className="sobre-container p-3 ">
                <div className="sobre-content ">
                    <div className='d-flex'>

                        <Col xs={6} md={4}>
                            <Image src={Perfil} thumbnail />
                        </Col>
                        <div className='p-4'>
                            <h2>Quem é Alexandre Belloni</h2>
                            <p> Sou Alexandre Belloni, 22 anos, professor de
                                robótica e desenvolvedor web. Sempre em busca de
                                desafios, sou conhecido pela minha animação em trabalhos,
                                meu jeito extrovertido e pela facilidade em me
                                comunicar. Apaixonado por compartilhar conhecimento,
                                sempre buscando aprender, e trabalhando cada vez mais!
                                Como sempre digo: <p></p> <strong>"Bora crescer que a concorrência não para!"</strong>
                            </p>
                        </div>
                    </div>

                    <h2>O que domíno na programação?</h2>
                    <p> Sou um desenvolvedor Front-end com conhecimentos básicos em backend,
                        pronto para oferecer as melhores soluções para o seu negócio.
                        Com 22 anos e atualmente formando em Engenharia de Software no 8º período,
                        sou apaixonado pelo ramo tecnologico. Com facilidade em aprendizado
                        e boa comunicação eu sigo uma frase: <strong>Nada é impossível na programação.</strong>
                        Minha principal stack é React, mas sou
                        extremamente flexível e habilidoso com diversas linguagens e
                        frameworks de programação.
                    </p>
                    <h5 className='pl-2'>Exemplos: </h5>
                    <div className='d-flex '>
                        <div>
                            <ul>
                                <li>Flutter</li>
                                <li>JavaScript</li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li>HTML5</li>
                                <li>CSS</li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li>PHP</li>
                                <li>MYSQL BÁSICO</li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li>C++</li>
                            </ul>
                        </div>

                    </div>

                    {/* Adicione mais seções conforme necessário */}
                </div>
            </div>
        </>
    );
}

export default about;