import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { FaLanguage } from 'react-icons/fa';
import logo from '../../resources/commonImages/OSA-mini-logo.jpg';
import './Common.scss';

const Header = () => {
  const handleLanguageSwitch = () => {
    window.location.href = 'https://ua.osatechno.com/';
  };
  
  return (
    <header className="header">
      <Container>
        {/* Left part of navigation */}
        <Navbar expand="md" variant="light">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" aria-label="Toggle navigation" />
            <Navbar.Brand>
              <Link to="/" className="logo-link">
                <img src={logo} alt="OSA-mini-logo" className="logo d-inline-block" />{' '}
                <span className="brand-name">OSAtechno</span>
              </Link>
            </Navbar.Brand>
          </Container>
          {/* Right part of navigation */}
          <Container>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Container>
                <nav>
                  <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/residential" className="nav-link" activeclassname="active">
                      Residential Gates
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/industrial" className="nav-link" activeclassname="active">
                      Industrial Gates
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/garageroller" className="nav-link" activeclassname="active">
                      Garage Rollers
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/windowroller" className="nav-link" activeclassname="active">
                      Window Rollers
                    </Nav.Link>
                  </Nav>
                </nav>
              </Container>
            </Navbar.Collapse>
          </Container>  
          {/* Language switch button */}
          <Button variant="light" className="language-switch-button ml-auto"
            onClick={handleLanguageSwitch}>
              <FaLanguage />
              <span className="language-text">'UA'</span>
          </Button>      
        </Navbar>
      </Container>
    </header>
  );
};
export default Header;
