import "./App.css";
import Web3 from "web3";
import TokenContract from "./TokenContract";
import { useEffect, useState } from "react";

function App() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const transferTokens = async (recipient, amount) => {
        const networkId = await web3.eth.net.getId();
        const networkData = TokenContract.networks[parseInt(networkId)];

        if (networkData) {
            const token = new web3.eth.Contract(TokenContract.abi, networkData.address);
            await token.methods.transfer(recipient, web3.utils.toWei(amount, "ether")).send({ from: account });
            let balance = await token.methods.balanceOf(account).call();
            setAmount("");
            setBalance(balance.toString());
        } else {
            console.log("Token transfer error");
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (recipient && amount) {
            transferTokens(recipient, amount);
        } else {
            alert("Recipient and amount must not be empty");
        }
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

            const netWorkId = await web3.eth.net.getId();
            const networkData = TokenContract.networks[parseInt(netWorkId)];

            if (networkData) {
                const token = new web3.eth.Contract(TokenContract.abi, networkData.address);
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
                        <label className="App-label" htmlFor="recipient">
                            Address:
                        </label>
                        <input
                            id="recipient"
                            className="App-input"
                            type="text"
                            value={recipient}
                            onChange={(e) => {
                                setRecipient(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label className="App-label" htmlFor="amount">
                            Amount:
                        </label>
                        <input
                            id="amount"
                            className="App-input"
                            type="text"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                        />
                    </div>
                    <button className="App-submit" type="submit">
                        Send form
                    </button>
                </form>
            </header>
        </div>
    );
}

export default App;
