// Universal Basic Income of 1 $WISH per day
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WishesToken is ERC20, ERC20Snapshot, Ownable {
    uint256 private constant DAILY_WISHes = 1 * 10**18; // 1 $WISH
    uint256 private lastSnapshot;

    constructor() ERC20("Wishes Token", "$WISH") {
        lastSnapshot = block.timestamp;
    }

    function dailyWish() external {
        require(balanceOf(_msgSender()) > 0, "Must hold $WISH tokens");
        uint256 last$WISH = getLastWishOf(_msgSender());
        require(block.timestamp - last$WISH >= 1 days, "Already received daily $WISH");

        _mint(_msgSender(), DAILY_WISHes);
        _snapshot();
    }

    function getLastWishOf(address account) public view returns (uint256) {
        uint256 lastSnapshotId = _getCurrentSnapshotId();
        uint256 lastWish;

        for (uint256 i = lastSnapshotId; i > 0; i--) {
            uint256 balance = balanceOfAt(account, i);
            if (balance > 0) {
                last$WISH = snapshotAt(i);
                break;
            }
        }

        return lastWish;
    }

    function snapshotAt(uint256 snapshotId) public view returns (uint256) {
        (, uint256 blockNumber) = _snapshotAt(snapshotId);
        return blockNumber;
    }

    function transferWishesToGenieDAO(address genieDAO, uint256 amount) external onlyOwner {
        require(balanceOf(address(this)) >= amount, "Insufficient $WISH in the Wishing Well");
        _transfer(address(this), genieDAO, amount);
    }
}

