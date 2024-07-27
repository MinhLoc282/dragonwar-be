pragma solidity ^0.4.23;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

    /**
     * @dev Multiplies two numbers, throws on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
     * @dev Integer division of two numbers, truncating the quotient.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

    /**
     * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
     * @dev Adds two numbers, throws on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}

/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
interface ERC721 {
    // Required methods
    function totalSupply() external view returns (uint256 total);

    function balanceOf(address _owner) external view returns (uint256 balance);

    function ownerOf(uint256 _tokenId) external view returns (address owner);

    function approve(address _to, uint256 _tokenId) external;

    function transfer(address _to, uint256 _tokenId) external;

    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
    // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}

/// @title SEKRETOOOO
contract GeneScienceInterface {
    /// @dev simply a boolean to indicate this is the contract we expect to be
    function isGeneScience() public pure returns (bool);

    /// @dev given genes of dragon 1 & 2, return a genetic combination - may have a random factor
    /// @param genes1 genes of mom
    /// @param genes2 genes of dad
    /// @return the genes that are supposed to be passed down the child
    function mixGenes(uint256 genes1, uint256 genes2, uint256 targetBlock) public returns (uint256);

    // calculate the cooldown of child dragon
    function processCooldown(uint16 childGen, uint256 targetBlock) public returns (uint16);

    // calculate the result for upgrading dragon
    function upgradedragonResult(uint8 unicornation, uint256 targetBlock) public returns (bool);
}



/// @title Interface for contracts conforming to ERC-20
interface ERC20 {
    //core ERC20 functions
    function transfer(address _to, uint _value) external returns (bool success);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    function transferFrom(address from, address to, uint256 value) external returns (bool success);
}

/**
 * @title Signature verifier
 * @dev To verify C level actions
 */
contract SignatureVerifier {

    function splitSignature(bytes sig)
    internal
    pure
    returns (uint8, bytes32, bytes32)
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
        // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
        // second 32 bytes
            s := mload(add(sig, 64))
        // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }

    // Returns the address that signed a given string message
    function verifyString(
        string message,
        uint8 v,
        bytes32 r,
        bytes32 s)
    internal pure
    returns (address signer) {

        // The message header; we will fill in the length next
        string memory header = "\x19Ethereum Signed Message:\n000000";
        uint256 lengthOffset;
        uint256 length;

        assembly {
        // The first word of a string is its length
            length := mload(message)
        // The beginning of the base-10 message length in the prefix
            lengthOffset := add(header, 57)
        }

        // Maximum length we support
        require(length <= 999999);
        // The length of the message's length in base-10
        uint256 lengthLength = 0;
        // The divisor to get the next left-most message length digit
        uint256 divisor = 100000;
        // Move one digit of the message length to the right at a time

        while (divisor != 0) {
            // The place value at the divisor
            uint256 digit = length / divisor;
            if (digit == 0) {
                // Skip leading zeros
                if (lengthLength == 0) {
                    divisor /= 10;
                    continue;
                }
            }
            // Found a non-zero digit or non-leading zero digit
            lengthLength++;
            // Remove this digit from the message length's current value
            length -= digit * divisor;
            // Shift our base-10 divisor over
            divisor /= 10;

            // Convert the digit to its ASCII representation (man ascii)
            digit += 0x30;
            // Move to the next character and write the digit
            lengthOffset++;
            assembly {
                mstore8(lengthOffset, digit)
            }
        }
        // The null string requires exactly 1 zero (unskip 1 leading 0)
        if (lengthLength == 0) {
            lengthLength = 1 + 0x19 + 1;
        } else {
            lengthLength += 1 + 0x19;
        }
        // Truncate the tailing zeros from the header
        assembly {
            mstore(header, lengthLength)
        }
        // Perform the elliptic curve recover operation
        bytes32 check = keccak256(abi.encodePacked(header, message));
        return ecrecover(check, v, r, s);
    }

    function recover(bytes32 hash, bytes sig) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;
        //Check the signature length
        if (sig.length != 65) {
            return (address(0));
        }
        // Divide the signature in r, s and v variables
        (v, r, s) = splitSignature(sig);
        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }
        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            bytes memory prefix = "\x19Ethereum Signed Message:\n32";
            bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
            return ecrecover(prefixedHash, v, r, s);
        }
    }
}


contract AccessControl is SignatureVerifier {
    using SafeMath for uint256;

    // C level address that can execute special actions.
    address public ownerAddress;
    address public systemAddress;


    /// @dev Access modifier for CEO-only functionality
    modifier onlyCEO() {
        require(msg.sender == ownerAddress);
        _;
    }

    event addressLogger(address signer);

    // @dev return true if transaction already signed by a C Level address
    // @param _message The string to be verify
    function signedBySystem(
        bytes32 _message,
        bytes _sig
    )
    internal
    view
    returns (bool)
    {
        address signer = recover(_message, _sig);
        require(signer != msg.sender);
        return (
        signer == systemAddress
        );
    }
}


/// @title A facet of dragonCore that manages special access privileges.
contract dragonAccessControl is AccessControl {
    /// @dev Emited when contract is upgraded - See README.md for updgrade plan
    event ContractUpgrade(address newContract);


    // @dev Keeps track whether the contract is paused. When that is true, most actions are blocked
    bool public paused = false;


    /// @dev Modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /// @dev Modifier to allow actions only when the contract IS paused
    modifier whenPaused {
        require(paused);
        _;
    }

    /// @dev Called by any "C-level" role to pause the contract. Used only when
    ///  a bug or exploit is detected and we need to limit damage.
    function pause() external onlyCEO whenNotPaused {
        paused = true;
    }

    /// @dev Unpauses the smart contract. Can only be called by the CEO, since
    ///  one reason we may pause the contract is when CFO or COO accounts are
    ///  compromised.
    /// @notice This is public rather than external so it can be called by
    ///  derived contracts.
    function unpause() public onlyCEO whenPaused {
        // can't unpause if contract was upgraded
        paused = false;
    }
}




