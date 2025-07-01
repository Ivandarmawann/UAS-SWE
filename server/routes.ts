import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application uses Google Apps Script as the backend API
  // All API calls are made directly from the frontend to the Google Apps Script endpoint
  // No server-side routes are needed for this implementation
  
  const httpServer = createServer(app);

  return httpServer;
}
