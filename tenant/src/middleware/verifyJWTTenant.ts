import { Request, Response, NextFunction } from "express";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL

    const payload = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify-admin-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (payload.status !== 200) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const verifiedPayload = await payload.json() as {
      status: 200;
      user: {
        id: string | null;
        username: string;
        email: string;
        full_name: string | null;
        address: string | null;
        phone_number: string | null;
      }
    }

    req.body.user = verifiedPayload.user;
    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token").generate()
    );
  }
};
