import Redis from "ioredis";

import { env } from "./env";

const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  password: undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error: ", err));

export default redis;
