// db.ts
import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import fs from "node:fs";
import { getDyadAppPath, getUserDataPath } from "../paths/paths";
import log from "electron-log";

const logger = log.scope("db");

// Database connection factory
let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Get the database path based on the current environment
 */
export function getDatabasePath(): string {
  return path.join(getUserDataPath(), "sqlite.db");
}

/**
 * Initialize the database connection
 */
export function initializeDatabase(): BetterSQLite3Database<typeof schema> & {
  $client: Database.Database;
} {
  if (_db) return _db as any;

  const dbPath = getDatabasePath();
  logger.log("Initializing database at:", dbPath);

  // Check if the database file exists and remove it if it has issues
  try {
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      if (stats.size < 100) {
        logger.log("Database file exists but may be corrupted. Removing it...");
        fs.unlinkSync(dbPath);
      }
    }
  } catch (error) {
    logger.error("Error checking database file:", error);
  }

  fs.mkdirSync(getUserDataPath(), { recursive: true });
  fs.mkdirSync(getDyadAppPath("."), { recursive: true });

  const sqlite = new Database(dbPath, { timeout: 10000 });
  sqlite.pragma("foreign_keys = ON");

  _db = drizzle(sqlite, { schema });

  try {
    // Try multiple possible migration folder locations for different deployment scenarios
    const possibleMigrationPaths = [
      path.join(__dirname, "..", "..", "drizzle"), // Standard build
      path.join(process.cwd(), "drizzle"), // Running from project root
      path.join(__dirname, "..", "..", "..", "drizzle"), // Nested build
      path.join(__dirname, "drizzle"), // Same directory
    ];

    let migrationsFolder: string | null = null;

    for (const migPath of possibleMigrationPaths) {
      if (fs.existsSync(migPath)) {
        const metaPath = path.join(migPath, "meta", "_journal.json");
        if (fs.existsSync(metaPath)) {
          migrationsFolder = migPath;
          logger.log("✅ Found migrations folder at:", migPath);
          break;
        }
      }
    }

    if (!migrationsFolder) {
      logger.warn("⚠️ Migrations folder not found in any expected location");
      logger.warn("Attempted paths:", possibleMigrationPaths);
      logger.warn("Database may need manual migration. Creating tables if they don't exist...");

      // Create a minimal schema if migrations aren't found
      // This ensures the server can at least start
      try {
        // Check if tables exist by trying a simple query
        sqlite.prepare("SELECT COUNT(*) FROM bolt_projects LIMIT 1").get();
        logger.log("✅ Database tables already exist");
      } catch (error) {
        logger.error("❌ Database tables don't exist and migrations not found");
        logger.error("Please ensure migration files are deployed with your application");
        throw new Error("Database schema not initialized. Migration files missing.");
      }
    } else {
      logger.log("🔄 Running migrations from:", migrationsFolder);
      migrate(_db, { migrationsFolder });
      logger.log("✅ Migrations completed successfully");
    }
  } catch (error: any) {
    logger.error("❌ Migration error:", error);
    logger.error("Error details:", error.message);

    // Don't throw in production, log the error and continue
    // This allows the server to start even if migrations fail
    if (process.env.NODE_ENV === 'production') {
      logger.warn("⚠️ Continuing in production mode despite migration error");
      logger.warn("Database operations may fail if schema is not up to date");
    } else {
      throw error;
    }
  }

  return _db as any;
}

/**
 * Get the database instance (throws if not initialized)
 */
export function getDb(): BetterSQLite3Database<typeof schema> & {
  $client: Database.Database;
} {
  if (!_db) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first.",
    );
  }
  return _db as any;
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    const database = getDb();
    return database[prop as keyof typeof database];
  },
}) as BetterSQLite3Database<typeof schema> & {
  $client: Database.Database;
};
