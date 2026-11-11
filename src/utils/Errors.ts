import mongoose from "mongoose";
import { Response } from "express";

export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}
export class ValidationError extends Error {}

export function rethrowAsValidationError(err: unknown): never {
    if(err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(err.message);
    }
    throw err;
}

export function sendError(res: Response, err: unknown): void {
    if(err instanceof NotFoundError) {
        res.status(404).json({ Error: err.message });
    } else if(err instanceof ForbiddenError) {
        res.status(403).json({ Error: err.message });
    } else if(err instanceof ValidationError) {
        res.status(400).json({ Error: err.message });
    } else {
        res.status(500).json({ Error: err instanceof Error ? err.message : String(err) });
    }
}