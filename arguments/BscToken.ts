// [string name, string symbol, address _bridgeAddress]
type argsArray = [string, string, string];

const bscBridge = process.env.BSC_BRIDGE_ADDRESS as string;

export default ["JumperBsc", "JBSC", bscBridge] as argsArray;
