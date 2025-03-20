import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://redis:6379",
});

redisClient.on("error", (err) => console.log("Redis client error:", err));
redisClient.on("connect", () =>
  console.log("Connection to Redis server established")
);
