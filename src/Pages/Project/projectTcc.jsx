import { Container, Row, Col } from 'react-bootstrap';
import './style.css'
function Dashboard() {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col>

                    <iframe title="AnaliseCriticaChampionsLeague" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiODQxZWRiNTgtNTI0OS00MzZjLTgyYzItM2JhYTQ2ZjdkODM2IiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9" frameborder="0" allowFullScreen="true"></iframe>
                    </Col>
                </Row>
            </Container>

        </>
    );
}
export default Dashboard;