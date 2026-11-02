# Semina Production Seed Dataset & Recovery Reference

> **Generated**: 2026-11-02T05:30:17.275Z  
> **Source Provenance**: Real tech conference metadata & Sessionize keynote speakers scraped via `agent-browser` from [Linux Foundation Events](https://events.linuxfoundation.org/about/calendar/) and [KubeCon North America](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).  
> **Target Database**: MongoDB Atlas `db_semina`  
> **Command to Re-seed**: `cd semina-api && npm run seed`

---

## 1. Quick Credentials Reference

### CMS Dashboard Login (`http://localhost:3001` or `semina-cms`)

| Role | Email | Password | Organizer | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Owner / Super Admin** | `admin@gmail.com` | `admin123` | Semina (Primary) | Full dashboard, categories, events, talents, payments, orders |
| **Organizer** | `organizer@semina.id` | `semina123` | Semina (Primary) | Primary organizer operational management |
| **Admin** | `staff@semina.id` | `semina123` | Semina (Primary) | Operational staff account |
| **Partner Organizer** | `events@linuxfoundation.org` | `semina123` | Linux Foundation & CNCF | Multi-tenant partner organizer |
| **Regional Organizer** | `lead@seatechguild.org` | `semina123` | Southeast Asia Tech Guild | Regional partner organizer |

### Landing Page Participant Login (`http://localhost:3000/signin`)

| Name | Role / Job | Email | Password | Status | Seeded Orders |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Budi Santoso** | Product Designer | `user@gmail.com` | `user123` | `aktif` | **4 Orders** (Paid & Pending) |
| **Anisa Rahmawati** | Senior Frontend Engineer | `anisa.rahma@gmail.com` | `user123` | `aktif` | 2 Orders |
| **Dimas Pratama** | Cloud Infrastructure Architect | `dimas.pratama@gmail.com` | `user123` | `aktif` | 2 Orders |
| **Siti Nurhaliza** | AI Research Engineer | `siti.nurhaliza@gmail.com` | `user123` | `aktif` | 2 Orders |
| **Kevin Wijaya** | DevSecOps Lead | `kevin.wijaya@gmail.com` | `user123` | `aktif` | 2 Orders |
| **Putri Maharani** | Product Manager | `putri.maharani@gmail.com` | `user123` | `aktif` | 1 Order |
| **Reza Octavian** | Fullstack Developer | `reza.octavian@gmail.com` | `user123` | `aktif` | 1 Order |
| **Clara Kusuma** | Data Scientist | `clara.kusuma@gmail.com` | `user123` | `aktif` | 1 Order |
| **Fajar Nugroho** | Platform Engineer | `fajar.nugroho@gmail.com` | `user123` | `aktif` | 1 Order |
| **Maya Indira** | UX Researcher | `maya.indira@gmail.com` | `user123` | `aktif` | 2 Orders |
| **Hendra Saputra** | Backend Developer | `pending.user@gmail.com` | `user123` | `tidak aktif` | 0 Orders (OTP: `654321`) |

---

## 2. Organizers Collection (`Organizers`)

| Organizer Name | Role in Ecosystem | ID Note |
| :--- | :--- | :--- |
| **Semina** | Primary Platform Organizer (owns core categories, events, speakers, payments) | Default for CMS `admin@gmail.com` |
| **Linux Foundation & CNCF** | International Cloud & Open Source Partner | Multi-tenant testing |
| **Southeast Asia Tech Guild** | Regional Community Partner | Regional developer events |

---

## 3. Categories Collection (`Categories`)

All 8 categories comply strictly with the `categorySchema` constraint ($3 \le \text{length} \le 20$ chars):

1. `AI & Agents` (11 chars)
2. `Cloud Native` (12 chars)
3. `Platform Eng` (12 chars)
4. `Cybersecurity` (13 chars)
5. `Web & Frontend` (14 chars)
6. `Data & ML Ops` (13 chars)
7. `Product Design` (14 chars)
8. `Embedded & IoT` (14 chars)

---

## 4. Talents / Keynote Speakers Collection (`Talents`)

All 14 keynote speakers are real industry leaders scraped from Sessionize & Linux Foundation with local high-resolution portraits:

| Speaker Name | Title & Organization | Avatar Image Asset |
| :--- | :--- | :--- |
| **Jaana Dogan** | Principal Software Engineer, Google | `uploads/speaker-jaana-dogan.jpeg` |
| **Lucy Sweet** | Member of Technical Staff, Anthropic | `uploads/speaker-lucy-sweet.jpg` |
| **Robert Nishihara** | Co-Founder & Creator of Ray, Anyscale | `uploads/speaker-robert-nishihara.jpg` |
| **Tim Hockin** | Distinguished Engineer (Kubernetes Co-Creator), Google | `uploads/speaker-tim-hockin.jpg` |
| **Warren Barkley** | VP of Product Management (AI Infrastructure), NVIDIA | `uploads/speaker-warren-barkley.png` |
| **Alolita Sharma** | Observability Engineering Leader, Apple | `uploads/speaker-alolita-sharma.png` |
| **Lin Sun** | Head of Open Source & Istio Maintainer, Solo.io | `uploads/speaker-lin-sun.jpg` |
| **Ravin Kumar** | Staff Research Engineer, Google DeepMind | `uploads/speaker-ravin-kumar.jpg` |
| **Jorge Palma** | Principal PM Lead (Azure Kubernetes Service), Microsoft | `uploads/speaker-jorge-palma.jpg` |
| **Jessica Forrester** | Senior Distinguished Engineer, Red Hat | `uploads/speaker-jessica-forrester.jpg` |
| **Vara Bonthu** | Principal Open Source Specialist SA, AWS | `uploads/speaker-vara-bonthu.jpg` |
| **Bassam Tabbara** | Founder & CEO (Crossplane Creator), Upbound | `uploads/speaker-bassam-tabbara.jpg` |
| **Andjelko Iharos** | VP of Architecture, HAProxy Technologies | `uploads/speaker-andjelko-iharos.jpg` |
| **Lorenzo Biava** | Staff Infrastructure Engineer, LiveKit | `uploads/speaker-lorenzo-biava.png` |

---

## 5. Payment Methods Collection (`Payments`)

| Payment Type | Icon Asset | Status |
| :--- | :--- | :--- |
| **Virtual Account BCA / Mandiri** | `uploads/payment-va-bank.png` | `Active` (true) |
| **Visa / Mastercard Credit Card** | `uploads/payment-credit-card.svg` | `Active` (true) |
| **Semina Pay (SeWallet)** | `uploads/payment-sewallet.svg` | `Active` (true) |
| **QRIS Instant Payment** | `uploads/payment-qris.png` | `Active` (true) |
| **GoPay / OVO Digital Wallet** | `uploads/payment-digital-wallet.png` | `Active` (true) |
| **Corporate Invoice / Wire Transfer** | `uploads/payment-invoice.png` | `Active` (true) |

---

## 6. Events Collection (`Events` — 16 Events)

| # | Event Title | Category | Speaker | Venue | Pricing | Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **KubeCon + CloudNativeCon NA 2026** | Cloud Native | Tim Hockin | Salt Palace, Salt Lake City | $149 / $299 / $599 | `Published` |
| 2 | **Agentics Day: MCP + AI Agents Summit** | AI & Agents | Lucy Sweet | Moscone Center, SF & Hybrid | $89 / $179 | `Published` |
| 3 | **Cloud Native AI & Inference Day** | AI & Agents | Warren Barkley | Jakarta Convention Center | Free ($0) / $99 | `Published` |
| 4 | **PyTorch Day & Open Source AI Forum** | Data & ML Ops | Ravin Kumar | Tokyo International Forum | $59 / $129 | `Published` |
| 5 | **React & Next.js Architecture Conf** | Web & Frontend | Jaana Dogan | Marina Bay Sands, Singapore | $49 / $119 | `Published` |
| 6 | **CiliumCon: eBPF Networking & Security** | Cybersecurity | Lin Sun | CCIB, Barcelona, Spain | $75 / $149 | `Published` |
| 7 | **Platform Eng & Developer Portals Day** | Platform Eng | Bassam Tabbara | Sheraton Grand Jakarta | Free ($0) / $79 | `Published` |
| 8 | **Observability Day: OpenTelemetry Scale** | Cloud Native | Alolita Sharma | ICE BSD City, Tangerang | Free ($0) / $49 | `Published` |
| 9 | **Open Source SecurityCon & Supply Chain** | Cybersecurity | Jessica Forrester | KL Convention Centre, Malaysia | $65 / $139 | `Published` |
| 10 | **Voice Agents & Real-Time Multimodal AI** | AI & Agents | Lorenzo Biava | Nusa Dua Convention Center, Bali | $55 / $120 | `Published` |
| 11 | **Distributed Ray & Large LLM Training** | Data & ML Ops | Robert Nishihara | Grand Hyatt Singapore | $95 / $199 | `Published` |
| 12 | **BackstageCon & Dev Experience Summit** | Platform Eng | Vara Bonthu | Bangkok Digital Park, Thailand | Free ($0) / $69 | `Published` |
| 13 | **gRPConf & High-Performance Services** | Web & Frontend | Andjelko Iharos | Bengaluru Tech Summit Hall | Free ($0) / $45 | `Published` |
| 14 | **Confidential Computing & Sovereign Cloud** | Cybersecurity | Jorge Palma | Pacific Place Jakarta | $85 / $175 | `Published` |
| 15 | **Design Systems & AI Interfaces Master** | Product Design | Jaana Dogan | Ciputra Artpreneur Jakarta | Free ($0) / $59 | `Published` |
| 16 | **Embedded Linux & RISC-V Edge Workshop** | Embedded & IoT | Tim Hockin | Tokyo Big Sight, Japan | $110 (Workshop) | `Draft` |

---

## 7. Orders Collection (`Orders` — 18 Orders)

| # | Participant | Event Title | Ticket Tier | Qty | Total Pay | Payment Method | Status |
| :- | :--- | :--- | :--- | :-: | :-: | :--- | :--- |
| 1 | **user@gmail.com** | KubeCon + CloudNativeCon NA 2026 | VIP All-Access | 1 | $599 | Visa / Mastercard | `paid` |
| 2 | **user@gmail.com** | Agentics Day: MCP + AI Agents Summit | Pro Workshop Pass | 2 | $358 | Semina Pay (SeWallet) | `paid` |
| 3 | **user@gmail.com** | Cloud Native AI & Inference Day | Community Free Pass | 1 | $0 | QRIS Instant Payment | `paid` |
| 4 | **user@gmail.com** | React & Next.js Architecture Conf | All-Access Pass | 1 | $119 | Virtual Account BCA / Mandiri | `pending` |
| 5 | **anisa.rahma@gmail.com** | React & Next.js Architecture Conf | Developer Pass | 2 | $98 | QRIS Instant Payment | `paid` |
| 6 | **anisa.rahma@gmail.com** | Design Systems & AI Interfaces Master | Studio Workshop | 1 | $59 | GoPay / OVO Digital Wallet | `paid` |
| 7 | **dimas.pratama@gmail.com** | KubeCon + CloudNativeCon NA 2026 | Regular Pass | 1 | $299 | Corporate Invoice / Wire | `paid` |
| 8 | **dimas.pratama@gmail.com** | CiliumCon: eBPF Networking & Security | Engineer Plus | 1 | $149 | Visa / Mastercard | `paid` |
| 9 | **siti.nurhaliza@gmail.com** | PyTorch Day & Open Source AI Forum | Deep Dive Pass | 1 | $129 | Semina Pay (SeWallet) | `paid` |
| 10 | **siti.nurhaliza@gmail.com** | Distributed Ray & Large LLM Training | Hands-on Masterclass | 1 | $199 | Visa / Mastercard | `pending` |
| 11 | **kevin.wijaya@gmail.com** | Open Source SecurityCon & Supply Chain | Executive Security Pass | 1 | $139 | Corporate Invoice / Wire | `paid` |
| 12 | **kevin.wijaya@gmail.com** | Confidential Computing & Sovereign Cloud | Enterprise VIP | 1 | $175 | Virtual Account BCA / Mandiri | `paid` |
| 13 | **putri.maharani@gmail.com** | Platform Eng & Developer Portals Day | Free Community | 1 | $0 | QRIS Instant Payment | `paid` |
| 14 | **reza.octavian@gmail.com** | gRPConf & High-Performance Services | On-Site Pass | 2 | $90 | GoPay / OVO Digital Wallet | `paid` |
| 15 | **clara.kusuma@gmail.com** | Voice Agents & Real-Time Multimodal AI | All-Inclusive Pass | 1 | $120 | Semina Pay (SeWallet) | `pending` |
| 16 | **fajar.nugroho@gmail.com** | BackstageCon & Dev Experience Summit | In-Person Plus | 1 | $69 | Visa / Mastercard | `paid` |
| 17 | **maya.indira@gmail.com** | Design Systems & AI Interfaces Master | Community Access | 1 | $0 | QRIS Instant Payment | `paid` |
| 18 | **maya.indira@gmail.com** | Observability Day: OpenTelemetry Scale | VIP Networking Pass | 1 | $49 | Virtual Account BCA / Mandiri | `paid` |

---

## 8. Database Restore & Verification Commands

```bash
# 1. Scrape real conference & speaker data (optional, raw data already stored in scraped-events-raw.json):
cd semina-api
npm run scrape:seed

# 2. Re-seed MongoDB database with 9 collections & generate this backup:
npm run seed

# 3. Verify Public Events API endpoint:
curl -s http://localhost:9000/api/v1/participants/events | jq '.data | length'
# Output -> 15

# 4. Verify Public Payments API endpoint:
curl -s http://localhost:9000/api/v1/participants/payments | jq '.data | length'
# Output -> 6
```
