require("dotenv").config();
const { AptosClient, TxnBuilderTypes, BCS } = require("aptos");

async function initializeModule() {
  if (!process.env.VITE_MODULE_ADDRESS) {
    throw new Error(
      "VITE_MODULE_ADDRESS variable is not set. Make sure you have deployed the module before initializing it.",
    );
  }

  const client = new AptosClient(process.env.VITE_APP_NETWORK);

  // Correct module ID
  const functionName = `${process.env.VITE_MODULE_ADDRESS}::stake_contract::initialize`;

  const sender = TxnBuilderTypes.AccountAddress.fromHex(process.env.VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS);

  // Create transaction payload
  const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
    TxnBuilderTypes.EntryFunction.natural(
      functionName,
      [], // Add type arguments if needed
      [], // Add function arguments if needed
    ),
  );

  try {
    // Generate transaction
    const rawTxn = await client.generateTransaction(sender, payload, {
      maxGasAmount: 2000,
      gasUnitPrice: 1,
    });

    // Sign transaction
    const privateKey = BCS.PrivateKey.fromHex(process.env.VITE_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY);
    const signedTxn = await client.signTransaction(rawTxn, privateKey);

    // Submit transaction
    const txnResult = await client.submitTransaction(signedTxn);

    console.log("Transaction submitted. Awaiting confirmation...");
    await client.waitForTransaction(txnResult.hash);

    console.log(`Initialization completed successfully. Txn hash: ${txnResult.hash}`);
  } catch (error) {
    console.error("Error during initialization:", error.message);
  }
}

initializeModule().catch((err) => {
  console.error("Initialization failed:", err.message);
});
