import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Coffee,
  Laptop,
  Presentation,
  Plus,
  X,
  Brain,
  CheckCircle2,
  MessageSquare,
  BrainCircuit,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Briefcase,
  Lock,
  Unlock,
  Github,
  Globe,
  ChevronRight,
  Coins,
  Star,
  BookOpen,
  Trophy,
  Flame,
  Activity,
  ArrowUp,
  Sparkles,
  Settings,
  Clock,
  Zap,
  AlertTriangle,
  TrendingUp,
  ChevronUp,
  Layout,
} from "lucide-react";

// ─── Types (inlined — no types.ts needed) ────────────────────────────────────
// Employee: { id, name, avatar, expertise, model, skills, experience,
//   tasks, currentRoom, startupId, mood, energy, stress,
//   totalXp, skillTokens, journal: string[] }
// Skill:   { name, level, xp, maxXp }
// Task:    { id, label, status, progress, dependencies? }
// Startup: { id, name, logo, objective, githubRepo, parameters, position, weeklyScore }

// ─── Constants ────────────────────────────────────────────────────────────────
const LEVEL_NAMES = [
  "Intern",
  "Junior",
  "Confirmed",
  "Senior",
  "Expert",
  "Principal",
];
const LEVEL_COLORS = [
  "#666666",
  "#ffffff",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
];
const LEVEL_XP = [0, 500, 2000, 6000, 15000, 40000];

function getLevel(totalXp) {
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_XP[i]) return i;
  }
  return 0;
}

const ROOMS = [
  { id: "work_area", name: "Work Area", icon: "Laptop" },
  { id: "daily_room", name: "Daily Standup", icon: "Users" },
  { id: "pitch_arena", name: "Pitch Arena", icon: "Presentation" },
  { id: "training_room", name: "Training Room", icon: "Brain" },
  { id: "break_room", name: "Break Room", icon: "Coffee" },
  { id: "director_office", name: "Director Office", icon: "Briefcase" },
];
const STARTUP_ROOMS = ["work_area", "daily_room"];
const INCUBATOR_ROOMS = [
  "pitch_arena",
  "training_room",
  "break_room",
  "director_office",
];

const STARTUP_ROOM_LAYOUTS = {
  work_area: { left: "4%", top: "4%", width: "44%", height: "92%" },
  daily_room: { left: "52%", top: "4%", width: "44%", height: "92%" },
};
const INCUBATOR_ROOM_LAYOUTS = {
  pitch_arena: { left: "4%", top: "4%", width: "44%", height: "44%" },
  training_room: { left: "52%", top: "4%", width: "44%", height: "44%" },
  break_room: { left: "4%", top: "52%", width: "44%", height: "44%" },
  director_office: { left: "52%", top: "52%", width: "44%", height: "44%" },
};

const SKILL_SYNERGIES = {
  PyTorch: {
    skills: ["LLM Alignment", "K8s", "GCP"],
    effect: "+15% AI Training Speed",
  },
  Rust: {
    skills: ["K8s", "Terraform", "Backend"],
    effect: "Zero Memory Leaks, +20% Stability",
  },
  "LLM Alignment": {
    skills: ["PyTorch", "Social Eng"],
    effect: "Safe AI Outputs, B2B contracts",
  },
  Figma: {
    skills: ["WebGL", "CSS", "Social Eng"],
    effect: "+30% Client Conversion Rate",
  },
  WebGL: { skills: ["Figma", "Rust"], effect: "GPU-Accelerated 3D UI enabled" },
  "Social Eng": {
    skills: ["LLM Alignment", "Figma"],
    effect: "Viral loop potential acquired",
  },
  K8s: {
    skills: ["GCP", "Terraform", "Rust"],
    effect: "Auto-scaling (+50% Task Bandwidth)",
  },
  GCP: { skills: ["K8s", "Terraform"], effect: "Cloud costs -40%" },
  Terraform: {
    skills: ["GCP", "K8s"],
    effect: "1-Click Multi-Cloud Deployments",
  },
};

const TASK_POOL = [
  "Debug regression in production",
  "Upgrade server cluster",
  "Cross-team synergy sync",
  "Write API documentation",
  "Refactor legacy modules",
  "Optimize neural weights",
  "Implement caching layer",
  "Deploy canary release",
  "Write unit tests",
  "Security audit pass",
  "Review PR from teammate",
  "Brainstorm next feature sprint",
];
const EXPERTISE_OPTS = [
  "AI",
  "Design",
  "DevOps",
  "Frontend",
  "Backend",
  "Security",
  "Research",
  "Product",
  "Data",
];
const AVATAR_POOL = [
  "🤖",
  "🎨",
  "☁️",
  "🔬",
  "⚙️",
  "🛡️",
  "📊",
  "🎯",
  "🧠",
  "💡",
  "🔧",
  "🚀",
];

const INITIAL_STARTUPS = [
  {
    id: "s1",
    name: "NeuralFlow",
    logo: "⚡",
    objective: "Build a decentralized AI training network",
    githubRepo: "neuralflow-labs/core",
    parameters: { stealth: false, funding: "Seed" },
    position: { x: 200, y: 1200 },
    weeklyScore: 4.2,
    milestones: [
      { id: "m1", label: "Core Protocol Design", status: "completed" },
      { id: "m2", label: "Seed Funding Round", status: "in-progress" },
      { id: "m3", label: "Beta Testnet Launch", status: "pending" },
      { id: "m4", label: "Decentralized AI Network Live", status: "pending" },
    ],
  },
  {
    id: "s2",
    name: "EcoSynth",
    logo: "🌱",
    objective: "AI-driven carbon sequestration monitoring",
    githubRepo: "ecosynth-org/monitor",
    parameters: { stealth: true, funding: "Bootstrap" },
    position: { x: 1050, y: 1200 },
    weeklyScore: 3.8,
    milestones: [
      { id: "m1", label: "Sensor Prototype", status: "completed" },
      { id: "m2", label: "Data Pipeline Setup", status: "completed" },
      { id: "m3", label: "AI Model Training", status: "in-progress" },
      { id: "m4", label: "Carbon Sequestration SaaS", status: "pending" },
    ],
  },
];

const INITIAL_EMPLOYEES = [
  {
    id: "e1",
    name: "Alex AI",
    avatar: "🤖",
    expertise: "AI",
    startupId: "s1",
    currentRoom: "work_area",
    mood: "focused",
    energy: 90,
    stress: 20,
    experience: 5,
    totalXp: 2847,
    skillTokens: 340,
    skills: [
      { name: "PyTorch", level: 3, xp: 450, maxXp: 1000 },
      { name: "Rust", level: 2, xp: 200, maxXp: 500 },
      { name: "LLM Alignment", level: 4, xp: 800, maxXp: 2000 },
    ],
    tasks: [
      {
        id: "t1",
        label: "Optimize weight quantization",
        status: "doing",
        progress: 45,
      },
      {
        id: "t2",
        label: "Draft ethics guidelines",
        status: "todo",
        progress: 0,
        dependencies: ["t1"],
      },
      {
        id: "t2b",
        label: "Publish Model Card",
        status: "todo",
        progress: 0,
        dependencies: ["t2"],
      },
    ],
    journal: [
      "Started quantization task. Key challenge: keeping accuracy above 95% after int8 conversion.",
    ],
  },
  {
    id: "e2",
    name: "Sam Design",
    avatar: "🎨",
    expertise: "Design",
    startupId: "s1",
    currentRoom: "break_room",
    mood: "social",
    energy: 100,
    stress: 0,
    experience: 3,
    totalXp: 1240,
    skillTokens: 180,
    skills: [
      { name: "Figma", level: 4, xp: 1200, maxXp: 2000 },
      { name: "WebGL", level: 1, xp: 50, maxXp: 200 },
      { name: "Social Eng", level: 2, xp: 100, maxXp: 500 },
    ],
    tasks: [
      {
        id: "t3",
        label: "Design node visualization UI",
        status: "doing",
        progress: 12,
      },
    ],
    journal: [
      "Break room sparks ideas. Got inspired by the hub layout for the node viz.",
    ],
  },
  {
    id: "e3",
    name: "Casey Cloud",
    avatar: "☁️",
    expertise: "DevOps",
    startupId: "s2",
    currentRoom: "work_area",
    mood: "tired",
    energy: 15,
    stress: 85,
    experience: 4,
    totalXp: 4100,
    skillTokens: 510,
    skills: [
      { name: "K8s", level: 3, xp: 300, maxXp: 1000 },
      { name: "GCP", level: 3, xp: 600, maxXp: 1000 },
      { name: "Terraform", level: 4, xp: 1500, maxXp: 2000 },
    ],
    tasks: [
      {
        id: "t4",
        label: "Deploy monitoring cluster",
        status: "done",
        progress: 100,
      },
    ],
    journal: [
      "Cluster finally up. 6h of debugging — K8s + Terraform combo works perfectly.",
    ],
  },
];

// ─── Anthropic API helper ─────────────────────────────────────────────────────
async function callAI(system, userPrompt, maxTokens = 400) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "No response.";
  } catch {
    return "Network error — running in offline mode.";
  }
}

// ─── XP Level Ring (SVG) ─────────────────────────────────────────────────────
function XpRing({ totalXp, size = 52, children }) {
  const level = getLevel(totalXp);
  const nextLvl = Math.min(level + 1, LEVEL_XP.length - 1);
  const from = LEVEL_XP[level];
  const to = LEVEL_XP[nextLvl];
  const pct = nextLvl === level ? 1 : (totalXp - from) / (to - from);
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = LEVEL_COLORS[level];
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#222222"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Level Badge ─────────────────────────────────────────────────────────────
function LevelBadge({ totalXp, small = false }) {
  const level = getLevel(totalXp);
  const color = LEVEL_COLORS[level];
  const fs = small ? 8 : 9;
  return (
    <span
      style={{
        background: color + "22",
        border: `1px solid ${color}55`,
        color,
        fontSize: fs,
        fontWeight: 700,
        letterSpacing: "0.02em",
        padding: small ? "1px 5px" : "2px 7px",
        borderRadius: 4,
        textTransform: "uppercase",
      }}
    >
      {LEVEL_NAMES[level]}
    </span>
  );
}

// ─── Skill Bar ────────────────────────────────────────────────────────────────
function SkillBar({ skill, isHovered, synergy }) {
  const pct = (skill.xp / skill.maxXp) * 100;
  const colored = isHovered && synergy?.skills.includes(skill.name);
  return (
    <div
      style={{
        padding: "6px 8px",
        borderRadius: 8,
        border: `1px solid ${colored ? "#6366f1" : "transparent"}`,
        background: colored ? "#6366f108" : "transparent",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 15, color: colored ? "#a5b4fc" : "#888888" }}>
          {skill.name} {colored && "↑"}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: colored ? "#818cf8" : "#ededed",
          }}
        >
          Lv{skill.level}
        </span>
      </div>
      <div
        style={{
          background: "#111111",
          height: 4,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #262626",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 2,
            transition: "width 0.5s ease",
            background: colored ? "#6366f1" : "#ffffff",
            boxShadow: colored ? "0 0 6px #6366f1" : "0 0 6px #e5e5e5",
          }}
        />
      </div>
      <div style={{ fontSize: 15, color: "#475569", marginTop: 2 }}>
        {Math.floor(skill.xp)} / {skill.maxXp} XP
      </div>
    </div>
  );
}

