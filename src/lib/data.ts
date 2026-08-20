import { promises as fs } from "fs";
import path from "path";
import { execFile } from "child_process";
import type { Graph } from "./types";

const DATA_PATH = "data/graph.json";
const LOCAL_FILE = path.join(process.cwd(), DATA_PATH);

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN;

function useGitHub(): boolean {
  return Boolean(process.env.VERCEL && OWNER && REPO);
}

export async function readGraph(): Promise<Graph> {
  if (useGitHub()) {
    const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${DATA_PATH}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to read graph from GitHub (${res.status})`);
    }
    return res.json();
  }
  const raw = await fs.readFile(LOCAL_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function writeGraph(graph: Graph, message: string): Promise<void> {
  const serialized = JSON.stringify(graph, null, 2) + "\n";

  if (useGitHub()) {
    if (!TOKEN) {
      throw new Error(
        "GITHUB_TOKEN is not set — add it in your Vercel project's environment variables."
      );
    }
    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`;
    const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });
    if (!getRes.ok) {
      throw new Error(`Could not read current file sha from GitHub (${getRes.status})`);
    }
    const current = (await getRes.json()) as { sha: string };

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(serialized, "utf-8").toString("base64"),
        sha: current.sha,
        branch: BRANCH,
      }),
    });
    if (!putRes.ok) {
      const body = await putRes.text();
      throw new Error(`Failed to commit to GitHub (${putRes.status}): ${body}`);
    }
    return;
  }

  await fs.writeFile(LOCAL_FILE, serialized, "utf-8");
  await tryLocalCommit(message);
}

function tryLocalCommit(message: string): Promise<void> {
  return new Promise((resolve) => {
    execFile("git", ["add", DATA_PATH], { cwd: process.cwd() }, () => {
      execFile(
        "git",
        ["commit", "-m", message, "--", DATA_PATH],
        { cwd: process.cwd() },
        () => resolve()
      );
    });
  });
}
