import { Response } from "express";

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data?: T;
  [key: string]: unknown;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: unknown;
  [key: string]: unknown;
}

export const sendSuccess = (
  res: Response,
  status: number,
  message: string,
  extra?: Record<string, unknown>
): void => {
  const payload: ApiSuccess = {
    success: true,
    message,
    ...(extra || {}),
  };
  res.status(status).json(payload);
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  options?: { error?: string; errors?: unknown; extra?: Record<string, unknown> }
): void => {
  const payload: ApiError = {
    success: false,
    message,
    ...(options?.error ? { error: options.error } : {}),
    ...(options?.errors ? { errors: options.errors } : {}),
    ...(options?.extra || {}),
  };
  res.status(status).json(payload);
};