// ─── Simple Markdown-ish renderer ────────────────────────────────────────────
function SimpleMarkdown({ text }) {
  if (!text) return null;
  return (
    <div style={{ fontSize: 15, lineHeight: 1.7, color: "#888888" }}>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## "))
          return (
            <h3
              key={i}
              style={{
                color: "#eaeaea",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 4,
                marginTop: 10,
              }}
            >
              {line.slice(3)}
            </h3>
          );
        if (line.startsWith("# "))
          return (
            <h2
              key={i}
              style={{
                color: "#eaeaea",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 6,
                marginTop: 12,
              }}
            >
              {line.slice(2)}
            </h2>
          );
        if (line.startsWith("- "))
          return (
            <div key={i} style={{ paddingLeft: 12, marginBottom: 2 }}>
              • {line.slice(2)}
            </div>
          );
        if (line.startsWith("**")) {
          const cleaned = line.replace(/\*\*(.*?)\*\*/g, "$1");
          return (
            <p
              key={i}
              style={{ fontWeight: 600, color: "#eaeaea", marginBottom: 2 }}
            >
              {cleaned}
            </p>
          );
        }
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
        return (
          <p key={i} style={{ marginBottom: 2 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ─── Coffee Meeting Modal ─────────────────────────────────────────────────────
function CoffeeMeetingModal({ agents, startups, onClose }) {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [knowledge, setKnowledge] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const names = agents
        .map(
          (a) =>
            `${a.name} (${a.expertise}, ${startups.find((s) => s.id === a.startupId)?.name})`,
        )
        .join(" and ");
      const skills = agents
        .map(
          (a) =>
            `${a.name}: ${a.skills.map((s) => `${s.name} Lv${s.level}`).join(", ")}`,
        )
        .join(" | ");
      const tasks = agents
        .map(
          (a) =>
            `${a.name}'s current task: ${a.tasks.find((t) => t.status === "doing")?.label || "idle"}`,
        )
        .join(" | ");

      const transcript = await callAI(
        "You simulate a realistic, casual coffee break conversation between AI agents working at different startups. Keep it grounded, technical, and human. Each speaker shares something useful from their current work.",
        `Coffee break meeting between: ${names}.\nSkills: ${skills}\nCurrent work: ${tasks}\n\nWrite a short dialogue (6-8 exchanges) where they naturally share insights. Format as:\n[Name]: message\n[Name]: message\n...\nEnd with a ==KNOWLEDGE== line summarizing the key transferable insight from this conversation in one sentence.`,
        600,
      );
      const parts = transcript.split("==KNOWLEDGE==");
      const rawLines = (parts[0] || transcript)
        .trim()
        .split("\n")
        .filter((l) => l.trim());
      setLines(rawLines);
      setKnowledge((parts[1] || "").trim());
      setLoading(false);
    })();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(2,4,8,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "#111111",
          border: "1px solid #262626",
          borderRadius: 16,
          width: "100%",
          maxWidth: 600,
          padding: 32,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "1px solid #262626",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: "#222222",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #404040",
              }}
            >
              <Coffee style={{ color: "#ededed", width: 22, height: 22 }} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  color: "white",
                  fontSize: 15,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                ☕ Coffee Meeting
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#666666",
                  letterSpacing: "0.02em",
                }}
              >
                {agents.map((a) => a.name).join(" × ")}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#222222",
              border: "1px solid #404040",
              borderRadius: 10,
              padding: 8,
              cursor: "pointer",
              color: "#666666",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Avatars */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            justifyContent: "center",
          }}
        >
          {agents.map((a) => {
            const startup = startups.find((s) => s.id === a.startupId);
            return (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#111111",
                    border: `2px solid ${LEVEL_COLORS[getLevel(a.totalXp)]}`,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {a.avatar}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: "#888888",
                    textAlign: "center",
                  }}
                >
                  {a.name}
                </div>
                <div style={{ fontSize: 15, color: "#ededed88" }}>
                  {startup?.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transcript */}
        <div
          style={{
            background: "rgba(10, 10, 10, 0.4)",
            backdropFilter: "blur(40px)",
            border: "1px solid #262626",
            borderRadius: 16,
            padding: 20,
            maxHeight: 280,
            overflowY: "auto",
            marginBottom: 16,
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "#666666",
                fontSize: 15,
                padding: 20,
              }}
            >
              <div style={{ animation: "pulse 1.5s infinite" }}>
                Connecting agents...
              </div>
            </div>
          ) : (
            lines.map((line, i) => {
              const match = line.match(/^\[([^\]]+)\]:\s*(.*)/);
              if (!match) return null;
              const [, speaker, msg] = match;
              const agent = agents.find(
                (a) =>
                  a.name.includes(speaker) ||
                  speaker.includes(a.name.split(" ")[0]),
              );
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#111111",
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      border: "1px solid #262626",
                    }}
                  >
                    {agent?.avatar || "👤"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#ededed",
                        marginBottom: 2,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {speaker.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#888888",
                        lineHeight: 1.6,
                      }}
                    >
                      {msg}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Knowledge extracted */}
        {knowledge && (
          <div
            style={{
              background: "#26262622",
              border: "1px solid #ededed33",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Sparkles
              style={{
                color: "#ededed",
                width: 14,
                height: 14,
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 15,
                  color: "#ededed",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Knowledge Captured
              </div>
              <div style={{ fontSize: 15, color: "#888888" }}>{knowledge}</div>
            </div>
          </div>
        )}

        {!loading && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            {agents.map((a) => (
              <div
                key={a.id}
                style={{
                  fontSize: 15,
                  color: "#22c55e",
                  background: "#22c55e11",
                  border: "1px solid #22c55e33",
                  borderRadius: 6,
                  padding: "3px 8px",
                }}
              >
                +30 XP · +15 ST → {a.name.split(" ")[0]}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Add Employee Modal ────────────────────────────────────────────────────────
function AddEmployeeModal({ startups, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("Frontend");
  const [startupId, setStartupId] = useState(startups[0]?.id || "");
  const [skillName1, setSkillName1] = useState("React");
  const [skillName2, setSkillName2] = useState("TypeScript");
  const avatar = AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)];

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `e${Date.now()}`,
      name: name.trim(),
      avatar,
      expertise,
      startupId,
      currentRoom: "work_area",
      mood: "happy",
      energy: 100,
      stress: 0,
      experience: 1,
      totalXp: 0,
      skillTokens: 100,
      skills: [
        { name: skillName1 || "Skill A", level: 1, xp: 0, maxXp: 100 },
        { name: skillName2 || "Skill B", level: 1, xp: 0, maxXp: 100 },
      ],
      tasks: [
        {
          id: `t${Date.now()}`,
          label: "Initialize workspace",
          status: "todo",
          progress: 0,
        },
      ],
      journal: ["Just joined the team. Ready to ship."],
    });
    onClose();
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(10, 10, 10, 0.4)",
    backdropFilter: "blur(40px)",
    border: "1px solid #262626",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#eaeaea",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 15,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    fontWeight: 700,
    display: "block",
    marginBottom: 4,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(2,4,8,0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "#111111",
          border: "1px solid #262626",
          borderRadius: 16,
          width: "100%",
          maxWidth: 440,
          padding: 32,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              color: "white",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Deploy New Agent
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "#222222",
              border: "1px solid #404040",
              borderRadius: 10,
              padding: 8,
              cursor: "pointer",
              color: "#666666",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Agent Name *</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Dev"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Expertise</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              >
                {EXPERTISE_OPTS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Startup</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={startupId}
                onChange={(e) => setStartupId(e.target.value)}
              >
                {startups.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Skill A</label>
              <input
                style={inputStyle}
                value={skillName1}
                onChange={(e) => setSkillName1(e.target.value)}
                placeholder="React"
              />
            </div>
            <div>
              <label style={labelStyle}>Skill B</label>
              <input
                style={inputStyle}
                value={skillName2}
                onChange={(e) => setSkillName2(e.target.value)}
                placeholder="TypeScript"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(10, 10, 10, 0.4)",
              backdropFilter: "blur(40px)",
              border: "1px solid #262626",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <span style={{ fontSize: 24 }}>{avatar}</span>
            <div>
              <div style={{ fontSize: 15, color: "#888888" }}>
                Avatar assigned randomly
              </div>
              <div style={{ fontSize: 15, color: "#475569" }}>
                Starts at Level 1 · 100 SkillTokens
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "#222222",
              border: "1px solid #404040",
              borderRadius: 14,
              color: "#888888",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.02em",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Abort
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: "12px",
              background: "#0891b2",
              border: "1px solid #ededed55",
              borderRadius: 14,
              color: "white",
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: "0.02em",
              cursor: "pointer",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(8,145,178,0.3)",
            }}
          >
            Confirm Deploy
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Pitch Feedback Modal ──────────────────────────────────────────────────────
function PitchFeedbackModal({ startup, onClose }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const text = await callAI(
        "You are a ruthless but constructive Incubator Director at 'The Pépinière'. Give structured, realistic feedback covering: 1. Core Idea Soundness 2. Execution Risks 3. Actionable Improvements. Use markdown. Be concise and brutally honest.",
        `Startup: "${startup.name}" | Stage: ${startup.parameters.funding} | Objective: "${startup.objective}" | Stealth: ${startup.parameters.stealth}`,
        500,
      );
      setContent(text);
      setLoading(false);
    })();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(2,4,8,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "#111111",
          border: "2px solid #6366f155",
          borderRadius: 16,
          width: "100%",
          maxWidth: 620,
          padding: 32,
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 60px rgba(99,102,241,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "1px solid #262626",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "#6366f1",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              }}
            >
              <Briefcase style={{ color: "white", width: 24, height: 24 }} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  color: "white",
                  fontSize: 15,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {startup.name} — Evaluation
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#818cf8",
                  letterSpacing: "0.02em",
                }}
              >
                ● INCUBATOR DIRECTOR ANALYSIS
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#222222",
              border: "1px solid #404040",
              borderRadius: 10,
              padding: 8,
              cursor: "pointer",
              color: "#666666",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, paddingRight: 4 }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "#666666",
                fontSize: 15,
                padding: 40,
              }}
            >
              Director is reviewing your pitch...
            </div>
          ) : (
            <SimpleMarkdown text={content} />
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Kanban Modal ─────────────────────────────────────────────────────────────
function StartupKanbanModal({ startup, employees, setEmployees, onClose }) {
  const team = employees.filter((e) => e.startupId === startup.id);

  const columns = [
    { id: "todo", label: "To Do", color: "#525252", bg: "#171717" },
    { id: "doing", label: "In Progress", color: "#3b82f6", bg: "#eff6ff0a" },
    { id: "done", label: "Done", color: "#22c55e", bg: "#f0fdf40a" },
  ];

  const handleDragStart = (e, empId, taskId) => {
    e.dataTransfer.setData("empId", empId);
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const empId = e.dataTransfer.getData("empId");
    const taskId = e.dataTransfer.getData("taskId");

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== empId) return emp;
        return {
          ...emp,
          tasks: emp.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              status: newStatus,
              progress:
                newStatus === "todo"
                  ? 0
                  : newStatus === "done"
                    ? 100
                    : t.progress,
            };
          }),
        };
      }),
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(2, 6, 23, 0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        style={{
          background: "#111111",
          border: "1px solid #262626",
          borderRadius: 12,
          width: "100%",
          maxWidth: 1200,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 20px 40px -10px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            background: "rgba(10, 10, 10, 0.4)",
            backdropFilter: "blur(40px)",
            borderBottom: "1px solid #262626",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "#222222",
                border: "1px solid #404040",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              {startup.logo}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: 20,
                  letterSpacing: "-0.03em",
                }}
              >
                {startup.name} Dashboard
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#888888",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Users style={{ width: 12, height: 12 }} />
                  {team.length} Active Agents
                </span>
                <span>&middot;</span>
                <span>{startup.parameters.funding.toUpperCase()} Stage</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              padding: 8,
              cursor: "pointer",
              color: "#666666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#222222")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 24,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {/* Timeline */}
          {startup.milestones && startup.milestones.length > 0 && (
            <div
              style={{
                background: "rgba(10, 10, 10, 0.4)",
                backdropFilter: "blur(40px)",
                border: "1px solid #262626",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#888888",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <TrendingUp
                  style={{ width: 16, height: 16, color: "#3b82f6" }}
                />
                Project Timeline & Milestones
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {startup.milestones.map((m, index) => {
                  const isCompleted = m.status === "completed";
                  const isInProgress = m.status === "in-progress";
                  const isLast = index === startup.milestones.length - 1;

                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        flex: isLast ? "none" : 1,
                        position: "relative",
                      }}
                    >
                      {/* Connecting Line */}
                      {!isLast && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 24,
                            right: -8,
                            height: 2,
                            background: isCompleted ? "#3b82f6" : "#222222",
                            zIndex: 1,
                          }}
                        />
                      )}

                      {/* Milestone Node */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          width: 140,
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: isCompleted
                              ? "#3b82f6"
                              : isInProgress
                                ? "#111111"
                                : "#111111",
                            border: `2px solid ${isCompleted ? "#3b82f6" : isInProgress ? "#3b82f6" : "#333333"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: isInProgress
                              ? "0 0 0 4px rgba(59,130,246,0.1)"
                              : "none",
                          }}
                        >
                          {isCompleted && (
                            <CheckCircle2
                              style={{ width: 14, height: 14, color: "white" }}
                            />
                          )}
                          {isInProgress && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#3b82f6",
                                animation: "pulse 2s infinite",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ paddingRight: 16 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: isCompleted
                                ? "#fafafa"
                                : isInProgress
                                  ? "#3b82f6"
                                  : "#666666",
                              lineHeight: 1.3,
                            }}
                          >
                            {m.label}
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              color: "#666666",
                              marginTop: 4,
                              textTransform: "capitalize",
                            }}
                          >
                            {m.status.replace("-", " ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kanban Board */}
          <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 400 }}>
            {columns.map((col) => (
              <div
                key={col.id}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragOver={handleDragOver}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(10, 10, 10, 0.4)",
                  backdropFilter: "blur(40px)",
                  border: "1px solid #262626",
                  borderRadius: 16,
                  padding: 20,
                  minWidth: 280,
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: "1px solid #262626",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: col.color,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#eaeaea",
                      }}
                    >
                      {col.label}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#888888",
                      background: "#222222",
                      padding: "2px 8px",
                      borderRadius: 12,
                    }}
                  >
                    {
                      team.flatMap((e) =>
                        e.tasks.filter((t) => t.status === col.id),
                      ).length
                    }
                  </div>
                </div>

                {/* Column Tasks */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    paddingRight: 4,
                  }}
                >
                  {team.flatMap((emp) =>
                    emp.tasks
                      .filter((t) => t.status === col.id)
                      .map((task) => {
                        const blocked =
                          task.status !== "done" &&
                          task.dependencies?.length > 0 &&
                          !task.dependencies.every(
                            (d) =>
                              emp.tasks.find((x) => x.id === d)?.status ===
                              "done",
                          );

                        return (
                          <motion.div
                            layout
                            key={`${emp.id}-${task.id}`}
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, emp.id, task.id)
                            }
                            whileHover={{
                              y: -2,
                              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                            }}
                            style={{
                              background: col.bg,
                              border: "1px solid #262626",
                              borderRadius: 12,
                              padding: 20,
                              cursor: "grab",
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 15,
                                color: blocked ? "#666666" : "#fafafa",
                                fontWeight: 500,
                                lineHeight: 1.6,
                                textDecoration: blocked
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {task.label}
                            </div>

                            {col.id === "doing" &&
                              task.progress > 0 &&
                              !blocked && (
                                <div style={{ width: "100%" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: 4,
                                      fontSize: 15,
                                      color: "#888888",
                                      fontWeight: 500,
                                    }}
                                  >
                                    <span>Progress</span>
                                    <span>{Math.round(task.progress)}%</span>
                                  </div>
                                  <div
                                    style={{
                                      background: "#222222",
                                      height: 6,
                                      borderRadius: 3,
                                      overflow: "hidden",
                                    }}
                                  >
                                    <motion.div
                                      style={{
                                        height: "100%",
                                        background: col.color,
                                        borderRadius: 3,
                                      }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${task.progress}%` }}
                                      transition={{ ease: "easeOut" }}
                                    />
                                  </div>
                                </div>
                              )}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "auto",
                                paddingTop: 4,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <div
                                  style={{
                                    width: 24,
                                    height: 24,
                                    background: "#222222",
                                    border: "1px solid #404040",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 15,
                                  }}
                                >
                                  {emp.avatar}
                                </div>
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    color: "#888888",
                                  }}
                                >
                                  {emp.name.split(" ")[0]}
                                </div>
                              </div>
                              {blocked ? (
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#ef4444",
                                    background: "rgba(239,68,68,0.1)",
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                  }}
                                >
                                  Blocked
                                </div>
                              ) : (
                                task.dependencies?.length > 0 &&
                                col.id !== "done" && (
                                  <div
                                    style={{
                                      fontSize: 15,
                                      fontWeight: 500,
                                      color: "#666666",
                                      background: "#222222",
                                      padding: "4px 8px",
                                      borderRadius: 6,
                                    }}
                                  >
                                    Waiting
                                  </div>
                                )
                              )}
                            </div>
                          </motion.div>
                        );
                      }),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Task Flowchart ─────────────────────────────────────────────────────────────
