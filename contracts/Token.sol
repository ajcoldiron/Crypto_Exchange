//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint public totalSupply;
    uint public decimals = 18;

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(
        address from,
        address to,
        uint amount
    );

    event Approval(
        address from,
        address to,
        uint amount
    );

    constructor(string memory _name, string memory _symbol, uint _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = totalSupply * (10 ** decimals);
    }

    function transfer(address _to, uint _amount) public returns (bool success) {
        require(balanceOf[msg.sender] >= _amount);

        _transfer(msg.sender, _to, _amount);

        return true;
    }

    function approve(address _spender, uint _amount) public returns (bool success) {
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);

        return true;
    }

    function transferFrom(address _from, address _to, uint _amount) public returns (bool success) {
        require(balanceOf[_from] >= _amount, "Not enough funds");
        require(allowance[_from][msg.sender] >= _amount, "Not enough allowance");

        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _amount;
        _transfer(_from, _to, _amount);

        return true;
    }

    function _transfer(address _from, address _to, uint _amount) internal returns (bool success) {
        require(_to != address(0));

        balanceOf[_from] = balanceOf[_from] - _amount;
        balanceOf[_to] = balanceOf[_to] + _amount;

        emit Transfer(_from, _to, _amount);

        return true;
    }

}
