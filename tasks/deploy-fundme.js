const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);

const { task } = require("hardhat/config");

task("deploy-fundme", "deploy and verify the fundme contract").setAction(async (taskArgs, hre) => {

    console.log("deploying the fundme contract....")

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
});

async function verifyContract(fundMeAddr, args) {
    // verify the contract 
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args
    });
    console.log("contract verified successfully")
}