// [address _tokenAddress, address _gateway]
type argsArray = [string, string];

const ethToken = process.env.ETH_TOKEN_ADDRESS as string;
const gatewayAddress = process.env.GATEWAY_ADDRESS as string;

export default [ethToken, gatewayAddress] as argsArray;