/// @dev See the dragonCore contract documentation to understand how the various contract facets are arranged.
contract dragonBase is dragonAccessControl {
    /*** EVENTS ***/

    /// @dev The Birth event is fired whenever a new dragon comes into existence. This obviously
    ///  includes any time a dragon is created through the giveBirth method, but it is also called
    ///  when a new gen0 dragon is created.
    event Birth(address owner, uint256 dragonId, uint256 matronId, uint256 sireId, uint256 genes);

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a dragon
    ///  ownership is assigned, including births.
    event Transfer(address from, address to, uint256 tokenId);

    /*** DATA TYPES ***/

    ///  of this structure, so great care was taken to ensure that it fits neatly into
    ///  exactly two 256-bit words. Note that the order of the members in this structure
    ///  is important because of the byte-packing rules used by Ethereum.
    ///  Ref: http://solidity.readthedocs.io/en/develop/miscellaneous.html
    struct dragon {
        // The dragon's genetic code is packed into these 256-bits, the format is
        // sooper-sekret! A cat's genes never change.
        uint256 genes;

        // The timestamp from the block when this cat came into existence.
        uint64 birthTime;

        // The minimum timestamp after which this cat can engage in breeding
        // activities again. This same timestamp is used for the pregnancy
        // timer (for matrons) as well as the siring cooldown.
        uint64 cooldownEndBlock;

        // The ID of the parents of this dragon, set to 0 for gen0 cats.
        // Note that using 32-bit unsigned integers limits us to a "mere"
        // 4 billion cats. This number might seem small until you realize
        // that Ethereum currently has a limit of about 500 million
        // transactions per year! So, this definitely won't be a problem
        // for several years (even as Ethereum learns to scale).
        uint32 matronId;
        uint32 sireId;

        // Set to the ID of the sire cat for matrons that are pregnant,
        // zero otherwise. A non-zero value here is how we know a cat
        // is pregnant. Used to retrieve the genetic material for the new
        // dragon when the birth transpires.
        uint32 matingWithId;

        // Set to the index in the cooldown array (see below) that represents
        // the current cooldown duration for this dragon. This starts at zero
        // for gen0 cats, and is initialized to floor(generation/2) for others.
        // Incremented by one for each successful breeding action, regardless
        // of whether this cat is acting as matron or sire.
        uint16 cooldownIndex;

        // The "generation number" of this cat. Cats minted by the CK contract
        // for sale are called "gen0" and have a generation number of 0. The
        // generation number of all other cats is the larger of the two generation
        // numbers of their parents, plus one.
        // (i.e. max(matron.generation, sire.generation) + 1)
        uint16 generation;

        uint16 txCount;

        uint8 unicornation;


    }

    /*** CONSTANTS ***/

    /// @dev A lookup table indicating the cooldown duration after any successful
    ///  breeding action, called "pregnancy time" for matrons and "siring cooldown"
    ///  for sires. Designed such that the cooldown roughly doubles each time a cat
    ///  is bred, encouraging owners not to just keep breeding the same cat over
    ///  and over again. Caps out at one week (a cat can breed an unbounded number
    ///  of times, and the maximum cooldown is always seven days).
    uint32[13] public cooldowns = [
    uint32(1 minutes),
    uint32(5 minutes),
    uint32(30 minutes),
    uint32(1 hours),
    uint32(2 hours),
    uint32(4 hours),
    uint32(8 hours),
    uint32(1 days),
    uint32(2 days),
    uint32(3 days),
    uint32(4 days),
    uint32(6 days),
    uint32(7 days)
    ];

    uint256[13] public birthCost = [
    uint256(100),
    uint256(200),
    uint256(300),
    uint256(500),
    uint256(800),
    uint256(1300),
    uint256(2100),
    uint256(3400),
    uint256(5500),
    uint256(8900),
    uint256(14400),
    uint256(23300),
    uint256(37700)
    ];

    uint8[5] public incubators = [
    uint8(5),
    uint8(10),
    uint8(15),
    uint8(20),
    uint8(25)
    ];

    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;

    // @dev store nonces
    mapping(address => uint256) nonces;

    /*** STORAGE ***/

    /// @dev An array containing the dragon struct for all dragons in existence. The ID
    ///  of each cat is actually an index into this array. Note that ID 0 is a negacat,
    ///  the undragon, the mythical beast that is the parent of all gen0 cats. A bizarre
    ///  creature that is both matron and sire... to itself! Has an invalid genetic code.
    ///  In other words, cat ID 0 is invalid... ;-)
    dragon[] dragons;

    /// @dev A mapping from cat IDs to the address that owns them. All cats have
    ///  some valid owner address, even gen0 cats are created with a non-zero owner.
    mapping(uint256 => address) public dragonIndexToOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping(address => uint256) ownershipTokenCount;

    /// @dev A mapping from dragonIDs to an address that has been approved to call
    ///  transferFrom(). Each dragon can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping(uint256 => address) public dragonIndexToApproved;

    /// @dev A mapping from dragonIDs to an address that has been approved to use
    ///  this dragon for siring via breedWith(). Each dragon can only have one approved
    ///  address for siring at any time. A zero value means no approval is outstanding.
    mapping(uint256 => address) public matingAllowedToAddress;

    mapping(address => bool) public hasIncubator;

    /// @dev The address of the ClockAuction contract that handles sales of dragons. This
    ///  same contract handles both peer-to-peer sales as well as the gen0 sales which are
    ///  initiated every 15 minutes.
    SaleClockAuction public saleAuction;

    /// @dev The address of a custom ClockAuction subclassed contract that handles siring
    ///  auctions. Needs to be separate from saleAuction because the actions taken on success
    ///  after a sales and siring auction are quite different.
    SiringClockAuction public siringAuction;


    BiddingClockAuction public biddingAuction;
    /// @dev Assigns ownership of a specific dragon to an address.
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        // Since the number of dragons is capped to 2^32 we can't overflow this
        ownershipTokenCount[_to]++;
        // transfer ownership
        dragonIndexToOwner[_tokenId] = _to;
        // When creating new dragons _from is 0x0, but we can't account that address.
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            // once the dragon is transferred also clear sire allowances
            delete matingAllowedToAddress[_tokenId];
            // clear any previously approved ownership exchange
            delete dragonIndexToApproved[_tokenId];
        }
        // Emit the transfer event.
        emit Transfer(_from, _to, _tokenId);
    }

    /// @dev An internal method that creates a new dragon and stores it. This
    ///  method doesn't do any checking and should only be called when the
    ///  input data is known to be valid. Will generate both a Birth event
    ///  and a Transfer event.
    /// @param _matronId The dragon ID of the matron of this cat (zero for gen0)
    /// @param _sireId The dragon ID of the sire of this cat (zero for gen0)
    /// @param _generation The generation number of this cat, must be computed by caller.
    /// @param _genes The dragon's genetic code.
    /// @param _owner The inital owner of this cat, must be non-zero (except for the undragon, ID 0)
    function _createdragon(
        uint256 _matronId,
        uint256 _sireId,
        uint256 _generation,
        uint256 _genes,
        address _owner,
        uint16 _cooldownIndex
    )
    internal
    returns (uint)
    {
        // These requires are not strictly necessary, our calling code should make
        // sure that these conditions are never broken. However! _createdragon() is already
        // an expensive call (for storage), and it doesn't hurt to be especially careful
        // to ensure our data structures are always valid.
        require(_matronId == uint256(uint32(_matronId)));
        require(_sireId == uint256(uint32(_sireId)));
        require(_generation == uint256(uint16(_generation)));


        dragon memory _dragon = dragon({
        genes : _genes,
        birthTime : uint64(now),
        cooldownEndBlock : 0,
        matronId : uint32(_matronId),
        sireId : uint32(_sireId),
        matingWithId : 0,
        cooldownIndex : _cooldownIndex,
        generation : uint16(_generation),
        unicornation : 0,
        txCount : 0
        });
        uint256 newdragonId = dragons.push(_dragon) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newdragonId == uint256(uint32(newdragonId)));

        // emit the birth event
        emit Birth(
            _owner,
            newdragonId,
            uint256(_dragon.matronId),
            uint256(_dragon.sireId),
            _dragon.genes
        );

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newdragonId);

        return newdragonId;
    }

    // Any C-level can fix how many seconds per blocks are currently observed.
    function setSecondsPerBlock(uint256 secs) external onlyCEO {
        require(secs < cooldowns[0]);
        secondsPerBlock = secs;
    }
}


