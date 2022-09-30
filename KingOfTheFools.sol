// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
contract KingOfTheFools is  Ownable {
    
    address[] public follAddress;
    uint256[] public foolAmounts;
    
   
    function enter() public payable{
        if(follAddress.length > 0){
            require(msg.value >= foolAmounts[follAddress.length-1] * 3 / 2, "Enter amounts must be bigger than lastAmounts * 1.5.");
            require(msg.sender != follAddress[follAddress.length-1], "Last sender can not enter.");
            (bool success, ) = follAddress[follAddress.length-1].call{value: msg.value}("");
            require(success, "Transfer failed.");  
        }
        
        follAddress.push(msg.sender);
        foolAmounts.push(msg.value);
         
    }

    function withdrawFirstAmounts() public onlyOwner { 
        uint256 balance = address(this).balance;
        require(balance >= foolAmounts[0], "WithDraw amounts must be smaller than this.balance");
       (bool success, ) = _msgSender().call{value: foolAmounts[0]}("");
        require(success, "Transfer failed.");    
    }
    
    function lastFoolInfo() public view returns (address, uint256){
        return (follAddress[follAddress.length-1], foolAmounts[foolAmounts.length-1]);
    }

    function getFollList() public view returns (address[] memory, uint256[] memory){
        
        return (follAddress, foolAmounts);
    }
}
