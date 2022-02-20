// [string name, string symbol, address _bridgeAddress]
type argsArray = [string, string, string];

const ethBridge = process.env.ETH_BRIDGE_ADDRESS as string;

export default ["JumperEth", "JETH", ethBridge] as argsArray;
