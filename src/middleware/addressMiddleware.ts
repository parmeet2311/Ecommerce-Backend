import { Request, Response, NextFunction } from "express";

export const validateDeliveryAddress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name, address, city, state, pincode, mob } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Invalid or missing "id".' });
  }
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: 'Invalid or missing "name".' });
  }

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: 'Invalid or missing "address".' });
  }

  if (!city || typeof city !== "string") {
    return res.status(400).json({ error: 'Invalid or missing "city".' });
  }

  if (!state || typeof state !== "string") {
    return res.status(400).json({ error: 'Invalid or missing "state".' });
  }

  if (!pincode || typeof pincode !== "string") {
    return res.status(400).json({ error: 'Invalid or missing "pincode".' });
  }

  if (!mob || typeof mob !== "string") {
    return res.status(400).json({ error: 'Invalid or missing "mob".' });
  }

  next();
};
