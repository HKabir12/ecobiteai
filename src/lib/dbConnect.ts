"use server";

import { MongoClient, ServerApiVersion, Db } from "mongodb";

let cachedClient: MongoClient | null = null;

export async function dbConnect(): Promise<Db> {
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
  const dbName = process.env.DB_NAME;

  if (!uri || !dbName) {
    throw new Error("Missing MongoDB environment variables.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
    });

    await cachedClient.connect();
  }

  return cachedClient.db(dbName); // return DB
}

export default dbConnect;
