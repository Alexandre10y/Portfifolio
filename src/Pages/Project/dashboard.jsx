import { Container, Row, Col } from 'react-bootstrap';
import './style.css'
function Dashboard() {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <iframe
                            title="AnaliseDeVendas-V1.0"
                            className='w-100'
                            style={{ height: '100vh' }} // altura de 100% da viewport
                            src="https://app.powerbi.com/view?r=eyJrIjoiNDVjMTIxMDctNWI5OS00NWZlLTgxYzctZTM0N2ZmMmViYjZhIiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </Col>
                    <Col md={6}>
                        <iframe title="FacebookCampanha" 
                        className='w-100'
                        style={{ height: '100vh' }}
                        src="https://app.powerbi.com/view?r=eyJrIjoiZmFkYWRiZmEtOTIxMi00YmE0LWI1ZjItODRhYjZhODAyNDFkIiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9" 
                        frameBorder="0"
                        allowFullScreen/>
                    </Col>
                </Row>
            </Container>

        </>
    );
}
export default Dashboard;