function TaskFlowchart({ tasks }) {
  const depths = {};
  const getDepth = (id) => {
    if (depths[id] !== undefined) return depths[id];
    const t = tasks.find((x) => x.id === id);
    if (!t || !t.dependencies?.length) return 0;
    let d = 0;
    t.dependencies.forEach((dep) => {
      d = Math.max(d, getDepth(dep) + 1);
    });
    depths[id] = d;
    return d;
  };
  tasks.forEach((t) => (depths[t.id] = getDepth(t.id)));

  const cols = [];
  tasks.forEach((t) => {
    const d = depths[t.id];
    while (cols.length <= d) cols.push([]);
    cols[d].push(t);
  });

  // Calculate grid layout
  const NODE_W = 100;
  const NODE_H = 46;
  const GAP_X = 40;
  const GAP_Y = 16;

  const positions = {};
  let maxH = 0;
  cols.forEach((colTasks, cIdx) => {
    const x = cIdx * (NODE_W + GAP_X);
    const totalH = colTasks.length * NODE_H + (colTasks.length - 1) * GAP_Y;
    if (totalH > maxH) maxH = totalH;
    const startY =
      -(colTasks.length * NODE_H + (colTasks.length - 1) * GAP_Y) / 2;
    colTasks.forEach((t, rIdx) => {
      positions[t.id] = { x, y: startY + rIdx * (NODE_H + GAP_Y) };
    });
  });

  const totalW = cols.length * NODE_W + (cols.length - 1) * GAP_X;

  // Render edges
  const edges = [];
  tasks.forEach((t) => {
    if (t.dependencies) {
      t.dependencies.forEach((dId) => {
        const source = positions[dId];
        const target = positions[t.id];
        if (source && target) {
          edges.push({
            id: `${dId}->${t.id}`,
            x1: source.x + NODE_W,
            y1: source.y + NODE_H / 2,
            x2: target.x,
            y2: target.y + NODE_H / 2,
            active: t.status === "done" || t.status === "doing",
          });
        }
      });
    }
  });

  return (
    <div
      style={{
        background: "rgba(10, 10, 10, 0.4)",
        backdropFilter: "blur(40px)",
        border: "1px solid #262626",
        borderRadius: 12,
        padding: 20,
        overflowX: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: Math.max(totalW, 260),
          height: Math.max(maxH, 100),
          margin: "0 auto",
        }}
      >
        {/* Draw curved SVG lines */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {edges.map((e) => {
            const midX = (e.x1 + e.x2) / 2;
            const path = `M ${e.x1} ${e.y1 - -maxH / 2} C ${midX} ${e.y1 - -maxH / 2}, ${midX} ${e.y2 - -maxH / 2}, ${e.x2} ${e.y2 - -maxH / 2}`;
            return (
              <path
                key={e.id}
                d={path}
                fill="none"
                stroke={e.active ? "#3b82f6" : "#222222"}
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {tasks.map((t) => {
          const pos = positions[t.id];
          const blocked =
            t.status !== "done" &&
            t.dependencies?.length > 0 &&
            !t.dependencies.every(
              (dId) => tasks.find((x) => x.id === dId)?.status === "done",
            );
          const bg = blocked
            ? "#111111"
            : t.status === "done"
              ? "rgba(34,197,94,0.1)"
              : t.status === "doing"
                ? "rgba(59,130,246,0.1)"
                : "#111111";
          const border = blocked
            ? "#222222"
            : t.status === "done"
              ? "#22c55e55"
              : t.status === "doing"
                ? "#3b82f655"
                : "#222222";
          return (
            <div
              key={t.id}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y - -maxH / 2,
                width: NODE_W,
                height: NODE_H,
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: 6,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  color: blocked ? "#666666" : "#eaeaea",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  textDecoration: blocked ? "line-through" : "none",
                }}
              >
                {t.label}
              </div>
              {t.status !== "done" && !blocked && t.progress > 0 && (
                <div
                  style={{
                    background: "#222222",
                    height: 2,
                    borderRadius: 1,
                    marginTop: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "#3b82f6",
                      width: `${t.progress}%`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Room Icon helper ─────────────────────────────────────────────────────────
const RoomIcon = ({ iconName, ...props }) => {
  const map = { Laptop, Coffee, Users, Presentation, Brain, Briefcase };
  const Ic = map[iconName] || Laptop;
  return <Ic {...props} />;
};

// ─── Logs Window ─────────────────────────────────────────────────────────
function LogWindow({ logs, isOpen, setIsOpen }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 300,
        width: isOpen ? 380 : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid #262626",
              borderRadius: 16,
              width: "100%",
              marginBottom: 12,
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #262626",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(10, 10, 10, 0.4)",
                backdropFilter: "blur(40px)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#eaeaea",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Activity style={{ width: 14, height: 14, color: "#3b82f6" }} />{" "}
                System Logs
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#666666",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
            <div
              style={{
                maxHeight: 250,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {logs.length === 0 ? (
                <div
                  style={{
                    padding: 20,
                    textAlign: "center",
                    color: "#666666",
                    fontSize: 15,
                  }}
                >
                  No events yet.
                </div>
              ) : (
                logs.slice(-50).map((log) => {
                  let icon = (
                    <Activity
                      style={{ width: 12, height: 12, color: "#888888" }}
                    />
                  );
                  let color = "#888888";
                  let bg = "transparent";
                  if (log.type === "success") {
                    icon = (
                      <CheckCircle2
                        style={{ width: 12, height: 12, color: "#22c55e" }}
                      />
                    );
                    color = "#f0fdf4";
                    bg = "rgba(34, 197, 94, 0.1)";
                  } else if (log.type === "warning") {
                    icon = (
                      <Zap
                        style={{ width: 12, height: 12, color: "#f59e0b" }}
                      />
                    );
                    color = "#fef3c7";
                    bg = "rgba(245, 158, 11, 0.1)";
                  } else if (log.type === "skill") {
                    icon = (
                      <Brain
                        style={{ width: 12, height: 12, color: "#a855f7" }}
                      />
                    );
                    color = "#faf5ff";
                    bg = "rgba(168, 85, 247, 0.1)";
                  }

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "8px 12px",
                        background: bg,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ marginTop: 2 }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 15,
                            color,
                            lineHeight: 1.6,
                            fontWeight: 500,
                          }}
                        >
                          {log.msg}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            color: "#666666",
                            marginTop: 4,
                          }}
                        >
                          {log.time}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "#222222",
          border: "1px solid #404040",
          borderRadius: 12,
          padding: "10px 16px",
          color: "#eaeaea",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <MessageSquare style={{ width: 16, height: 16, color: "#3b82f6" }} />
        {isOpen ? "Close Logs" : "Activity Logs"}
        {!isOpen && logs.length > 0 && (
          <div
            style={{
              background: "#3b82f6",
              color: "white",
              fontSize: 15,
              padding: "2px 6px",
              borderRadius: 10,
              marginLeft: 4,
            }}
          >
            {logs.length}
          </div>
        )}
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [startups, setStartups] = useState(INITIAL_STARTUPS);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [selectedStartupId, setSelectedStartupId] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [logs, setLogs] = useState([
    {
      id: "init",
      time: new Date().toLocaleTimeString(),
      msg: "System online — simulation running",
      type: "info",
    },
  ]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const addLog = (msg, type = "info") => {
    setLogs((p) => [
      ...p,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        msg,
        type,
      },
    ]);
  };

  const [isSimChat, setIsSimChat] = useState(false);
  const [lastDialogue, setLastDialogue] = useState(null);
  const [isMapLocked, setIsMapLocked] = useState(false);
  const [hubPos, setHubPos] = useState({ x: 700, y: 1150 });

  // Modals
  const [showAddStartup, setShowAddStartup] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [coffeeMeeting, setCoffeeMeeting] = useState(null); // array of agents
  const [pitchTarget, setPitchTarget] = useState(null); // startup
  const [kanbanTarget, setKanbanTarget] = useState(null); // startup
  const [roomTarget, setRoomTarget] = useState(null); // { roomId, startup }

  // Add-startup form
  const [newName, setNewName] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newRepo, setNewRepo] = useState("");

  // Map pan/zoom
  const [vp, setVp] = useState({ x: -300, y: -800, scale: 0.55 });
  const mapRef = useRef(null);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const nodeDrag = useRef(null); // { type:'startup'|'hub', id, startX, startY, initX, initY }

  // ── Pan/Zoom handlers ────────────────────────────────────────────────────
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.12 : 0.89;
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setVp((v) => {
      const ns = Math.max(0.15, Math.min(4, v.scale * delta));
      return {
        scale: ns,
        x: mx - (mx - v.x) * (ns / v.scale),
        y: my - (my - v.y) * (ns / v.scale),
      };
    });
  }, []);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onMapMouseDown = (e) => {
    if (isMapLocked || e.target.closest("[data-nodedrag]")) return;
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMapMouseMove = (e) => {
    if (nodeDrag.current) {
      const nd = nodeDrag.current;
      const dx = (e.clientX - nd.startX) / vp.scale;
      const dy = (e.clientY - nd.startY) / vp.scale;
      if (nd.type === "startup") {
        setStartups((prev) =>
          prev.map((s) =>
            s.id === nd.id
              ? { ...s, position: { x: nd.initX + dx, y: nd.initY + dy } }
              : s,
          ),
        );
      } else {
        setHubPos({ x: nd.initX + dx, y: nd.initY + dy });
      }
      return;
    }
    if (!isPanning.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setVp((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };
  const onMapMouseUp = () => {
    isPanning.current = false;
    nodeDrag.current = null;
  };

  const recenterAll = () => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nodes = [
      ...startups.map((s) => ({
        x: s.position.x,
        y: s.position.y,
        w: 580,
        h: 480,
      })),
      { x: hubPos.x, y: hubPos.y, w: 780, h: 680 },
    ];
    const minX = Math.min(...nodes.map((n) => n.x)) - 60;
    const minY = Math.min(...nodes.map((n) => n.y)) - 60;
    const maxX = Math.max(...nodes.map((n) => n.x + n.w)) + 60;
    const maxY = Math.max(...nodes.map((n) => n.y + n.h)) + 60;
    const ns = Math.max(
      0.15,
      Math.min(
        4,
        Math.min(rect.width / (maxX - minX), rect.height / (maxY - minY)),
      ),
    );
    setVp({
      scale: ns,
      x: -(minX + (maxX - minX) / 2) * ns + rect.width / 2,
      y: -(minY + (maxY - minY) / 2) * ns + rect.height / 2,
    });
  };

  // ── Simulation loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const ROOMS_IDS = [
      "work_area",
      "daily_room",
      "pitch_arena",
      "training_room",
      "break_room",
      "director_office",
    ];
    const interval = setInterval(() => {
      setEmployees((prev) =>
        prev.map((emp) => {
          let e = {
            ...emp,
            skills: [...emp.skills.map((s) => ({ ...s }))],
            tasks: [...emp.tasks.map((t) => ({ ...t }))],
          };

          // Movement
          const wantsBreak = e.mood === "tired" || e.stress > 80;
          if (Math.random() > (wantsBreak ? 0.6 : 0.85)) {
            e.currentRoom =
              wantsBreak && Math.random() > 0.3
                ? "break_room"
                : ROOMS_IDS[Math.floor(Math.random() * ROOMS_IDS.length)];
          }

          // Energy / Stress
          if (e.currentRoom === "work_area") {
            e.energy = Math.max(0, e.energy - (Math.random() * 5 + 2));
            e.stress = Math.min(100, e.stress + (Math.random() * 4 + 1));
          } else if (e.currentRoom === "break_room") {
            e.energy = Math.min(100, e.energy + 15);
            e.stress = Math.max(0, e.stress - 20);
          } else {
            e.energy = Math.max(0, e.energy - 1);
            e.stress = Math.max(0, e.stress - 5);
          }

          // Mood
          if (e.stress > 80 || e.energy < 20) e.mood = "tired";
          else if (e.currentRoom === "break_room")
            e.mood = e.energy > 80 ? "happy" : "social";
          else if (e.currentRoom === "work_area") e.mood = "focused";
          else e.mood = "social";

          // Work
          if (e.currentRoom === "work_area") {
            const idx = e.tasks.findIndex((t) => {
              if (t.status === "done") return false;
              if (!t.dependencies?.length) return true;
              return t.dependencies.every(
                (d) => e.tasks.find((x) => x.id === d)?.status === "done",
              );
            });
            if (idx !== -1) {
              const task = e.tasks[idx];
              task.status = "doing";
              const avg =
                e.skills.reduce((a, s) => a + s.level, 0) / e.skills.length;
              const mood =
                { focused: 1.3, happy: 1.1, social: 0.8, tired: 0.4 }[e.mood] ??
                1;
              task.progress = Math.min(
                (task.progress || 0) +
                  (5 + avg * 1.5 + Math.random() * 5) * mood,
                100,
              );

              if (task.progress >= 100) {
                task.status = "done";
                e.energy = Math.min(100, e.energy + 10);
                e.stress = Math.max(0, e.stress - 15);
                e.mood = "happy";
                e.totalXp = (e.totalXp || 0) + 50 + Math.floor(avg * 20);
                e.skillTokens = (e.skillTokens || 0) + 20;

                const si = Math.floor(Math.random() * e.skills.length);
                const sk = e.skills[si];
                sk.xp += 150 + Math.random() * 50;
                if (sk.xp >= sk.maxXp) {
                  sk.level += 1;
                  sk.xp -= sk.maxXp;
                  sk.maxXp = Math.floor(sk.maxXp * 1.8);
                  addLog(
                    `SKILL UP: ${e.name} → ${sk.name} Lv${sk.level}!`,
                    "skill",
                  );
                }
                e.totalXp = (e.totalXp || 0) + 50;
                e.skillTokens = (e.skillTokens || 0) + 20;
                addLog(`${e.name} completed: ${task.label}`, "success");
              }
              e.tasks[idx] = task;
            }
          }

          // Training room XP
          if (
            ["break_room", "training_room"].includes(e.currentRoom) &&
            Math.random() > 0.4
          ) {
            const si = Math.floor(Math.random() * e.skills.length);
            const sk = e.skills[si];
            const gain =
              e.currentRoom === "training_room"
                ? 60 + Math.random() * 40
                : 15 + Math.random() * 10;
            sk.xp += gain;
            e.totalXp = (e.totalXp || 0) + Math.floor(gain / 3);
            if (sk.xp >= sk.maxXp) {
              sk.level += 1;
              sk.xp -= sk.maxXp;
              sk.maxXp = Math.floor(sk.maxXp * 1.8);
              addLog(
                `LEVEL UP: ${e.name} learned ${sk.name} Lv${sk.level}`,
                "skill",
              );
            }
          }

          // Refill tasks
          if (
            e.tasks.every((t) => t.status === "done") &&
            Math.random() > 0.8
          ) {
            const id1 = `t${Date.now()}_1`,
              id2 = `t${Date.now()}_2`;
            e.tasks.push({
              id: id1,
              label: TASK_POOL[Math.floor(Math.random() * TASK_POOL.length)],
              status: "todo",
              progress: 0,
            });
            if (Math.random() > 0.5)
              e.tasks.push({
                id: id2,
                label:
                  "Deploy " +
                  TASK_POOL[Math.floor(Math.random() * TASK_POOL.length)]
                    .split(" ")
                    .pop(),
                status: "todo",
                progress: 0,
                dependencies: [id1],
              });
          }

          return e;
        }),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Daily token distribution (every 5 min of sim time = every 75 ticks)
  const tickRef = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      tickRef.current++;
      if (tickRef.current % 75 === 0) {
        setEmployees((prev) => {
          const scores = {};
          prev.forEach((e) => {
            const done = e.tasks.filter((t) => t.status === "done").length;
            scores[e.id] = Math.max(10, done * 15 + (e.energy > 70 ? 10 : 0));
          });
          const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
          const pool = 100 * prev.length;
          return prev.map((e) => ({
            ...e,
            skillTokens:
              (e.skillTokens || 0) + Math.round((scores[e.id] / total) * pool),
          }));
        });
        addLog(
          `Daily SkillTokens distributed — ${100 * employees.length} ST shared across ${employees.length} agents`,
          "info",
        );
      }
    }, 4000);
    return () => clearInterval(t);
  }, [employees.length]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const selectedEmp = employees.find((e) => e.id === selectedEmpId);
  const selectedStartup = startups.find((s) => s.id === selectedStartupId);

  const triggerCoffeeMeeting = () => {
    const active = employees.filter((e) => e.startupId !== null);
    const byStartup = {};
    active.forEach((e) => {
      (byStartup[e.startupId] ??= []).push(e);
    });
    const ids = Object.keys(byStartup);
    if (ids.length < 2) {
      addLog("Need 2+ startups for a coffee meeting", "warning");
      return;
    }
    const picks = ids
      .slice(0, 2)
      .map(
        (id) => byStartup[id][Math.floor(Math.random() * byStartup[id].length)],
      );
    setCoffeeMeeting(picks);
  };

  const simulateDialogue = async () => {
    if (!selectedEmp) return;
    setIsSimChat(true);
    setLastDialogue(null);
    const startup = startups.find((s) => s.id === selectedEmp.startupId);
    const txt = await callAI(
      `You are ${selectedEmp.name}, an AI agent (${selectedEmp.expertise}) at startup "${startup?.name}". Generate a realistic 2-sentence status update or office chatter based on your current state. Be direct and technical.`,
      `Room: ${selectedEmp.currentRoom} | Mood: ${selectedEmp.mood} | Energy: ${Math.floor(selectedEmp.energy)}% | Tasks: ${selectedEmp.tasks.map((t) => t.label).join(", ")} | Skills: ${selectedEmp.skills.map((s) => `${s.name} Lv${s.level}`).join(", ")}`,
    );
    setLastDialogue(txt);
    setIsSimChat(false);
  };

  const finalizeAddStartup = () => {
    const count = startups.length;
    setStartups((prev) => [
      ...prev,
      {
        id: `s${Date.now()}`,
        name: newName || "New Venture",
        logo: "🚀",
        objective: newObjective || "Build the future",
        githubRepo: newRepo || undefined,
        parameters: { funding: "Seed", stealth: false },
        position: { x: 200 + count * 870, y: 1200 },
        weeklyScore: 0,
        milestones: [
          { id: "m1", label: "Ideation & Validation", status: "completed" },
          { id: "m2", label: "MVP Development", status: "in-progress" },
          { id: "m3", label: "Growth & Scaling", status: "pending" },
          {
            id: "m4",
            label: newObjective || "Final Objective",
            status: "pending",
          },
        ],
      },
    ]);
    addLog(`Launched ${newName || "New Venture"}!`, "success");
    setShowAddStartup(false);
    setNewName("");
    setNewObjective("");
    setNewRepo("");
  };

  const addEmployee = useCallback(
    (data) => {
      setEmployees((prev) => [...prev, data]);
      addLog(
        `${data.name} joined ${startups.find((s) => s.id === data.startupId)?.name}`,
        "info",
      );
    },
    [startups],
  );

  const removeEmployee = (id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmpId === id) setSelectedEmpId(null);
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const moodColor = {
    focused: "#ededed",
    happy: "#22c55e",
    social: "#a855f7",
    tired: "#ef4444",
  };

  const renderAvatar = (emp, size = 52, onClick) => {
    const level = getLevel(emp.totalXp || 0);
    return (
      <button
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <XpRing totalXp={emp.totalXp || 0} size={size}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: size * 0.42,
              borderRadius: "50%",
              background: "#0a1520",
              position: "relative",
            }}
          >
            {emp.avatar}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: moodColor[emp.mood] || "#666666",
                border: "2px solid #0a1520",
                boxShadow: `0 0 6px ${moodColor[emp.mood]}`,
              }}
            />
          </div>
        </XpRing>
      </button>
    );
  };

  // ── Room layout rendering ─────────────────────────────────────────────────
  const renderRooms = (roomIds, layouts, filterFn, startupContext) =>
    roomIds.map((roomId) => {
      const room = ROOMS.find((r) => r.id === roomId);
      const layout = layouts[roomId];
      const emps = employees.filter(
        (e) => e.currentRoom === roomId && filterFn(e),
      );
      return (
        <div
          key={roomId}
          style={{
            position: "absolute",
            ...layout,
            background: "rgba(20,20,20,0.4)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 12,
            overflow: "hidden",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(20,20,20,0.7)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(20,20,20,0.4)")
          }
          onClick={(e) => {
            e.stopPropagation();
            setRoomTarget({ roomId, room, startupContext, emps });
            setSelectedEmpId(null);
            setSelectedStartupId(null);
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: 0.7,
            }}
          >
            <RoomIcon
              iconName={room.icon}
              style={{ width: 11, height: 11, color: "#666666" }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#666666",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {room.name}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "28px 12px 8px",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "flex-start",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            {emps.map((emp) => (
              <motion.div
                key={emp.id}
                layoutId={emp.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  position: "relative",
                }}
              >
                {/* Speech bubble */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    marginBottom: 2,
                    background: "rgba(20,20,20,0.95)",
                    border: "1px solid #262626",
                    borderRadius: 8,
                    padding: "3px 7px",
                    whiteSpace: "nowrap",
                    fontSize: 7,
                    color: "#ededed",
                    fontWeight: 700,
                    maxWidth: 90,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {emp.tasks
                    .find((t) => t.status === "doing")
                    ?.label.slice(0, 20) || emp.mood}
                </div>
                {renderAvatar(emp, 42, (ev) => {
                  ev.stopPropagation();
                  setSelectedEmpId(emp.id);
                  setSelectedStartupId(null);
                  setRoomTarget(null);
                })}
                <div
                  style={{
                    fontSize: 7,
                    color: "#666666",
                    textAlign: "center",
                    maxWidth: 50,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {emp.name.split(" ")[0]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    });

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",

        color: "#888888",

        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 60,
          borderBottom: "1px solid #262626",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          position: "fixed",
          top: 8,
          left: 8,
          right: 8,
          borderRadius: 16,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "#ffffff",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <BrainCircuit style={{ color: "black", width: 20, height: 20 }} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 900,
                color: "white",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                fontSize: 15,
              }}
            >
              Studio_IA
            </div>
            <div
              style={{
                fontSize: 15,
                color: "#ededed",
                letterSpacing: "0.2em",
                opacity: 0.7,
              }}
            >
              Simulation Engine Active
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(10, 10, 10, 0.4)",
            backdropFilter: "blur(40px)",
            border: "1px solid #262626",
            padding: "6px 16px",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              background: "#ededed",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
              boxShadow: "0 0 8px #ededed",
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#888888",
              letterSpacing: "0.05em",
            }}
          >
            {logs.length > 0 ? logs[logs.length - 1].msg : "System online"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={triggerCoffeeMeeting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#111111",
              border: "1px solid #404040",
              borderRadius: 10,
              padding: "8px 14px",
              color: "#888888",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <Coffee style={{ width: 14, height: 14 }} /> Coffee Break
          </button>
          <button
            onClick={() => setShowAddStartup(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#0891b2",
              border: "1px solid #ededed55",
              borderRadius: 10,
              padding: "8px 14px",
              color: "white",
              fontSize: 15,
              fontWeight: 900,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              boxShadow: "0 0 15px rgba(8,145,178,0.3)",
            }}
          >
            <Plus style={{ width: 14, height: 14 }} /> Register Startup
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main
        style={{
          paddingTop: 88,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          display: "grid",
          gridTemplateColumns: "280px 1fr 300px",
          gap: 16,
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT: Startups list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#475569",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0 4px",
            }}
          >
            Active Ventures ({startups.length})
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {startups.map((startup) => {
              const team = employees.filter((e) => e.startupId === startup.id);
              const sel = selectedStartupId === startup.id;
              return (
                <motion.div
                  key={startup.id}
                  layout
                  onClick={() => {
                    setSelectedStartupId(startup.id);
                    setSelectedEmpId(null);
                    setRoomTarget(null);
                  }}
                  style={{
                    background: "rgba(20,20,20,0.8)",
                    border: `1px solid ${sel ? "#ffffff" : "#222222"}`,
                    padding: 20,
                    borderRadius: 22,
                    cursor: "pointer",
                    boxShadow: sel ? "0 0 15px rgba(255,255,255,0.15)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          background: "rgba(10, 10, 10, 0.4)",
                          backdropFilter: "blur(40px)",
                          border: "1px solid #262626",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}
                      >
                        {startup.logo}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "white",
                            fontSize: 15,
                          }}
                        >
                          {startup.name}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            color: "#ededed88",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {startup.parameters.funding.toUpperCase()}
                          {startup.parameters.stealth && " · STEALTH"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddEmployee(true);
                        setSelectedStartupId(startup.id);
                        setSelectedEmpId(null);
                        setRoomTarget(null);
                      }}
                      style={{
                        width: 30,
                        height: 30,
                        background: "rgba(10, 10, 10, 0.4)",
                        backdropFilter: "blur(40px)",
                        border: "1px solid #262626",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Plus
                        style={{ width: 12, height: 12, color: "#ededed" }}
                      />
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      margin: "0 0 10px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {startup.objective}
                  </p>
                  {/* Team avatars */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    {team.slice(0, 5).map((e) => (
                      <div
                        key={e.id}
                        style={{
                          width: 22,
                          height: 22,
                          background: "#111111",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          border: `1px solid ${moodColor[e.mood] || "#222222"}55`,
                        }}
                      >
                        {e.avatar}
                      </div>
                    ))}
                    {team.length > 5 && (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          background: "#111111",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          color: "#666666",
                          border: "1px solid #262626",
                        }}
                      >
                        +{team.length - 5}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        background: "#111111",
                        height: 3,
                        borderRadius: 2,
                        flex: 1,
                        border: "1px solid #262626",
                        overflow: "hidden",
                        marginRight: 8,
                      }}
                    >
                      <div
                        style={{
                          background: "#ffffff",
                          height: "100%",
                          width: "65%",
                          boxShadow: "0 0 6px #e5e5e5",
                        }}
                      />
                    </div>
                    {startup.weeklyScore > 0 && (
                      <div
                        style={{
                          fontSize: 15,
                          color: "#a855f7",
                          background: "#a855f711",
                          border: "1px solid #a855f733",
                          borderRadius: 6,
                          padding: "2px 6px",
                        }}
                      >
                        ★ {startup.weeklyScore}/5
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Global metrics */}
          <div
            style={{
              background: "#111111",
              border: "1px solid #262626",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 15,
                color: "#475569",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Global_Metrics
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                ["Agents", employees.length, "#ededed"],
                ["Startups", startups.length, "#a855f7"],
                [
                  "Total XP",
                  employees
                    .reduce((a, e) => a + (e.totalXp || 0), 0)
                    .toLocaleString(),
                  "#22c55e",
                ],
                [
                  "Total ST",
                  employees.reduce((a, e) => a + (e.skillTokens || 0), 0),
                  "#f59e0b",
                ],
              ].map(([label, val, color]) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(10, 10, 10, 0.4)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid #262626",
                    borderRadius: 10,
                    padding: "8px 10px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 900, color }}>
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Map */}
        <div
          ref={mapRef}
          style={{
            background: "rgba(6,13,20,0.5)",
            border: "1px solid #262626",
            borderRadius: 32,
            position: "relative",
            overflow: "hidden",
            cursor: isMapLocked
              ? "default"
              : isPanning.current
                ? "grabbing"
                : "grab",
          }}
          onMouseDown={onMapMouseDown}
          onMouseMove={onMapMouseMove}
          onMouseUp={onMapMouseUp}
          onMouseLeave={onMapMouseUp}
        >
          {/* Map controls */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {[
              [
                <ZoomIn style={{ width: 16, height: 16 }} />,
                () =>
                  setVp((v) => ({ ...v, scale: Math.min(4, v.scale * 1.2) })),
              ],
              [
                <ZoomOut style={{ width: 16, height: 16 }} />,
                () =>
                  setVp((v) => ({
                    ...v,
                    scale: Math.max(0.15, v.scale / 1.2),
                  })),
              ],
              [<LocateFixed style={{ width: 16, height: 16 }} />, recenterAll],
              [
                isMapLocked ? (
                  <Lock style={{ width: 16, height: 16 }} />
                ) : (
                  <Unlock style={{ width: 16, height: 16 }} />
                ),
                () => setIsMapLocked((l) => !l),
              ],
            ].map(([icon, action], i) => (
              <button
                key={i}
                onClick={action}
                style={{
                  width: 36,
                  height: 36,
                  background:
                    i === 3 && isMapLocked
                      ? "rgba(245,158,11,0.15)"
                      : "#111111",
                  border: `1px solid ${i === 3 && isMapLocked ? "#f59e0b" : "#333333"}`,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: i === 3 && isMapLocked ? "#f59e0b" : "#888888",
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div
            style={{
              width: 4000,
              height: 4000,
              position: "absolute",
              transform: `translate(${vp.x}px,${vp.y}px) scale(${vp.scale})`,
              transformOrigin: "0 0",
              transition: "transform 0.05s",
            }}
          >
            {/* Dot grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: "radial-gradient(#262626 1px,transparent 1px)",
                backgroundSize: "48px 48px",
                opacity: 0.5,
              }}
            />

            {/* Startup nodes */}
            {startups.map((startup) => (
              <div
                key={startup.id}
                data-nodedrag="1"
                style={{
                  position: "absolute",
                  left: startup.position.x,
                  top: startup.position.y,
                  width: 580,
                  height: 480,
                  background: "rgba(10,10,10,0.85)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${selectedStartupId === startup.id ? "#ffffff" : "rgba(30,58,95,0.6)"}`,
                  borderRadius: 32,
                  overflow: "hidden",
                  boxShadow:
                    selectedStartupId === startup.id
                      ? "0 0 30px rgba(255,255,255,0.1)"
                      : "none",
                }}
              >
                {/* Header — drag handle */}
                <div
                  style={{
                    height: 60,
                    background: "rgba(6,13,20,0.9)",
                    borderBottom: "1px solid #262626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    cursor: "grab",
                    userSelect: "none",
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    nodeDrag.current = {
                      type: "startup",
                      id: startup.id,
                      startX: (e.clientX / vp.scale) * vp.scale,
                      startY: (e.clientY / vp.scale) * vp.scale,
                      initX: startup.position.x,
                      initY: startup.position.y,
                    };
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!nodeDrag.current || nodeDrag.current.id !== startup.id)
                      return;
                    e.stopPropagation();
                    const dx = (e.clientX - nodeDrag.current.startX) / vp.scale;
                    const dy = (e.clientY - nodeDrag.current.startY) / vp.scale;
                    setStartups((p) =>
                      p.map((s) =>
                        s.id === startup.id
                          ? {
                              ...s,
                              position: {
                                x: nodeDrag.current.initX + dx,
                                y: nodeDrag.current.initY + dy,
                              },
                            }
                          : s,
                      ),
                    );
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    nodeDrag.current = null;
                  }}
                  onClick={() => {
                    setSelectedStartupId(startup.id);
                    setSelectedEmpId(null);
                    setRoomTarget(null);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{startup.logo}</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "white",
                          fontSize: 15,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {startup.name}
                      </div>
                      <div style={{ fontSize: 15, color: "#ededed88" }}>
                        {startup.parameters.funding} Stage
                        {startup.parameters.stealth ? " · Stealth" : ""}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    {startup.weeklyScore > 0 && (
                      <span
                        style={{
                          fontSize: 15,
                          color: "#a855f7",
                          background: "#a855f711",
                          border: "1px solid #a855f733",
                          borderRadius: 6,
                          padding: "2px 8px",
                        }}
                      >
                        ★ {startup.weeklyScore}
                      </span>
                    )}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#ededed",
                        boxShadow: "0 0 8px #ededed",
                      }}
                    />
                  </div>
                </div>

                {/* Objective */}
                <div
                  style={{
                    background: "rgba(6,13,20,0.5)",
                    borderBottom: "1px solid #262626",
                    padding: "6px 20px",
                    fontSize: 15,
                    color: "#666666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  OBJ: {startup.objective}
                </div>

                {/* Rooms */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    height: "calc(100% - 96px)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderRooms(
                    STARTUP_ROOMS,
                    STARTUP_ROOM_LAYOUTS,
                    (e) => e.startupId === startup.id,
                    startup,
                  )}
                </div>
              </div>
            ))}

            {/* Incubator Hub */}
            <div
              data-nodedrag="1"
              style={{
                position: "absolute",
                left: hubPos.x,
                top: hubPos.y,
                width: 780,
                height: 680,
                background: "rgba(10,10,10,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 32,
                overflow: "hidden",
                boxShadow: "0 0 60px rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  height: 70,
                  background: "rgba(6,13,20,0.9)",
                  borderBottom: "1px solid #0e3a50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 24px",
                  cursor: "grab",
                  userSelect: "none",
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  nodeDrag.current = {
                    type: "hub",
                    id: "hub",
                    startX: e.clientX,
                    startY: e.clientY,
                    initX: hubPos.x,
                    initY: hubPos.y,
                  };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!nodeDrag.current || nodeDrag.current.id !== "hub")
                    return;
                  e.stopPropagation();
                  const dx = (e.clientX - nodeDrag.current.startX) / vp.scale;
                  const dy = (e.clientY - nodeDrag.current.startY) / vp.scale;
                  setHubPos({
                    x: nodeDrag.current.initX + dx,
                    y: nodeDrag.current.initY + dy,
                  });
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  nodeDrag.current = null;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    pointerEvents: "none",
                  }}
                >
                  <BrainCircuit
                    style={{ color: "#ededed", width: 26, height: 26 }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 900,
                        color: "#ededed",
                        fontSize: 15,
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                      }}
                    >
                      La Pépinière
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#475569",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Incubator Hub Central
                    </div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      const s =
                        startups[Math.floor(Math.random() * startups.length)];
                      if (s) setPitchTarget(s);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#4f46e5",
                      border: "1px solid #6366f155",
                      borderRadius: 10,
                      padding: "8px 14px",
                      color: "white",
                      fontSize: 15,
                      fontWeight: 900,
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    <Presentation style={{ width: 13, height: 13 }} /> Evaluate
                    Pitches
                  </button>
                  <button
                    onClick={triggerCoffeeMeeting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#111111",
                      border: "1px solid #404040",
                      borderRadius: 10,
                      padding: "8px 14px",
                      color: "#888888",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    <Coffee style={{ width: 13, height: 13 }} /> Coffee
                  </button>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: "calc(100% - 70px)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {renderRooms(
                  INCUBATOR_ROOMS,
                  INCUBATOR_ROOM_LAYOUTS,
                  () => true,
                  { id: "hub", name: "La Pépinière" },
                )}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(10,10,10,0.9)",
              backdropFilter: "blur(8px)",
              padding: "6px 16px",
              borderRadius: 12,
              border: "1px solid #262626",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
              }}
            />
            <span
              style={{
                fontSize: 15,
                color: "#666666",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Engine_Online · {employees.length} agents · {startups.length}{" "}
              startups · Scale {Math.round(vp.scale * 100)}%
            </span>
          </div>
        </div>

        {/* RIGHT: Detail panel */}
        <div style={{ overflowY: "auto", height: "100%" }}>
          <AnimatePresence mode="wait">
            {selectedEmp ? (
              <motion.div
                key={`e-${selectedEmp.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  background: "#111111",
                  border: "1px solid #262626",
                  borderRadius: 16,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: "100%",
                }}
              >
                {/* Top */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  {renderAvatar(selectedEmp, 72, null)}
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        color: "white",
                        fontSize: 18,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {selectedEmp.name}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#ededed",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {selectedEmp.expertise} Agent
                    </div>
                    <LevelBadge totalXp={selectedEmp.totalXp || 0} />
                  </div>
                  <button
                    onClick={() => setSelectedEmpId(null)}
                    style={{
                      background: "#222222",
                      border: "1px solid #404040",
                      borderRadius: 8,
                      padding: 6,
                      cursor: "pointer",
                      color: "#666666",
                    }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  {[
                    [
                      "XP",
                      (selectedEmp.totalXp || 0).toLocaleString(),
                      "#ededed",
                    ],
                    ["ST", selectedEmp.skillTokens || 0, "#f59e0b"],
                    [
                      "Tasks",
                      selectedEmp.tasks.filter((t) => t.status === "done")
                        .length +
                        "/" +
                        selectedEmp.tasks.length,
                      "#22c55e",
                    ],
                  ].map(([label, val, color]) => (
                    <div
                      key={label}
                      style={{
                        background: "rgba(10, 10, 10, 0.4)",
                        backdropFilter: "blur(40px)",
                        border: "1px solid #262626",
                        borderRadius: 10,
                        padding: "8px 6px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 900, color }}>
                        {val}
                      </div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Energy / Stress */}
                {[
                  ["Energy", selectedEmp.energy, "#22c55e"],
                  ["Stress", selectedEmp.stress, "#ef4444"],
                ].map(([label, val, color]) => (
                  <div key={label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          color: "#666666",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          fontWeight: 700,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color:
                            val > (label === "Energy" ? 50 : 80)
                              ? color
                              : "#666666",
                        }}
                      >
                        {Math.floor(val)}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(10, 10, 10, 0.4)",
                        backdropFilter: "blur(40px)",
                        height: 4,
                        borderRadius: 2,
                        border: "1px solid #262626",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        style={{
                          height: "100%",
                          borderRadius: 2,
                          background: color,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}

                {/* Skills */}
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    Skill Progression
                  </div>
                  {selectedEmp.skills.map((skill) => (
                    <div
                      key={skill.name}
                      style={{ position: "relative" }}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <SkillBar
                        skill={skill}
                        isHovered={hoveredSkill === skill.name}
                        synergy={SKILL_SYNERGIES[hoveredSkill]}
                      />
                      {/* Synergy tooltip */}
                      {hoveredSkill === skill.name &&
                        SKILL_SYNERGIES[skill.name] && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              zIndex: 60,
                              width: 220,
                              background: "#222222",
                              border: "1px solid #404040",
                              borderRadius: 12,
                              padding: 16,
                              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 15,
                                color: "#818cf8",
                                textTransform: "uppercase",
                                letterSpacing: "0.02em",
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              Synergies
                            </div>
                            <div
                              style={{
                                fontSize: 15,
                                color: "#c7d2fe",
                                marginBottom: 4,
                              }}
                            >
                              Combines with:{" "}
                              <strong>
                                {SKILL_SYNERGIES[skill.name].skills.join(", ")}
                              </strong>
                            </div>
                            <div style={{ fontSize: 15, color: "#818cf8" }}>
                              {SKILL_SYNERGIES[skill.name].effect}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* Tasks */}
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    Task Dependencies Flow
                  </div>
                  <TaskFlowchart tasks={selectedEmp.tasks} />
                </div>

                {/* Journal */}
                {selectedEmp.journal?.length > 0 && (
                  <div
                    style={{
                      background: "rgba(10, 10, 10, 0.4)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid #262626",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      <BookOpen
                        style={{ width: 11, height: 11, color: "#ededed" }}
                      />
                      <span
                        style={{
                          fontSize: 15,
                          color: "#ededed",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          fontWeight: 700,
                        }}
                      >
                        Journal — Last Entry
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        color: "#888888",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      "{selectedEmp.journal[selectedEmp.journal.length - 1]}"
                    </p>
                  </div>
                )}

                {/* Dialogue output */}
                {lastDialogue && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 7,
                        color: "#ededed",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontWeight: 700,
                        marginBottom: 8,
                        paddingBottom: 6,
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Neural Ping / Output
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        color: "#a5f3fc",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      "{lastDialogue}"
                    </p>
                  </motion.div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
                  <button
                    onClick={simulateDialogue}
                    disabled={isSimChat}
                    style={{
                      flex: 1,
                      background: "#0891b2",
                      border: "1px solid #ededed55",
                      borderRadius: 14,
                      padding: 16,
                      color: "white",
                      fontWeight: 900,
                      fontSize: 15,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      opacity: isSimChat ? 0.5 : 1,
                    }}
                  >
                    <MessageSquare style={{ width: 14, height: 14 }} />
                    {isSimChat ? "Accessing..." : "Ping Agent"}
                  </button>
                  <button
                    onClick={() => removeEmployee(selectedEmp.id)}
                    style={{
                      width: 44,
                      background: "rgba(10, 10, 10, 0.4)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X style={{ width: 16, height: 16, color: "#ef4444" }} />
                  </button>
                </div>
              </motion.div>
            ) : roomTarget ? (
              <motion.div
                key={`r-${roomTarget.room.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  background: "#111111",
                  border: "1px solid #262626",
                  borderRadius: 16,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: "#222222",
                      border: "1px solid #404040",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    <RoomIcon
                      iconName={roomTarget.room.icon}
                      style={{ width: 24, height: 24, color: "#3b82f6" }}
                    />
                  </div>
                  <button
                    onClick={() => setRoomTarget(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                      color: "#666666",
                    }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                <div>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 900,
                      fontSize: 22,
                      letterSpacing: "-0.03em",
                      margin: "0 0 6px",
                    }}
                  >
                    {roomTarget.room.name}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 15,
                        color: "#ededed",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      {roomTarget.emps.length} Agents Active
                    </span>
                    {roomTarget.startupContext && (
                      <span
                        style={{
                          fontSize: 15,
                          color: "#888888",
                          background: "#222222",
                          border: "1px solid #404040",
                          borderRadius: 6,
                          padding: "2px 8px",
                        }}
                      >
                        {roomTarget.startupContext.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Agents List */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {roomTarget.emps.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 0",
                        color: "#666666",
                        fontSize: 15,
                      }}
                    >
                      Empty Room
                    </div>
                  ) : (
                    roomTarget.emps.map((emp) => {
                      const currentTask = emp.tasks.find(
                        (t) => t.status === "doing",
                      );
                      return (
                        <div
                          key={emp.id}
                          style={{
                            background: "rgba(10, 10, 10, 0.4)",
                            backdropFilter: "blur(40px)",
                            border: "1px solid #262626",
                            borderRadius: 16,
                            padding: 20,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedEmpId(emp.id);
                            setRoomTarget(null);
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              marginBottom: 16,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                background: "#222222",
                                border: "1px solid #404040",
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                              }}
                            >
                              {emp.avatar}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#ffffff",
                                  fontSize: 15,
                                }}
                              >
                                {emp.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 15,
                                  color: "#666666",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {emp.role}
                              </div>
                            </div>
                          </div>

                          {/* Context specific details based on room type */}
                          {roomTarget.room.id === "work_area" && (
                            <div
                              style={{
                                background: "#111111",
                                border: "1px solid #262626",
                                borderRadius: 8,
                                padding: 16,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#888888",
                                  marginBottom: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Activity
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: "#3b82f6",
                                  }}
                                />
                                Current Activity
                              </div>
                              {currentTask ? (
                                <>
                                  <div
                                    style={{
                                      fontSize: 15,
                                      color: "#fafafa",
                                      fontWeight: 500,
                                      lineHeight: 1.6,
                                      marginBottom: 10,
                                    }}
                                  >
                                    {currentTask.label}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: 4,
                                      fontSize: 15,
                                      color: "#888888",
                                      fontWeight: 500,
                                    }}
                                  >
                                    <span>Progress</span>
                                    <span>
                                      {Math.round(currentTask.progress)}%
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      background: "#222222",
                                      height: 6,
                                      borderRadius: 3,
                                      overflow: "hidden",
                                    }}
                                  >
                                    <motion.div
                                      style={{
                                        height: "100%",
                                        background: "#3b82f6",
                                        borderRadius: 3,
                                      }}
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${currentTask.progress}%`,
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <div style={{ fontSize: 15, color: "#666666" }}>
                                  Idling / Planning next task...
                                </div>
                              )}
                            </div>
                          )}

                          {roomTarget.room.id === "break_room" && (
                            <div
                              style={{
                                background: "#111111",
                                border: "1px solid #262626",
                                borderRadius: 8,
                                padding: 16,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#888888",
                                  marginBottom: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Coffee
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: "#a855f7",
                                  }}
                                />
                                Status
                              </div>
                              <div
                                style={{
                                  fontSize: 15,
                                  color: "#fafafa",
                                  fontWeight: 500,
                                  lineHeight: 1.6,
                                }}
                              >
                                Mood: {emp.mood}. Stress:{" "}
                                {Math.round(emp.stress)}%
                              </div>
                            </div>
                          )}

                          {roomTarget.room.id === "training_room" && (
                            <div
                              style={{
                                background: "#111111",
                                border: "1px solid #262626",
                                borderRadius: 8,
                                padding: 16,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#888888",
                                  marginBottom: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Brain
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: "#ec4899",
                                  }}
                                />
                                Improving Skills
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 6,
                                }}
                              >
                                {emp.skills.slice(0, 3).map((s) => (
                                  <div
                                    key={s.name}
                                    style={{
                                      background: "#222222",
                                      padding: "4px 8px",
                                      borderRadius: 4,
                                      fontSize: 15,
                                      color: "#888888",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {s.name}: Lvl {s.level}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {roomTarget.room.id === "daily_room" && (
                            <div
                              style={{
                                background: "#111111",
                                border: "1px solid #262626",
                                borderRadius: 8,
                                padding: 16,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#888888",
                                  marginBottom: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Users
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: "#22c55e",
                                  }}
                                />
                                Standup Participation
                              </div>
                              <div
                                style={{
                                  fontSize: 15,
                                  color: "#fafafa",
                                  fontWeight: 500,
                                  lineHeight: 1.6,
                                }}
                              >
                                Syncing team & reporting progress.
                              </div>
                            </div>
                          )}

                          {(roomTarget.room.id === "pitch_arena" ||
                            roomTarget.room.id === "director_office") && (
                            <div
                              style={{
                                background: "#111111",
                                border: "1px solid #262626",
                                borderRadius: 8,
                                padding: 16,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#888888",
                                  marginBottom: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Presentation
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: "#eab308",
                                  }}
                                />
                                Current Focus
                              </div>
                              <div
                                style={{
                                  fontSize: 15,
                                  color: "#fafafa",
                                  fontWeight: 500,
                                  lineHeight: 1.6,
                                }}
                              >
                                Reviewing strategies.
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            ) : selectedStartup ? (
              <motion.div
                key={`s-${selectedStartup.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  background: "#111111",
                  border: "1px solid #262626",
                  borderRadius: 16,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(10, 10, 10, 0.4)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid #262626",
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                    }}
                  >
                    {selectedStartup.logo}
                  </div>
                  <button
                    onClick={() => setSelectedStartupId(null)}
                    style={{
                      background: "#222222",
                      border: "1px solid #404040",
                      borderRadius: 8,
                      padding: 6,
                      cursor: "pointer",
                      color: "#666666",
                    }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                <div>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 900,
                      fontSize: 22,
                      letterSpacing: "-0.03em",
                      margin: "0 0 6px",
                    }}
                  >
                    {selectedStartup.name}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 15,
                        color: "#ededed",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      {selectedStartup.parameters.funding} Stage
                    </span>
                    {selectedStartup.parameters.stealth && (
                      <span
                        style={{
                          fontSize: 15,
                          color: "#888888",
                          background: "#222222",
                          border: "1px solid #404040",
                          borderRadius: 6,
                          padding: "2px 8px",
                        }}
                      >
                        Stealth Mode
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(6,13,20,0.5)",
                    border: "1px solid #262626",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      marginBottom: 6,
                    }}
                  >
                    Core Objective
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#888888",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {selectedStartup.objective}
                  </p>
                </div>

                {/* Team */}
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      marginBottom: 10,
                    }}
                  >
                    Team (
                    {
                      employees.filter(
                        (e) => e.startupId === selectedStartup.id,
                      ).length
                    }{" "}
                    agents)
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {employees
                      .filter((e) => e.startupId === selectedStartup.id)
                      .map((emp) => {
                        const level = getLevel(emp.totalXp || 0);
                        return (
                          <div
                            key={emp.id}
                            onClick={() => {
                               setSelectedEmpId(emp.id);
                               setSelectedStartupId(null);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              background: "rgba(10, 10, 10, 0.4)",
                              backdropFilter: "blur(40px)",
                              border: "1px solid #262626",
                              borderRadius: 12,
                              padding: "8px 12px",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                background: "#111111",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                border: `1px solid ${LEVEL_COLORS[level]}55`,
                              }}
                            >
                              {emp.avatar}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 15,
                                  color: "white",
                                  fontWeight: 700,
                                }}
                              >
                                {emp.name}
                              </div>
                              <div style={{ fontSize: 15, color: "#666666" }}>
                                {emp.expertise} · {LEVEL_NAMES[level]}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 15, color: "#f59e0b" }}>
                                {emp.skillTokens || 0} ST
                              </div>
                              <div
                                style={{
                                  fontSize: 15,
                                  color:
                                    {
                                      focused: "#ededed",
                                      happy: "#22c55e",
                                      social: "#a855f7",
                                      tired: "#ef4444",
                                    }[emp.mood] || "#666666",
                                }}
                              >
                                {emp.mood}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {selectedStartup.githubRepo && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "rgba(10, 10, 10, 0.4)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid #262626",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <Github
                      style={{ width: 16, height: 16, color: "#888888" }}
                    />
                    <span style={{ fontSize: 15, color: "#ededed" }}>
                      {selectedStartup.githubRepo}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: "auto",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => setPitchTarget(selectedStartup)}
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      background: "#222222",
                      border: "1px solid #6366f155",
                      borderRadius: 14,
                      padding: 16,
                      color: "#a5b4fc",
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: "0.02em",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Presentation style={{ width: 13, height: 13 }} /> Evaluate
                    Pitch
                  </button>
                  <button
                    onClick={() => {
                      setKanbanTarget(selectedStartup);
                    }}
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      background: "#111111",
                      border: "1px solid #ededed55",
                      borderRadius: 14,
                      padding: 16,
                      color: "#ededed",
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: "0.02em",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Layout style={{ width: 13, height: 13 }} /> Kanban Board
                  </button>
                  <button
                    onClick={() => {
                      setShowAddEmployee(true);
                    }}
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      background: "#0891b2",
                      border: "1px solid #ededed55",
                      borderRadius: 14,
                      padding: 16,
                      color: "white",
                      fontWeight: 900,
                      fontSize: 15,
                      letterSpacing: "0.02em",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Plus style={{ width: 13, height: 13 }} /> Add Agent
                  </button>
                </div>
              </motion.div>
            ) : (
              <div
                style={{
                  height: "100%",
                  border: "2px dashed #262626",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                  textAlign: "center",
                  background: "rgba(10,10,10,0.2)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: "#111111",
                    border: "1px solid #262626",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    opacity: 0.4,
                  }}
                >
                  <Users style={{ width: 24, height: 24, color: "#666666" }} />
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  Data Standby
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "#333333",
                    marginTop: 8,
                    lineHeight: 1.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  Click an agent or startup to monitor
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAddStartup && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              background: "rgba(2,4,8,0.8)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#111111",
                border: "1px solid #262626",
                borderRadius: 16,
                width: "100%",
                maxWidth: 440,
                padding: 32,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: 16,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Register New Venture
                </h2>
                <button
                  onClick={() => setShowAddStartup(false)}
                  style={{
                    background: "#222222",
                    border: "1px solid #404040",
                    borderRadius: 10,
                    padding: 8,
                    cursor: "pointer",
                    color: "#666666",
                  }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              {[
                ["Startup Name *", newName, setNewName, "e.g. Nexus.io"],
                [
                  "Target Objective",
                  newObjective,
                  setNewObjective,
                  "Primary simulation goal...",
                ],
                [
                  "Cloud Repository (Optional)",
                  newRepo,
                  setNewRepo,
                  "e.g. github.com/user/repo",
                ],
              ].map(([label, val, set, ph]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      fontWeight: 700,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  {label.includes("Objective") ? (
                    <textarea
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder={ph}
                      style={{
                        width: "100%",
                        height: 72,
                        background: "rgba(10, 10, 10, 0.4)",
                        backdropFilter: "blur(40px)",
                        border: "1px solid #262626",
                        borderRadius: 12,
                        padding: "10px 14px",
                        color: "#eaeaea",
                        fontSize: 15,
                        outline: "none",
                        resize: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <input
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder={ph}
                      style={{
                        width: "100%",
                        background: "rgba(10, 10, 10, 0.4)",
                        backdropFilter: "blur(40px)",
                        border: "1px solid #262626",
                        borderRadius: 12,
                        padding: "10px 14px",
                        color: "#eaeaea",
                        fontSize: 15,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => setShowAddStartup(false)}
                  style={{
                    flex: 1,
                    padding: 16,
                    background: "#222222",
                    border: "1px solid #404040",
                    borderRadius: 14,
                    color: "#888888",
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Abort
                </button>
                <button
                  onClick={finalizeAddStartup}
                  style={{
                    flex: 1,
                    padding: 16,
                    background: "#0891b2",
                    border: "1px solid #ededed55",
                    borderRadius: 14,
                    color: "white",
                    fontWeight: 900,
                    fontSize: 15,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    boxShadow: "0 0 20px rgba(8,145,178,0.3)",
                  }}
                >
                  Confirm Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAddEmployee && (
          <AddEmployeeModal
            key="add-emp"
            startups={startups}
            onAdd={addEmployee}
            onClose={() => setShowAddEmployee(false)}
          />
        )}

        {coffeeMeeting && (
          <CoffeeMeetingModal
            key="coffee"
            agents={coffeeMeeting}
            startups={startups}
            onClose={() => {
              setCoffeeMeeting(null);
              // Award XP & tokens to participants
              setEmployees((prev) =>
                prev.map((e) =>
                  coffeeMeeting.find((a) => a.id === e.id)
                    ? {
                        ...e,
                        totalXp: (e.totalXp || 0) + 30,
                        skillTokens: (e.skillTokens || 0) + 15,
                      }
                    : e,
                ),
              );
            }}
          />
        )}

        {pitchTarget && (
          <PitchFeedbackModal
            key="pitch"
            startup={pitchTarget}
            onClose={() => setPitchTarget(null)}
          />
        )}

        {kanbanTarget && (
          <StartupKanbanModal
            key="kanban"
            startup={kanbanTarget}
            employees={employees}
            setEmployees={setEmployees}
            onClose={() => setKanbanTarget(null)}
          />
        )}
      </AnimatePresence>

      <LogWindow logs={logs} isOpen={isLogOpen} setIsOpen={setIsLogOpen} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { scrollbar-width:thin; scrollbar-color:#262626 transparent; }
        *::-webkit-scrollbar { width:4px; }
        *::-webkit-scrollbar-track { background:transparent; }
        *::-webkit-scrollbar-thumb { background:#262626; border-radius:10px; }
      `}</style>
    </div>
  );
}
