// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title Quest Contract (Fixed Version)
 * @dev FIXED: joinQuest and addSubmission now use msg.sender instead of address parameters
 * @dev This should resolve the "Internal JSON-RPC error" issue
 */
contract Quest {
    
    struct User {
        address walletAddress;
        string username;
        string submission;
        bool isParticipant;
    }
    
    uint256 public participantCount;
    uint256 public maxParticipants;
    address public owner;
    
    mapping(address => User) public users;
    mapping(string => address) public usernameToWallet;
    
    event QuestJoined(address indexed participant, string username, uint256 totalParticipants);
    event MaxParticipantsSet(uint256 newMaxParticipants);
    event PrizeDistributed(address indexed recipient, uint256 amount);
    event SubmissionAdded(string indexed username, address indexed walletAddress, string proofUrl);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // FIXED: Now uses msg.sender instead of _walletAddress parameter
    function joinQuest(uint256 _maxParticipants, string memory _username) external {
        maxParticipants = _maxParticipants;
        require(participantCount < maxParticipants, "Quest participant limit reached, cannot join");
        require(!users[msg.sender].isParticipant, "Address already joined quest");
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(usernameToWallet[_username] == address(0), "Username already taken");
        
        participantCount++;
        
        users[msg.sender] = User({
            walletAddress: msg.sender,
            username: _username,
            submission: "",
            isParticipant: true
        });
        
        usernameToWallet[_username] = msg.sender;
        
        emit QuestJoined(msg.sender, _username, participantCount);
        emit MaxParticipantsSet(_maxParticipants);
    }
    
    function distributeQuestPrizes(address _walletAddress, uint256 _prizeAmount, bool _shouldDistribute) external onlyOwner {
        require(_shouldDistribute == true, "Prize distribution not authorized");
        require(address(this).balance >= _prizeAmount, "Insufficient ETH in contract");
        require(_walletAddress != address(0), "Invalid wallet address");
        require(_prizeAmount > 0, "Prize amount must be greater than 0");
        require(users[_walletAddress].isParticipant, "Address has not joined quest");
        
        (bool success, ) = _walletAddress.call{value: _prizeAmount}("");
        require(success, "ETH transfer failed");
        
        emit PrizeDistributed(_walletAddress, _prizeAmount);
    }
    
    // FIXED: Now uses msg.sender instead of _walletAddress parameter
    function addSubmission(string memory _proofUrl) external {
        require(users[msg.sender].isParticipant, "Address has not joined quest");
        require(bytes(_proofUrl).length > 0, "Proof URL cannot be empty");
        
        users[msg.sender].submission = _proofUrl;
        
        emit SubmissionAdded(users[msg.sender].username, msg.sender, _proofUrl);
    }
    
    function isParticipant(address _address) public view returns (bool) {
        return users[_address].isParticipant;
    }
    
    function getSubmission(address _walletAddress) external view returns (string memory) {
        return users[_walletAddress].submission;
    }
    
    function getUsername(address _walletAddress) external view returns (string memory) {
        return users[_walletAddress].username;
    }
    
    function getWalletAddress(string memory _username) external view returns (address) {
        return usernameToWallet[_username];
    }
    
    function getUserInfo(address _walletAddress) external view returns (User memory) {
        return users[_walletAddress];
    }
    
    function getTotalParticipants() external view returns (uint256) {
        return participantCount;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    receive() external payable {}
}