contract dragonOwnership is dragonBase, ERC721 {

    /// @notice Name and symbol of the non fungible token, as defined in ERC721.
    string public constant name = "Defily Dragons";
    string public constant symbol = "DD";

    bytes4 constant InterfaceSignature_ERC165 =
    bytes4(keccak256('supportsInterface(bytes4)'));

    bytes4 constant InterfaceSignature_ERC721 =
    bytes4(keccak256('name()')) ^
    bytes4(keccak256('symbol()')) ^
    bytes4(keccak256('totalSupply()')) ^
    bytes4(keccak256('balanceOf(address)')) ^
    bytes4(keccak256('ownerOf(uint256)')) ^
    bytes4(keccak256('approve(address,uint256)')) ^
    bytes4(keccak256('transfer(address,uint256)')) ^
    bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    bytes4(keccak256('tokensOfOwner(address)')) ^
    bytes4(keccak256('tokenMetadata(uint256,string)'));

    /// @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
    ///  Returns true for any standardized interfaces implemented by this contract. We implement
    ///  ERC-165 (obviously!) and ERC-721.
    function supportsInterface(bytes4 _interfaceID) external view returns (bool)
    {
        // DEBUG ONLY
        //require((InterfaceSignature_ERC165 == 0x01ffc9a7) && (InterfaceSignature_ERC721 == 0x9a20483d));

        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }

    // Internal utility functions: These functions all assume that their input arguments
    // are valid. We leave it to public methods to sanitize their inputs and follow
    // the required logic.

    /// @dev Checks if a given address is the current owner of a particular dragon.
    /// @param _claimant the address we are validating against.
    /// @param _tokenId dragon id, only valid when > 0
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return dragonIndexToOwner[_tokenId] == _claimant;
    }

    /// @dev Checks if a given address currently has transferApproval for a particular dragon.
    /// @param _claimant the address we are confirming dragon is approved for.
    /// @param _tokenId dragon id, only valid when > 0
    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return dragonIndexToApproved[_tokenId] == _claimant;
    }

    /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
    ///  approval. Setting _approved to address(0) clears all transfer approval.
    ///  NOTE: _approve() does NOT send the Approval event. This is intentional because
    ///  _approve() and transferFrom() are used together for putting dragons on auction, and
    ///  there is no value in spamming the log with Approval events in that case.
    function _approve(uint256 _tokenId, address _approved) internal {
        dragonIndexToApproved[_tokenId] = _approved;
    }

    /// @notice Returns the number of dragons owned by a specific address.
    /// @param _owner The owner address to check.
    /// @dev Required for ERC-721 compliance
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipTokenCount[_owner];
    }

    /// @notice Transfers a dragon to another address. If transferring to a smart
    ///  contract be VERY CAREFUL to ensure that it is aware of ERC-721 (or
    ///  DefilyDragons specifically) or your dragon may be lost forever. Seriously.
    /// @param _to The address of the recipient, can be a user or contract.
    /// @param _tokenId The ID of the dragon to transfer.
    /// @dev Required for ERC-721 compliance.
    function transfer(
        address _to,
        uint256 _tokenId
    )
    external
    whenNotPaused
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        // The contract should never own any dragons (except very briefly
        // after a gen0 dragon is created and before it goes on auction).
        require(_to != address(this));


        // You can only send your own dragon.
        require(_owns(msg.sender, _tokenId));

        // Reassign ownership, clear pending approvals, emit Transfer event.
        _transfer(msg.sender, _to, _tokenId);
    }

    /// @notice Grant another address the right to transfer a specific dragon via
    ///  transferFrom(). This is the preferred flow for transfering NFTs to contracts.
    /// @param _to The address to be granted transfer approval. Pass address(0) to
    ///  clear all approvals.
    /// @param _tokenId The ID of the dragon that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function approve(
        address _to,
        uint256 _tokenId
    )
    external
    whenNotPaused
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _tokenId));

        // Register the approval (replacing any previous approval).
        _approve(_tokenId, _to);

        // Emit approval event.
        emit Approval(msg.sender, _to, _tokenId);
    }

    /// @notice Transfer a dragon owned by another address, for which the calling address
    ///  has previously been granted transfer approval by the owner.
    /// @param _from The address that owns the dragon to be transfered.
    /// @param _to The address that should take ownership of the dragon. Can be any address,
    ///  including the caller.
    /// @param _tokenId The ID of the dragon to be transferred.
    /// @dev Required for ERC-721 compliance.
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    )
    external
    whenNotPaused
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        // The contract should never own any dragons (except very briefly
        // after a gen0 cat is created and before it goes on auction).
        require(_to != address(this));
        // Check for approval and valid ownership
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        // Reassign ownership (also clears pending approvals and emits Transfer event).
        _transfer(_from, _to, _tokenId);
    }

    /// @notice Returns the total number of dragons currently in existence.
    /// @dev Required for ERC-721 compliance.
    function totalSupply() public view returns (uint) {
        return dragons.length - 1;
    }

    /// @notice Returns the address currently assigned ownership of a given dragon.
    /// @dev Required for ERC-721 compliance.
    function ownerOf(uint256 _tokenId)
    external
    view
    returns (address owner)
    {
        owner = dragonIndexToOwner[_tokenId];

        require(owner != address(0));
    }

    /// @notice Returns a list of all dragon IDs assigned to an address.
    /// @param _owner The owner whose dragons we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire dragon array looking for cats belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner) external view returns (uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totaldragons = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 dragonId;

            for (dragonId = 1; dragonId <= totaldragons; dragonId++) {
                if (dragonIndexToOwner[dragonId] == _owner) {
                    result[resultIndex] = dragonId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    /// @dev Adapted from memcpy() by @arachnid (Nick Johnson <arachnid@notdot.net>)
    ///  This method is licenced under the Apache License.
    ///  Ref: https://github.com/Arachnid/solidity-stringutils/blob/2f6ca9accb48ae14c66f1437ec50ed19a0616f78/strings.sol
    function _memcpy(uint _dest, uint _src, uint _len) private pure {
        // Copy word-length chunks while possible
        for (; _len >= 32; _len -= 32) {
            assembly {
                mstore(_dest, mload(_src))
            }
            _dest += 32;
            _src += 32;
        }

        // Copy remaining bytes
        uint256 mask = 256 ** (32 - _len) - 1;
        assembly {
            let srcpart := and(mload(_src), not(mask))
            let destpart := and(mload(_dest), mask)
            mstore(_dest, or(destpart, srcpart))
        }
    }

    /// @dev Adapted from toString(slice) by @arachnid (Nick Johnson <arachnid@notdot.net>)
    ///  This method is licenced under the Apache License.
    ///  Ref: https://github.com/Arachnid/solidity-stringutils/blob/2f6ca9accb48ae14c66f1437ec50ed19a0616f78/strings.sol
    function _toString(bytes32[4] _rawBytes, uint256 _stringLength) private pure returns (string) {
        string memory outputString = new string(_stringLength);
        uint256 outputPtr;
        uint256 bytesPtr;

        assembly {
            outputPtr := add(outputString, 32)
            bytesPtr := _rawBytes
        }

        _memcpy(outputPtr, bytesPtr, _stringLength);

        return outputString;
    }

    function transferPreSignedHashing(
        address _token,
        address _to,
        uint256 _id,
        uint256 _nonce
    )
    public
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(bytes4(0x486A0E97), _token, _to, _id, _nonce));
    }

    function transferPreSigned(
        bytes _signature,
        address _to,
        uint256 _id,
        uint256 _nonce
    )
    public
    {
        require(_to != address(0));
        // require(signatures[_signature] == false);
        bytes32 hashedTx = transferPreSignedHashing(address(this), _to, _id, _nonce);
        address from = recover(hashedTx, _signature);
        require(from != address(0));
        require(_to != address(this));

        // You can only send your own dragon.
        require(_owns(from, _id));
        nonces[from]++;
        // Reassign ownership, clear pending approvals, emit Transfer event.
        _transfer(from, _to, _id);
    }

    function approvePreSignedHashing(
        address _token,
        address _spender,
        uint256 _tokenId,
        uint256 _nonce
    )
    public
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(_token, _spender, _tokenId, _nonce));
    }

    function approvePreSigned(
        bytes _signature,
        address _spender,
        uint256 _tokenId,
        uint256 _nonce
    )
    public
    returns (bool)
    {
        require(_spender != address(0));
        // require(signatures[_signature] == false);
        bytes32 hashedTx = approvePreSignedHashing(address(this), _spender, _tokenId, _nonce);
        address from = recover(hashedTx, _signature);
        require(from != address(0));

        // Only an owner can grant transfer approval.
        require(_owns(from, _tokenId));

        nonces[from]++;
        // Register the approval (replacing any previous approval).
        _approve(_tokenId, _spender);

        // Emit approval event.
        emit Approval(from, _spender, _tokenId);
        return true;
    }
}

