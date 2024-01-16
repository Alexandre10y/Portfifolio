import React from "react";
import { FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import './style.css';
function Footer() {
    return (
        <>
            <Container className="pt-4">
                <Row>
                    <Col>
                        <h5>Developed by Alexandre Belloni using React.JS</h5>
                    </Col>
                    <Col>
                        <h5><a href="">Source code here</a></h5>
                    </Col>
                    <Col >
                        <ul className="d-flex ">
                            <li className="pl-3"><a target='_blank' href="https://www.instagram.com/alexandre__02/"><FaInstagram /></a></li>
                            <li className="pl-3"><a target='_blank' href="https://wa.me/5542984022669?text=Bem+Vindo%2C+Sou+Alexandre%2C+Desenvolvedor++Front-End.+Como+posso+lhe+ajudar%3F"><FaWhatsapp /></a></li>
                            <li className="pl-3"><a target='_blank' href="https://github.com/Alexandre10y"><FaGithub /></a></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Footer;