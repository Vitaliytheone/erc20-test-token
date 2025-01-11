import "./App.css";
import Web3 from "web3";
import VTokenContract from "./vTokenContract";
import { useEffect, useState } from "react";

function App() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const transferTokens = (recipient, amount) => null;

    const onSubmit = (e) => {
        e.preventDefault();
        transferTokens(recipient, amount);
    };

    useEffect(() => {
        async function loadWeb3() {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                setWeb3(web3);
            } else if (window.web3) {
                setWeb3(new Web3(window.web3.currentProvider));
            } else {
                console.log("web3 doesn't enable!");
            }
        }

        async function loadBlockchainData() {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            const networkData = VTokenContract.networks[31337];

            if (networkData) {
                const token = new web3.eth.Contract(VTokenContract.abi, networkData.address);
                let balance = await token.methods.balanceOf(accounts[0]).call();
                setBalance(balance.toString());
            } else {
                console.log("contract not deployed");
            }
        }

        if (web3) {
            loadBlockchainData();
        } else {
            loadWeb3();
        }
    }, [web3]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>My Web3 App</h1>
                <p>Your Account: {account}</p>
                <p>Your Balance: {balance}</p>
                <h1>Transfer tokens</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="recipient">Address:</label>
                        <input
                            id="recipient"
                            type="text"
                            onChange={(e) => {
                                setRecipient(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <input
                            id="amount"
                            type="text"
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                        />
                    </div>
                    <button type="submit">Send form</button>
                </form>
            </header>
        </div>
    );
}

export default App;
