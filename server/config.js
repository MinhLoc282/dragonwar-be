/**
 * The config for server
 */

export const SERVER_PORT = process.env.PORT;
export const UPLOAD_GET_HOST = process.env.UPLOAD_GET_HOST;
let serverOrigin = process.env.SERVER_ORIGIN || '*';
try {
  serverOrigin = JSON.parse(serverOrigin);
} catch (e) {
  console.log(`Server Origin is ${serverOrigin}`);
}
export const CORS_OPTIONS = {
  // Find and fill your options here: https://github.com/expressjs/cors#configuration-options
  origin: serverOrigin,
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Accept-Language,wallet',
};
export const ENVIRONMENT_LAUNCH = process.env.ENVIRONMENT_LAUNCH;
export const API_DOCS_HOST = process.env.API_DOCS_HOST;
export const KAI_RPC_ENDPOINT = process.env.KAI_RPC_ENDPOINT;
export const KAI_TIME_BLOCK = process.env.KAI_TIME_BLOCK;
export const KAI_WS_ENDPOINT = process.env.KAI_WS_ENDPOINT;
export const KAI_PRIVATE_KEY = `0x${process.env.KAI_PRIVATE_KEY}`;
export const KAI_CONTRACT_DRAGON = process.env.KAI_CONTRACT_DRAGON;
export const KAI_CONTRACT_SALECA = process.env.KAI_CONTRACT_SALECA;
export const KAI_CONTRACT_SIRING = process.env.KAI_CONTRACT_SIRING;
export const KAI_CONTRACT_BIDING = process.env.KAI_CONTRACT_BIDING;
export const KAI_CONTRACT_TRAINING = process.env.KAI_CONTRACT_TRAINING;
export const KAI_ADDRESS_DEV = process.env.KAI_ADDRESS_DEV;
export const KAI_CONTRACT_EVENT = process.env.KAI_CONTRACT_EVENT;
export const DRAGON_TICKET = process.env.DRAGON_TICKET;
export const DRAGON_TICKET_PVP = process.env.DRAGON_TICKET_PVP;
export const DRAGON_TOKEN_ADDRESS = process.env.DRAGON_TOKEN_ADDRESS;
export const EXPERIENCE_ADDRESS = process.env.EXPERIENCE_ADDRESS;
export const EQUIPMENT_ADDRESS = process.env.EQUIPMENT_ADDRESS;
export const SKILLS_ADDRESS = process.env.SKILLS_ADDRESS;
export const WEARABLE_EQUIPMENT_ADDRESS = process.env.WEARABLE_EQUIPMENT_ADDRESS;
export const WEARABLE_SKILL_ADDRESS = process.env.WEARABLE_SKILL_ADDRESS;
export const MARKETPLACE_NFT_ADDRESS = process.env.MARKETPLACE_NFT_ADDRESS;
export const MULTICALL_ADDRESS = process.env.MULTICALL_ADDRESS;
export const PRIVATE_KEY_OWNER_NFT = process.env.PRIVATE_KEY_OWNER_NFT;
export const PUBLIC_KEY_OWNER_NFT = process.env.PUBLIC_KEY_OWNER_NFT;
export const USE_EXPRESS_HOST_STATIC_FILE = process.env.USE_EXPRESS_HOST_STATIC_FILE === 'true';

export const BCRYPT_SALT_ROUNDS = 12;
export const MONGO_URI = process.env.MONGO_URI;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const RABBITMQ_URI = process.env.RABBITMQ_URI;
export const RABBITMQ_PREFIX = process.env.RABBITMQ_PREFIX; // Use to prevent queue name duplicated
export const USER_JWT_SECRET_KEY = process.env.USER_JWT_SECRET_KEY;
export const USER_JWT_DEFAULT_EXPIRE_DURATION = '10d';

//AWS S3

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const BUCKET_NAME = process.env.BUCKET_NAME;
export const FILE_KEY = process.env.FILE_KEY;
// Pinata

// API Key: 2d48009da7ec385a6f2a
// API Secret: 822d9ca13b78559932077515778963e2141300317d73350c420691f59f2cbf6b
// JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYmNiNmYwNC0zMTg2LTRiY2UtOWVhOC0zODRkNTdhNzUxYjgiLCJlbWFpbCI6InBuZ29jdGhhbjE5ODhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJkNDgwMDlkYTdlYzM4NWE2ZjJhIiwic2NvcGVkS2V5U2VjcmV0IjoiODIyZDljYTEzYjc4NTU5OTMyMDc3NTE1Nzc4OTYzZTIxNDEzMDAzMTdkNzMzNTBjNDIwNjkxZjU5ZjJjYmY2YiIsImlhdCI6MTYzMTIwNzMwNH0.TZu0rlsBzewes3Ns_SeCwzYHDFV_wk4xqTHPPwYBpbM
