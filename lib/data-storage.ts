import "server-only";

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import type { ActivitySample } from "@/lib/types";

const dataDir = path.join(process.cwd(), ".data");
const cloudFile = path.join(dataDir, "cloud-sync.json");
const paidFile = path.join(dataDir, "paid-users.json");

interface CloudStorageData {
  byAnonymousId: Record<string, ActivitySample[]>;
}

interface PaidData {
  emailHashes: string[];
}

async function ensureDataFiles() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(cloudFile);
  } catch {
    const initial: CloudStorageData = { byAnonymousId: {} };
    await fs.writeFile(cloudFile, JSON.stringify(initial, null, 2), "utf8");
  }

  try {
    await fs.access(paidFile);
  } catch {
    const initial: PaidData = { emailHashes: [] };
    await fs.writeFile(paidFile, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson(filePath: string, data: unknown) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function readSyncedSamples(anonymousId: string) {
  await ensureDataFiles();
  const payload = await readJson<CloudStorageData>(cloudFile);
  return payload.byAnonymousId[anonymousId] ?? [];
}

export async function writeSyncedSamples(anonymousId: string, incomingSamples: ActivitySample[]) {
  await ensureDataFiles();
  const payload = await readJson<CloudStorageData>(cloudFile);
  const currentSamples = payload.byAnonymousId[anonymousId] ?? [];

  const merged = [...currentSamples, ...incomingSamples];
  const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values())
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .slice(-90 * 24 * 60);

  payload.byAnonymousId[anonymousId] = deduped;
  await writeJson(cloudFile, payload);

  return deduped;
}

function hashEmail(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export async function grantPaidAccess(email: string) {
  await ensureDataFiles();
  const payload = await readJson<PaidData>(paidFile);
  const emailHash = hashEmail(email);

  if (!payload.emailHashes.includes(emailHash)) {
    payload.emailHashes.push(emailHash);
    await writeJson(paidFile, payload);
  }
}

export async function hasPaidAccess(email: string) {
  await ensureDataFiles();
  const payload = await readJson<PaidData>(paidFile);
  const emailHash = hashEmail(email);
  return payload.emailHashes.includes(emailHash);
}
