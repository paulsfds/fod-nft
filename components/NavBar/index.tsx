import { Nav, Navbar, Container } from 'react-bootstrap';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
    return (
        <>
            <Navbar
                bg="primary"
                variant="dark"
            >
                <Container>
                    <Navbar.Brand href="#home">Aimazing Art</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">
                            <ConnectButton />
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}
export default NavBar;