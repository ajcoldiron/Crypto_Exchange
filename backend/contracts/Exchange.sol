//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint public feePercent;
    uint public orderCount;

    mapping(address => mapping(address => uint)) public tokens;
    mapping(uint => _Order) public orders;
    mapping(uint => bool) public cancelledOrders;
    mapping(uint => bool) public filledOrders;

    event Deposit(
        address user,
        address token,
        uint amount,
        uint balance
    );

    event Withdraw(
        address user,
        address token,
        uint amount,
        uint balance
    );

    event Order(
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timestamp
    );

    event Cancel(
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timestamp
    );

    event Trade(
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        address creator,
        uint timestamp
    );

    struct _Order{
        uint id;
        address user;
        address tokenGet;
        uint amountGet;
        address tokenGive;
        uint amountGive;
        uint timestamp;
    }

    constructor(address _feeAccount, uint _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function balanceOf(address _token, address _user) public view returns(uint success) {
        return (tokens[_token][_user]);
    }

    function depositTokens(address _token, uint _amount) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));

        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

        emit Deposit(msg.sender, _token, _amount, tokens[_token][msg.sender]);
    }

    function withdrawTokens(address _token, uint _amount) public {
        require(tokens[_token][msg.sender] >= _amount);
        
        Token(_token).transfer(msg.sender, _amount);
        
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        emit Withdraw(msg.sender, _token, _amount, tokens[_token][msg.sender]);
    }

    function makeOrder(
        address _tokenGet, 
        uint _amountGet, 
        address _tokenGive, 
        uint _amountGive) public {
            require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

            orderCount++;
            orders[orderCount] = _Order(
                orderCount,
                msg.sender,
                _tokenGet,
                _amountGet,
                _tokenGive,
                _amountGive,
                block.timestamp
            );

            emit Order(
                orderCount,
                msg.sender,
                _tokenGet,
                _amountGet,
                _tokenGive,
                _amountGive,
                block.timestamp
            );
    }

    function cancelOrder(uint _id) public {
        _Order storage order = orders[_id];
        require(_id == order.id);
        require(order.user == msg.sender);
        require(!cancelledOrders[_id]);

        emit Cancel(
            order.id, 
            msg.sender, 
            order.tokenGet, 
            order.amountGet,
            order.tokenGive,
            order.amountGive,
            block.timestamp
        );

        cancelledOrders[_id] = true;
    }

    function fillOrder(uint _id) public {
        _Order storage order = orders[_id];
        require(_id > 0 && _id <= orderCount);
        require(!cancelledOrders[_id]);
        require(!filledOrders[_id]);

        _trade(
            order.id, 
            order.user, 
            order.tokenGet, 
            order.amountGet, 
            order.tokenGive, 
            order.amountGive
        );
        filledOrders[_id] = true;
    }

    function _trade(
        uint _orderId, 
        address _creator, 
        address _tokenGet, 
        uint _amountGet,
        address _tokenGive,
        uint _amountGive) internal {

        uint feeAmount = (feePercent * _amountGet) / 100;
        
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] - (_amountGet + feeAmount);
        tokens[_tokenGet][_creator] = tokens[_tokenGet][_creator] + _amountGet;

        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;
        tokens[_tokenGive][_creator] = tokens[_tokenGive][_creator] - _amountGive;

        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + feeAmount;

        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _creator,
            block.timestamp
        );
    }
}
