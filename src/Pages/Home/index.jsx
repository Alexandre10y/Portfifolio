import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Perfil from '../../images/perfil.jpg';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaExternalLinkAlt, FaReact, FaHtml5, FaCss3, FaPhp } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './style.css'
import Project from '../../images/card-home/Project1.png'
import Project2 from '../../images/card-home/Project2.png'
import Project3 from '../../images/card-home/Project3.png'
import Project4 from '../../images/card-home/Project4.png'
import Project5 from '../../images/card-home/Project5.png'
function Home() {
  return (
    <Container className='pb-3'>
      <div className='pt-5'>
        {/* Apresentação */}
        <Row>
          <Col xs={6} md={4}>
            <Image src={Perfil} roundedCircle thumbnail />
          </Col>
          <Col className='pt-4'>

            <ListGroup>
              <h2 className="mb-2 text-muted pb-2">Belloni Alexandre</h2>
              <ListGroup.Item >Software Enginer</ListGroup.Item>
              <ListGroup.Item>22 Years</ListGroup.Item>
              <ListGroup.Item><a target='_blank' href='https://maps.app.goo.gl/6y2jBrPSaviJKaH79'>Laranjeiras Do Sul - Paraná <FaExternalLinkAlt /></a> </ListGroup.Item>
              <ListGroup.Item>Domains <FaReact /> <FaHtml5 /> <FaCss3 /> <IoLogoJavascript /> <FaPhp /></ListGroup.Item>
              <ListGroup.Item> Developer Front-End</ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>

        <br />
        <hr />

        {/* Trabalhos desenvolvidos */}
        <Row>
          <h2 className='t-l'>Developer Projects.</h2>
          <Col>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={Project} />
              <Card.Body>
                <Card.Title>HTML CSS PROGRAMMING SCHOOL FOR FREE</Card.Title>
                <Card.Text>
                  Introduction to the basic concepts of web development in html css and java script
                </Card.Text>
                <Button target='_blank' href='https://www.instagram.com/p/Cy6YiVJA0Qp/' variant="primary">know more</Button>
              </Card.Body>
            </Card></Col>
          <Col>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" className='h-6' src={Project2} />
              <Card.Body>
                <Card.Title>ROBOTIC <br /> INSERTION</Card.Title>

                <Card.Text>
                  Introduction to the basics of robotics for free to anyone interested.
                </Card.Text>
                <Button target='_blank' href='https://www.instagram.com/p/CiVA9rWgA-M/' variant="primary">know more</Button>
              </Card.Body>
            </Card></Col>
          <Col>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={Project3} />
              <Card.Body>
                <Card.Title>PRIVATE <br /> PROJECTS</Card.Title>
                <Card.Text>
                  Free projects <br /> developed for <br /> companies.
                </Card.Text>
                <Button variant="primary">know more</Button>
              </Card.Body>
            </Card></Col>
        </Row>
        <Row>
          <h2 className='t-l pt-5 center'>Education.</h2>
          <div className='d-flex center'>

            <Col className='Col'>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={Project4} />
                <Card.Body>
                  <Card.Title>INFORMATIC TECHNICIAN</Card.Title>
                  <Card.Text>
                    Developing knowledge in the areas of hardware,
                    software, networks, basic programming and information security
                  </Card.Text>
                  <Button target='_blank' href='https://www.instagram.com/p/Cy6YiVJA0Qp/' variant="primary">
                    where I graduated</Button>
                </Card.Body>
              </Card></Col>
            <Col className='Col '>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={Project5} />
                <Card.Body>
                  <Card.Title>SOFTWARE ENGINER</Card.Title>

                  <Card.Text>
                    We learn about software, systems design, algorithms, software testing,
                    project management, and software engineering practices
                  </Card.Text>
                  <Button target='_blank' href='https://www.instagram.com/p/CiVA9rWgA-M/' variant="primary">where I graduated</Button>
                </Card.Body>
              </Card></Col>
          </div>

        </Row>
      </div>
    </Container>

  );
}

export default Home;