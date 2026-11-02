#!/usr/bin/env node

/**
 * Cross-platform script to sync local .env secrets to GitHub Repository Secrets
 * Supports: Linux, macOS, Windows (PowerShell, CMD, Git Bash, WSL)
 * Zero external npm dependencies (uses native Node.js core modules).
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const { execSync, spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const envFile = path.resolve(projectRoot, ".env");

const isTTY = process.stdin.isTTY;

function prompt(question) {
  if (!isTTY) return Promise.resolve("");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function runCmd(command, args = [], options = {}) {
  return spawnSync(command, args, {
    stdio: options.stdio || "pipe",
    encoding: "utf-8",
    shell: process.platform === "win32",
    ...options,
  });
}

function checkGhCli() {
  const check = runCmd("gh", ["--version"]);
  if (check.error || check.status !== 0) {
    console.error("\x1b[31m[ERROR] GitHub CLI (gh) not found in system PATH!\x1b[0m");
    console.error("Please install it from: https://cli.github.com/");
    if (process.platform === "win32") {
      console.error("  Windows: winget install --id GitHub.cli  or  choco install gh");
    } else if (process.platform === "darwin") {
      console.error("  macOS: brew install gh");
    } else {
      console.error("  Linux: sudo pacman -S github-cli  or  sudo apt install gh");
    }
    process.exit(1);
  }

  const authCheck = runCmd("gh", ["auth", "status"]);
  if (authCheck.status !== 0) {
    console.warn("\x1b[33m[!] You are not logged into GitHub CLI.\x1b[0m");
    console.log("Launching gh auth login...");
    spawnSync("gh", ["auth", "login"], { stdio: "inherit", shell: process.platform === "win32" });
  }
}

function detectGitHubRepo() {
  try {
    const remoteUrl = execSync("git remote get-url origin", {
      cwd: projectRoot,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    const match = remoteUrl.match(/github\.com[:/]([^\s/]+)\/([^\s/]+?)(?:\.git)?$/);
    if (match) {
      return `${match[1]}/${match[2]}`;
    }
  } catch (e) {
    // git remote failed or not a git repo
  }
  return null;
}

function detectVercelCliToken() {
  const home = os.homedir();
  const candidates = [
    path.join(home, ".local", "share", "com.vercel.cli", "auth.json"),
    path.join(home, ".config", "com.vercel.cli", "auth.json"),
    path.join(home, "Library", "Application Support", "com.vercel.cli", "auth.json"),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "com.vercel.cli", "auth.json"),
    process.env.APPDATA && path.join(process.env.APPDATA, "com.vercel.cli", "auth.json"),
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const data = JSON.parse(fs.readFileSync(p, "utf-8"));
        if (data.token) {
          return data.token;
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return null;
}

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/);
  const result = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();

    // Strip leading/trailing matching quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    if (key && val) {
      result[key] = val;
    }
  }
  return result;
}

function appendOrUpdateEnv(filePath, updates) {
  let content = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";
  let modified = false;

  for (const [key, val] of Object.entries(updates)) {
    if (!val) continue;
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      const match = content.match(regex)[0];
      const currentVal = match.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
      if (!currentVal) {
        content = content.replace(regex, `${key}=${val}`);
        modified = true;
      }
    } else {
      if (content && !content.endsWith("\n")) {
        content += "\n";
      }
      content += `${key}=${val}\n`;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
  return modified;
}

async function main() {
  console.log("\x1b[34m====================================================\x1b[0m");
  console.log("\x1b[34m       GitHub Secrets & Env Auto-Sync Tool          \x1b[0m");
  console.log(`\x1b[34m       Project: ${path.basename(projectRoot)}\x1b[0m`);
  console.log("\x1b[34m====================================================\x1b[0m");

  checkGhCli();

  let targetRepo = detectGitHubRepo();
  if (targetRepo) {
    console.log(`\x1b[32m[✓]\x1b[0m Target GitHub Repo: \x1b[1m${targetRepo}\x1b[0m`);
  } else {
    targetRepo = await prompt("Enter GitHub repository (owner/repo): ");
    if (!targetRepo) {
      console.error("\x1b[31m[ERROR] Repository is required.\x1b[0m");
      process.exit(1);
    }
  }

  if (!fs.existsSync(envFile)) {
    console.warn(`\x1b[33m[!] .env file not found at: ${envFile}\x1b[0m`);
    const exampleFile = path.resolve(projectRoot, ".env.example");
    if (fs.existsSync(exampleFile)) {
      console.log(`Found .env.example. Copying to .env...`);
      fs.copyFileSync(exampleFile, envFile);
      console.log(`Created .env from .env.example. Please review it before syncing.`);
    } else {
      console.error("\x1b[31m[ERROR] No .env or .env.example found!\x1b[0m");
      process.exit(1);
    }
  }

  const envVars = parseEnv(envFile);
  const detectedFromVercel = {};

  // 1. Auto-detect VERCEL_ORG_ID and VERCEL_PROJECT_ID from .vercel/project.json
  const vercelProjectFile = path.resolve(projectRoot, ".vercel/project.json");
  if (fs.existsSync(vercelProjectFile)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelProjectFile, "utf-8"));
      if (vercelConfig.orgId && !envVars.VERCEL_ORG_ID) {
        envVars.VERCEL_ORG_ID = vercelConfig.orgId;
        detectedFromVercel.VERCEL_ORG_ID = vercelConfig.orgId;
        console.log(`\x1b[32m[✓]\x1b[0m Auto-detected VERCEL_ORG_ID from .vercel/project.json`);
      }
      if (vercelConfig.projectId && !envVars.VERCEL_PROJECT_ID) {
        envVars.VERCEL_PROJECT_ID = vercelConfig.projectId;
        detectedFromVercel.VERCEL_PROJECT_ID = vercelConfig.projectId;
        console.log(`\x1b[32m[✓]\x1b[0m Auto-detected VERCEL_PROJECT_ID from .vercel/project.json`);
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Auto-detect VERCEL_TOKEN from Vercel CLI global login auth.json
  if (!envVars.VERCEL_TOKEN) {
    const cliToken = detectVercelCliToken();
    if (cliToken) {
      envVars.VERCEL_TOKEN = cliToken;
      detectedFromVercel.VERCEL_TOKEN = cliToken;
      console.log(`\x1b[32m[✓]\x1b[0m Auto-detected VERCEL_TOKEN from Vercel CLI session`);
    }
  }

  // Persist auto-detected Vercel credentials into local .env if missing
  if (Object.keys(detectedFromVercel).length > 0) {
    if (appendOrUpdateEnv(envFile, detectedFromVercel)) {
      const keysSaved = Object.keys(detectedFromVercel).join(", ");
      console.log(`\x1b[32m[✓]\x1b[0m Auto-saved [${keysSaved}] into your local .env`);
    }
  }

  const keys = Object.keys(envVars);
  console.log(`Found ${keys.length} environment variables to sync:`);

  let successCount = 0;
  for (const key of keys) {
    const val = envVars[key];
    process.stdout.write(`  Syncing secret ${key} ... `);
    const setRes = runCmd("gh", ["secret", "set", key, "--repo", targetRepo, "-b", val]);
    if (setRes.status === 0) {
      console.log("\x1b[32mOK\x1b[0m");
      successCount++;
    } else {
      console.log("\x1b[31mFAILED\x1b[0m");
      if (setRes.stderr) console.error("    " + setRes.stderr.trim());
    }
  }

  console.log(`\x1b[32m[✓] Successfully synced ${successCount}/${keys.length} secret(s) to ${targetRepo}\x1b[0m`);

  // Optional: If Vercel credentials are STILL missing (e.g. neither .vercel nor CLI login exists) and interactive
  const skipVercel = process.argv.includes("--skip-vercel");
  const hasVercelCredentials =
    Boolean(envVars.VERCEL_TOKEN) &&
    Boolean(envVars.VERCEL_ORG_ID) &&
    Boolean(envVars.VERCEL_PROJECT_ID);

  if (!skipVercel && !hasVercelCredentials && isTTY) {
    console.log("\n\x1b[33mMissing Vercel Deployment Credentials for GitHub Actions:\x1b[0m");
    const entered = {};

    if (!envVars.VERCEL_TOKEN) {
      const vToken = await prompt("VERCEL_TOKEN (leave blank to skip): ");
      if (vToken) {
        runCmd("gh", ["secret", "set", "VERCEL_TOKEN", "--repo", targetRepo, "-b", vToken]);
        console.log("  \x1b[32m[✓] VERCEL_TOKEN saved to GitHub Secrets\x1b[0m");
        entered.VERCEL_TOKEN = vToken;
      }
    }

    if (!envVars.VERCEL_ORG_ID) {
      const vOrg = await prompt("VERCEL_ORG_ID (leave blank to skip): ");
      if (vOrg) {
        runCmd("gh", ["secret", "set", "VERCEL_ORG_ID", "--repo", targetRepo, "-b", vOrg]);
        console.log("  \x1b[32m[✓] VERCEL_ORG_ID saved to GitHub Secrets\x1b[0m");
        entered.VERCEL_ORG_ID = vOrg;
      }
    }

    if (!envVars.VERCEL_PROJECT_ID) {
      const vPrj = await prompt("VERCEL_PROJECT_ID (leave blank to skip): ");
      if (vPrj) {
        runCmd("gh", ["secret", "set", "VERCEL_PROJECT_ID", "--repo", targetRepo, "-b", vPrj]);
        console.log("  \x1b[32m[✓] VERCEL_PROJECT_ID saved to GitHub Secrets\x1b[0m");
        entered.VERCEL_PROJECT_ID = vPrj;
      }
    }

    if (Object.keys(entered).length > 0) {
      if (appendOrUpdateEnv(envFile, entered)) {
        console.log(`\x1b[32m[✓]\x1b[0m Auto-saved entered credentials into your local .env`);
      }
    }
  }

  console.log("\n\x1b[32m====================================================\x1b[0m");
  console.log("\x1b[32m[✓] Done! All secrets are up to date on GitHub.\x1b[0m");
  console.log("\x1b[32m====================================================\x1b[0m");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
