// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MailPayment {
    address public owner;
    uint256 public pricePerEmail;
    uint256 public totalEmailsPaid;

    event EmailPaid(address indexed payer, uint256 amount, string recipientEmail);

    constructor(uint256 _pricePerEmail) {
        owner = msg.sender;
        pricePerEmail = _pricePerEmail;
    }

    function payForEmail(string calldata recipientEmail) external payable {
        require(msg.value >= pricePerEmail, "Insufficient payment");
        totalEmailsPaid++;
        emit EmailPaid(msg.sender, msg.value, recipientEmail);
    }

    function setPrice(uint256 newPrice) external {
        require(msg.sender == owner, "Not owner");
        pricePerEmail = newPrice;
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}