contract dragonBreeding is dragonOwnership {

    /// @dev The Pregnant event is fired when two cats successfully breed and the pregnancy
    ///  timer begins for the matron.
    event Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock);

    /// @notice The minimum payment required to use breedWithAuto(). This fee goes towards
    ///  the gas cost paid by whatever calls giveBirth(), and can be dynamically updated by
    ///  the COO role as the gas price changes.
    uint256 public autoBirthFee = 2 finney;

    // Keeps track of number of pregnant dragons.
    uint256 public pregnantdragons;

    ERC20 public tokens;
    uint256 constant public DRAGON_DECIMAL = 1000000000000000000;

    constructor(address _tokenAddress) public {
        tokens = ERC20(_tokenAddress);
    }

    /// @dev The address of the sibling contract that is used to implement the sooper-sekret
    ///  genetic combination algorithm.
    GeneScienceInterface public geneScience;

    /// @dev Update the address of the genetic contract, can only be called by the CEO.
    /// @param _address An address of a GeneScience contract instance to be used from this point forward.
    function setGeneScienceAddress(address _address) external onlyCEO {
        GeneScienceInterface candidateContract = GeneScienceInterface(_address);

        // NOTE: verify that a contract is what we expect - https://github.com/Lunyr/crowdsale-contracts/blob/cfadd15986c30521d8ba7d5b6f57b4fefcc7ac38/contracts/LunyrToken.sol#L117
        require(candidateContract.isGeneScience());

        // Set the new contract address
        geneScience = candidateContract;
    }

    function setTokenAddress(address _address) external onlyCEO {
        tokens = ERC20(_address);
    }

    /// @dev Checks that a given dragon is able to breed. Requires that the
    ///  current cooldown is finished (for sires) and also checks that there is
    ///  no pending pregnancy.
    function _isReadyToMate(dragon _pon) internal view returns (bool) {
        // In addition to checking the cooldownEndBlock, we also need to check to see if
        // the cat has a pending birth; there can be some period of time between the end
        // of the pregnacy timer and the birth event.
        return (_pon.matingWithId == 0) && (_pon.cooldownEndBlock <= uint64(block.number));
    }

    /// @dev Check if a sire has authorized breeding with this matron. True if both sire
    ///  and matron have the same owner, or if the sire has given siring permission to
    ///  the matron's owner (via approveSiring()).
    function _isMatingPermitted(uint256 _sireId, uint256 _matronId) internal view returns (bool) {
        address matronOwner = dragonIndexToOwner[_matronId];
        address sireOwner = dragonIndexToOwner[_sireId];

        // Siring is okay if they have same owner, or if the matron's owner was given
        // permission to breed with this sire.
        return (matronOwner == sireOwner || matingAllowedToAddress[_sireId] == matronOwner);
    }

    /// @dev Set the cooldownEndTime for the given dragon, based on its current cooldownIndex.
    ///  Also increments the cooldownIndex (unless it has hit the cap).
    /// @param _dragon A reference to the dragon in storage which needs its timer started.
    function _triggerCooldown(dragon storage _dragon) internal {
        // Compute an estimation of the cooldown time in blocks (based on current cooldownIndex).
        _dragon.cooldownEndBlock = uint64((cooldowns[_dragon.cooldownIndex] / secondsPerBlock) + block.number);

        // Increment the breeding count, clamping it at 13, which is the length of the
        // cooldowns array. We could check the array size dynamically, but hard-coding
        // this as a constant saves gas. Yay, Solidity!
        if (_dragon.cooldownIndex < 13) {
            _dragon.cooldownIndex += 1;
        }
    }

    function _triggerPregnant(dragon storage _dragon) internal {
        // Compute an estimation of the cooldown time in blocks (based on current cooldownIndex).

        _dragon.cooldownEndBlock = uint64((cooldowns[_dragon.cooldownIndex] / secondsPerBlock) + block.number);

        // Increment the breeding count, clamping it at 13, which is the length of the
        // cooldowns array. We could check the array size dynamically, but hard-coding
        // this as a constant saves gas. Yay, Solidity!
        if (_dragon.cooldownIndex < 13) {
            _dragon.cooldownIndex += 1;
        }
    }

    /// @notice Grants approval to another user to sire with one of your dragons.
    /// @param _addr The address that will be able to sire with your dragon. Set to
    ///  address(0) to clear all siring approvals for this dragon.
    /// @param _sireId A dragon that you own that _addr will now be able to sire with.
    function approveSiring(address _addr, uint256 _sireId)
    external
    whenNotPaused
    {
        require(_owns(msg.sender, _sireId));
        matingAllowedToAddress[_sireId] = _addr;
    }

    /// @dev Updates the minimum payment required for calling giveBirthAuto(). Can only
    ///  be called by the COO address. (This fee is used to offset the gas cost incurred
    ///  by the autobirth daemon).
    function setAutoBirthFee(uint256 val) external onlyCEO {
        autoBirthFee = val;
    }

    /// @dev Checks to see if a given dragon is pregnant and (if so) if the gestation
    ///  period has passed.
    function _isReadyToGiveBirth(dragon _matron) private view returns (bool) {
        return (_matron.matingWithId != 0) && (_matron.cooldownEndBlock <= uint64(block.number));
    }

    /// @notice Checks that a given dragon is able to breed (i.e. it is not pregnant or
    ///  in the middle of a siring cooldown).
    /// @param _dragonId reference the id of the dragon, any user can inquire about it
    function isReadyToMate(uint256 _dragonId)
    public
    view
    returns (bool)
    {
        require(_dragonId > 0);
        dragon storage pon = dragons[_dragonId];
        return _isReadyToMate(pon);
    }

    /// @dev Checks whether a dragon is currently pregnant.
    /// @param _dragonId reference the id of the dragon, any user can inquire about it
    function isPregnant(uint256 _dragonId)
    public
    view
    returns (bool)
    {
        require(_dragonId > 0);
        // A dragon is pregnant if and only if this field is set
        return dragons[_dragonId].matingWithId != 0;
    }

    /// @dev Internal check to see if a given sire and matron are a valid mating pair. DOES NOT
    ///  check ownership permissions (that is up to the caller).
    /// @param _matron A reference to the dragon struct of the potential matron.
    /// @param _matronId The matron's ID.
    /// @param _sire A reference to the dragon struct of the potential sire.
    /// @param _sireId The sire's ID
    function _isValidMatingPair(
        dragon storage _matron,
        uint256 _matronId,
        dragon storage _sire,
        uint256 _sireId
    )
    private
    view
    returns (bool)
    {
        // A dragon can't breed with itself!
        if (_matronId == _sireId) {
            return false;
        }

        // dragons can't breed with their parents.
        if (_matron.matronId == _sireId || _matron.sireId == _sireId) {
            return false;
        }
        if (_sire.matronId == _matronId || _sire.sireId == _matronId) {
            return false;
        }

        // We can short circuit the sibling check (below) if either cat is
        // gen zero (has a matron ID of zero).
        if (_sire.matronId == 0 || _matron.matronId == 0) {
            return true;
        }

        // dragons can't breed with full or half siblings.
        if (_sire.matronId == _matron.matronId || _sire.matronId == _matron.sireId) {
            return false;
        }
        if (_sire.sireId == _matron.matronId || _sire.sireId == _matron.sireId) {
            return false;
        }

        // Everything seems cool! Let's get DTF.
        return true;
    }

    /// @dev Internal check to see if a given sire and matron are a valid mating pair for
    ///  breeding via auction (i.e. skips ownership and siring approval checks).
    function _canMateWithViaAuction(uint256 _matronId, uint256 _sireId)
    internal
    view
    returns (bool)
    {
        dragon storage matron = dragons[_matronId];
        dragon storage sire = dragons[_sireId];
        return _isValidMatingPair(matron, _matronId, sire, _sireId);
    }

    /// @notice Checks to see if two cats can breed together, including checks for
    ///  ownership and siring approvals. Does NOT check that both cats are ready for
    ///  breeding (i.e. breedWith could still fail until the cooldowns are finished).
    ///  TODO: Shouldn't this check pregnancy and cooldowns?!?
    /// @param _matronId The ID of the proposed matron.
    /// @param _sireId The ID of the proposed sire.
    function canMateWith(uint256 _matronId, uint256 _sireId)
    external
    view
    returns (bool)
    {
        require(_matronId > 0);
        require(_sireId > 0);
        dragon storage matron = dragons[_matronId];
        dragon storage sire = dragons[_sireId];
        return _isValidMatingPair(matron, _matronId, sire, _sireId) &&
        _isMatingPermitted(_sireId, _matronId);
    }

    /// @dev Internal utility function to initiate breeding, assumes that all breeding
    ///  requirements have been checked.
    function _mateWith(uint256 _matronId, uint256 _sireId) internal {
        // Grab a reference to the dragons from storage.
        dragon storage sire = dragons[_sireId];
        dragon storage matron = dragons[_matronId];

        // Mark the matron as pregnant, keeping track of who the sire is.
        matron.matingWithId = uint32(_sireId);

        // Trigger the cooldown for both parents.
        _triggerCooldown(sire);
        _triggerPregnant(matron);

        // Clear siring permission for both parents. This may not be strictly necessary
        // but it's likely to avoid confusion!
        delete matingAllowedToAddress[_matronId];
        delete matingAllowedToAddress[_sireId];

        // Every time a dragon gets pregnant, counter is incremented.
        pregnantdragons++;

        // Emit the pregnancy event.

        emit Pregnant(dragonIndexToOwner[_matronId], _matronId, _sireId, matron.cooldownEndBlock);
    }

    // string memory message_ = strConcat(
    //     "_inb:",
    //     numberToString(_incubator),
    //     "_idx:",
    //     numberToString(dragon.txCount + 1)
    // );


    /// @notice Breed a dragon you own (as matron) with a sire that you own, or for which you
    ///  have previously been given Siring approval. Will either make your cat pregnant, or will
    ///  fail entirely. Requires a pre-payment of the fee given out to the first caller of giveBirth()
    /// @param _matronId The ID of the dragon acting as matron (will end up pregnant if successful)
    /// @param _sireId The ID of the dragon acting as sire (will begin its siring cooldown if successful)
    function mateWithAuto(uint256 _matronId, uint256 _sireId)
    external
    payable
    whenNotPaused
    {
        // Checks for payment.
        require(msg.value >= autoBirthFee);

        // Caller must own the matron.
        require(_owns(msg.sender, _matronId));

        require(_isMatingPermitted(_sireId, _matronId));

        // Grab a reference to the potential matron
        dragon storage matron = dragons[_matronId];

        // Make sure matron isn't pregnant, or in the middle of a siring cooldown
        require(_isReadyToMate(matron));

        // Grab a reference to the potential sire
        dragon storage sire = dragons[_sireId];

        // Make sure sire isn't pregnant, or in the middle of a siring cooldown
        require(_isReadyToMate(sire));

        // Test that these cats are a valid mating pair.
        require(
            _isValidMatingPair(matron, _matronId, sire, _sireId)
        );


        _mateWith(_matronId, _sireId);

    }

    /// @notice Have a pregnant dragon give birth!
    /// @param _matronId A dragon ready to give birth.
    /// @return The dragon ID of the new dragon.
    /// @dev Looks at a given dragon and, if pregnant and if the gestation period has passed,
    ///  combines the genes of the two parents to create a new dragon. The new dragon is assigned
    ///  to the current owner of the matron. Upon successful completion, both the matron and the
    ///  new dragon will be ready to breed again. Note that anyone can call this function (if they
    ///  are willing to pay the gas!), but the new dragon always goes to the mother's owner.
    function giveBirth(uint256 _matronId)
    external
    whenNotPaused
    returns (uint256)
    {
        // Grab a reference to the matron in storage.
        dragon storage matron = dragons[_matronId];

        // Check that the matron is a valid cat.
        require(matron.birthTime != 0);

        // Check that the matron is pregnant, and that its time has come!
        require(_isReadyToGiveBirth(matron));

        // Grab a reference to the sire in storage.
        uint256 sireId = matron.matingWithId;
        dragon storage sire = dragons[sireId];

        // Determine the higher generation number of the two parents
        uint16 parentGen = matron.generation;
        if (sire.generation > matron.generation) {
            parentGen = sire.generation;
        }

        // Call the sooper-sekret gene mixing operation.
        uint256 childGenes = geneScience.mixGenes(matron.genes, sire.genes, matron.cooldownEndBlock - 1);
        // New dragon starts with the same cooldown as parent gen/20
        uint16 cooldownIndex = geneScience.processCooldown(parentGen + 1, block.number);
        if (cooldownIndex > 13) {
            cooldownIndex = 13;
        }

        tokens.transferFrom(msg.sender, address(0x000000000000000000000000000000000000dEaD), birthCost[cooldownIndex] * DRAGON_DECIMAL);
        // Make the new dragon!
        address owner = dragonIndexToOwner[_matronId];
        uint256 dragonId = _createdragon(_matronId, matron.matingWithId, parentGen + 1, childGenes, owner, cooldownIndex);

        // Clear the reference to sire from the matron (REQUIRED! Having siringWithId
        // set is what marks a matron as being pregnant.)
        delete matron.matingWithId;

        // Every time a dragon gives birth counter is decremented.
        pregnantdragons--;

        // Send the balance fee to the person who made birth happen.
        msg.sender.transfer(autoBirthFee);

        // return the new dragon's ID
        return dragonId;
    }
}


