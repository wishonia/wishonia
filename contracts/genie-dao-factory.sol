// Contract for the Genie DAOs
// Each Genie DAO must have a gnosis-safe multisig requiring at least 5 out of 9 signers to allocate
// Wishes to members of the Genie DAO in proportion to their contribution to the realization of the Wish.
// Integration with the Gnosis Safe contracts that sets up a Gnosis Safe multisig Treasury:

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";
import "@gnosis.pm/safe-contracts/contracts/libraries/CreateCall.sol";

contract GenieDAOFactory {
    IERC20 public WishesToken;
    GnosisSafeProxyFactory public gnosisSafeProxyFactory;
    address public immutable gnosisSafeMasterCopy;

    constructor(
        IERC20 _WishesToken,
        address _gnosisSafeProxyFactory,
        address _gnosisSafeMasterCopy
    ) {
        WishesToken = _WishesToken;
        gnosisSafeProxyFactory = GnosisSafeProxyFactory(_gnosisSafeProxyFactory);
        gnosisSafeMasterCopy = _gnosisSafeMasterCopy;
    }

    function createGenieDAO(address[] memory owners, uint256 threshold) public returns (address) {
        require(owners.length >= threshold, "Threshold cannot be greater than the number of owners");

        // Deploy the Gnosis Safe multisig Treasury
        bytes memory proxySetupData = abi.encodeWithSelector(
            GnosisSafe.setup.selector,
            owners,
            threshold,
            address(0), // No fallback handler
            bytes32(0), // No fallback data
            address(0), // No payment token
            0, // No payment amount
            address(0) // No payment receiver
        );
        address treasury = address(
            gnosisSafeProxyFactory.createProxyWithNonce(gnosisSafeMasterCopy, proxySetupData, 0)
        );

        // Create and return the GenieDAO
        GenieDAO genieDAO = new GenieDAO(WishesToken, treasury);
        return address(genieDAO);
    }
}

contract GenieDAO {
    IERC20 public WishesToken;
    address public treasury;

    mapping(address => uint256) public contributions;

    constructor(IERC20 _WishesToken, address _treasury) {
        WishesToken = _WishesToken;
        treasury = _treasury;
    }

    function contribute(uint256 amount) public {
        WishesToken.transferFrom(msg.sender, treasury, amount);
        contributions[msg.sender] += amount;
    }

    // Additional DAO functionality for proposals, voting, and $WISH realization.
}
