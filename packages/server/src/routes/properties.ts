import express, { Request, Response } from "express";
import properties from "../services/property-svc";

const router = express.Router();

router.get("/:propertyId", (req: Request, res: Response) => {
  const { property_id_string } = req.params;
  const property_id = Number(property_id_string)
  const got = properties.get(property_id);

  if (got) res.send(got);
  else res.status(404).end();
});

export default router;