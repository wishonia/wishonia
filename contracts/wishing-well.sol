// Contract for the Wishing Well
// This contract allows users to submit their Wishes and keeps track of the total $WISH tokens for
// each unique Wish.
// It also includes a voting mechanism for Genie DAO proposals.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WishingWell is Ownable {
    struct $WISH {
        string description;
        uint256 totalWishes;
        address[] genieDAOProposals;
        mapping(address => uint256) votes;
    }

    IERC20 public WishesToken;
    mapping(string => Wishes) public Wishes;

    constructor(IERC20 _WishesToken) {
        WishesToken = _WishesToken;
    }

    function submitWishes(string memory description) public {
        require(bytes(description).length > 0, "Wishes description cannot be empty");

        if (Wishes[description].totalWishes == 0) {
            Wishes[description] = Wishes({
                description: description,
                totalWishes: 0,
                genieDAOProposals: new address[](0)
            });
        }

        WishesToken.transferFrom(msg.sender, address(this), 1 * 10**18); // Assumes 1 $WISH = 10^18 units
        Wishes[description].totalWishes++;
    }

    function addGenieDAOProposal(string memory description, address genieDAO) public onlyOwner {
        require(Wishes[description].totalWishes > 0, "Wishes not found");
        Wishes[description].genieDAOProposals.push(genieDAO);
    }

    function voteForGenieDAO(string memory description, address genieDAO) public {
        require(WishesToken.balanceOf(msg.sender) > 0, "Must hold $WISH tokens");
        WishToken.transferFrom(msg.sender, address(this), 1 * 10**18); // Assumes 1 $WISH = 10^18 units

        bool genieDAOExists = false;
        for (uint256 i = 0; i < Wishes[description].genieDAOProposals.length; i++) {
            if (Wishes[description].genieDAOProposals[i] == genieDAO) {
                genieDAOExists = true;
                break;
            }
        }

        require(genieDAOExists, "Genie DAO proposal not found");
        Wishes[description].votes[genieDAO]++;
    }

    function releaseWishes(string memory description, address genieDAO) public onlyOwner {
        require(Wishes[description].votes[genieDAO] * 2 > Wishes[description].totalWishes, "Not enough votes for Genie DAO");

        uint256 amount = Wishes[description].totalWishes * 10**18;
        WishesToken.transfer(genieDAO, amount);
        Wishes[description].totalWishes = 0;
    }
}
