import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Define MONGODB_URI in .env.local");
}

// Tell TypeScript that `global` can carry our cache
declare global {
  var mongooseCache: {
    conn: Mongoose | null;
    // This promise returns a Mongoose connection instance.
    promise: Promise<Mongoose> | null;
  };
}

// In dev, hot-reload destroys module scope but NOT global —
// so we attach the cache there to survive reloads
let cached = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<Mongoose> {
  // Already connected — return immediately
  if (cached.conn) return cached.conn;

  // Connection in progress — wait for it instead of creating another
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}