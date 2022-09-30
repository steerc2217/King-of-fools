import React from 'react';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./ABI.json";
const Web3 = require("web3");
const Test = () => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [enteredWalletAddress, setEnteredWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [amounts, setAmounts] = useState("");
  const [enteredAmounts, setEnteredAmounts] = useState(0);
  const [enteredAmountsComp, setEnteredAmountsComp] = useState(0);
//   useEffect(() => {
//     init();
  
// }, []);
//   const init = async () => {
//     let sportPrice = await Contract.lastFoolInfo();
    
//   }
  const connectWalletPressed = async () => {
    let chainId = 4; 
    if (window.ethereum) {
      if(walletAddress){
        setWallet("");
      }
      else{
        var web3Window = new Web3(window.ethereum);  
        
        
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{
              eth_accounts: {}
          }]
        });
        
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: "0x"+chainId.toString(16) }],
        }); 
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        setWallet(addressArray[0]); 
        web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
          let balETH = web3Window.utils.fromWei(balanceOf, 'ether');        
          setBalance(String(balETH).substring(0, 6));
        });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = provider.getSigner();
        var ContractInterface = new ethers.Contract(
          "0x428DF45323574E562AB4180F0e89Bff7BE187C46",
          ABI,
          signer
        );
        let buffer = await ContractInterface.lastFoolInfo();
        console.log("BUF->",buffer);
        if(buffer != null){

          if(buffer[0].toLowerCase() == addressArray[0].toLowerCase()){
            setEnteredAmounts(buffer[1] / 10 ** 18);
          }
          setEnteredAmountsComp(buffer[1] / 10 ** 18);
          setEnteredWalletAddress(buffer[0].toLowerCase());     
        }
        
      }
      
    } 
    
  };
  const onEnter = async () => {
    if (walletAddress == "") {
      alert("You are not connected.");
      return;
    }
    setAmounts("");
    if(parseFloat(enteredAmountsComp) * 1.5 > parseFloat(amounts) || amounts == ""){
      alert("Enter Amounts must be bigger than " + parseFloat(enteredAmountsComp) * 1.5);
      return;
    } 
    if(enteredWalletAddress == walletAddress.toLowerCase()){
      alert("Enter Address must be differrent with last entered Address. You are a last enter fool.");
      return;
    }
    if (window.ethereum) {
      if (walletAddress != "") {
        if (parseFloat(amounts) > 0) {
          const chainIDBuffer = await window.ethereum.networkVersion;
            if (chainIDBuffer == 4) {
              
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              var ContractInterface = new ethers.Contract(
                "0x428DF45323574E562AB4180F0e89Bff7BE187C46",
                ABI,
                signer
              );
              let nftTxn = await ContractInterface.enter({
                value: ethers.utils.parseUnits(amounts.toString(), "ether")
                  ._hex,
              });
              await nftTxn.wait();
              let buffer = await ContractInterface.lastFoolInfo();
              if(buffer[0].toLowerCase() == walletAddress.toLowerCase()){
                setEnteredAmounts(buffer[1] / 10 ** 18);
              }
              setEnteredAmountsComp(buffer[1] / 10 ** 18);
              setEnteredWalletAddress(buffer[0].toLowerCase());     
            }
        }
      }
    }
    
  };
  return (
    <div className="Navbar" style={{display: 'inline-block'}}>    
    
      <button id="walletButton" onClick={connectWalletPressed} style = {{position: 'relative', top : "20px", color : "blue"}}>
        {walletAddress ? (
          <span>DisConnect</span>) : (
          <span>Connect Wallet</span>
        )}
      </button>  
      <form>
        <p style = {{position: 'relative', left : "20px", top : "40px", color : "red"}}>
         MetaMask ADDRESS : {walletAddress? (String(walletAddress).substring(0, 5) +
            "..." +
            String(walletAddress).substring(39)) :("")}
        </p>
        
        <p style = {{position: 'relative', left : "20px", top : "40px", color : "black"}}>
          MetaMask Balance : {walletAddress? (balance) :("")}
        </p>
        <p style = {{position: 'relative', left : "20px", top : "40px", color : "black"}}>
          Your Entered Amounts : {walletAddress? (enteredAmounts) :("")}
        </p>
        <p style = {{position: 'relative', left : "20px", top : "40px", color : "black"}}>
          Last Entered Amounts Of Fool Contract : {walletAddress? (enteredAmountsComp) :("")}
        </p>
      </form>
      
      <form style = {{position: 'relative', left : "20px", top : "40px", color : "black"}}>
        <h2> Send Amounts: </h2>
        <input
          type="text"
          value={amounts}
          placeholder="e.g. 0.1"
          onChange={(event) => setAmounts(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onEnter} style = {{position: 'relative', left : "30px", top : "40px", color : "black"}}>
        Transfer
      </button>
    </div>
  );
};


export default Test;

