import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const rootDir = path.resolve(__dirname, "../../..");
const uploadsDir = path.resolve(__dirname, "../../public/uploads");
const landingImagesDir = path.resolve(rootDir, "semina-landingpage/public/images");
const landingIconsDir = path.resolve(rootDir, "semina-landingpage/public/icons");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Copy Banner Assets
const eventBannerCopies: Array<{ src: string; dest: string }> = [
  { src: path.join(landingImagesDir, "1.png"), dest: path.join(uploadsDir, "event-kubecon-na.png") },
  { src: path.join(landingImagesDir, "2.png"), dest: path.join(uploadsDir, "event-agentics-mcp.png") },
  { src: path.join(landingImagesDir, "card-1.png"), dest: path.join(uploadsDir, "event-cloudnative-ai.png") },
  { src: path.join(landingImagesDir, "card-2.png"), dest: path.join(uploadsDir, "event-pytorch-day.png") },
  { src: path.join(landingImagesDir, "card-3.png"), dest: path.join(uploadsDir, "event-react-nextjs.png") },
  { src: path.join(landingImagesDir, "card-4.png"), dest: path.join(uploadsDir, "event-ciliumcon.png") },
  { src: path.join(landingImagesDir, "details-image.png"), dest: path.join(uploadsDir, "event-platform-eng.png") },
  { src: path.join(landingImagesDir, "story.png"), dest: path.join(uploadsDir, "event-observability-day.png") },
  { src: path.join(landingImagesDir, "Group 24.png"), dest: path.join(uploadsDir, "event-opensource-security.png") },
  { src: path.join(uploadsDir, "17876550-Frame New.png"), dest: path.join(uploadsDir, "event-voice-agents.png") },
  { src: path.join(uploadsDir, "24581311-detailing (3).png"), dest: path.join(uploadsDir, "event-distributed-ray.png") },
  { src: path.join(uploadsDir, "48721508-Thumbnail (1).jpg"), dest: path.join(uploadsDir, "event-backstagecon.jpg") },
  { src: path.join(uploadsDir, "54583923-A4 - 2.jpg"), dest: path.join(uploadsDir, "event-grpconf-asia.jpg") },
  { src: path.join(uploadsDir, "59196187-44 1.png"), dest: path.join(uploadsDir, "event-confidential-computing.png") },
  { src: path.join(uploadsDir, "89800836-BG.png"), dest: path.join(uploadsDir, "event-design-systems.png") },
  { src: path.join(uploadsDir, "96140690-e5ada306-ff2c-419c-86af-e000372bbaf4.jpg"), dest: path.join(uploadsDir, "event-embedded-linux.jpg") },
];

console.log("=== Provisioning Event Banners ===");
for (const item of eventBannerCopies) {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.dest);
    console.log(`✓ Copied banner: ${path.basename(item.dest)}`);
  } else {
    console.warn(`! Source banner missing: ${item.src}`);
  }
}

// 2. Copy Payment Icons
const paymentIconCopies: Array<{ src: string; dest: string }> = [
  { src: path.join(landingIconsDir, "ic-mastercard.svg"), dest: path.join(uploadsDir, "payment-credit-card.svg") },
  { src: path.join(landingIconsDir, "ic-sewallet.svg"), dest: path.join(uploadsDir, "payment-sewallet.svg") },
  { src: path.join(uploadsDir, "65699950-770674546c721d11192cdf523da52b1bPath 3 (1).png"), dest: path.join(uploadsDir, "payment-va-bank.png") },
  { src: path.join(uploadsDir, "63207830-2022-04-24T16_17_56.685Z-ic-sewallet.png"), dest: path.join(uploadsDir, "payment-qris.png") },
  { src: path.join(uploadsDir, "36911534-bwalogosmall.png"), dest: path.join(uploadsDir, "payment-digital-wallet.png") },
  { src: path.join(uploadsDir, "31443289-Untitled-1-01.png"), dest: path.join(uploadsDir, "payment-invoice.png") },
];

console.log("\n=== Provisioning Payment Icons ===");
for (const item of paymentIconCopies) {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.dest);
    console.log(`✓ Copied payment icon: ${path.basename(item.dest)}`);
  } else {
    console.warn(`! Source payment icon missing: ${item.src}`);
  }
}