/// @title Auction Core
/// @dev Contains models, variables, and internal methods for the auction.
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract ClockAuctionBase {

    // Represents an auction on an NFT
    struct Auction {
        // Current owner of NFT
        address seller;
        uint256 price;
        bool allowPayToken;
    }

    // Reference to contract tracking NFT ownership
    ERC721 public nonFungibleContract;

    ERC20 public tokens;

    // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
    // Values 0-10,000 map to 0%-100%
    uint256 public ownerCut = 500;

    // Map from token ID to their corresponding auction.
    mapping(uint256 => Auction) tokenIdToAuction;

    event AuctionCreated(uint256 tokenId);
    event AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner);
    event AuctionCancelled(uint256 tokenId);

    /// @dev Returns true if the claimant owns the token.
    /// @param _claimant - Address claiming to own the token.
    /// @param _tokenId - ID of token whose ownership to verify.
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
    }

    /// @dev Escrows the NFT, assigning ownership to this contract.
    /// Throws if the escrow fails.
    /// @param _owner - Current owner address of token to escrow.
    /// @param _tokenId - ID of token whose approval to verify.
    function _escrow(address _owner, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transferFrom(_owner, this, _tokenId);
    }

    /// @dev Transfers an NFT owned by this contract to another address.
    /// Returns true if the transfer succeeds.
    /// @param _receiver - Address to transfer NFT to.
    /// @param _tokenId - ID of token to transfer.
    function _transfer(address _receiver, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transfer(_receiver, _tokenId);
    }

    /// @dev Adds an auction to the list of open auctions. Also fires the
    ///  AuctionCreated event.
    /// @param _tokenId The ID of the token to be put on auction.
    /// @param _auction Auction to add.
    function _addAuction(uint256 _tokenId, Auction _auction) internal {

        tokenIdToAuction[_tokenId] = _auction;

        emit AuctionCreated(
            uint256(_tokenId)
        );
    }


    /// @dev Computes the price and transfers winnings.
    /// Does NOT transfer ownership of token.
    function _bidEth(uint256 _tokenId, uint256 _bidAmount)
    internal
    returns (uint256)
    {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        require(!auction.allowPayToken);

        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));

        // Check that the bid is greater than or equal to the current price
        uint256 price = auction.price;
        require(_bidAmount >= price);

        // Grab a reference to the seller before the auction struct
        // gets deleted.
        address seller = auction.seller;

        // The bid is good! Remove the auction before sending the fees
        // to the sender so we can't have a reentrancy attack.
        _removeAuction(_tokenId);

        // Transfer proceeds to seller (if there are any!)
        if (price > 0) {
            seller.transfer(price);
        }

        // Tell the world!
        emit AuctionSuccessful(_tokenId, price, msg.sender);

        return price;
    }

    function _bidToken(uint256 _tokenId, uint256 _bidAmount)
    internal
    returns (uint256)
    {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        require(auction.allowPayToken);
        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));

        // Check that the bid is greater than or equal to the current price
        uint256 price = auction.price;
        require(_bidAmount >= price);

        // Grab a reference to the seller before the auction struct
        // gets deleted.
        address seller = auction.seller;

        // The bid is good! Remove the auction before sending the fees
        // to the sender so we can't have a reentrancy attack.
        _removeAuction(_tokenId);

        // Transfer proceeds to seller (if there are any!)
        if (price > 0) {
            tokens.transfer(seller, price);
        }
        // Tell the world!
        emit AuctionSuccessful(_tokenId, price, msg.sender);

        return price;
    }

    /// @dev Cancels an auction unconditionally.
    function _cancelAuction(uint256 _tokenId, address _seller) internal {
        _removeAuction(_tokenId);
        _transfer(_seller, _tokenId);
        emit AuctionCancelled(_tokenId);
    }

    /// @dev Returns true if the NFT is on auction.
    /// @param _auction - Auction to check.
    function _isOnAuction(Auction storage _auction) internal view returns (bool) {
        return (_auction.price > 0);
    }

    /// @dev Removes an auction from the list of open auctions.
    /// @param _tokenId - ID of NFT on auction.
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];
    }
}







/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;

    /**
     * @dev modifier to allow actions only when the contract IS paused
     */
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /**
     * @dev modifier to allow actions only when the contract IS NOT paused
     */
    modifier whenPaused {
        require(paused);
        _;
    }

    /**
     * @dev called by the owner to pause, triggers stopped state
     */
    function pause() onlyOwner whenNotPaused public returns (bool) {
        paused = true;
        emit Pause();
        return true;
    }

    /**
     * @dev called by the owner to unpause, returns to normal state
     */
    function unpause() onlyOwner whenPaused public returns (bool) {
        paused = false;
        emit Unpause();
        return true;
    }
}


/// @title Clock auction for non-fungible tokens.
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract ClockAuction is Pausable, ClockAuctionBase {

    /// @dev The ERC-165 interface signature for ERC-721.
    ///  Ref: https://github.com/ethereum/EIPs/issues/165
    ///  Ref: https://github.com/ethereum/EIPs/issues/721
    bytes4 constant InterfaceSignature_ERC721 = bytes4(0x9a20483d);

    /// @dev Constructor creates a reference to the NFT ownership contract
    ///  and verifies the owner cut is in the valid range.
    /// @param _nftAddress - address of a deployed contract implementing
    ///  the Nonfungible Interface.
    constructor(address _nftAddress, address _tokenAddress) public {
        ERC721 candidateContract = ERC721(_nftAddress);
        require(candidateContract.supportsInterface(InterfaceSignature_ERC721));
        tokens = ERC20(_tokenAddress);
        nonFungibleContract = candidateContract;
    }


    /// @dev Cancels an auction that hasn't been won yet.
    ///  Returns the NFT to original owner.
    /// @notice This is a state-modifying function that can
    ///  be called while the contract is paused.
    /// @param _tokenId - ID of token on auction
    function cancelAuction(uint256 _tokenId)
    external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        address seller = auction.seller;
        require(msg.sender == seller);
        _cancelAuction(_tokenId, seller);
    }

    /// @dev Cancels an auction when the contract is paused.
    ///  Only the owner may do this, and NFTs are returned to
    ///  the seller. This should only be used in emergencies.
    /// @param _tokenId - ID of the NFT on auction to cancel.
    function cancelAuctionWhenPaused(uint256 _tokenId)
    whenPaused
    onlyOwner
    external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        _cancelAuction(_tokenId, auction.seller);
    }

    /// @dev Returns auction info for an NFT on auction.
    /// @param _tokenId - ID of NFT on auction.
    function getAuction(uint256 _tokenId)
    external
    view
    returns
    (
        address seller,
        uint256 price
    ) {
        Auction storage auction = tokenIdToAuction[_tokenId];
        return (
        auction.seller,
        auction.price
        );
    }

    /// @dev Returns the current price of an auction.
    /// @param _tokenId - ID of the token price we are checking.
    function getCurrentPrice(uint256 _tokenId)
    external
    view
    returns (uint256)
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        return auction.price;
    }

}


