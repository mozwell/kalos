import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Kalos } from "../typechain";

describe("Kalos", () => {
  async function deployCommonFixture() {
    const Contract = await ethers.getContractFactory("Kalos");
    const [deployer, account1, account2] = await ethers.getSigners();
    const contractInstance = await Contract.deploy();
    await contractInstance.deployed();
    return { contractInstance, deployer, account1, account2 };
  }

  describe("constructor", () => {
    it("should set deployer state variable correctly", async () => {
      const { contractInstance, deployer } = await loadFixture(deployCommonFixture);
      expect(await contractInstance.deployer()).to.be.equal(deployer.address);
    })
  });

  describe("mint", () => {
    it("should failed minting for a specific account if there is no personal empty slot", async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address

      await expect(contractInstance.tokenURI(0)).to.be.revertedWith('ERC721: invalid token ID');
      expect(await contractInstance.totalArtworks()).to.be.equal(0);
      await expect(contractInstance.mint('AAA', addr1)).to.emit(contractInstance, 'Mint').withArgs(deployer.address, addr1, 0, 'AAA')
      expect(await contractInstance.tokenURI(0)).to.be.equal('AAA');
      expect(await contractInstance.totalArtworks()).to.be.equal(1);
      await expect(contractInstance.mint('BBB', addr1)).to.emit(contractInstance, 'Mint').withArgs(deployer.address, addr1, 1, 'BBB')
      expect(await contractInstance.tokenURI(1)).to.be.equal('BBB');
      expect(await contractInstance.totalArtworks()).to.be.equal(2);
      await expect(contractInstance.mint('CCC', addr1)).to.emit(contractInstance, 'Mint').withArgs(deployer.address, addr1, 2, 'CCC')
      expect(await contractInstance.tokenURI(2)).to.be.equal('CCC');
      expect(await contractInstance.totalArtworks()).to.be.equal(3);
      await expect(contractInstance.mint('DDD', addr1)).to.be.revertedWith('No empty slot for the receiver');
      expect(await contractInstance.totalArtworks()).to.be.equal(3);
    })
  })

  describe("destroy", () => {
    it("should failed destroying if the artwork does not belong to the caller", async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;

      await contractInstance.mint('AAA', addr1);
      await expect(contractInstance.destroy(0)).to.be.revertedWith('the caller is not owner of the artwork');
      expect(await contractInstance.tokenURI(0)).to.be.equal('AAA');
      expect(await contractInstance.totalArtworks()).to.be.equal(1);
      expect(await contractInstance.totalActiveArtworks()).to.be.equal(1);
      await expect(contractInstance.connect(account1).destroy(0)).to.emit(contractInstance, 'Destroy').withArgs(addr1, 0, 'AAA')
      await expect(contractInstance.tokenURI(0)).to.be.revertedWith('ERC721: invalid token ID');
      expect(await contractInstance.totalArtworks()).to.be.equal(1);
      expect(await contractInstance.totalActiveArtworks()).to.be.equal(0);
    })

    it('should revert if the target artwork ID does not exist', async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      await expect(contractInstance.connect(account1).destroy(3)).to.be.revertedWith('ERC721: invalid token ID');
    })

    it('should withdraw tip before the artwork gets destroyed', async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      await contractInstance.mint('AAA', addr1);
      contractInstance.tip(0, { value: 100 });
      expect(await contractInstance.tipBalances(0)).to.be.equal(100);
      await expect(contractInstance.connect(account1).destroy(0)).to.changeEtherBalances([contractInstance, account1], [-100, 100])
    })
  })

  describe("transfer", () => {
    it("should not transfer to itself", async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      const deployerAddr = deployer.address;

      await contractInstance.mint('AAA', deployerAddr);
      await expect(contractInstance.transfer(0, deployerAddr)).to.be.revertedWith('The transferee cannot be the same as transferor');
      await expect(contractInstance.transfer(0, addr1)).to.emit(contractInstance, 'TransferArtwork').withArgs(deployerAddr, addr1, 0, 'AAA');
    })

    it("should not transfer to someone who does not have empty slot", async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      const deployerAddr = deployer.address;

      await contractInstance.mint('AAA', deployerAddr);
      await expect(contractInstance.transfer(0, addr1)).to.emit(contractInstance, 'TransferArtwork').withArgs(deployerAddr, addr1, 0, 'AAA');
      await contractInstance.mint('BBB', deployerAddr);
      await expect(contractInstance.transfer(1, addr1)).to.emit(contractInstance, 'TransferArtwork').withArgs(deployerAddr, addr1, 1, 'BBB');
      await contractInstance.mint('CCC', deployerAddr);
      await expect(contractInstance.transfer(2, addr1)).to.emit(contractInstance, 'TransferArtwork').withArgs(deployerAddr, addr1, 2, 'CCC');
      await contractInstance.mint('DDD', deployerAddr);
      await expect(contractInstance.transfer(3, addr1)).to.be.revertedWith('No empty slot for the receiver');
    })
  })

  describe("tip", () => {
    it('should revert if the tip amount is 0', async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      await contractInstance.mint('AAA', addr1);
      await expect(contractInstance.tip(0, {value: 0})).to.be.revertedWith('the tip amount should not be 0');
    })

    it('should revert if tip on some non-existing artwork', async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      await expect(contractInstance.tip(0, {value: 100})).to.be.revertedWith('ERC721: invalid token ID');
    })

    it('should calculate tip balance correctly and emit event if succeeds ', async () => {
      const { contractInstance, deployer, account1 } = await loadFixture(deployCommonFixture);
      const addr1 = account1.address;
      const deployerAddr = deployer.address;
      await contractInstance.mint('AAA', addr1);
      expect(await contractInstance.tipBalances(0)).to.be.equal(0);
      await expect(contractInstance.tip(0, {value: 100})).to.emit(contractInstance, 'Tip').withArgs(deployerAddr, 0, 'AAA', 100);
      expect(await contractInstance.tipBalances(0)).to.be.equal(100);
    })
  })

  describe("withdraw", () => {
    let contractInstance: Kalos;
    let deployer: any;
    let account1: any;

    async function mintAndTipOne() {
      const loadResult = await loadFixture(deployCommonFixture);
      contractInstance = loadResult.contractInstance;
      deployer = loadResult.deployer;
      account1 = loadResult.account1;
      const addr1 = account1.address;
      await contractInstance.mint('AAA', addr1);
      await contractInstance.tip(0, {value: 100});
    }

    beforeEach(async () => {
      await mintAndTipOne();
    })

    it('should revert if the caller is not the owner of artwork', async () => {
      await expect(contractInstance["withdraw(uint256)"](0)).to.be.revertedWith('the caller is not owner of the artwork');
      await expect(contractInstance.connect(account1)["withdraw(uint256)"](0)).to.not.be.reverted;
    })

    it('should revert if the target artwork has no tip balance', async () => {
      const addr1 = account1.address;
      await contractInstance.mint('BBB', addr1);
      expect(await contractInstance.tipBalances(1)).to.be.equal(0);
      await expect(contractInstance.connect(account1)["withdraw(uint256)"](1)).to.be.revertedWith('No tip balance exists for the artwork');
    })

    it('should revert if the amount of withdrawal is more than the tip balance', async () => {
      const addr1 = account1.address;
      expect(await contractInstance.tipBalances(0)).to.be.equal(100);
      await expect(contractInstance.connect(account1)["withdraw(uint256,uint256)"](0, 200)).to.be.revertedWith('the amount to withdraw exceeds the tip balance');
    })

    it('should withdraw all of tip balance if no amount is passed', async () => {
      const addr1 = account1.address;
      expect(await contractInstance.tipBalances(0)).to.be.equal(100);
      await expect(contractInstance.connect(account1)["withdraw(uint256)"](0)).to.emit(contractInstance, 'Withdraw').withArgs(addr1, 0, 'AAA', 100);
      expect(await contractInstance.tipBalances(0)).to.be.equal(0);
    })

    it('should withdraw a portion of tip balance according to the amount passed', async () => {
      const addr1 = account1.address;
      expect(await contractInstance.tipBalances(0)).to.be.equal(100);
      await expect(contractInstance.connect(account1)["withdraw(uint256,uint256)"](0, 40)).to.emit(contractInstance, 'Withdraw').withArgs(addr1, 0, 'AAA', 40);
      expect(await contractInstance.tipBalances(0)).to.be.equal(60);
    })
  })
});
