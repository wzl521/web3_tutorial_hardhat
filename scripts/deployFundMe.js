const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);

// import the ethers from hardhat
const { ethers } = require("hardhat");
console.log("Deploying FundMe...")
// write a main function
async function main() {
    // create an factory for the contract
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    // deploy the contract
    const fundMe = await fundMeFactory.deploy(400);
    // wait for the deployment to finish
    await fundMe.waitForDeployment();
    console.log(`contract fundMe is deployed successfully at address ${fundMe.target}`);

    // verify the contract 
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        // wait for 5 blocks to be mined
        await fundMe.deploymentTransaction().wait(5);
        console.log("waiting for 5 block confirmations")
        await verifyContract(fundMe.target, [400]);
    } else {
        console.log("verification skipped....")
    }

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();
    //fund contract with first account
    const fundTx = await fundMe.fund({ value: ethers.parseEther("0.001") })
    await fundTx.wait();

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log(`balance of contract is ${balanceOfContract}`)

    // fund contract with second account
    const fundTx2 = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.001") })
    await fundTx2.wait();

    // check balance of contract
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target);
    console.log(`balance of contract is ${balanceOfContractAfterSecondFund}`)

    // check mapping
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address);
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address);
    console.log(`Balance of first accont $(firstAccount.address) in FundMe is $(firstAccountBalanceInFundMe)`);
    console.log(`Balance of second accont $(secondAccount.address) in FundMe is $(secondAccountBalanceInFundMe)`);


}

async function verifyContract(fundMeAddr, args) {
    // verify the contract 
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args
    });
}

main().then().catch((error) => {
    console.log(`error is ${error}`)
    process.exit(1)
})