/// @title Reverse auction modified for siring
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract SiringClockAuction is ClockAuction {

    // @dev Sanity check that allows us to ensure that we are pointing to the
    //  right auction in our setSiringAuctionAddress() call.
    bool public isSiringClockAuction = true;

    address prizeAddress;

    // Delegate constructor
    constructor(address _nftAddr, address _tokenAddress, address _prizeAddress) public
    ClockAuction(_nftAddr, _tokenAddress) {
        prizeAddress = _prizeAddress;
    }

    /// @dev Creates and begins a new auction. Since this function is wrapped,
    /// require sender to be dragonCore contract.
    /// @param _tokenId - ID of token to auction, sender must be owner.
    /// @param _seller - Seller, if not the message sender
    function createEthAuction(
        uint256 _tokenId,
        address _seller,
        uint256 _price
    )
    external
    {

        require(msg.sender == address(nonFungibleContract));
        require(_price > 0);
        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            _price,
            false
        );
        _addAuction(_tokenId, auction);
    }

    function createTokenAuction(
        uint256 _tokenId,
        address _seller,
        uint256 _price
    )
    external
    {

        require(msg.sender == address(nonFungibleContract));
        require(_price > 0);
        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            _price,
            true
        );
        _addAuction(_tokenId, auction);
    }

    /// @dev Places a bid for siring. Requires the sender
    /// is the dragonCore contract because all bid methods
    /// should be wrapped. Also returns the dragon to the
    /// seller rather than the winner.
    function bidEth(uint256 _tokenId)
    external
    payable
    {
        require(msg.sender == address(nonFungibleContract));
        address seller = tokenIdToAuction[_tokenId].seller;
        // _bid checks that token ID is valid and will throw if bid fails
        _bidEth(_tokenId, msg.value);

        _transfer(seller, _tokenId);
    }

    function bidToken(uint256 _tokenId,
        uint256 _price)
    external
    whenNotPaused
    {
        require(msg.sender == address(nonFungibleContract));
        address seller = tokenIdToAuction[_tokenId].seller;
        // _bid will throw if the bid or funds transfer fails
        _bidToken(_tokenId, _price);
        _transfer(seller, _tokenId);
    }

    /// @dev Remove all Ether from the contract, which is the owner's cuts
    ///  as well as any Ether sent directly to the contract address.
    ///  Always transfers to the NFT contract, but can be called either by
    ///  the owner or the NFT contract.
    function withdrawBalance() external {
        address nftAddress = address(nonFungibleContract);

        require(
            msg.sender == owner ||
            msg.sender == nftAddress
        );

        nftAddress.transfer(address(this).balance);
    }
}





/// @title Clock auction modified for sale of dragons
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract SaleClockAuction is ClockAuction {

    // @dev Sanity check that allows us to ensure that we are pointing to the
    //  right auction in our setSaleAuctionAddress() call.
    bool public isSaleClockAuction = true;

    // Tracks last 5 sale price of gen0 dragon sales
    uint256 public gen0SaleCount;
    uint256[5] public lastGen0SalePrices;

    // Delegate constructor
    constructor(address _nftAddr, address _token) public
    ClockAuction(_nftAddr, _token) {

    }

    /// @dev Creates and begins a new auction.
    /// @param _tokenId - ID of token to auction, sender must be owner.
    /// @param _seller - Seller, if not the message sender
    function createEthAuction(
        uint256 _tokenId,
        address _seller,
        uint256 _price
    )
    external
    {

        require(msg.sender == address(nonFungibleContract));
        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            _price,
            false
        );
        _addAuction(_tokenId, auction);
    }

    function createTokenAuction(
        uint256 _tokenId,
        address _seller,
        uint256 _price
    )
    external
    {

        require(msg.sender == address(nonFungibleContract));
        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            _price,
            true
        );
        _addAuction(_tokenId, auction);
    }

    function bidEth(uint256 _tokenId)
    external
    payable
    whenNotPaused
    {
        // _bid will throw if the bid or funds transfer fails
        _bidEth(_tokenId, msg.value);
        _transfer(msg.sender, _tokenId);
    }

    function bidToken(uint256 _tokenId, uint256 _price)
    external
    whenNotPaused
    {
        require(tokens.transferFrom(msg.sender, address(this), _price));
        // _bid will throw if the bid or funds transfer fails
        _bidToken(_tokenId, _price);
        _transfer(msg.sender, _tokenId);
    }

    /// @dev Creates and begins a new auction.
    /// @param _tokenId - ID of token to auction, sender must be owner.
    /// @param _seller - Seller, if not the message sender
    function createDklAuction(
        uint256 _tokenId,
        address _seller,
        uint256 _price
    )
    external
    {

        require(msg.sender == address(nonFungibleContract));
        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            _price,
            true
        );
        _addAuction(_tokenId, auction);
    }

    /// @dev Remove all Ether from the contract, which is the owner's cuts
    ///  as well as any Ether sent directly to the contract address.
    ///  Always transfers to the NFT contract, but can be called either by
    ///  the owner or the NFT contract.
    function withdrawBalance() external {
        address nftAddress = address(nonFungibleContract);

        require(
            msg.sender == owner ||
            msg.sender == nftAddress
        );

        nftAddress.transfer(address(this).balance);
    }
}


/// @title Handles creating auctions for sale and siring of dragons.
///  This wrapper of ReverseAuction exists only so that users can create
///  auctions with only one transaction.
contract dragonAuction is dragonBreeding {

    // @notice The auction contract variables are defined in dragonBase to allow
    //  us to refer to them in dragonOwnership to prevent accidental transfers.
    // `saleAuction` refers to the auction for gen0 and p2p sale of dragons.
    // `siringAuction` refers to the auction for siring rights of dragons.

    /// @dev Sets the reference to the sale auction.
    /// @param _address - Address of sale contract.
    function setSaleAuctionAddress(address _address) external onlyCEO {
        SaleClockAuction candidateContract = SaleClockAuction(_address);

        // NOTE: verify that a contract is what we expect - https://github.com/Lunyr/crowdsale-contracts/blob/cfadd15986c30521d8ba7d5b6f57b4fefcc7ac38/contracts/LunyrToken.sol#L117
        require(candidateContract.isSaleClockAuction());

        // Set the new contract address
        saleAuction = candidateContract;
    }

    /// @dev Sets the reference to the siring auction.
    /// @param _address - Address of siring contract.
    function setSiringAuctionAddress(address _address) external onlyCEO {
        SiringClockAuction candidateContract = SiringClockAuction(_address);

        // NOTE: verify that a contract is what we expect - https://github.com/Lunyr/crowdsale-contracts/blob/cfadd15986c30521d8ba7d5b6f57b4fefcc7ac38/contracts/LunyrToken.sol#L117
        require(candidateContract.isSiringClockAuction());

        // Set the new contract address
        siringAuction = candidateContract;
    }

    /// @dev Sets the reference to the bidding auction.
    /// @param _address - Address of bidding contract.
    function setBiddingAuctionAddress(address _address) external onlyCEO {
        BiddingClockAuction candidateContract = BiddingClockAuction(_address);

        // NOTE: verify that a contract is what we expect - https://github.com/Lunyr/crowdsale-contracts/blob/cfadd15986c30521d8ba7d5b6f57b4fefcc7ac38/contracts/LunyrToken.sol#L117
        require(candidateContract.isBiddingClockAuction());

        // Set the new contract address
        biddingAuction = candidateContract;
    }


    /// @dev Put a dragon up for auction.
    ///  Does some ownership trickery to create auctions in one tx.
    function createEthSaleAuction(
        uint256 _dragonId,
        uint256 _price
    )
    external
    whenNotPaused
    {
        // Auction contract checks input sizes
        // If dragon is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(_owns(msg.sender, _dragonId));
        // Ensure the dragon is not pregnant to prevent the auction
        // contract accidentally receiving ownership of the child.
        // NOTE: the dragon IS allowed to be in a cooldown.
        require(!isPregnant(_dragonId));
        _approve(_dragonId, saleAuction);
        // Sale auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the dragon.
        saleAuction.createEthAuction(
            _dragonId,
            msg.sender,
            _price
        );
    }

    function createTokenSaleAuction(
        uint256 _dragonId,
        uint256 _price
    )
    public
    whenNotPaused
    {
        // Auction contract checks input sizes
        // If dragon is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(_owns(msg.sender, _dragonId));
        // Ensure the dragon is not pregnant to prevent the auction
        // contract accidentally receiving ownership of the child.
        // NOTE: the dragon IS allowed to be in a cooldown.
        require(!isPregnant(_dragonId));
        _approve(_dragonId, saleAuction);
        // Sale auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the dragon.
        saleAuction.createTokenAuction(
            _dragonId,
            msg.sender,
            _price
        );
    }


    /// @dev Put a dragon up for auction to be sire.
    ///  Performs checks to ensure the dragon can be sired, then
    ///  delegates to reverse auction.
    function createEthSiringAuction(
        uint256 _dragonId,
        uint256 _price
    )
    external
    whenNotPaused
    {
        // Auction contract checks input sizes
        // If dragon is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(_owns(msg.sender, _dragonId));
        require(isReadyToMate(_dragonId));
        _approve(_dragonId, siringAuction);
        // Siring auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the dragon.
        siringAuction.createEthAuction(
            _dragonId,
            msg.sender,
            _price
        );
    }

    function createTokenSiringAuction(
        uint256 _dragonId,
        uint256 _price
    )
    external
    whenNotPaused
    {
        // Auction contract checks input sizes
        // If dragon is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(_owns(msg.sender, _dragonId));
        require(isReadyToMate(_dragonId));
        _approve(_dragonId, siringAuction);
        // Siring auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the dragon.
        siringAuction.createTokenAuction(
            _dragonId,
            msg.sender,
            _price
        );
    }

    function createEthBidAuction(
        uint256 _dragonId,
        uint256 _price,
        uint16 _durationIndex
    ) external whenNotPaused {
        require(_owns(msg.sender, _dragonId));
        _approve(_dragonId, biddingAuction);
        biddingAuction.createETHAuction(_dragonId, msg.sender, _durationIndex, _price);
    }

    function bidOnEthSiringAuctionHashing(
        uint8 _incubator,
        uint256 txCount
    )
    public
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(bytes4(0x486A0E99), _incubator, txCount));
    }

    /// @dev Completes a siring auction by bidding.
    ///  Immediately breeds the winning matron with the sire on auction.
    /// @param _sireId - ID of the sire on auction.
    /// @param _matronId - ID of the matron owned by the bidder.
    function bidOnEthSiringAuction(
        uint256 _sireId,
        uint256 _matronId
    )
    external
    payable
    whenNotPaused
    {
        // Auction contract checks input sizes
        require(_owns(msg.sender, _matronId));
        require(isReadyToMate(_matronId));
        require(_canMateWithViaAuction(_matronId, _sireId));

        // Define the current price of the auction.
        uint256 currentPrice = siringAuction.getCurrentPrice(_sireId);
        require(msg.value >= currentPrice + autoBirthFee);

        // Siring auction will throw if the bid fails.
        siringAuction.bidEth.value(msg.value - autoBirthFee)(_sireId);

        _mateWith(_matronId, _sireId);

    }

    function bidOnTokenSiringAuction(
        uint256 _sireId,
        uint256 _matronId
    )
    external
    whenNotPaused
    {
        // Auction contract checks input sizes
        require(_owns(msg.sender, _matronId));
        require(isReadyToMate(_matronId));
        require(_canMateWithViaAuction(_matronId, _sireId));

        // Define the current price of the auction.
        uint256 currentPrice = siringAuction.getCurrentPrice(_sireId);

        //Transfer token to core in order to bid
        ERC20 biddingToken = ERC20(siringAuction.tokens());
        biddingToken.transferFrom(msg.sender,address(siringAuction),currentPrice);

        // Siring auction will throw if the bid fails.
        siringAuction.bidToken(_sireId, currentPrice);

        _mateWith(_matronId, _sireId);

    }


    /// @dev Transfers the balance of the sale auction contract
    /// to the dragonCore contract. We use two-step withdrawal to
    /// prevent two transfer calls in the auction bid function.
    function withdrawAuctionBalances() external onlyCEO {
        saleAuction.withdrawBalance();
        siringAuction.withdrawBalance();
        biddingAuction.withdrawBalance();
    }
}

