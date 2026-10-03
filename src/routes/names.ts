import { Router } from "express";
import fs from "fs";
import path from "path";

const namesRouter = Router();

const DATA_FILE = path.join(process.cwd(), "data", "names.json");

interface NameEntry {
  name: string;
  timestamp: string;
}

function readNames(): NameEntry[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as NameEntry[];
  } catch {
    return [];
  }
}

function writeNames(names: NameEntry[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(names, null, 2));
}

namesRouter.post("/names", (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const names = readNames();
  names.push({ name: name.trim(), timestamp: new Date().toISOString() });
  writeNames(names);
  res.json({ ok: true });
});

namesRouter.post("/names/admin", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access is not configured" });
    return;
  }

  const { password } = req.body as { password?: string };
  if (password !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const names = readNames();
  res.json(names);
});

export default namesRouter;
