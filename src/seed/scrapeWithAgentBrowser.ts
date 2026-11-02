import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const SESSION = "semina_seed_scraper";

function runBrowser(args: string[], timeout = 90000): string {
  const env = {
    ...process.env,
    AGENT_BROWSER_SESSION: SESSION,
    AGENT_BROWSER_DEFAULT_TIMEOUT: "60000",
  };
  return execFileSync("agent-browser", args, {
    env,
    encoding: "utf-8",
    timeout,
    maxBuffer: 10 * 1024 * 1024,
  }).trim();
}

interface ScrapedCalendarEvent {
  title: string;
  url: string;
}

interface ScrapedSpeaker {
  name: string;
  role: string;
  img: string;
  source: string;
}

async function scrape() {
  console.log("=== Starting agent-browser Conference & Speaker Scraper ===");
  const outputPath = path.join(__dirname, "scraped-events-raw.json");

  try {
    // 1. Scrape Events Calendar from Linux Foundation
    console.log("[1/3] Navigating to Linux Foundation Events Calendar...");
    runBrowser(["open", "https://events.linuxfoundation.org/about/calendar/"]);
    runBrowser(["wait", "2000"]);

    console.log("[1/3] Extracting calendar conference entries...");
    const rawEventsJs = `
      (() => {
        const links = Array.from(document.querySelectorAll('a[href*="events.linuxfoundation.org/"]'));
        const eventMap = new Map();
        links.forEach(a => {
          const title = a.innerText.trim();
          const href = a.href;
          if (
            title.length > 5 &&
            !title.includes("Skip") &&
            !title.includes("About") &&
            !title.includes("Contact") &&
            !title.includes("Sponsor") &&
            !title.includes("Newsletter") &&
            !title.includes("Blog") &&
            !title.includes("Travel") &&
            !title.includes("Calendar") &&
            !title.includes("Events") &&
            !title.includes("Community") &&
            !href.includes("/about/") &&
            !href.includes("/search/") &&
            !href.includes("/calendar/") &&
            !href.includes("#")
          ) {
            if (!eventMap.has(title)) {
              eventMap.set(title, {
                title,
                url: href
              });
            }
          }
        });
        return Array.from(eventMap.values());
      })()
    `;
    const eventsOutputStr = runBrowser(["eval", rawEventsJs]);
    let calendarEvents: ScrapedCalendarEvent[] = [];
    try {
      const parsed: unknown = JSON.parse(eventsOutputStr);
      if (Array.isArray(parsed)) {
        calendarEvents = parsed as ScrapedCalendarEvent[];
      }
      console.log(`- Extracted ${calendarEvents.length} calendar event entries.`);
    } catch (e) {
      console.warn("Failed to parse calendar events JSON:", e);
    }

    // 2. Scrape KubeCon + CloudNativeCon Keynote Speakers
    console.log("[2/3] Opening KubeCon Keynote Speakers in new tab...");
    runBrowser(["tab", "new", "https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/keynote-speakers/"]);
    runBrowser(["wait", "2500"]);

    console.log("[2/3] Extracting keynote speakers...");
    const rawSpeakersJs = `
      (() => {
        const cards = Array.from(document.querySelectorAll('.sz-speakers-grid > *'));
        return cards.map(el => {
          const lines = el.innerText.split('\\n').map(s => s.trim()).filter(Boolean);
          const name = lines[0] || "";
          const roleRaw = lines.slice(1).join(" - ");
          const img = el.querySelector("img")?.src || "";
          return {
            name,
            role: roleRaw,
            img,
            source: "Sessionize / KubeCon North America"
          };
        }).filter(sp => sp.name.length > 0);
      })()
    `;
    const speakersOutputStr = runBrowser(["eval", rawSpeakersJs]);
    let speakers: ScrapedSpeaker[] = [];
    try {
      const parsed: unknown = JSON.parse(speakersOutputStr);
      if (Array.isArray(parsed)) {
        speakers = parsed as ScrapedSpeaker[];
      }
      console.log(`- Extracted ${speakers.length} keynote speakers.`);
    } catch (e) {
      console.warn("Failed to parse speakers JSON:", e);
    }

    // 3. Compile Curated Raw Payload
    console.log("[3/3] Compiling and saving scraped raw dataset...");
    const payload = {
      scrapedAt: new Date().toISOString(),
      session: SESSION,
      sources: [
        "https://events.linuxfoundation.org/about/calendar/",
        "https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/keynote-speakers/"
      ],
      calendarEvents,
      speakers
    };

    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`✓ Scraped data successfully written to: ${outputPath}`);
    console.log(`  Events: ${calendarEvents.length}`);
    console.log(`  Speakers: ${speakers.length}`);
  } catch (err) {
    console.error("Error during scraping:", err);
    throw err;
  } finally {
    console.log("Closing agent-browser session...");
    try {
      runBrowser(["close"]);
      console.log("✓ agent-browser session closed cleanly.");
    } catch (closeErr) {
      console.warn("Warning closing session:", closeErr);
    }
  }
}

scrape().catch(err => {
  console.error("Fatal scraping error:", err);
  process.exit(1);
});
