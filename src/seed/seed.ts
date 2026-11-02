import * as fs from "fs";
import * as path from "path";
import mongoose from "mongoose";
import { connectToDb } from "../app/db";
import Organizers from "../app/api/v1/organizers/model";
import Users from "../app/api/v1/users/model";
import Categories from "../app/api/v1/categories/model";
import Images from "../app/api/v1/images/model";
import Talents from "../app/api/v1/talents/model";
import Events from "../app/api/v1/events/model";
import Payments from "../app/api/v1/payments/model";
import Participants from "../app/api/v1/participants/model";
import Orders from "../app/api/v1/orders/model";

interface SeedImageDef {
  name: string;
}

interface SeedCategoryDef {
  name: string;
}

interface SeedTalentDef {
  name: string;
  role: string;
  imageName: string;
}

interface SeedPaymentDef {
  type: string;
  imageName: string;
}

interface SeedTicketDef {
  type: string;
  price: number;
  stock: number;
  statusTicketCategories: boolean;
  expired: Date;
}

interface SeedEventDef {
  title: string;
  date: Date;
  about: string;
  tagline: string;
  keyPoint: string[];
  venueName: string;
  statusEvent: "Draft" | "Published";
  tickets: SeedTicketDef[];
  imageName: string;
  categoryName: string;
  talentName: string;
}

interface SeedParticipantDef {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status: "aktif" | "tidak aktif";
  otp?: string;
}

interface SeedOrderDef {
  participantEmail: string;
  eventTitle: string;
  ticketType: string;
  ticketCount: number;
  paymentType: string;
  status: "pending" | "paid";
  date: Date;
}

