import { Request, Response, NextFunction } from "express";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

export const verifyJWTProduct = async (
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
      };
    }

    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return res.status(500).send({ message: "Server Tenant ID not found" });
    }

    const TENANT_SERVICE_URL = process.env.TENANT_SERVICE_URL

    const tenantPayload = await fetch(`${TENANT_SERVICE_URL}/api/tenant/${SERVER_TENANT_ID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (tenantPayload.status !== 200) {
      return res.status(500).send({ message: "Server Tenant not found" });
    }

    const tenantData = await tenantPayload.json();

    if (!tenantData) {
      return res.status(500).send({ message: "Server Tenant not found" });
    }

    const verifiedTenantPayload = tenantData as {
      status: 200;
      tenants: {
        id: string;
        owner_id: string;
      };
      tenantDetails: {
        id: string;
        tenant_id: string;
        name: string;
      };
    };

    // Check for tenant ownership
    if (verifiedPayload.user.id !== verifiedTenantPayload.tenants.owner_id) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.body.user = verifiedPayload.user;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token").generate()
    );
  }
};
