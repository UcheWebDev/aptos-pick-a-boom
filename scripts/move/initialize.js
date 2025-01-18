require("dotenv").config();
const { AptosClient, AptosAccount, HexString } = require("aptos");

async function initializeModule() {
    const nodeUrl = "https://api.devnet.aptoslabs.com/v1";
    const client = new AptosClient(nodeUrl);

    try {
        console.log("Starting module initialization on devnet...");
        const moduleAddress = process.env.VITE_MODULE_ADDRESS;
        const publisherAddressFromEnv = process.env.VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS;
        const privateKey = process.env.VITE_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY;

        console.log("Module Address:", moduleAddress);
        console.log("Publisher Address (from .env):", publisherAddressFromEnv);

        // Parse the private key and derive the account
        const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();
        const publisherAccount = new AptosAccount(privateKeyBytes);
        const publisherAddressFromKey = publisherAccount.address().hex();

        console.log("Calculated Publisher Address (from private key):", publisherAddressFromKey);

        // Check if addresses match
        if (moduleAddress !== publisherAddressFromKey) {
            throw new Error(
                `Signer address mismatch: The private key does not match the module address.\nExpected: ${moduleAddress}\nGot: ${publisherAddressFromKey}`
            );
        }

        const payload = {
            function: `${moduleAddress}::stake_contract::initialize`,
            type_arguments: [],
            arguments: [],
        };

        console.log("Generating transaction...");
        const rawTxn = await client.generateTransaction(publisherAddressFromKey, payload);

        console.log("Signing transaction...");
        const bcsTxn = await client.signTransaction(publisherAccount, rawTxn);

        console.log("Submitting transaction...");
        const transactionRes = await client.submitTransaction(bcsTxn);

        console.log("Waiting for transaction confirmation...");
        console.log("Transaction hash:", transactionRes.hash);

        const result = await client.waitForTransactionWithResult(transactionRes.hash, {
            timeoutSecs: 30,
            checkSuccess: true,
        });

        console.log("\nTransaction Results:");
        console.log("-------------------");
        console.log("Status:", result.success ? "SUCCESS" : "FAILED");
        console.log("Version:", result.version);
        console.log("Gas used:", result.gas_used);
        if (result.vm_status) {
            console.log("VM Status:", result.vm_status);
        }

        if (!result.success) {
            throw new Error(`Transaction failed: ${result.vm_status}`);
        }

        console.log("\nModule initialization completed successfully!");
        return result;
    } catch (error) {
        console.error("\nError Details:");
        console.error("---------------");
        console.error("Message:", error.message);
        if (error.response?.data) {
            console.error("API Error:", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

// Run initialization
initializeModule()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error("\nInitialization failed!");
        console.error(error.message);
        process.exit(1);
    });