/// @title Auction Core
/// @dev Contains models, variables, and internal methods for the auction.
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract BiddingAuctionBase {
    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;

    // Represents an auction on an NFT
    struct Auction {
        // Current owner of NFT
        address seller;
        // Duration (in seconds) of auction
        uint16 durationIndex;
        // Time when auction started
        // NOTE: 0 if this auction has been concluded
        uint64 startedAt;

        uint64 auctionEndBlock;
        // Price (in wei) at beginning of auction
        uint256 startingPrice;
    }

    uint32[4] public auctionDuration = [
    //beta
    uint32(10 minutes),
    uint32(20 minutes),
    uint32(30 minutes),
    uint32(40 minutes)

    //production
    // uint32(2 days),
    // uint32(3 days),
    // uint32(4 days),
    // uint32(5 days)
    ];

    // Reference to contract tracking NFT ownership
    ERC721 public nonFungibleContract;


    uint256 public ownerCut = 500;

    // Map from token ID to their corresponding auction.
    mapping(uint256 => Auction) tokenIdToAuction;

    event AuctionCreated(uint256 tokenId);
    event AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner);
    event AuctionCancelled(uint256 tokenId);

    /// @dev Returns true if the claimant owns the token.
    /// @param _claimant - Address claiming to own the token.
    /// @param _tokenId - ID of token whose ownership to verify.
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
    }

    /// @dev Escrows the NFT, assigning ownership to this contract.
    /// Throws if the escrow fails.
    /// @param _owner - Current owner address of token to escrow.
    /// @param _tokenId - ID of token whose approval to verify.
    function _escrow(address _owner, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transferFrom(_owner, this, _tokenId);
    }

    /// @dev Transfers an NFT owned by this contract to another address.
    /// Returns true if the transfer succeeds.
    /// @param _receiver - Address to transfer NFT to.
    /// @param _tokenId - ID of token to transfer.
    function _transfer(address _receiver, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transfer(_receiver, _tokenId);
    }

    /// @dev Adds an auction to the list of open auctions. Also fires the
    ///  AuctionCreated event.
    /// @param _tokenId The ID of the token to be put on auction.
    /// @param _auction Auction to add.
    function _addAuction(uint256 _tokenId, Auction _auction) internal {

        tokenIdToAuction[_tokenId] = _auction;

        emit AuctionCreated(
            uint256(_tokenId)
        );
    }

    /// @dev Cancels an auction unconditionally.
    function _cancelAuction(uint256 _tokenId, address _seller) internal {
        _removeAuction(_tokenId);
        _transfer(_seller, _tokenId);
        emit AuctionCancelled(_tokenId);
    }


    /// @dev Removes an auction from the list of open auctions.
    /// @param _tokenId - ID of NFT on auction.
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];
    }



    /// @dev Computes owner's cut of a sale.
    /// @param _price - Sale price of NFT.
    function _computeCut(uint256 _price) internal view returns (uint256) {
        // NOTE: We don't use SafeMath (or similar) in this function because
        //  all of our entry functions carefully cap the maximum values for
        //  currency (at 128-bits), and ownerCut <= 10000 (see the require()
        //  statement in the ClockAuction constructor). The result of this
        //  function is always guaranteed to be <= _price.
        return _price * ownerCut / 10000;
    }

}


/// @title Clock auction for non-fungible tokens.
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract BiddingAuction is Pausable, BiddingAuctionBase, SignatureVerifier {
    /// @dev The ERC-165 interface signature for ERC-721.
    ///  Ref: https://github.com/ethereum/EIPs/issues/165
    ///  Ref: https://github.com/ethereum/EIPs/issues/721
    bytes4 constant InterfaceSignature_ERC721 = bytes4(0x9a20483d);



    /// @dev Constructor creates a reference to the NFT ownership contract
    ///  and verifies the owner cut is in the valid range.
    /// @param _nftAddress - address of a deployed contract implementing
    ///  the Nonfungible Interface.
    constructor(address _nftAddress) public {

        ERC721 candidateContract = ERC721(_nftAddress);
        require(candidateContract.supportsInterface(InterfaceSignature_ERC721));
        nonFungibleContract = candidateContract;
    }

    function checkBidSignature(
        bytes32 _message,
        bytes _sig
    ) internal view returns (bool) {
        address signer = recover(_message, _sig);
        return (signer == owner);
    }

    function cancelAuctionHashing(
        uint256 _tokenId,
        uint64 _endblock
    )
    public
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(bytes4(0x486A0E9E), _tokenId, _endblock));
    }

    /// @dev Cancels an auction that hasn't been won yet.
    ///  Returns the NFT to original owner.
    /// @notice This is a state-modifying function that can
    ///  be called while the contract is paused.
    /// @param _tokenId - ID of token on auction
    function cancelAuction(
        uint256 _tokenId,
        bytes _sig
    )
    external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        address seller = auction.seller;
        uint64 endblock = auction.auctionEndBlock;
        require(msg.sender == seller);
        require(endblock < block.number);

        bytes32 hashedTx = cancelAuctionHashing(_tokenId, endblock);
        require(checkBidSignature(hashedTx, _sig));

        _cancelAuction(_tokenId, seller);
    }

    /// @dev Cancels an auction when the contract is paused.
    ///  Only the owner may do this, and NFTs are returned to
    ///  the seller. This should only be used in emergencies.
    /// @param _tokenId - ID of the NFT on auction to cancel.
    function cancelAuctionWhenPaused(uint256 _tokenId)
    whenPaused
    onlyOwner
    external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        _cancelAuction(_tokenId, auction.seller);
    }

    /// @dev Returns auction info for an NFT on auction.
    /// @param _tokenId - ID of NFT on auction.
    function getAuction(uint256 _tokenId)
    external
    view
    returns
    (
        address seller,
        uint64 startedAt,
        uint16 durationIndex,
        uint64 auctionEndBlock,
        uint256 startingPrice
    ) {
        Auction storage auction = tokenIdToAuction[_tokenId];
        return (
        auction.seller,
        auction.startedAt,
        auction.durationIndex,
        auction.auctionEndBlock,
        auction.startingPrice
        );
    }

    function setSecondsPerBlock(uint256 secs) external onlyOwner {
        secondsPerBlock = secs;
    }

}


