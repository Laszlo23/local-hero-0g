import { mkdir, writeFile, unlink, readFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { Indexer, ZgFile } from "@0gfoundation/0g-ts-sdk";
import { ethers } from "ethers";
import { config } from "./config.js";

export function is0gStorageConfigured(): boolean {
  return Boolean(config.og0gStoragePrivateKey && config.og0gStoragePrivateKey.startsWith("0x"));
}

function extractRootHash(
  tx: { txHash?: string; rootHash?: string; txHashes?: string[]; rootHashes?: string[] } | undefined
): string | null {
  if (!tx) return null;
  if (typeof tx.rootHash === "string") return tx.rootHash;
  if (Array.isArray(tx.rootHashes) && tx.rootHashes[0]) return tx.rootHashes[0];
  return null;
}

/**
 * Upload file bytes to 0G Storage using the server-funded wallet.
 * Returns Merkle root hash used for retrieval.
 */
export async function uploadBytesTo0gStorage(buffer: Buffer, originalName: string): Promise<{ rootHash: string; txHash?: string }> {
  if (!is0gStorageConfigured()) {
    throw new Error("0G storage is not configured (set OG_0G_STORAGE_PRIVATE_KEY)");
  }

  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload.bin";
  const dir = join(tmpdir(), `zg-upload-${randomUUID()}`);
  await mkdir(dir, { recursive: true });
  const filePath = join(dir, safeName);

  await writeFile(filePath, buffer);

  const file = await ZgFile.fromFilePath(filePath);
  try {
    const indexer = new Indexer(config.og0gIndexerRpc);
    const provider = new ethers.JsonRpcProvider(config.og0gEvmRpc);
    const signer = new ethers.Wallet(config.og0gStoragePrivateKey!, provider);

    // 0g SDK types reference ethers CommonJS; this project uses the ESM build — compatible at runtime.
    const [tx, err] = await indexer.upload(
      file,
      config.og0gEvmRpc,
      signer as unknown as Parameters<Indexer["upload"]>[2]
    );
    if (err) {
      throw new Error(typeof err === "string" ? err : String(err));
    }

    const rootHash = extractRootHash(tx as { rootHash?: string; rootHashes?: string[] });
    if (!rootHash) {
      throw new Error("Upload succeeded but root hash missing from response");
    }

    const txHash =
      typeof (tx as { txHash?: string }).txHash === "string"
        ? (tx as { txHash: string }).txHash
        : Array.isArray((tx as { txHashes?: string[] }).txHashes)
          ? (tx as { txHashes: string[] }).txHashes[0]
          : undefined;

    return { rootHash, txHash };
  } finally {
    await file.close().catch(() => {});
    await unlink(filePath).catch(() => {});
  }
}

/** Guess Content-Type for common image signatures (avatar display in browsers). */
export function sniffContentType(buf: Buffer): string {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf.length >= 6 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50)
    return "image/webp";
  return "application/octet-stream";
}

/** Download file from 0G by root hash into a buffer (used for public GET). */
export async function download0gFileToBuffer(rootHash: string, outPath: string): Promise<void> {
  const indexer = new Indexer(config.og0gIndexerRpc);
  const err = await indexer.download(rootHash, outPath, false);
  if (err) {
    throw new Error(typeof err === "string" ? err : String(err));
  }
}

export async function readDownloadedFile(path: string): Promise<Buffer> {
  return readFile(path);
}

/** Accepts indexer root hash (with or without 0x). */
export function isLikelyRootHash(value: string): boolean {
  const s = value.startsWith("0x") ? value.slice(2) : value;
  return /^[0-9a-fA-F]{64}$/.test(s);
}
