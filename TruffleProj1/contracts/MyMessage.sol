// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Message {
    string myMessage;

    // constructor() public {
    //     value = "someValue";
    // }

    function getMessage() public view returns (string memory) {
        return myMessage;
    }

    function setMessage(string memory _value) public {
        myMessage = _value;
    }


}