contract BiddingWallet is AccessControl {

    //user balance is stored in this balances map and could be withdrawn by owner at anytime
    mapping(address => uint) public EthBalances;

    // user transactions count
    mapping(address => uint) public txCount;

    ERC20 public tokens;

    //the limit of deposit and withdraw the minimum amount you can deposit is 0.05 eth
    //you also have to have at least 0.05 eth
    uint public EthLimit = 50000000000000000;

    uint256 totalEthDeposit;

    event withdrawSuccess(address receiver, uint amount);
    event cancelPendingWithdrawSuccess(address sender);

    function setSystemAddress(address _systemAddress, address _tokenAddress) internal {
        systemAddress = _systemAddress;
        tokens = ERC20(_tokenAddress);
    }

    //user will be assigned an equivalent amount of bidding credit to bid
    function depositETH() payable external {
        require(msg.value >= EthLimit);
        EthBalances[msg.sender] = EthBalances[msg.sender] + msg.value;
        totalEthDeposit = totalEthDeposit + msg.value;
    }


    function withdrawEthHashing(uint256 _amount, uint256 _txCount) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(bytes4(0x486A0E9B), _amount, _txCount));
    }

    // Withdraw all available eth back to user wallet, need co-verify
    function withdrawEth(
        uint256 _amount,
        bytes _sig
    ) external {
        require(EthBalances[msg.sender] >= _amount);

        bytes32 hashedTx = withdrawEthHashing(_amount, txCount[msg.sender] + 1);
        require(signedBySystem(hashedTx, _sig));

        EthBalances[msg.sender] = EthBalances[msg.sender] - _amount;
        totalEthDeposit = totalEthDeposit - _amount;
        msg.sender.transfer(_amount);

        txCount[msg.sender]++;
        emit withdrawSuccess(msg.sender, _amount);
    }

    event valueLogger(uint256 value);
    //bidding success tranfer eth to seller wallet
    function winBidEth(
        address winner,
        address seller,
        uint256 amount
    ) internal {
        require(EthBalances[winner] >= amount);
        seller.transfer(amount);
    }

    function() public {
        revert();
    }
}


/// @title Reverse auction modified for siring
/// @notice We omit a fallback function to prevent accidental sends to this contract.
contract BiddingClockAuction is BiddingAuction, BiddingWallet {

    // @dev Sanity check that allows us to ensure that we are pointing to the
    //  right auction in our setSiringAuctionAddress() call.
    bool public isBiddingClockAuction = true;

    // Delegate constructor
    constructor(
        address _nftAddr,
        address _tokenAddress,
        address _systemAddress,
        address _ceoAddress
    )
    public
    BiddingAuction(_nftAddr) {
        setSystemAddress(_systemAddress, _tokenAddress);
        ownerAddress = _ceoAddress;
    }


    /// @dev Creates and begins a new auction. Since this function is wrapped,
    /// require sender to be dragonCore contract.
    function createETHAuction(
        uint256 _tokenId,
        address _seller,
        uint16 _durationIndex,
        uint256 _startingPrice
    )
    external
    {
        require(msg.sender == address(nonFungibleContract));
        _escrow(_seller, _tokenId);
        uint64 auctionEndBlock = uint64((auctionDuration[_durationIndex] / secondsPerBlock) + block.number);
        Auction memory auction = Auction(
            _seller,
            _durationIndex,
            uint64(now),
            auctionEndBlock,
            _startingPrice
        );
        _addAuction(_tokenId, auction);
    }

    function auctionEthEndHashing(uint _amount,uint256 _tokenId, uint256 _txCount) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(bytes4(0x486A0F0E), _tokenId, _amount ,_txCount));
    }

    function auctionEthEnd(address winner, uint _amount, uint256 _tokenId, bytes _sig, uint256 _txCount) public onlyCEO {
        bytes32 hashedTx = auctionEthEndHashing(_amount, _tokenId ,_txCount);
        require(recover(hashedTx, _sig) == winner);
        Auction storage auction = tokenIdToAuction[_tokenId];
        uint64 endblock = auction.auctionEndBlock;
        require(endblock < block.number);
        winBidEth(winner, auction.seller, _amount);
        _removeAuction(_tokenId);
        _transfer(winner, _tokenId);

    }

    /// @dev Remove all Ether from the contract, which is the owner's cuts
    ///  as well as any Ether sent directly to the contract address.
    ///  Always transfers to the NFT contract, but can be called either by
    ///  the owner or the NFT contract.
    function withdrawBalance() external {
        address nftAddress = address(nonFungibleContract);

        require(
            msg.sender == owner ||
            msg.sender == nftAddress
        );

        nftAddress.transfer(address(this).balance - totalEthDeposit);
    }
}

/// @title all functions related to creating dragons
contract dragonMinting is dragonAuction {

    // Limits the number of cats the contract owner can ever create.
    uint256 public constant PROMO_CREATION_LIMIT = 1111;
    uint256 public constant GEN0_CREATION_LIMIT = 7777;


    // Counts the number of cats the contract owner has created.
    uint256 public promoCreatedCount;
    uint256 public gen0CreatedCount;

    /// @dev we can create promo dragons, up to a limit. Only callable by COO
    /// @param _genes the encoded genes of the dragon to be created, any value is accepted
    /// @param _owner the future owner of the created dragons. Default to contract COO
    function createPromodragon(uint256 _genes, address _owner) external onlyCEO {
        address dragonOwner = _owner;
        if (dragonOwner == address(0)) {
            dragonOwner = ownerAddress;
        }
        require(promoCreatedCount < PROMO_CREATION_LIMIT);

        promoCreatedCount++;
        _createdragon(0, 0, 0, _genes, dragonOwner, 0);
    }

    /// @dev Creates a new gen0 dragon with the given genes
    function createGen0(uint256 _genes) external onlyCEO {
        require(gen0CreatedCount < GEN0_CREATION_LIMIT);

        _createdragon(0, 0, 0, _genes, ownerAddress, 0);


        gen0CreatedCount++;
    }

    /// @dev Creates a new gen0 dragon with the given genes and
    ///  creates an auction for it.
    function createAndSaleGen0(uint256 _genes, uint256 _price) external onlyCEO {
        require(gen0CreatedCount < GEN0_CREATION_LIMIT);

        _createdragon(0, 0, 0, _genes, ownerAddress, 0);

        gen0CreatedCount++;

        createTokenSaleAuction(gen0CreatedCount,_price);
    }
}



/// @title DefilyDragons: Collectible, breedable, and oh-so-adorable cats on the Ethereum blockchain.
/// @dev The main DefilyDragons contract, keeps track of dragons so they don't wander around and get lost.
contract dragonCore is dragonMinting {

    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;

    /// @notice Creates the main DefilyDragons smart contract instance.
    constructor(
        address _ceoAddress,
        address _tokenAddress
    )
    dragonBreeding(_tokenAddress)
    public {
        // Starts paused.
        paused = true;

        // the creator of the contract is the initial CEO
        ownerAddress = _ceoAddress;

        // start with the mythical dragon 0 - so we don't have generation-0 parent issues
        _createdragon(0, 0, 0, uint256(- 1), address(0), 0);
    }

    /// @dev Used to mark the smart contract as upgraded, in case there is a serious
    ///  breaking bug. This method does nothing but keep track of the new contract and
    ///  emit a message indicating that the new address is set. It's up to clients of this
    ///  contract to update to the new contract address in that case. (This contract will
    ///  be paused indefinitely if such an upgrade takes place.)
    /// @param _v2Address new address
    function setNewAddress(address _v2Address) external onlyCEO whenPaused {
        // See README.md for updgrade plan
        newContractAddress = _v2Address;
        emit ContractUpgrade(_v2Address);
    }

    /// @notice No tipping!
    /// @dev Reject all Ether from being sent here, unless it's from one of the
    ///  two auction contracts. (Hopefully, we can prevent user accidents.)
    function() external payable {
    }

    /// @notice Returns all the relevant information about a specific dragon.
    /// @param _id The ID of the dragon of interest.
    function getdragon(uint256 _id)
    external
    view
    returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes,
        uint16 upgradeIndex,
        uint8 unicornation
    ) {
        dragon storage pon = dragons[_id];

        // if this variable is 0 then it's not gestating
        isGestating = (pon.matingWithId != 0);
        isReady = (pon.cooldownEndBlock <= block.number);
        cooldownIndex = uint256(pon.cooldownIndex);
        nextActionAt = uint256(pon.cooldownEndBlock);
        siringWithId = uint256(pon.matingWithId);
        birthTime = uint256(pon.birthTime);
        matronId = uint256(pon.matronId);
        sireId = uint256(pon.sireId);
        generation = uint256(pon.generation);
        genes = pon.genes;
        upgradeIndex = pon.txCount;
        unicornation = pon.unicornation;
    }

    /// @dev Override unpause so it requires all external contract addresses
    ///  to be set before contract can be unpaused. Also, we can't have
    ///  newContractAddress set either, because then the contract was upgraded.
    /// @notice This is public rather than external so we can call super.unpause
    ///  without using an expensive CALL.
    function unpause() public onlyCEO whenPaused {
        require(geneScience != address(0));
        require(newContractAddress == address(0));

        // Actually unpause the contract.
        super.unpause();
    }

    function withdrawBalance(address withdrawWallet) external onlyCEO {
        uint256 balance = address(this).balance;
        // Subtract all the currently pregnant dragons we have, plus 1 of margin.
        uint256 subtractFees = (pregnantdragons + 1) * autoBirthFee;

        if (balance > subtractFees) {
            withdrawWallet.transfer(balance - subtractFees);
        }
    }
}
