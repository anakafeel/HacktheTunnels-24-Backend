import { NextFunction, Request, Response } from "express";
import cors from 'cors';

// CORS middleware
export const corsMiddleware = cors({
  origin: [
    'http://localhost:5175',
    'https://hackthe-tunnels-24.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export function notFound(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  response.status(404);
  const error = new Error(`🔍 - Not Found - ${request.originalUrl}`);
  next(error);
}

export function errorHandler(
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction,
) {
  const statusCode = response.statusCode !== 200 ? response.statusCode : 500;
  response.status(statusCode);
  response.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🛠️" : error.stack,
  });
}
