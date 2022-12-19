import * as React from "react";
import logo from "../logo.svg";

const TestComp = () => {
    // const [test, setTest] = React.useState("hello world");

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} class="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default TestComp;
