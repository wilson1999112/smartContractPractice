// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

interface MiniDAOInterface {
    struct Proposal {
        string description;
        uint value;
        address payable recipient;
        address payable creator;
        bool complete;
        uint votingDeadline;
        uint deposit;
        mapping(address => bool) approvals;
    }
    function contribute() payable external;
    function transferOwnerPower(address receiver, uint8 portion) external;
    function createProposal(
        string memory _description,
        uint _value,
        address payable _recipient,
        uint64 _debatingPeriod
    ) external payable returns (uint _proposalID) ;
    function voteProposal(uint index) external;
    function unvoteProposal(uint index) external;
    function getApproveRate(uint _proposalID) external view returns(uint proposalApproveRate);
    function finalizeProposal(uint index) external returns(uint approvePower, uint approveCount);
    function getProposalDeposit(uint _proposalID) external;
    event ProposalCreated(
        uint indexed proposalID,
        address recipient,
        uint value,
        string description
    );
    event Voted(uint indexed proposalID, address indexed voter);
    event UnVoted(uint indexed proposalID, address indexed voter);
}


contract MiniDAO is MiniDAOInterface{
    Proposal[] public proposals;
    address public manager;
    address[] public ownerList;
    mapping(address => bool) public owners;
    mapping(address => uint) public ownerPower;
    uint public proposalsCount;
    uint public ownerCount;
    uint public approveRate;
    uint public totalPower;
    uint public proposalDeposit;
    uint public sumOfProposalDeposits;
    
    constructor() {
        ownerCount = 0;
        approveRate = 50;
        proposalDeposit = 0.01 ether;
        sumOfProposalDeposits = 0;
        proposalsCount = 0;
    }
    function contribute() payable public {
        _signupOwner(msg.sender);
        ownerPower[msg.sender] += msg.value;
        totalPower += msg.value;
    }
    function transferOwnerPower(address receiver, uint8 portion) public onlyOwner {
        _signupOwner(receiver);
        uint powerTransfer = ownerPower[msg.sender] * portion / 100;
        ownerPower[receiver] += powerTransfer;
        ownerPower[msg.sender] -= powerTransfer;
    }
    function _signupOwner(address candidate) private {
        if (!owners[candidate]){
            ownerList.push(candidate);
            ownerCount++;
            owners[candidate] = true;
        }
    }
    function createProposal(
        string memory _description,
        uint _value,
        address payable _recipient,
        uint64 _debatingPeriod) public payable onlyOwner returns (uint _proposalID) {
        require(_debatingPeriod > 4 weeks && _debatingPeriod < 8 weeks);
        require(msg.value >= proposalDeposit);
        _proposalID = proposals.length;
        Proposal storage newProposal = proposals.push();
        newProposal.votingDeadline = block.timestamp + _debatingPeriod;
        newProposal.description = _description;
        newProposal.value = _value;
        newProposal.deposit = msg.value;
        newProposal.recipient = _recipient;
        newProposal.complete = false;
        newProposal.creator = payable(msg.sender);
        sumOfProposalDeposits += msg.value;
        proposalsCount = _proposalID + 1;
        emit ProposalCreated(
            _proposalID,
            _recipient,
            _value,
            _description
        );

    }
    function voteProposal(uint _proposalID) public onlyOwner {
        Proposal storage proposal = proposals[_proposalID];
        require(!proposal.approvals[msg.sender]);
        require(!proposal.complete);
        require(block.timestamp < proposal.votingDeadline);
        proposal.approvals[msg.sender] = true;
        emit Voted(_proposalID, msg.sender);
    }
    function unvoteProposal(uint _proposalID) public onlyOwner {
        Proposal storage proposal = proposals[_proposalID];
        require(proposal.approvals[msg.sender]);
        require(!proposal.complete);
        require(block.timestamp < proposal.votingDeadline);
        proposal.approvals[msg.sender] = false;
        emit UnVoted(_proposalID, msg.sender);
    }
    function finalizeProposal(uint _proposalID) public onlyOwner returns(uint approvePower, uint approveCount){
        Proposal storage proposal = proposals[_proposalID];
        require(!proposal.complete);
        for (uint i=0; i < ownerCount; i++) {
            if(proposal.approvals[ownerList[i]]){
                approveCount ++;
                approvePower += ownerPower[ownerList[i]];
            }
        }
        require(approveCount >= (ownerCount * approveRate / 100));
        require(approvePower >= (totalPower * approveRate / 100));
        uint originBalance = actualBalance();
        proposal.recipient.transfer(proposal.value);
        totalPower = 0;
        for (uint i=0; i < ownerCount; i++) {
            ownerPower[ownerList[i]] = (ownerPower[ownerList[i]] * actualBalance() / originBalance);
            totalPower += ownerPower[ownerList[i]];
        }
        proposal.complete = true;
    }

    function getProposalDeposit(uint _proposalID) public {
        Proposal storage proposal = proposals[_proposalID];
        require(msg.sender == proposal.creator);
        require(proposal.deposit > 0);
        require(proposal.complete || block.timestamp > proposal.votingDeadline);
        proposal.creator.transfer(proposal.deposit);
        sumOfProposalDeposits -= proposal.deposit;
        proposal.deposit = 0;
    }

    function getApproveRate(uint _proposalID) public view returns (uint) {
        Proposal storage proposal = proposals[_proposalID];
        uint approvePower = 0;
        for (uint i=0; i < ownerCount; i++) {
            if(proposal.approvals[ownerList[i]]){
                approvePower += ownerPower[ownerList[i]];
            }
        }
        return 100 * approvePower / totalPower;
    }

    function actualBalance() private view returns (uint) {
        return address(this).balance - sumOfProposalDeposits;
    }
    
    modifier onlyOwner() {
        require(owners[msg.sender]);
        _;
    }
}