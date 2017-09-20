
var gasAmount = 2000000;

var CBToken = artifacts.require("./CBToken.sol");

// Test investments
contract('CBToken fund integration test', function (accounts) {
    // Owner of the contract
    var owner = accounts[0];
    var company = accounts[1];
    var partners = accounts[2];
    var remaining = accounts[3];
    var token;


    //test sale 
    it("start sale", async function () {

        token = await CBToken.deployed();

        var totalSupply = await token.totalSupply()
        assert.equal(totalSupply.toNumber(), 1000000000, "not correct");

        var balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 1000000000, "not correct");

        var balanceOf4 = await token.balanceOf(accounts[4]);
        assert.equal(balanceOf4.toNumber(), 0, "not correct");

        await token.transfer(accounts[4], 20000000, { from: company });

        balanceOf4 = await token.balanceOf(accounts[4]);
        assert.equal(balanceOf4.toNumber(), 20000000, "not correct");

        balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 980000000, "not correct");

        await token.transfer(accounts[5], 12000000, { from: company });

        var balanceOf5 = await token.balanceOf(accounts[5]);
        assert.equal(balanceOf5.toNumber(), 12000000, "not correct");

        balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 968000000, "not correct");

        await token.transfer(accounts[6], 23000000, { from: company });

        var balanceOf6 = await token.balanceOf(accounts[6]);
        assert.equal(balanceOf6.toNumber(), 23000000, "not correct");

        balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 945000000, "not correct");

        await token.transfer(accounts[4], 17000000, { from: company });

        balanceOf4 = await token.balanceOf(accounts[4]);
        assert.equal(balanceOf4.toNumber(), 37000000, "not correct");

        balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 928000000, "not correct");

        await token.transfer(accounts[5], 6128479, { from: company });

        balanceOf5 = await token.balanceOf(accounts[5]);
        assert.equal(balanceOf5.toNumber(), 18128479, "not correct");

        balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 921871521, "not correct");

        await token.transfer(accounts[6], 84596321, { from: company });

        balanceOf6 = await token.balanceOf(accounts[6]);
        assert.equal(balanceOf6.toNumber(), 107596321, "not correct");

        balanceOfCompany = await token.balanceOf(accounts[1]);
        assert.equal(balanceOfCompany.toNumber(), 837275200, "not correct");
    });


    //end and finailizer 
    it("check transfer", async function () {

        try {
            await token.transfer(accounts[7], 100000, { from: accounts[2] });
            assert.fail('should have thrown before');
        } catch (error) {
            assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
        }

        try {
            await token.transfer(accounts[7], 100000, { from: accounts[0] });
            assert.fail('should have thrown before');
        } catch (error) {

            assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
        }

        var balanceOf7 = await token.balanceOf(accounts[7]);
        assert.equal(balanceOf7.toNumber(), 0, "not corect amount");

        await token.transfer(accounts[7], 1000000, { from: accounts[4] });
        await token.transfer(accounts[8], 10000000, { from: accounts[4] });
        await token.transfer(accounts[7], 10000000, { from: accounts[5] });

        balanceOf7 = await token.balanceOf(accounts[7]);
        var balanceOf5 = await token.balanceOf(accounts[5]);
        var balanceOf4 = await token.balanceOf(accounts[4]);
        var balanceOf8 = await token.balanceOf(accounts[8]);

        assert.equal(balanceOf7.toNumber(), 11000000, "not corect amount");
        assert.equal(balanceOf8.toNumber(), 10000000, "not corect amount");
        assert.equal(balanceOf5.toNumber(), 8128479, "not corect amount");
        assert.equal(balanceOf4.toNumber(), 26000000, "not corect amount");

        await token.transfer(accounts[7], 10000000, { from: accounts[8] });

        balanceOf8 = await token.balanceOf(accounts[8]);
        balanceOf7 = await token.balanceOf(accounts[7]);

        assert.equal(balanceOf7.toNumber(), 21000000, "not corect amount");
        assert.equal(balanceOf8.toNumber(), 0, "not corect amount");

        try {
            await token.transfer(accounts[7], 100000, { from: accounts[8] });
            assert.fail('should have thrown before');
        } catch (error) {

            assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
        }
    });


    //allowence
    it("check allowence", async function () {

        try {
            await token.transferFrom(accounts[7], accounts[8], 100000, { from: accounts[6] });
            assert.fail('should have thrown before');
        } catch (error) {

            assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
        }



        await token.approve(accounts[6], 10000000, { from: accounts[7] });
        await token.approve(accounts[5], 10000000, { from: accounts[7] });


        try {
            await token.transferFrom(accounts[7], accounts[8], 10000001, { from: accounts[6] });
            assert.fail('should have thrown before');
        } catch (error) {

            assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcodeerror must be returned');
        }

        token.transferFrom(accounts[7], accounts[8], 10000000, { from: accounts[6] });
        var balanceOf7 = await token.balanceOf(accounts[7]);
        assert.equal(balanceOf7.toNumber(), 11000000, "not corect amount");
        var balanceOf8 = await token.balanceOf(accounts[8]);
        assert.equal(balanceOf8.toNumber(), 10000000, "not corect amount");

        token.transferFrom(accounts[7], accounts[9], 3000000, { from: accounts[5] });
        balanceOf7 = await token.balanceOf(accounts[7]);
        assert.equal(balanceOf7.toNumber(), 8000000, "not corect amount");
        var balanceOf9 = await token.balanceOf(accounts[9]);
        assert.equal(balanceOf9.toNumber(), 3000000, "not corect amount");

    });
});