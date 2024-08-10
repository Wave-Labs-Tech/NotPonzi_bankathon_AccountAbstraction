import Web3 from "web3";

export function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
  console.log(...args);
}

export const signMessage = async (message: string, provider: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      message,
      fromAddress,
      "test password!" // configure your own password here.
    );
    // uiConsole(signedMessage);

    if (!signedMessage) {
      throw new Error("Failed to sign message");
    }

    return signedMessage;
  };
