import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { tasksLoaded } from "../data/statusSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import initGameInstance from "../js/g1024";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import CurrencyDisplay from "../components/Currency";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import One from "../images/1.png";
import Two from "../images/2.png";
import Three from "../images/3.png";
import Four from "../images/4.png";
import Title from "../images/2048_title.png";

export function Main() {
  const dispatch = useAppDispatch();
  const [board, setBoard] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [focus, setFocus] = useState(-1);
  const [currency, setCurrency] = useState(20);
  const [commands, setCommands] = useState<Array<number>>([]);
  const [highscore, setHighscore] = useState(20);
  const [submitURI, setSubmitURI] = useState("");

  const [showInputsAsRaw, setShowInputsAsRaw] = useState(false);
  let ready = useAppSelector(tasksLoaded);

  function appendCommand(cmds: Array<number>) {
    setCommands((commands) => {
      return [...commands.concat(cmds)];
    });
  }

  function arrowFunction(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === "ArrowUp" || event.key === "w") {
      step(0);
    } else if (event.key == "ArrowLeft" || event.key === "a") {
      step(1);
    } else if (event.key == "ArrowDown" || event.key === "s") {
      step(2);
    } else if (event.key == "ArrowRight" || event.key === "d") {
      step(3);
    }
  }

  useEffect(() => {
    initGameInstance().then((ins: any) => {
      for (var i = 0; i < 16; i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      //ins.setCurrency(40);
      setCurrency(ins.getCurrency());
    });
    document.addEventListener("keydown", arrowFunction, false);
    return () => {
      document.removeEventListener("keydown", arrowFunction, false);
    };
  }, []);

  useEffect(() => {
    //Set highscore
    if (currency > highscore) setHighscore(currency);
  }, [currency]);

  function getWitness() {
    let wit = `0x`;
    for (var c of commands) {
      wit = wit + "0" + c.toString(16);
    }
    wit = wit + ":bytes-packed";
    return wit;
  }

  function getURI() {
    let uri = `${commands.length}:i64-0x`;
    for (var c of commands) {
      uri = uri + "0" + c.toString(16);
    }
    uri = uri + ":bytes-packed";
    return uri;
  }

  function displayCommandIcons() {
    let icons = [];
    for (var i = 0; i < commands.length; i++) {
      let icon = <></>;
      //Check prev is sell, display as number not arrow
      if (i > 0) {
        if (commands[i - 1] === 4 && commands[i - 3] === 4) {
          //Display cell that has been sold
          if (commands[i - 1] === 4 || commands[i - 2] != 4) {
            icon = <span>{commands[i]}</span>;
            icons.push(icon);
            continue;
          }
        } else if (commands[i - 1] === 4 && commands[i - 2] === 4) {
          //continue to next to display cell as action (arrow or sell)
        } else if (commands[i - 1] === 4) {
          //Display the cell that has been sold
          icon = <span>{commands[i]}</span>;
          icons.push(icon);
          continue;
        }
      }

      switch (commands[i]) {
        case 0:
          icon = <i className="bi bi-arrow-up mx-1"></i>;
          break;
        case 1:
          icon = <i className="bi bi-arrow-left mx-1"></i>;
          break;
        case 2:
          icon = <i className="bi bi-arrow-down mx-1"></i>;
          break;
        case 3:
          icon = <i className="bi bi-arrow-right mx-1"></i>;
          break;
        case 4:
          icon = <i className="bi bi-cash-stack mx-1"></i>;
          break;

        default:
          icon = <span>{commands[i]}</span>;
      }
      icons.push(icon);
    }
    return icons;
  }

  async function step(k: number) {
    let ins = await initGameInstance();
    if (ins.getCurrency() == 0) {
      alert("not enough currency to proceed!");
      return;
    }
    setFocus(-1);
    ins.step(k);
    for (var i = 0; i < 16; i++) {
      board[i] = ins.getBoard(i);
    }
    setBoard([...board]);
    setCurrency(ins.getCurrency());
    appendCommand([k]);
  }

  async function toggleSelect(focus: number) {
    setFocus(focus);
  }

  async function sell() {
    let ins = await initGameInstance();
    if (focus != -1) {
      let focusValue = ins.getBoard(focus);
      for (var i = 0; i < 16; i++) {
        let compare = ins.getBoard(i);
        if (compare > focusValue) {
          alert("can only sell highest value block");
          return;
        }
      }
      ins.sell(focus);
      for (var i = 0; i < 16; i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      setCurrency(ins.getCurrency());

      appendCommand([4, focus]);
      setFocus(-1);
    }
  }

  function restartGame() {
    //reload the window for now
    window.location.reload();
  }

  function cellClass(index: number) {
    if (board[index] === 0) {
      return "board-cell";
    } else {
      return `board-cell-${board[index]}`;
    }
  }

  return (
    <>
      <MainNavBar currency={currency} handleRestart={restartGame}></MainNavBar>
      <Container className="justify-content-center mb-4">
        <Row className="justify-content-md-center m-auto mt-3">
          <Col className="d-flex justify-content-between align-items-center p-0 game-width">
            <img src={Title} height="40px" alt="title" className="me-4" />
            <CurrencyDisplay
              tag="Best"
              value={highscore}
              className="high-score mx-2"
            ></CurrencyDisplay>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="content">
              {[...Array(4)].map((_, r) => {
                return (
                  <div className="board-row" key={r}>
                    {[...Array(4)].map((_, c) => {
                      let index = r * 4 + c;
                      return (
                        <div
                          className={`${cellClass(r * 4 + c)} board-cell-out`}
                          onClick={() => toggleSelect(index)}
                          key={index}
                        >
                          {index === focus && <div></div>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>

        <div className="container-max mx-auto d-flex justify-content-between my-3">
          <button onClick={() => sell()} className="sell-button rounded-pill w-50 p-2">
            Sell
          </button>
          <NewProveTask
            md5="77DA9B5A42FABD295FD67CCDBDF2E348"
            inputs={`${commands.length}:i64`}
            witness={getWitness()}
          ></NewProveTask>
        </div>

        <Row className="justify-content-center overflow-breakword my-4">
          <Col lg={6} xs={12} className="game-inputs border-box rounded-4">
            <Row className="py-2 border-content rounded-4">
              <Col>
                <div>
                  <i
                    className="bi bi-eye me-2 cursor-pointer"
                    onClick={() => setShowInputsAsRaw(!showInputsAsRaw)}
                  ></i>
                  <span>
                    {showInputsAsRaw
                      ? "Show Commands"
                      : "Show Raw Proof Inputs"}
                  </span>
                </div>
              </Col>
              <Col className="text-end">
                {showInputsAsRaw ? (
                  <div>{getURI()}</div>
                ) : (
                  <div>
                    {commands.length == 0 && "No inputs made yet!"}
                    {displayCommandIcons().map((icon) => {
                      return icon;
                    })}
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="rounded-4 border-box container-max mx-auto text-center">
          <div className="border-content py-3">
            <h2>HOW TO PLAY?</h2>
            <p className="px-4" style={{ fontSize: "18px" }}>
              Use your arrow keys to move the tiles. Each time you move, one
              currency unit is deducted. When two tiles with the same icon
              touch, they merge into one tile with same icon they summed to one!
              When you make the highest tile, you can sell the highest tile for
              currency.
            </p>
            <div className="d-flex align-items-center justify-content-center my-3">
              {[One, Two, Three, Four].map((src, index) => (
                <>
                  <img src={src} alt="#" className="game-icon" />
                  {index !== 3 && (
                    <>
                      <span className="mx-2">+</span>
                      <img src={src} alt="#" className="game-icon" />
                      <span className="mx-2">=</span>
                    </>
                  )}
                </>
              ))}
              <span className="ms-2">...</span>
            </div>
          </div>
        </div>
      </Container>
      <History md5="77DA9B5A42FABD295FD67CCDBDF2E348"></History>
    </>
  );
}
