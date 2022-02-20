// [address _tokenAddress, address _gateway]
type argsArray = [string, string];

const bscToken = process.env.BSC_TOKEN_ADDRESS as string;
const gatewayAddress = process.env.GATEWAY_ADDRESS as string;

export default [bscToken, gatewayAddress] as argsArray;