const seed = async () => {
  try {
    console.log("=== Starting Semina Comprehensive Seed Workflow ===");
    await connectToDb();
    console.log("✓ Connected to MongoDB Atlas (db_semina)");

    // 0. Clean old placeholder & previous seed data for idempotent state
    console.log("\n[0/9] Cleaning existing collection records for clean slate...");
    await Orders.deleteMany({});
    await Events.deleteMany({});
    await Talents.deleteMany({});
    await Payments.deleteMany({});
    await Categories.deleteMany({});
    await Images.deleteMany({});
    await Users.deleteMany({});
    await Participants.deleteMany({});
    await Organizers.deleteMany({});
    console.log("✓ All 9 collections cleared successfully.");

    // 1. Organizers (3 Organizers)
    console.log("\n[1/9] Seeding Organizers...");
    const orgSemina = await Organizers.create({ organizer: "Semina" });
    const orgLinux = await Organizers.create({ organizer: "Linux Foundation & CNCF" });
    const orgSea = await Organizers.create({ organizer: "Southeast Asia Tech Guild" });
    console.log(`✓ 3 Organizers created: Semina (${orgSemina._id}), Linux Foundation (${orgLinux._id}), SEA Tech Guild (${orgSea._id})`);

    // 2. Users (5 CMS Users)
    console.log("\n[2/9] Seeding CMS Users...");
    const usersData = [
      {
        email: "admin@gmail.com",
        password: "admin123",
        name: "Super Admin",
        role: "owner" as const,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      },
      {
        email: "organizer@semina.id",
        password: "semina123",
        name: "Rizky Pratama",
        role: "organizer" as const,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      },
      {
        email: "staff@semina.id",
        password: "semina123",
        name: "Nadia Kusuma",
        role: "admin" as const,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      },
      {
        email: "events@linuxfoundation.org",
        password: "semina123",
        name: "Cloud Native Ops",
        role: "organizer" as const,
        organizer: orgLinux._id as mongoose.Types.ObjectId,
      },
      {
        email: "lead@seatechguild.org",
        password: "semina123",
        name: "Arif Budiman",
        role: "organizer" as const,
        organizer: orgSea._id as mongoose.Types.ObjectId,
      },
    ];

    for (const u of usersData) {
      await Users.create(u);
    }
    console.log(`✓ 5 CMS Users created with bcrypt-hashed credentials.`);

    // 3. Images (Banners, Speaker Portraits, Payment Icons, Fallback)
    console.log("\n[3/9] Seeding Images Collection...");
    const imageNames = [
      // Event Banners (16)
      "uploads/event-kubecon-na.png",
      "uploads/event-agentics-mcp.png",
      "uploads/event-cloudnative-ai.png",
      "uploads/event-pytorch-day.png",
      "uploads/event-react-nextjs.png",
      "uploads/event-ciliumcon.png",
      "uploads/event-platform-eng.png",
      "uploads/event-observability-day.png",
      "uploads/event-opensource-security.png",
      "uploads/event-voice-agents.png",
      "uploads/event-distributed-ray.png",
      "uploads/event-backstagecon.jpg",
      "uploads/event-grpconf-asia.jpg",
      "uploads/event-confidential-computing.png",
      "uploads/event-design-systems.png",
      "uploads/event-embedded-linux.jpg",
      // Speaker Portraits (14)
      "uploads/speaker-jaana-dogan.jpeg",
      "uploads/speaker-lucy-sweet.jpg",
      "uploads/speaker-robert-nishihara.jpg",
      "uploads/speaker-tim-hockin.jpg",
      "uploads/speaker-warren-barkley.png",
      "uploads/speaker-alolita-sharma.png",
      "uploads/speaker-lin-sun.jpg",
      "uploads/speaker-ravin-kumar.jpg",
      "uploads/speaker-jorge-palma.jpg",
      "uploads/speaker-jessica-forrester.jpg",
      "uploads/speaker-vara-bonthu.jpg",
      "uploads/speaker-bassam-tabbara.jpg",
      "uploads/speaker-andjelko-iharos.jpg",
      "uploads/speaker-lorenzo-biava.png",
      // Payment Icons (6)
      "uploads/payment-va-bank.png",
      "uploads/payment-credit-card.svg",
      "uploads/payment-sewallet.svg",
      "uploads/payment-qris.png",
      "uploads/payment-digital-wallet.png",
      "uploads/payment-invoice.png",
      // Fallback
      "uploads/default.jpg",
    ];

    const imageMap = new Map<string, mongoose.Types.ObjectId>();
    for (const name of imageNames) {
      const doc = await Images.create({ name });
      imageMap.set(name, doc._id as mongoose.Types.ObjectId);
    }
    console.log(`✓ ${imageMap.size} Image records created.`);

    // 4. Categories (8 Categories - strictly 3-20 chars)
    console.log("\n[4/9] Seeding Categories Collection...");
    const categoryNames = [
      "AI & Agents",
      "Cloud Native",
      "Platform Eng",
      "Cybersecurity",
      "Web & Frontend",
      "Data & ML Ops",
      "Product Design",
      "Embedded & IoT",
    ];

    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const cName of categoryNames) {
      const doc = await Categories.create({
        name: cName,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      });
      categoryMap.set(cName, doc._id as mongoose.Types.ObjectId);
    }
    console.log(`✓ ${categoryMap.size} Categories created under Primary Organizer Semina.`);

    // 5. Talents / Keynote Speakers (14 Speakers)
    console.log("\n[5/9] Seeding Talents Collection...");
    const talentsData: SeedTalentDef[] = [
      {
        name: "Jaana Dogan",
        role: "Principal Software Engineer, Google",
        imageName: "uploads/speaker-jaana-dogan.jpeg",
      },
      {
        name: "Lucy Sweet",
        role: "Member of Technical Staff, Anthropic",
        imageName: "uploads/speaker-lucy-sweet.jpg",
      },
      {
        name: "Robert Nishihara",
        role: "Co-Founder & Creator of Ray, Anyscale",
        imageName: "uploads/speaker-robert-nishihara.jpg",
      },
      {
        name: "Tim Hockin",
        role: "Distinguished Engineer (Kubernetes Co-Creator), Google",
        imageName: "uploads/speaker-tim-hockin.jpg",
      },
      {
        name: "Warren Barkley",
        role: "VP of Product Management (AI Infrastructure), NVIDIA",
        imageName: "uploads/speaker-warren-barkley.png",
      },
      {
        name: "Alolita Sharma",
        role: "Observability Engineering Leader, Apple",
        imageName: "uploads/speaker-alolita-sharma.png",
      },
      {
        name: "Lin Sun",
        role: "Head of Open Source & Istio Maintainer, Solo.io",
        imageName: "uploads/speaker-lin-sun.jpg",
      },
      {
        name: "Ravin Kumar",
        role: "Staff Research Engineer, Google DeepMind",
        imageName: "uploads/speaker-ravin-kumar.jpg",
      },
      {
        name: "Jorge Palma",
        role: "Principal PM Lead (Azure Kubernetes Service), Microsoft",
        imageName: "uploads/speaker-jorge-palma.jpg",
      },
      {
        name: "Jessica Forrester",
        role: "Senior Distinguished Engineer, Red Hat",
        imageName: "uploads/speaker-jessica-forrester.jpg",
      },
      {
        name: "Vara Bonthu",
        role: "Principal Open Source Specialist SA, AWS",
        imageName: "uploads/speaker-vara-bonthu.jpg",
      },
      {
        name: "Bassam Tabbara",
        role: "Founder & CEO (Crossplane Creator), Upbound",
        imageName: "uploads/speaker-bassam-tabbara.jpg",
      },
      {
        name: "Andjelko Iharos",
        role: "VP of Architecture, HAProxy Technologies",
        imageName: "uploads/speaker-andjelko-iharos.jpg",
      },
      {
        name: "Lorenzo Biava",
        role: "Staff Infrastructure Engineer, LiveKit",
        imageName: "uploads/speaker-lorenzo-biava.png",
      },
    ];

    const talentMap = new Map<string, mongoose.Types.ObjectId>();
    for (const t of talentsData) {
      const imgId = imageMap.get(t.imageName) || imageMap.get("uploads/default.jpg")!;
      const doc = await Talents.create({
        name: t.name,
        role: t.role,
        image: imgId,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      });
      talentMap.set(t.name, doc._id as mongoose.Types.ObjectId);
    }
    console.log(`✓ ${talentMap.size} Talents created.`);

    // 6. Payments (6 Payment Methods)
    console.log("\n[6/9] Seeding Payments Collection...");
    const paymentsData: SeedPaymentDef[] = [
      { type: "Virtual Account BCA / Mandiri", imageName: "uploads/payment-va-bank.png" },
      { type: "Visa / Mastercard Credit Card", imageName: "uploads/payment-credit-card.svg" },
      { type: "Semina Pay (SeWallet)", imageName: "uploads/payment-sewallet.svg" },
      { type: "QRIS Instant Payment", imageName: "uploads/payment-qris.png" },
      { type: "GoPay / OVO Digital Wallet", imageName: "uploads/payment-digital-wallet.png" },
      { type: "Corporate Invoice / Wire Transfer", imageName: "uploads/payment-invoice.png" },
    ];

    const paymentMap = new Map<string, mongoose.Types.ObjectId>();
    for (const p of paymentsData) {
      const imgId = imageMap.get(p.imageName) || imageMap.get("uploads/default.jpg")!;
      const doc = await Payments.create({
        type: p.type,
        image: imgId,
        status: true,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      });
      paymentMap.set(p.type, doc._id as mongoose.Types.ObjectId);
    }
    console.log(`✓ ${paymentMap.size} Payment methods created.`);

    // 7. Events (16 Events: 15 Published + 1 Draft)
    console.log("\n[7/9] Seeding Events Collection...");
    const eventsData: SeedEventDef[] = [
      {
        title: "KubeCon + CloudNativeCon NA 2026",
        date: new Date("2026-11-17T09:00:00.000Z"),
        about:
          "The Cloud Native Computing Foundation flagship conference gathers adopters and technologists from leading open source and cloud native communities in Salt Lake City, Utah. Join thousands of engineers, maintainers, and platform leaders as we explore the future of distributed systems, multi-cloud scalability, and autonomous Kubernetes orchestration.\n\nAttendees will participate in technical deep dives, keynotes by community pioneers, hands-on architectural clinics, and lightning talks on cloud resilience.",
        tagline: "The premier gathering for cloud native computing and Kubernetes",
        keyPoint: [
          "Master multi-cluster Kubernetes topology and declarative gitops at petabyte scale",
          "Hardening container runtimes with eBPF-driven zero trust security policies",
          "Automating developer control planes with Crossplane and Backstage plugins",
          "Architecting low-latency edge AI serving with WebAssembly and KubeEdge",
        ],
        venueName: "Salt Palace Convention Center, Salt Lake City",
        statusEvent: "Published",
        imageName: "uploads/event-kubecon-na.png",
        categoryName: "Cloud Native",
        talentName: "Tim Hockin",
        tickets: [
          {
            type: "Early Bird",
            price: 149,
            stock: 250,
            statusTicketCategories: true,
            expired: new Date("2026-10-31T23:59:59.000Z"),
          },
          {
            type: "Regular Pass",
            price: 299,
            stock: 500,
            statusTicketCategories: true,
            expired: new Date("2026-11-16T23:59:59.000Z"),
          },
          {
            type: "VIP All-Access",
            price: 599,
            stock: 100,
            statusTicketCategories: true,
            expired: new Date("2026-11-16T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Agentics Day: MCP + AI Agents Summit",
        date: new Date("2026-11-20T08:30:00.000Z"),
        about:
          "Agentics Day is the premier summit dedicated to Model Context Protocol (MCP), autonomous multi-agent swarms, and tool-augmented LLM architectures. Discover how production engineering teams connect foundational models to complex enterprise workflows, real-time tool devices, and structured sandboxes.\n\nFeaturing interactive sessions by leading frontier AI researchers and system architects, attendees will gain actionable knowledge for building robust agent evaluation pipelines.",
        tagline: "Building autonomous systems with Model Context Protocol & Agents",
        keyPoint: [
          "Deep dive into Model Context Protocol (MCP) server & client architectures",
          "Designing deterministic tool execution sandboxes with formal capability boundaries",
          "Reliable state recovery, memory hierarchies, and multi-agent consensus",
          "Benchmarking agent reliability with automated E2E adversarial test harnesses",
        ],
        venueName: "Moscone Center, San Francisco & Hybrid",
        statusEvent: "Published",
        imageName: "uploads/event-agentics-mcp.png",
        categoryName: "AI & Agents",
        talentName: "Lucy Sweet",
        tickets: [
          {
            type: "Standard Pass",
            price: 89,
            stock: 300,
            statusTicketCategories: true,
            expired: new Date("2026-11-19T23:59:59.000Z"),
          },
          {
            type: "Pro Workshop Pass",
            price: 179,
            stock: 150,
            statusTicketCategories: true,
            expired: new Date("2026-11-19T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Cloud Native AI & Inference Day",
        date: new Date("2026-12-05T09:00:00.000Z"),
        about:
          "Connecting high-performance GPU clusters, vLLM acceleration, and Kubernetes-native AI infrastructure in Southeast Asia. This conference focuses on the operational challenges of serving modern large multimodal models with sub-second latency and minimal infrastructure overhead.\n\nFrom dynamic batching algorithms to Kubernetes scheduling optimizations for heterogeneous accelerators, learn the exact engineering patterns powering production AI platforms.",
        tagline: "High-performance inference and GPU infrastructure on Kubernetes",
        keyPoint: [
          "Optimizing speculative decoding and continuous batching in production",
          "Kubernetes DRA (Dynamic Resource Allocation) for GPU and NPU clusters",
          "Cost-efficient auto-scaling strategies for spiky inference workloads",
          "Observability and drift detection across distributed model replicas",
        ],
        venueName: "Jakarta Convention Center, Indonesia",
        statusEvent: "Published",
        imageName: "uploads/event-cloudnative-ai.png",
        categoryName: "AI & Agents",
        talentName: "Warren Barkley",
        tickets: [
          {
            type: "Community Free Pass",
            price: 0,
            stock: 400,
            statusTicketCategories: true,
            expired: new Date("2026-12-04T23:59:59.000Z"),
          },
          {
            type: "Pro Executive Pass",
            price: 99,
            stock: 120,
            statusTicketCategories: true,
            expired: new Date("2026-12-04T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "PyTorch Day & Open Source AI Forum",
        date: new Date("2026-12-12T10:00:00.000Z"),
        about:
          "PyTorch Day Japan brings together the global PyTorch research and engineering community for an intensive exploration of compiled models, TorchDynamo, distributed training topologies, and ONNX deployment.\n\nParticipants will learn directly from deep learning core developers how to accelerate model training and fine-tune foundation models efficiently on commodity hardware.",
        tagline: "Core architectures and distributed optimization with PyTorch",
        keyPoint: [
          "Mastering torch.compile, Triton kernels, and memory-efficient attention",
          "FSDP (Fully Sharded Data Parallel) v2 for multi-billion parameter models",
          "Quantization techniques: FP8, INT4 AWQ, and runtime speedups",
          "Bridging research prototypes into production microservices",
        ],
        venueName: "Tokyo International Forum, Japan",
        statusEvent: "Published",
        imageName: "uploads/event-pytorch-day.png",
        categoryName: "Data & ML Ops",
        talentName: "Ravin Kumar",
        tickets: [
          {
            type: "General Admission",
            price: 59,
            stock: 350,
            statusTicketCategories: true,
            expired: new Date("2026-12-11T23:59:59.000Z"),
          },
          {
            type: "Deep Dive Pass",
            price: 129,
            stock: 100,
            statusTicketCategories: true,
            expired: new Date("2026-12-11T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "React & Next.js Architecture Conf",
        date: new Date("2027-01-15T09:30:00.000Z"),
        about:
          "The definitive Southeast Asian conference on high-performance frontend engineering. Explore React 19 Server Components, Turbopack bundling internals, partial prerendering (PPR), and resilient state synchronization.\n\nDesigned for senior engineers and engineering directors, this event offers practical insights into reducing bundle size, improving INP scores, and scaling design systems across teams.",
        tagline: "Next-generation frontend systems, RSC, and streaming web apps",
        keyPoint: [
          "Architectural patterns with React Server Components & Server Actions",
          "Optimizing Core Web Vitals (LCP, INP, CLS) in massive Next.js apps",
          "Type-safe data fetching with TanStack Query and server validation",
          "Micro-frontends versus unified monolithic architectures in enterprise",
        ],
        venueName: "Marina Bay Sands Expo, Singapore",
        statusEvent: "Published",
        imageName: "uploads/event-react-nextjs.png",
        categoryName: "Web & Frontend",
        talentName: "Jaana Dogan",
        tickets: [
          {
            type: "Developer Pass",
            price: 49,
            stock: 300,
            statusTicketCategories: true,
            expired: new Date("2027-01-14T23:59:59.000Z"),
          },
          {
            type: "All-Access Pass",
            price: 119,
            stock: 150,
            statusTicketCategories: true,
            expired: new Date("2027-01-14T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "CiliumCon: eBPF Networking & Security",
        date: new Date("2027-01-22T09:00:00.000Z"),
        about:
          "CiliumCon is dedicated to eBPF-powered container networking, service mesh without sidecars, and real-time security observability with Tetragon. Learn how global enterprises replace traditional IP tables and iptables proxies with high-speed kernel bytecode.\n\nGain hands-on knowledge in debugging network latency, enforcing mutual TLS transparently, and detecting kernel anomalies in real-time.",
        tagline: "Revolutionizing cloud native networking and security with eBPF",
        keyPoint: [
          "Sidecarless Service Mesh architecture using Cilium eBPF",
          "Real-time kernel runtime enforcement and forensics with Tetragon",
          "High-throughput load balancing and BGP routing integration",
          "Zero-trust microsegmentation and transparent mTLS encryption",
        ],
        venueName: "Barcelona International Convention Centre, Spain",
        statusEvent: "Published",
        imageName: "uploads/event-ciliumcon.png",
        categoryName: "Cybersecurity",
        talentName: "Lin Sun",
        tickets: [
          {
            type: "Standard Ticket",
            price: 75,
            stock: 200,
            statusTicketCategories: true,
            expired: new Date("2027-01-21T23:59:59.000Z"),
          },
          {
            type: "Engineer Plus",
            price: 149,
            stock: 80,
            statusTicketCategories: true,
            expired: new Date("2027-01-21T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Platform Eng & Developer Portals Day",
        date: new Date("2027-02-10T09:00:00.000Z"),
        about:
          "Empowering software engineering organizations through internal developer platforms (IDP), self-service infrastructure blueprints, and unified developer portals.\n\nDiscover how platform teams reduce cognitive load, automate compliance checks, and enable developers to provision cloud databases, compute nodes, and DNS entries safely in seconds.",
        tagline: "Accelerating engineering velocity with internal developer platforms",
        keyPoint: [
          "Designing intuitive self-service APIs with Crossplane and Kubernetes CRDs",
          "Measuring developer productivity and golden paths with DORA metrics",
          "Building customized Backstage catalogs and automated scaffolding templates",
          "Governing infrastructure drift with policy-as-code and Open Policy Agent",
        ],
        venueName: "Sheraton Grand Jakarta, Indonesia",
        statusEvent: "Published",
        imageName: "uploads/event-platform-eng.png",
        categoryName: "Platform Eng",
        talentName: "Bassam Tabbara",
        tickets: [
          {
            type: "Free Community",
            price: 0,
            stock: 350,
            statusTicketCategories: true,
            expired: new Date("2027-02-09T23:59:59.000Z"),
          },
          {
            type: "Workshop Pass",
            price: 79,
            stock: 120,
            statusTicketCategories: true,
            expired: new Date("2027-02-09T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Observability Day: OpenTelemetry Scale",
        date: new Date("2027-02-18T09:00:00.000Z"),
        about:
          "OpenTelemetry has become the industry standard for distributed traces, metrics, and structured logs. This summit addresses the challenge of running telemetry collectors and storage backends at billion-event daily scale.\n\nLearn strategies for trace sampling, semantic conventions, Prometheus alerting tuning, and correlating application telemetry with cloud cost telemetry.",
        tagline: "Unified traces, metrics, and logs with OpenTelemetry & Prometheus",
        keyPoint: [
          "Scalable collector topologies: load balancing and head/tail-based sampling",
          "Standardizing application instrumentation across polyglot microservices",
          "Correlating distributed tracing with CPU profiling and memory leak dumps",
          "Building high-cardinality monitoring pipelines without budget overruns",
        ],
        venueName: "ICE BSD City, Tangerang",
        statusEvent: "Published",
        imageName: "uploads/event-observability-day.png",
        categoryName: "Cloud Native",
        talentName: "Alolita Sharma",
        tickets: [
          {
            type: "Free Community Pass",
            price: 0,
            stock: 500,
            statusTicketCategories: true,
            expired: new Date("2027-02-17T23:59:59.000Z"),
          },
          {
            type: "VIP Networking Pass",
            price: 49,
            stock: 150,
            statusTicketCategories: true,
            expired: new Date("2027-02-17T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Open Source SecurityCon & Supply Chain",
        date: new Date("2027-03-05T09:30:00.000Z"),
        about:
          "Supply chain integrity has become the foremost security frontier for software teams. This conference brings together open source maintainers, cryptographers, and enterprise security leaders in Kuala Lumpur.\n\nSessions cover SLSA framework compliance, cryptographic artifact signing with Sigstore, automated dependency attestation, and rapid response mechanisms for zero-day vulnerabilities.",
        tagline: "Securing the open source software supply chain and CI/CD pipelines",
        keyPoint: [
          "Implementing SLSA Level 3 provenance in automated GitHub Actions pipelines",
          "Artifact signing, verification, and transparency logs with Cosign & Rekor",
          "Automated SBOM generation, vulnerability scanning, and license compliance",
          "Hardening CI/CD runner environments against memory scraping attacks",
        ],
        venueName: "Kuala Lumpur Convention Centre, Malaysia",
        statusEvent: "Published",
        imageName: "uploads/event-opensource-security.png",
        categoryName: "Cybersecurity",
        talentName: "Jessica Forrester",
        tickets: [
          {
            type: "Regular Admission",
            price: 65,
            stock: 250,
            statusTicketCategories: true,
            expired: new Date("2027-03-04T23:59:59.000Z"),
          },
          {
            type: "Executive Security Pass",
            price: 139,
            stock: 90,
            statusTicketCategories: true,
            expired: new Date("2027-03-04T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Voice Agents & Real-Time Multimodal AI",
        date: new Date("2027-03-15T09:00:00.000Z"),
        about:
          "Real-time bidirectional voice agents demand low-latency WebRTC pipelines, streaming speech-to-text, and conversational turn-taking algorithms. Held in the picturesque Bali Nusa Dua Convention Center, this forum explores modern audio AI systems.\n\nLearn how to build conversational AI agents that listen, interrupt gracefully, and execute asynchronous database queries with natural human speech latency under 300 milliseconds.",
        tagline: "Low-latency WebRTC streaming, voice AI, and multimodal agents",
        keyPoint: [
          "Sub-300ms speech-to-speech architectures with WebRTC and LiveKit",
          "Handling conversational barge-in, voice activity detection, and interruptions",
          "Function calling and context management in continuous voice streams",
          "Deploying edge voice pipelines on regional CDN media servers",
        ],
        venueName: "Bali Nusa Dua Convention Center, Indonesia",
        statusEvent: "Published",
        imageName: "uploads/event-voice-agents.png",
        categoryName: "AI & Agents",
        talentName: "Lorenzo Biava",
        tickets: [
          {
            type: "Early Registration",
            price: 55,
            stock: 200,
            statusTicketCategories: true,
            expired: new Date("2027-03-14T23:59:59.000Z"),
          },
          {
            type: "All-Inclusive Pass",
            price: 120,
            stock: 100,
            statusTicketCategories: true,
            expired: new Date("2027-03-14T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Distributed Ray & Large LLM Training",
        date: new Date("2027-03-25T09:00:00.000Z"),
        about:
          "An intensive engineering workshop focused on Ray Train, Ray Data, and vLLM integration for enterprise machine learning. Discover how Anyscale and leading AI labs coordinate thousands of GPU cores for pre-training and alignment.\n\nDive into actor-based scheduling, distributed tensor checkpoints, and pipeline parallelisms that prevent costly node failure interruptions.",
        tagline: "Scaling distributed computation, RLHF, and LLM fine-tuning with Ray",
        keyPoint: [
          "Architecting distributed Ray clusters on top of AWS, GCP, and bare metal",
          "Ray Data streaming ingest for terabyte-scale multimodal datasets",
          "Fine-tuning LLMs with DeepSpeed ZeRO-3 and Ray Train integration",
          "Elastic cluster scaling and fault-tolerant checkpoint resumption",
        ],
        venueName: "Grand Hyatt Singapore",
        statusEvent: "Published",
        imageName: "uploads/event-distributed-ray.png",
        categoryName: "Data & ML Ops",
        talentName: "Robert Nishihara",
        tickets: [
          {
            type: "Engineer Pass",
            price: 95,
            stock: 180,
            statusTicketCategories: true,
            expired: new Date("2027-03-24T23:59:59.000Z"),
          },
          {
            type: "Hands-on Masterclass",
            price: 199,
            stock: 60,
            statusTicketCategories: true,
            expired: new Date("2027-03-24T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "BackstageCon & Dev Experience Summit",
        date: new Date("2027-04-08T09:00:00.000Z"),
        about:
          "BackstageCon brings together Spotify, AWS, Red Hat, and global contributors to discuss Spotify Backstage in production. Learn how to transform internal documentation, API catalogs, and deployment templates into an intuitive single pane of glass.\n\nHear real case studies on overcoming plugin maintainability overhead, integrating LDAP and RBAC permissions, and unifying enterprise developer tooling.",
        tagline: "Mastering Backstage service catalogs, plugins, and developer empathy",
        keyPoint: [
          "Building production-grade custom plugins with React and TypeScript",
          "Federating software catalogs across heterogeneous cloud providers",
          "Automating repo creation with Backstage Software Templates and GitOps",
          "Aligning developer experience metrics with engineering retention",
        ],
        venueName: "Bangkok Digital Park, Thailand",
        statusEvent: "Published",
        imageName: "uploads/event-backstagecon.jpg",
        categoryName: "Platform Eng",
        talentName: "Vara Bonthu",
        tickets: [
          {
            type: "Free Online Pass",
            price: 0,
            stock: 500,
            statusTicketCategories: true,
            expired: new Date("2027-04-07T23:59:59.000Z"),
          },
          {
            type: "In-Person Plus",
            price: 69,
            stock: 150,
            statusTicketCategories: true,
            expired: new Date("2027-04-07T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "gRPConf & High-Performance Services",
        date: new Date("2027-04-16T10:00:00.000Z"),
        about:
          "gRPC powers low-latency microservice communication across Google, HAProxy, and high-frequency trading platforms. This conference focuses on Protocol Buffers v3, HTTP/2 multiplexing, connection pooling, and load balancing.\n\nEngineers will learn optimization techniques in Go, Rust, and C++ that shave microseconds off internal API transit times.",
        tagline: "High-throughput, low-latency microservices with gRPC and Protobuf",
        keyPoint: [
          "Benchmarking gRPC vs REST vs GraphQL in ultra-high concurrency systems",
          "Connection pooling, health checking, and client-side load balancing",
          "Streaming gRPC pipelines for real-time telemetry and financial feeds",
          "gRPC-Web and Envoy gateway patterns for browser-direct communication",
        ],
        venueName: "Bengaluru Tech Summit Hall & Online",
        statusEvent: "Published",
        imageName: "uploads/event-grpconf-asia.jpg",
        categoryName: "Web & Frontend",
        talentName: "Andjelko Iharos",
        tickets: [
          {
            type: "Virtual Free Pass",
            price: 0,
            stock: 600,
            statusTicketCategories: true,
            expired: new Date("2027-04-15T23:59:59.000Z"),
          },
          {
            type: "On-Site Pass",
            price: 45,
            stock: 200,
            statusTicketCategories: true,
            expired: new Date("2027-04-15T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Confidential Computing & Sovereign Cloud",
        date: new Date("2027-04-28T09:00:00.000Z"),
        about:
          "Hardware-based Trusted Execution Environments (TEEs), Intel SGX, AMD SEV-SNP, and confidential containers on Kubernetes. As sovereign cloud mandates expand across Asia and Europe, confidential computing ensures data remains encrypted in use.\n\nExplore real-world case studies in privacy-preserving collaborative machine learning, multi-party computation, and confidential inference for healthcare and banking.",
        tagline: "Hardware-enforced zero trust and encrypted compute in the cloud",
        keyPoint: [
          "Deploying confidential containers on AKS and managed Kubernetes",
          "Cryptographic attestation verification before workload decryption",
          "Protecting proprietary LLM weights from host and cloud provider snooping",
          "Regulatory compliance with regional data sovereignty frameworks",
        ],
        venueName: "Pacific Place Jakarta, Indonesia",
        statusEvent: "Published",
        imageName: "uploads/event-confidential-computing.png",
        categoryName: "Cybersecurity",
        talentName: "Jorge Palma",
        tickets: [
          {
            type: "Professional Pass",
            price: 85,
            stock: 160,
            statusTicketCategories: true,
            expired: new Date("2027-04-27T23:59:59.000Z"),
          },
          {
            type: "Enterprise VIP",
            price: 175,
            stock: 75,
            statusTicketCategories: true,
            expired: new Date("2027-04-27T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Design Systems & AI Interfaces Master",
        date: new Date("2027-05-12T09:00:00.000Z"),
        about:
          "A human-centered design masterclass for modern software teams. Learn how to architect multi-brand design systems, tokenized design systems in Figma and Tailwind, and intuitive interface patterns for non-deterministic AI outputs.\n\nFrom accessible contrast ratios to graceful streaming text transitions, this workshop equips product designers and frontend engineers with battle-tested UI guidelines.",
        tagline: "Human-centered UI systems, design tokens, and conversational UX",
        keyPoint: [
          "Building scalable multi-theme design tokens with Style Dictionary & Tailwind",
          "Designing for AI latency: skeletons, streaming tokens, and optimistic UI",
          "Accessible WCAG 2.2 compliant component libraries and keyboard flows",
          "Design system governance, versioning, and cross-team adoption metrics",
        ],
        venueName: "Ciputra Artpreneur Jakarta, Indonesia",
        statusEvent: "Published",
        imageName: "uploads/event-design-systems.png",
        categoryName: "Product Design",
        talentName: "Jaana Dogan",
        tickets: [
          {
            type: "Community Access",
            price: 0,
            stock: 300,
            statusTicketCategories: true,
            expired: new Date("2027-05-11T23:59:59.000Z"),
          },
          {
            type: "Studio Workshop",
            price: 59,
            stock: 100,
            statusTicketCategories: true,
            expired: new Date("2027-05-11T23:59:59.000Z"),
          },
        ],
      },
      {
        title: "Embedded Linux & RISC-V Edge Workshop",
        date: new Date("2027-05-25T09:00:00.000Z"),
        about:
          "A comprehensive deep dive into custom board bring-up, Yocto Project builds, device trees, and RISC-V hardware acceleration for industrial IoT devices.\n\nThis event is currently in Draft status for CMS review and administrative staging. It demonstrates how draft events remain invisible on public browse pages while remaining fully editable within the organizer CMS.",
        tagline: "Kernel development, Yocto configurations, and RISC-V architectures",
        keyPoint: [
          "Compiling customized real-time Linux kernels with PREEMPT_RT patches",
          "Building reproducible root filesystems using the Yocto Project & BitBake",
          "Interfacing hardware sensors via I2C, SPI, and CAN bus drivers in Linux",
          "Running quantized edge vision models on low-power RISC-V boards",
        ],
        venueName: "Tokyo Big Sight, Japan",
        statusEvent: "Draft",
        imageName: "uploads/event-embedded-linux.jpg",
        categoryName: "Embedded & IoT",
        talentName: "Tim Hockin",
        tickets: [
          {
            type: "Workshop Pass",
            price: 110,
            stock: 50,
            statusTicketCategories: true,
            expired: new Date("2027-05-24T23:59:59.000Z"),
          },
        ],
      },
    ];

    const eventMap = new Map<string, any>();
    for (const e of eventsData) {
      const imgId = imageMap.get(e.imageName) || imageMap.get("uploads/default.jpg")!;
      const catId = categoryMap.get(e.categoryName)!;
      const talId = talentMap.get(e.talentName)!;

      const doc = await Events.create({
        title: e.title,
        date: e.date,
        about: e.about,
        tagline: e.tagline,
        keyPoint: e.keyPoint,
        venueName: e.venueName,
        statusEvent: e.statusEvent,
        tickets: e.tickets,
        image: imgId,
        category: catId,
        talent: talId,
        organizer: orgSemina._id as mongoose.Types.ObjectId,
      });
      eventMap.set(e.title, doc);
    }
    console.log(`✓ ${eventMap.size} Events created (15 Published, 1 Draft).`);

    // 8. Participants (11 Participants: 10 Active + 1 Inactive OTP)
    console.log("\n[8/9] Seeding Participants Collection...");
    const participantsData: SeedParticipantDef[] = [
      {
        firstName: "Budi",
        lastName: "Santoso",
        email: "user@gmail.com",
        password: "user123",
        role: "Product Designer",
        status: "aktif",
      },
      {
        firstName: "Anisa",
        lastName: "Rahmawati",
        email: "anisa.rahma@gmail.com",
        password: "user123",
        role: "Senior Frontend Engineer",
        status: "aktif",
      },
      {
        firstName: "Dimas",
        lastName: "Pratama",
        email: "dimas.pratama@gmail.com",
        password: "user123",
        role: "Cloud Infrastructure Architect",
        status: "aktif",
      },
      {
        firstName: "Siti",
        lastName: "Nurhaliza",
        email: "siti.nurhaliza@gmail.com",
        password: "user123",
        role: "AI Research Engineer",
        status: "aktif",
      },
      {
        firstName: "Kevin",
        lastName: "Wijaya",
        email: "kevin.wijaya@gmail.com",
        password: "user123",
        role: "DevSecOps Lead",
        status: "aktif",
      },
      {
        firstName: "Putri",
        lastName: "Maharani",
        email: "putri.maharani@gmail.com",
        password: "user123",
        role: "Product Manager",
        status: "aktif",
      },
      {
        firstName: "Reza",
        lastName: "Octavian",
        email: "reza.octavian@gmail.com",
        password: "user123",
        role: "Fullstack Developer",
        status: "aktif",
      },
      {
        firstName: "Clara",
        lastName: "Kusuma",
        email: "clara.kusuma@gmail.com",
        password: "user123",
        role: "Data Scientist",
        status: "aktif",
      },
      {
        firstName: "Fajar",
        lastName: "Nugroho",
        email: "fajar.nugroho@gmail.com",
        password: "user123",
        role: "Platform Engineer",
        status: "aktif",
      },
      {
        firstName: "Maya",
        lastName: "Indira",
        email: "maya.indira@gmail.com",
        password: "user123",
        role: "UX Researcher",
        status: "aktif",
      },
      {
        firstName: "Hendra",
        lastName: "Saputra",
        email: "pending.user@gmail.com",
        password: "user123",
        role: "Backend Developer",
        status: "tidak aktif",
        otp: "654321",
      },
    ];

    const participantMap = new Map<string, any>();
    for (const p of participantsData) {
      const doc = await Participants.create({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        password: p.password,
        role: p.role,
        status: p.status,
        otp: p.otp,
        otpExpiresAt: p.otp ? new Date(Date.now() + 24 * 3600 * 1000) : undefined,
      });
      participantMap.set(p.email, doc);
    }
    console.log(`✓ ${participantMap.size} Participants created with hashed passwords.`);

    // 9. Orders (18 Realistic Orders: 4 for user@gmail.com + 14 across others)
    console.log("\n[9/9] Seeding Orders Collection...");
    const ordersData: SeedOrderDef[] = [
      // 4 Orders for Primary Demo User: user@gmail.com (Budi Santoso)
      {
        participantEmail: "user@gmail.com",
        eventTitle: "KubeCon + CloudNativeCon NA 2026",
        ticketType: "VIP All-Access",
        ticketCount: 1,
        paymentType: "Visa / Mastercard Credit Card",
        status: "paid",
        date: new Date("2026-10-15T14:30:00.000Z"),
      },
      {
        participantEmail: "user@gmail.com",
        eventTitle: "Agentics Day: MCP + AI Agents Summit",
        ticketType: "Pro Workshop Pass",
        ticketCount: 2,
        paymentType: "Semina Pay (SeWallet)",
        status: "paid",
        date: new Date("2026-10-18T10:15:00.000Z"),
      },
      {
        participantEmail: "user@gmail.com",
        eventTitle: "Cloud Native AI & Inference Day",
        ticketType: "Community Free Pass",
        ticketCount: 1,
        paymentType: "QRIS Instant Payment",
        status: "paid",
        date: new Date("2026-10-22T08:45:00.000Z"),
      },
      {
        participantEmail: "user@gmail.com",
        eventTitle: "React & Next.js Architecture Conf",
        ticketType: "All-Access Pass",
        ticketCount: 1,
        paymentType: "Virtual Account BCA / Mandiri",
        status: "pending",
        date: new Date("2026-10-25T16:20:00.000Z"),
      },
      // 14 Orders for other participants
      {
        participantEmail: "anisa.rahma@gmail.com",
        eventTitle: "React & Next.js Architecture Conf",
        ticketType: "Developer Pass",
        ticketCount: 2,
        paymentType: "QRIS Instant Payment",
        status: "paid",
        date: new Date("2026-10-10T11:00:00.000Z"),
      },
      {
        participantEmail: "anisa.rahma@gmail.com",
        eventTitle: "Design Systems & AI Interfaces Master",
        ticketType: "Studio Workshop",
        ticketCount: 1,
        paymentType: "GoPay / OVO Digital Wallet",
        status: "paid",
        date: new Date("2026-10-12T13:30:00.000Z"),
      },
      {
        participantEmail: "dimas.pratama@gmail.com",
        eventTitle: "KubeCon + CloudNativeCon NA 2026",
        ticketType: "Regular Pass",
        ticketCount: 1,
        paymentType: "Corporate Invoice / Wire Transfer",
        status: "paid",
        date: new Date("2026-10-14T09:00:00.000Z"),
      },
      {
        participantEmail: "dimas.pratama@gmail.com",
        eventTitle: "CiliumCon: eBPF Networking & Security",
        ticketType: "Engineer Plus",
        ticketCount: 1,
        paymentType: "Visa / Mastercard Credit Card",
        status: "paid",
        date: new Date("2026-10-16T15:00:00.000Z"),
      },
      {
        participantEmail: "siti.nurhaliza@gmail.com",
        eventTitle: "PyTorch Day & Open Source AI Forum",
        ticketType: "Deep Dive Pass",
        ticketCount: 1,
        paymentType: "Semina Pay (SeWallet)",
        status: "paid",
        date: new Date("2026-10-17T12:00:00.000Z"),
      },
      {
        participantEmail: "siti.nurhaliza@gmail.com",
        eventTitle: "Distributed Ray & Large LLM Training",
        ticketType: "Hands-on Masterclass",
        ticketCount: 1,
        paymentType: "Visa / Mastercard Credit Card",
        status: "pending",
        date: new Date("2026-10-19T14:45:00.000Z"),
      },
      {
        participantEmail: "kevin.wijaya@gmail.com",
        eventTitle: "Open Source SecurityCon & Supply Chain",
        ticketType: "Executive Security Pass",
        ticketCount: 1,
        paymentType: "Corporate Invoice / Wire Transfer",
        status: "paid",
        date: new Date("2026-10-20T10:30:00.000Z"),
      },
      {
        participantEmail: "kevin.wijaya@gmail.com",
        eventTitle: "Confidential Computing & Sovereign Cloud",
        ticketType: "Enterprise VIP",
        ticketCount: 1,
        paymentType: "Virtual Account BCA / Mandiri",
        status: "paid",
        date: new Date("2026-10-21T11:15:00.000Z"),
      },
      {
        participantEmail: "putri.maharani@gmail.com",
        eventTitle: "Platform Eng & Developer Portals Day",
        ticketType: "Free Community",
        ticketCount: 1,
        paymentType: "QRIS Instant Payment",
        status: "paid",
        date: new Date("2026-10-22T16:00:00.000Z"),
      },
      {
        participantEmail: "reza.octavian@gmail.com",
        eventTitle: "gRPConf & High-Performance Services",
        ticketType: "On-Site Pass",
        ticketCount: 2,
        paymentType: "GoPay / OVO Digital Wallet",
        status: "paid",
        date: new Date("2026-10-23T13:20:00.000Z"),
      },
      {
        participantEmail: "clara.kusuma@gmail.com",
        eventTitle: "Voice Agents & Real-Time Multimodal AI",
        ticketType: "All-Inclusive Pass",
        ticketCount: 1,
        paymentType: "Semina Pay (SeWallet)",
        status: "pending",
        date: new Date("2026-10-24T09:40:00.000Z"),
      },
      {
        participantEmail: "fajar.nugroho@gmail.com",
        eventTitle: "BackstageCon & Dev Experience Summit",
        ticketType: "In-Person Plus",
        ticketCount: 1,
        paymentType: "Visa / Mastercard Credit Card",
        status: "paid",
        date: new Date("2026-10-25T14:10:00.000Z"),
      },
      {
        participantEmail: "maya.indira@gmail.com",
        eventTitle: "Design Systems & AI Interfaces Master",
        ticketType: "Community Access",
        ticketCount: 1,
        paymentType: "QRIS Instant Payment",
        status: "paid",
        date: new Date("2026-10-26T10:05:00.000Z"),
      },
      {
        participantEmail: "maya.indira@gmail.com",
        eventTitle: "Observability Day: OpenTelemetry Scale",
        ticketType: "VIP Networking Pass",
        ticketCount: 1,
        paymentType: "Virtual Account BCA / Mandiri",
        status: "paid",
        date: new Date("2026-10-27T15:30:00.000Z"),
      },
    ];

    let orderCount = 0;
    for (const o of ordersData) {
      const part = participantMap.get(o.participantEmail);
      const ev = eventMap.get(o.eventTitle);
      const pay = paymentMap.get(o.paymentType);

      if (!part || !ev || !pay) {
        console.warn(`! Missing entity for order: ${o.eventTitle} / ${o.participantEmail}`);
        continue;
      }

      const ticketCat = ev.tickets.find((t: any) => t.type === o.ticketType) || ev.tickets[0];
      const unitPrice = ticketCat.price || 0;
      const totalPay = unitPrice * o.ticketCount;

      await Orders.create({
        date: o.date,
        personalDetail: {
          firstName: part.firstName,
          lastName: part.lastName || "Santoso",
          email: part.email,
          role: part.role || "Developer",
        },
        status: o.status,
        totalPay: totalPay,
        totalOrderTicket: o.ticketCount,
        orderItems: [
          {
            ticketCategories: {
              type: ticketCat.type,
              price: ticketCat.price,
            },
            sumTicket: o.ticketCount,
          },
        ],
        participant: part._id,
        payment: pay,
        event: ev._id,
        historyEvent: {
          title: ev.title,
          date: ev.date,
          about: ev.about,
          tagline: ev.tagline,
          keyPoint: ev.keyPoint,
          venueName: ev.venueName,
          image: ev.image,
          category: ev.category,
          talent: ev.talent,
          organizer: ev.organizer,
        },
      });
      orderCount++;
    }
    console.log(`✓ ${orderCount} Orders created with full historyEvent snapshots.`);

    // 10. Generate Markdown Backup Documentation
    console.log("\n[10/10] Generating SEED_DATA_BACKUP.md...");
    await generateMarkdownBackup({
      organizers: [orgSemina, orgLinux, orgSea],
      users: usersData,
      categories: categoryNames,
      talents: talentsData,
      payments: paymentsData,
      events: eventsData,
      participants: participantsData,
      orders: ordersData,
    });

    console.log("\n=== Semina Seeding Finished Successfully! ===");
    console.log(`Summary:
  - Organizers: 3
  - CMS Users: 5
  - Images: ${imageMap.size}
  - Categories: ${categoryMap.size}
  - Talents: ${talentMap.size}
  - Payments: ${paymentMap.size}
  - Events: ${eventMap.size} (15 Published, 1 Draft)
  - Participants: ${participantMap.size} (10 Aktif, 1 Tidak Aktif)
  - Orders: ${orderCount} (4 for user@gmail.com)
  - Markdown Backup: Written to workspace root and semina-api/
`);

    process.exit(0);
  } catch (err) {
    console.error("Fatal error during seeding:", err);
    process.exit(1);
  }
};

async function generateMarkdownBackup(data: {
  organizers: any[];
  users: any[];
  categories: string[];
  talents: SeedTalentDef[];
  payments: SeedPaymentDef[];
  events: SeedEventDef[];
  participants: SeedParticipantDef[];
  orders: SeedOrderDef[];
}) {
  const rootBackupPath = path.resolve(__dirname, "../../../SEED_DATA_BACKUP.md");
  const apiBackupPath = path.resolve(__dirname, "../../SEED_DATA_BACKUP.md");

  const md = `# Semina Production Seed Dataset & Recovery Reference

> **Generated**: ${new Date().toISOString()}  
> **Source Provenance**: Real tech conference metadata & Sessionize keynote speakers scraped via \`agent-browser\` from [Linux Foundation Events](https://events.linuxfoundation.org/about/calendar/) and [KubeCon North America](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).  
> **Target Database**: MongoDB Atlas \`db_semina\`  
> **Command to Re-seed**: \`cd semina-api && npm run seed\`

---

## 1. Quick Credentials Reference

### CMS Dashboard Login (\`http://localhost:3001\` or \`semina-cms\`)

| Role | Email | Password | Organizer | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Owner / Super Admin** | \`admin@gmail.com\` | \`admin123\` | Semina (Primary) | Full dashboard, categories, events, talents, payments, orders |
| **Organizer** | \`organizer@semina.id\` | \`semina123\` | Semina (Primary) | Primary organizer operational management |
| **Admin** | \`staff@semina.id\` | \`semina123\` | Semina (Primary) | Operational staff account |
| **Partner Organizer** | \`events@linuxfoundation.org\` | \`semina123\` | Linux Foundation & CNCF | Multi-tenant partner organizer |
| **Regional Organizer** | \`lead@seatechguild.org\` | \`semina123\` | Southeast Asia Tech Guild | Regional partner organizer |

### Landing Page Participant Login (\`http://localhost:3000/signin\`)

| Name | Role / Job | Email | Password | Status | Seeded Orders |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Budi Santoso** | Product Designer | \`user@gmail.com\` | \`user123\` | \`aktif\` | **4 Orders** (Paid & Pending) |
| **Anisa Rahmawati** | Senior Frontend Engineer | \`anisa.rahma@gmail.com\` | \`user123\` | \`aktif\` | 2 Orders |
| **Dimas Pratama** | Cloud Infrastructure Architect | \`dimas.pratama@gmail.com\` | \`user123\` | \`aktif\` | 2 Orders |
| **Siti Nurhaliza** | AI Research Engineer | \`siti.nurhaliza@gmail.com\` | \`user123\` | \`aktif\` | 2 Orders |
| **Kevin Wijaya** | DevSecOps Lead | \`kevin.wijaya@gmail.com\` | \`user123\` | \`aktif\` | 2 Orders |
| **Putri Maharani** | Product Manager | \`putri.maharani@gmail.com\` | \`user123\` | \`aktif\` | 1 Order |
| **Reza Octavian** | Fullstack Developer | \`reza.octavian@gmail.com\` | \`user123\` | \`aktif\` | 1 Order |
| **Clara Kusuma** | Data Scientist | \`clara.kusuma@gmail.com\` | \`user123\` | \`aktif\` | 1 Order |
| **Fajar Nugroho** | Platform Engineer | \`fajar.nugroho@gmail.com\` | \`user123\` | \`aktif\` | 1 Order |
| **Maya Indira** | UX Researcher | \`maya.indira@gmail.com\` | \`user123\` | \`aktif\` | 2 Orders |
| **Hendra Saputra** | Backend Developer | \`pending.user@gmail.com\` | \`user123\` | \`tidak aktif\` | 0 Orders (OTP: \`654321\`) |

---

## 2. Organizers Collection (\`Organizers\`)

| Organizer Name | Role in Ecosystem | ID Note |
| :--- | :--- | :--- |
| **Semina** | Primary Platform Organizer (owns core categories, events, speakers, payments) | Default for CMS \`admin@gmail.com\` |
| **Linux Foundation & CNCF** | International Cloud & Open Source Partner | Multi-tenant testing |
| **Southeast Asia Tech Guild** | Regional Community Partner | Regional developer events |

---

## 3. Categories Collection (\`Categories\`)

All 8 categories comply strictly with the \`categorySchema\` constraint ($3 \\le \\text{length} \\le 20$ chars):

1. \`AI & Agents\` (11 chars)
2. \`Cloud Native\` (12 chars)
3. \`Platform Eng\` (12 chars)
4. \`Cybersecurity\` (13 chars)
5. \`Web & Frontend\` (14 chars)
6. \`Data & ML Ops\` (13 chars)
7. \`Product Design\` (14 chars)
8. \`Embedded & IoT\` (14 chars)

---

## 4. Talents / Keynote Speakers Collection (\`Talents\`)

All 14 keynote speakers are real industry leaders scraped from Sessionize & Linux Foundation with local high-resolution portraits:

| Speaker Name | Title & Organization | Avatar Image Asset |
| :--- | :--- | :--- |
| **Jaana Dogan** | Principal Software Engineer, Google | \`uploads/speaker-jaana-dogan.jpeg\` |
| **Lucy Sweet** | Member of Technical Staff, Anthropic | \`uploads/speaker-lucy-sweet.jpg\` |
| **Robert Nishihara** | Co-Founder & Creator of Ray, Anyscale | \`uploads/speaker-robert-nishihara.jpg\` |
| **Tim Hockin** | Distinguished Engineer (Kubernetes Co-Creator), Google | \`uploads/speaker-tim-hockin.jpg\` |
| **Warren Barkley** | VP of Product Management (AI Infrastructure), NVIDIA | \`uploads/speaker-warren-barkley.png\` |
| **Alolita Sharma** | Observability Engineering Leader, Apple | \`uploads/speaker-alolita-sharma.png\` |
| **Lin Sun** | Head of Open Source & Istio Maintainer, Solo.io | \`uploads/speaker-lin-sun.jpg\` |
| **Ravin Kumar** | Staff Research Engineer, Google DeepMind | \`uploads/speaker-ravin-kumar.jpg\` |
| **Jorge Palma** | Principal PM Lead (Azure Kubernetes Service), Microsoft | \`uploads/speaker-jorge-palma.jpg\` |
| **Jessica Forrester** | Senior Distinguished Engineer, Red Hat | \`uploads/speaker-jessica-forrester.jpg\` |
| **Vara Bonthu** | Principal Open Source Specialist SA, AWS | \`uploads/speaker-vara-bonthu.jpg\` |
| **Bassam Tabbara** | Founder & CEO (Crossplane Creator), Upbound | \`uploads/speaker-bassam-tabbara.jpg\` |
| **Andjelko Iharos** | VP of Architecture, HAProxy Technologies | \`uploads/speaker-andjelko-iharos.jpg\` |
| **Lorenzo Biava** | Staff Infrastructure Engineer, LiveKit | \`uploads/speaker-lorenzo-biava.png\` |

---

## 5. Payment Methods Collection (\`Payments\`)

| Payment Type | Icon Asset | Status |
| :--- | :--- | :--- |
| **Virtual Account BCA / Mandiri** | \`uploads/payment-va-bank.png\` | \`Active\` (true) |
| **Visa / Mastercard Credit Card** | \`uploads/payment-credit-card.svg\` | \`Active\` (true) |
| **Semina Pay (SeWallet)** | \`uploads/payment-sewallet.svg\` | \`Active\` (true) |
| **QRIS Instant Payment** | \`uploads/payment-qris.png\` | \`Active\` (true) |
| **GoPay / OVO Digital Wallet** | \`uploads/payment-digital-wallet.png\` | \`Active\` (true) |
| **Corporate Invoice / Wire Transfer** | \`uploads/payment-invoice.png\` | \`Active\` (true) |

---

## 6. Events Collection (\`Events\` — 16 Events)

| # | Event Title | Category | Speaker | Venue | Pricing | Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **KubeCon + CloudNativeCon NA 2026** | Cloud Native | Tim Hockin | Salt Palace, Salt Lake City | $149 / $299 / $599 | \`Published\` |
| 2 | **Agentics Day: MCP + AI Agents Summit** | AI & Agents | Lucy Sweet | Moscone Center, SF & Hybrid | $89 / $179 | \`Published\` |
| 3 | **Cloud Native AI & Inference Day** | AI & Agents | Warren Barkley | Jakarta Convention Center | Free ($0) / $99 | \`Published\` |
| 4 | **PyTorch Day & Open Source AI Forum** | Data & ML Ops | Ravin Kumar | Tokyo International Forum | $59 / $129 | \`Published\` |
| 5 | **React & Next.js Architecture Conf** | Web & Frontend | Jaana Dogan | Marina Bay Sands, Singapore | $49 / $119 | \`Published\` |
| 6 | **CiliumCon: eBPF Networking & Security** | Cybersecurity | Lin Sun | CCIB, Barcelona, Spain | $75 / $149 | \`Published\` |
| 7 | **Platform Eng & Developer Portals Day** | Platform Eng | Bassam Tabbara | Sheraton Grand Jakarta | Free ($0) / $79 | \`Published\` |
| 8 | **Observability Day: OpenTelemetry Scale** | Cloud Native | Alolita Sharma | ICE BSD City, Tangerang | Free ($0) / $49 | \`Published\` |
| 9 | **Open Source SecurityCon & Supply Chain** | Cybersecurity | Jessica Forrester | KL Convention Centre, Malaysia | $65 / $139 | \`Published\` |
| 10 | **Voice Agents & Real-Time Multimodal AI** | AI & Agents | Lorenzo Biava | Nusa Dua Convention Center, Bali | $55 / $120 | \`Published\` |
| 11 | **Distributed Ray & Large LLM Training** | Data & ML Ops | Robert Nishihara | Grand Hyatt Singapore | $95 / $199 | \`Published\` |
| 12 | **BackstageCon & Dev Experience Summit** | Platform Eng | Vara Bonthu | Bangkok Digital Park, Thailand | Free ($0) / $69 | \`Published\` |
| 13 | **gRPConf & High-Performance Services** | Web & Frontend | Andjelko Iharos | Bengaluru Tech Summit Hall | Free ($0) / $45 | \`Published\` |
| 14 | **Confidential Computing & Sovereign Cloud** | Cybersecurity | Jorge Palma | Pacific Place Jakarta | $85 / $175 | \`Published\` |
| 15 | **Design Systems & AI Interfaces Master** | Product Design | Jaana Dogan | Ciputra Artpreneur Jakarta | Free ($0) / $59 | \`Published\` |
| 16 | **Embedded Linux & RISC-V Edge Workshop** | Embedded & IoT | Tim Hockin | Tokyo Big Sight, Japan | $110 (Workshop) | \`Draft\` |

---

## 7. Orders Collection (\`Orders\` — 18 Orders)

| # | Participant | Event Title | Ticket Tier | Qty | Total Pay | Payment Method | Status |
| :- | :--- | :--- | :--- | :-: | :-: | :--- | :--- |
| 1 | **user@gmail.com** | KubeCon + CloudNativeCon NA 2026 | VIP All-Access | 1 | $599 | Visa / Mastercard | \`paid\` |
| 2 | **user@gmail.com** | Agentics Day: MCP + AI Agents Summit | Pro Workshop Pass | 2 | $358 | Semina Pay (SeWallet) | \`paid\` |
| 3 | **user@gmail.com** | Cloud Native AI & Inference Day | Community Free Pass | 1 | $0 | QRIS Instant Payment | \`paid\` |
| 4 | **user@gmail.com** | React & Next.js Architecture Conf | All-Access Pass | 1 | $119 | Virtual Account BCA / Mandiri | \`pending\` |
| 5 | **anisa.rahma@gmail.com** | React & Next.js Architecture Conf | Developer Pass | 2 | $98 | QRIS Instant Payment | \`paid\` |
| 6 | **anisa.rahma@gmail.com** | Design Systems & AI Interfaces Master | Studio Workshop | 1 | $59 | GoPay / OVO Digital Wallet | \`paid\` |
| 7 | **dimas.pratama@gmail.com** | KubeCon + CloudNativeCon NA 2026 | Regular Pass | 1 | $299 | Corporate Invoice / Wire | \`paid\` |
| 8 | **dimas.pratama@gmail.com** | CiliumCon: eBPF Networking & Security | Engineer Plus | 1 | $149 | Visa / Mastercard | \`paid\` |
| 9 | **siti.nurhaliza@gmail.com** | PyTorch Day & Open Source AI Forum | Deep Dive Pass | 1 | $129 | Semina Pay (SeWallet) | \`paid\` |
| 10 | **siti.nurhaliza@gmail.com** | Distributed Ray & Large LLM Training | Hands-on Masterclass | 1 | $199 | Visa / Mastercard | \`pending\` |
| 11 | **kevin.wijaya@gmail.com** | Open Source SecurityCon & Supply Chain | Executive Security Pass | 1 | $139 | Corporate Invoice / Wire | \`paid\` |
| 12 | **kevin.wijaya@gmail.com** | Confidential Computing & Sovereign Cloud | Enterprise VIP | 1 | $175 | Virtual Account BCA / Mandiri | \`paid\` |
| 13 | **putri.maharani@gmail.com** | Platform Eng & Developer Portals Day | Free Community | 1 | $0 | QRIS Instant Payment | \`paid\` |
| 14 | **reza.octavian@gmail.com** | gRPConf & High-Performance Services | On-Site Pass | 2 | $90 | GoPay / OVO Digital Wallet | \`paid\` |
| 15 | **clara.kusuma@gmail.com** | Voice Agents & Real-Time Multimodal AI | All-Inclusive Pass | 1 | $120 | Semina Pay (SeWallet) | \`pending\` |
| 16 | **fajar.nugroho@gmail.com** | BackstageCon & Dev Experience Summit | In-Person Plus | 1 | $69 | Visa / Mastercard | \`paid\` |
| 17 | **maya.indira@gmail.com** | Design Systems & AI Interfaces Master | Community Access | 1 | $0 | QRIS Instant Payment | \`paid\` |
| 18 | **maya.indira@gmail.com** | Observability Day: OpenTelemetry Scale | VIP Networking Pass | 1 | $49 | Virtual Account BCA / Mandiri | \`paid\` |

---

## 8. Database Restore & Verification Commands

\`\`\`bash
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
\`\`\`
`;

  fs.writeFileSync(rootBackupPath, md, "utf-8");
  fs.writeFileSync(apiBackupPath, md, "utf-8");
  console.log(`✓ Backup saved to: ${rootBackupPath}`);
  console.log(`✓ Backup saved to: ${apiBackupPath}`);
}

seed();
