pragma solidity >=0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

    constructor() ERC721("StarNotaryMem", "MYSTNT") { }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    
    

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }


    // // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        //https://docs.soliditylang.org/en/latest/types.html?highlight=address%20initial#address
        //https://ethereum.stackexchange.com/questions/66415/convert-contract-to-payable-address/97123
           // https://www.reddit.com/r/ethdev/comments/qike3a/cant_compile_truffle_project_that_imports/
        return payable(address(uint160(x)));
        //return payable(uint160(x));
        
    }

    //     // Function that allows you to convert an address into a payable address
    // function _make_payable(address x) internal pure returns (address payable) {
    //     //https://docs.soliditylang.org/en/latest/types.html?highlight=address%20initial#address
    //     //https://ethereum.stackexchange.com/questions/66415/convert-contract-to-payable-address/97123
    //     //return address(uint160(x));
    //     return address(uint160(x));
    // }

    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        transferFrom(ownerAddress, msg.sender, _tokenId);
        //_transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        address payable newOwnerAddressPayable = _make_payable(msg.sender);
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            newOwnerAddressPayable.transfer(msg.value - starCost);
        }
    }

}