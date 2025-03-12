import redis from "../config/redis.config";
import { logger } from "../config/winston";

export const setCache = async (
  key: string,
  value: any,
  expiration: number = 3600
) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", expiration);
  } catch (error) {
    logger.error(`Error setting cache: ${error}`);
    throw new Error("Error setting cache");
  }
};

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Error getting cache: ${error}`);
    throw new Error("Error getting cache");
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error(`Error deleting cache: ${error}`);
    throw new Error("Error deleting cache");
  }
};