// 3. Download / Provision Speaker Avatars
const speakerAvatars: Array<{ filename: string; url: string }> = [
  { filename: "speaker-jaana-dogan.jpeg", url: "https://cdn.sessionize.com/image/e35b-400o400o1-WMpLZecb2yUW4dCSiAV1zC.jpeg" },
  { filename: "speaker-lucy-sweet.jpg", url: "https://cdn.sessionize.com/image/1ed3-400o400o1-sa5rk3TE889rKHLBWYWBoa.jpg" },
  { filename: "speaker-robert-nishihara.jpg", url: "https://cdn.sessionize.com/image/115f-400o400o1-p7bZNNoGH3msAKsgpxKWSg.jpg" },
  { filename: "speaker-tim-hockin.jpg", url: "https://cdn.sessionize.com/image/b3ef-400o400o1-nwXJhysu3oJncCZ38fkQBL.jpg" },
  { filename: "speaker-warren-barkley.png", url: "https://cdn.sessionize.com/image/8830-400o400o1-5dzeF5xKDG4w9myZe7fgH.png" },
  { filename: "speaker-alolita-sharma.png", url: "https://cdn.sessionize.com/image/da21-400o400o1-y3vxUoQdXuzH5sfmXcZGG.png" },
  { filename: "speaker-lin-sun.jpg", url: "https://cdn.sessionize.com/image/b154-400o400o1-UnrH8vnN8XbaR16rnvDHp6.jpg" },
  { filename: "speaker-ravin-kumar.jpg", url: "https://cdn.sessionize.com/image/774d-400o400o1-MLtdPzzGEPytVJbfoZAfix.jpg" },
  { filename: "speaker-jorge-palma.jpg", url: "https://cdn.sessionize.com/image/250d-400o400o1-PqddsXBsH6yHdaavMJzi4R.jpg" },
  { filename: "speaker-jessica-forrester.jpg", url: "https://cdn.sessionize.com/image/929e-400o400o1-WMHHWy7SzES5fNcBcBea2V.jpg" },
  { filename: "speaker-vara-bonthu.jpg", url: "https://cdn.sessionize.com/image/a40e-400o400o1-DpUmyvWXM79JS4bdPbekQm.jpg" },
  { filename: "speaker-bassam-tabbara.jpg", url: "https://cdn.sessionize.com/image/3d93-400o400o1-M4CFFua3KsnFPL4kuHqxB4.jpg" },
  { filename: "speaker-andjelko-iharos.jpg", url: "https://cdn.sessionize.com/image/3840-400o400o1-avNrMDLGBq5nJgXYND2cWf.jpg" },
  { filename: "speaker-lorenzo-biava.png", url: "https://cdn.sessionize.com/image/cf13-400o400o1-MZuaatpi96z3HoYVaJcosd.png" },
];

console.log("\n=== Provisioning Speaker Avatars ===");
const fallbackAvatar = path.join(landingImagesDir, "avatar.png");

for (const sp of speakerAvatars) {
  const destPath = path.join(uploadsDir, sp.filename);
  let downloaded = false;
  try {
    execSync(`curl -sSL --fail --max-time 15 -o "${destPath}" "${sp.url}"`);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      downloaded = true;
      console.log(`✓ Downloaded portrait: ${sp.filename} (${fs.statSync(destPath).size} bytes)`);
    }
  } catch (err) {
    console.warn(`! Failed to download ${sp.url}: ${(err as Error).message}`);
  }

  if (!downloaded) {
    console.log(`→ Using local fallback for ${sp.filename}`);
    if (fs.existsSync(fallbackAvatar)) {
      fs.copyFileSync(fallbackAvatar, destPath);
    }
  }
}

// Ensure default.jpg also exists so any legacy reference doesn't 404
const defaultJpg = path.join(uploadsDir, "default.jpg");
if (!fs.existsSync(defaultJpg)) {
  fs.copyFileSync(path.join(landingImagesDir, "avatar.png"), defaultJpg);
  console.log("✓ Created fallback default.jpg");
}

console.log("\n=== Asset Provisioning Complete ===");
