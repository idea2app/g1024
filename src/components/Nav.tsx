import "./style.scss";

import { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { loginL1AccountAsync, selectL1Account } from "../data/accountSlice";
import { addressAbbreviation } from "../utils/address";
import logo from "../images/logo.svg";

interface IProps {
  currency: number;
  handleRestart: () => void;
}

export function MainNavBar(props: IProps) {
  const dispatch = useAppDispatch();

  let account = useAppSelector(selectL1Account);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

  return (
    <Navbar expand="lg" style={{ zIndex: "1000" }}>
      <Container className="justify-content-md-between">
        <Navbar.Brand href="http://www.delphinuslab.com">
          <img src={logo} height="30" alt="logo"></img>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <button className="appearance-none rounded-pill fs-5 fw-semibold score-button me-4 px-4 d-flex justify-content-between align-items-center common-button">
              <span>Best Score</span>
              <span className="gradient-content">6889</span>
            </button>
            {account && (
              <>
                <Navbar.Text>
                  <div>Account</div>
                  <div>{addressAbbreviation(account.address, 4)}</div>
                </Navbar.Text>
              </>
            )}
            {!account && (
              <>
                <button
                  onClick={() => dispatch(loginL1AccountAsync())}
                  className="appearance-none rounded-pill border-0 fs-5 fw-semibold ms-4 ms-xl-0 text-black connect"
                >
                  Connect Wallet
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
