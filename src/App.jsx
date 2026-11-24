/* eslint no-useless-escape: off */
import "./App.css";
import DeveloperHub from "./DeveloperHub";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  ExternalLink,
  Code2,
  Globe2,
  GraduationCap,
  Heart,
  ImagePlus,
  Mail,
  FileText,
  ListTodo,
  MapPin,
  Menu,
  Search,
  Settings2,
  Sparkles,
  Plus,
  RefreshCw,
  Target,
  X,
  Zap,
  Download,
  Trash2,
  Link2,
  Palette,
} from "lucide-react";

function AvatarVisual({ profile }) {
  if (profile.avatar) {
    return <img className="avatar-image" src={profile.avatar} alt="" />;
  }
  const initials = (profile.name || "SIGNAL")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "S";
}

const opportunities = [
  {
    id: "website-challenge",
    title: "Build Your Own Website",
    org: "ROXTEN STUDIOS",
    type: "Hackathon",
    mode: "Online",
    location: "Remote · India",
    deadline: "25 Nov 2026",
    days: 2,
    reward: "₹15,000 in goodies",
    fit: 98,
    color: "lime",
    featured: true,
    description:
      "Turn an idea into a website worth showing off. Ship a real project, share your process, and get it in front of a community of builders.",
    tags: ["Web Development", "Frontend", "Open to all"],
    steps: [
      "Build and publish your website",
      "Prepare a short project description",
      "Submit your live link on Devpost",
    ],
    link: "https://devpost.com/submit-to/31683-buildyourownwebsite/manage/submissions/1311291/edit",
  },
  {
    id: "prompt-wars",
    title: "PromptWars Virtual",
    org: "GOOGLE DEVELOPER · HACK2SKILL",
    type: "Hackathon",
    mode: "Online",
    location: "Remote",
    deadline: "08 Dec 2026",
    days: 15,
    reward: "Google Developer swag",
    fit: 94,
    color: "blue",
    description:
      "Build a useful generative AI application that solves a real problem. Bring your existing AI experiments or start with a fresh idea.",
    tags: ["Generative AI", "Product Building", "Open to all"],
    steps: [
      "Register for the challenge",
      "Build a working GenAI prototype",
      "Submit your project and demo",
    ],
    link: "https://hack2skill.com/",
  },
  {
    id: "innodata",
    title: "Innodata AI Hackathon",
    org: "HACK2SKILL",
    type: "Hackathon",
    mode: "Online",
    location: "India",
    deadline: "06 Dec 2026",
    days: 13,
    reward: "₹10 lakh prize pool",
    fit: 91,
    color: "violet",
    description:
      "Create an AI-powered solution with real-world impact. A strong opportunity to test your skills, meet other builders, and compete for a share of the prize pool.",
    tags: ["Artificial Intelligence", "Hackathon", "Free entry"],
    steps: [
      "Complete free registration",
      "Choose a problem statement",
      "Submit your solution before the deadline",
    ],
    link: "https://hack2skill.com/",
  },
  {
    id: "nexovai",
    title: "Software Engineer Intern",
    org: "NEXOVAI",
    type: "Internship",
    mode: "Hybrid",
    location: "Hyderabad, India",
    deadline: "14 Dec 2026",
    days: 21,
    reward: "Paid · 3 months",
    fit: 89,
    color: "orange",
    description:
      "Join a small product team and help ship features from idea to production. Great for early-career engineers who like learning by building.",
    tags: ["React", "JavaScript", "Internship"],
    steps: [
      "Review the role requirements",
      "Tailor your resume and portfolio",
      "Apply through the company listing",
    ],
    link: "https://www.linkedin.com/jobs/",
  },
  {
    id: "brandstorm",
    title: "L'Oréal Brandstorm 2027",
    org: "L’ORÉAL · UNSTOP",
    type: "Competition",
    mode: "Online",
    location: "Global",
    deadline: "10 Jan 2027",
    days: 48,
    reward: "International experience",
    fit: 82,
    color: "pink",
    description:
      "A global innovation challenge for teams ready to rethink the future of beauty. Explore, make, and pitch an original idea.",
    tags: ["Innovation", "Team challenge", "Global"],
    steps: [
      "Form a team",
      "Explore the brief and create a concept",
      "Submit your idea on Unstop",
    ],
    link: "https://unstop.com/",
  },
  {
    id: "titan-design",
    title: "Titan Watch Face Design Challenge",
    org: "TITAN · HACK2SKILL",
    type: "Design",
    mode: "Online",
    location: "India",
    deadline: "18 Dec 2026",
    days: 25,
    reward: "Design showcase",
    fit: 78,
    color: "cyan",
    description:
      "Design a watch face that makes every glance count. Join the upcoming AMA to learn more about the brief and get your questions answered.",
    tags: ["UI/UX Design", "Wearables", "AMA · 25 Nov"],
    steps: [
      "Attend the challenge AMA",
      "Create your watch face concept",
      "Submit your design",
    ],
    link: "https://hack2skill.com/",
  },
];

const initialProfile = {
  name: "Alex Morgan",
  role: "Frontend developer",
  location: "Bengaluru, India",
  email: "",
  phone: "",
  interests: ["Frontend", "AI & ML", "Hackathons", "Product design"],
  github: "github.com/alexmorgan",
  linkedin: "",
  portfolio: "",
  completion: 75,
};
const initialMissions = [
  { id: "website-challenge", status: "In progress", addedAt: "Today" },
];
const initialActivities = [
  {
    id: "devfest-attended",
    title: "Google DevFest",
    kind: "Event attended",
    date: "",
    organization: "Google Developer Groups",
    notes:
      "Attended DevFest and explored the developer community, talks, and sessions.",
    skills: ["Community", "Technology"],
  },
];
const safeRead = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function loadGoogleIdentity() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-google-identity]");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function decodeEmailBody(payload) {
  const parts = [payload, ...(payload?.parts || [])];
  const textPart = parts.find(
    (part) => part.mimeType === "text/plain" && part.body?.data,
  );
  const htmlPart = parts.find(
    (part) => part.mimeType === "text/html" && part.body?.data,
  );
  const data = textPart?.body?.data || htmlPart?.body?.data;
  if (!data) return "";
  try {
    const binary = atob(data.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return textPart
      ? decoded
      : decoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  } catch {
    return "";
  }
}

function opportunityFromEmail(message) {
  const headers = message.payload?.headers || [];
  const getHeader = (name) =>
    headers.find((header) => header.name.toLowerCase() === name)?.value || "";
  const subject =
    getHeader("subject")
      .replace(/^(re|fwd?):\s*/i, "")
      .trim() || "Opportunity from your inbox";
  const from = getHeader("from");
  const sender =
    from
      .match(/^([^<]+)|<([^>]+)>/)?.[1]
      ?.trim()
      .replaceAll('"', "") ||
    from.split("@")[0] ||
    "EMAIL SOURCE";
  const body = decodeEmailBody(message.payload);
  const searchable = `${subject} ${message.snippet || ""} ${body}`;
  if (
    !/(opportunit|hackathon|internship|fellowship|competition|challenge|scholarship|apply now|application deadline|career fair|devfest)/i.test(
      searchable,
    )
  )
    return null;
  const type = /intern|job|career/i.test(searchable)
    ? "Internship"
    : /design|ui\/ux/i.test(searchable)
      ? "Design"
      : /fellowship|scholarship/i.test(searchable)
        ? "Fellowship"
        : /competition|challenge|hackathon/i.test(searchable)
          ? "Hackathon"
          : "Opportunity";
  const dateMatch = searchable.match(
    /(?:deadline|apply by|due date|closes? on)\s*[:\-]?\s*((?:\d{1,2}\s+)?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*,?\s*\d{4}|\d{1,2}[/.\-]\d{1,2}[/.\-]\d{2,4})/i,
  );
  const link =
    searchable.match(/https?:\/\/[^\s<>"')]+/i)?.[0] ||
    `https://mail.google.com/mail/u/0/#all/${message.id}`;
  return {
    id: `gmail-${message.id}`,
    gmailId: message.id,
    title: subject.slice(0, 110),
    org: sender.toUpperCase().slice(0, 55),
    type,
    mode: "From your inbox",
    location: "See email details",
    deadline: dateMatch?.[1] || "Check email for deadline",
    days: 99,
    reward: "See opportunity details",
    fit: 86,
    color: type === "Internship" ? "blue" : type === "Design" ? "pink" : "lime",
    description: (
      message.snippet ||
      body ||
      "Open the original email to see the full opportunity details."
    ).slice(0, 420),
    tags: [
      ...new Set([
        type,
        "From Gmail",
        ...(
          searchable.match(
            /\b(React|JavaScript|AI|ML|design|frontend|web development)\b/gi,
          ) || []
        ).slice(0, 2),
      ]),
    ],
    steps: [
      "Review the original email and eligibility",
      "Note the application requirements",
      "Apply before the listed deadline",
    ],
    link,
    emailDate: getHeader("date"),
  };
}

async function createProfileAvatar(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Choose an image smaller than 10 MB.");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("This image could not be processed.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.86);
}

async function createProfileBanner(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Choose an image smaller than 10 MB.");
  }
  const bitmap = await createImageBitmap(file);
  const width = 1440;
  const height = 480;
  const scale = Math.max(width / bitmap.width, height / bitmap.height);
  const scaledWidth = bitmap.width * scale;
  const scaledHeight = bitmap.height * scale;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("This image could not be processed.");
  }
  context.drawImage(
    bitmap,
    (width - scaledWidth) / 2,
    (height - scaledHeight) / 2,
    scaledWidth,
    scaledHeight,
  );
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.84);
}

function App() {
  const [page, setPage] = useState("Discover");
  const [theme, setTheme] = useState(() => {
    const savedTheme = safeRead("signal.themePreview", "dev");
    return savedTheme === "midnight" ? "dev" : savedTheme;
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [missions, setMissions] = useState(() =>
    safeRead("signal.missions", initialMissions),
  );
  const [saved, setSaved] = useState(() =>
    safeRead("signal.saved", ["prompt-wars", "innodata"]),
  );
  const [profile, setProfile] = useState(() =>
    safeRead("signal.profile", initialProfile),
  );
  const [activities, setActivities] = useState(() =>
    safeRead("signal.activities", initialActivities),
  );
  const [emailConfig, setEmailConfig] = useState(() =>
    safeRead("signal.emailConfig", { clientId: "", account: "", lastSync: "" }),
  );
  const [emailOpportunities, setEmailOpportunities] = useState(() =>
    safeRead("signal.emailOpportunities", []),
  );
  const [emailToken, setEmailToken] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All opportunities");
  const [sort, setSort] = useState("Best match");
  const [mobileNav, setMobileNav] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [draft, setDraft] = useState(profile);
  const [activityDraft, setActivityDraft] = useState({
    title: "",
    kind: "Event attended",
    date: "",
    organization: "",
    notes: "",
    skills: "",
  });
  const searchInputRef = useRef(null);
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPage("Discover");
        window.setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      if (event.key === "Escape") {
        setActive(null);
        setEditing(false);
        setShowThemePicker(false);
        setMobileNav(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  const syncGmailRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("signal.themePreview", JSON.stringify(theme));
  }, [theme]);

  const persist = (key, value, setter) => {
    setter(value);
    localStorage.setItem(`signal.${key}`, JSON.stringify(value));
  };
  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }, []);
  const allOpportunities = useMemo(
    () => [...emailOpportunities, ...opportunities],
    [emailOpportunities],
  );
  const filtered = useMemo(() => {
    let list = allOpportunities.filter(
      (item) =>
        (category === "All opportunities" || item.type === category) &&
        `${item.title} ${item.org} ${item.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    if (sort === "Deadline soon")
      list = [...list].sort((a, b) => a.days - b.days);
    if (sort === "Best match") list = [...list].sort((a, b) => b.fit - a.fit);
    return list;
  }, [allOpportunities, category, query, sort]);
  const missionItems = missions
    .map((mission) => ({
      ...allOpportunities.find((item) => item.id === mission.id),
      ...mission,
    }))
    .filter((item) => item.title);
  const toggleSaved = (id) =>
    persist(
      "saved",
      saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id],
      setSaved,
    );
  const addMission = (item) => {
    if (!missions.some((mission) => mission.id === item.id))
      persist(
        "missions",
        [...missions, { id: item.id, status: "In progress", addedAt: "Today" }],
        setMissions,
      );
    setActive(null);
    notify("Added to My Missions");
  };
  const updateStatus = (id, status) =>
    persist(
      "missions",
      missions.map((mission) =>
        mission.id === id ? { ...mission, status } : mission,
      ),
      setMissions,
    );
  const saveProfile = () => {
    const next = {
      ...draft,
      completion: Math.min(
        100,
        65 + (draft.github ? 10 : 0) + (draft.location ? 5 : 0) + (draft.linkedin ? 10 : 0) + (draft.portfolio ? 10 : 0),
      ),
    };
    persist("profile", next, setProfile);
    setEditing(false);
    notify("Profile updated");
  };
  const updateProfileAvatar = async (file) => {
    try {
      const avatar = await createProfileAvatar(file);
      const next = { ...profile, avatar };
      localStorage.setItem("signal.profile", JSON.stringify(next));
      setProfile(next);
      setDraft(next);
      notify("Profile picture updated");
    } catch (error) {
      notify(error.message || "Could not save this profile picture.");
    }
  };
  const removeProfileAvatar = () => {
    const next = { ...profile };
    delete next.avatar;
    try {
      localStorage.setItem("signal.profile", JSON.stringify(next));
      setProfile(next);
      setDraft(next);
      notify("Profile picture removed");
    } catch {
      notify("Could not update your profile picture.");
    }
  };
  const updateProfileBanner = async (file) => {
    try {
      const banner = await createProfileBanner(file);
      const next = { ...profile, banner };
      localStorage.setItem("signal.profile", JSON.stringify(next));
      setProfile(next);
      setDraft(next);
      notify("Profile banner updated");
    } catch (error) {
      notify(error.message || "Could not save this profile banner.");
    }
  };
  const removeProfileBanner = () => {
    const next = { ...profile };
    delete next.banner;
    try {
      localStorage.setItem("signal.profile", JSON.stringify(next));
      setProfile(next);
      setDraft(next);
      notify("Profile banner removed");
    } catch {
      notify("Could not update your profile banner.");
    }
  };
  const addActivity = (event) => {
    event.preventDefault();
    if (!activityDraft.title.trim()) return;
    const next = [
      {
        ...activityDraft,
        id: `activity-${Date.now()}`,
        skills: activityDraft.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      },
      ...activities,
    ];
    persist("activities", next, setActivities);
    setActivityDraft({
      title: "",
      kind: "Event attended",
      date: "",
      organization: "",
      notes: "",
      skills: "",
    });
    notify("Activity added to your profile");
  };
  const removeImportedOpportunity = (id) => {
    const next = emailOpportunities.filter((item) => item.id !== id);
    persist("emailOpportunities", next, setEmailOpportunities);
    notify("Imported opportunity removed");
  };
  const clearImportedOpportunities = () => {
    if (!window.confirm("Remove all opportunities imported from Gmail?")) return;
    persist("emailOpportunities", [], setEmailOpportunities);
    notify("Imported opportunities cleared");
  };
  const exportSignalData = () => {
    const data = { profile, projects: safeRead("signal.projects", []), education: safeRead("signal.education", []), certifications: safeRead("signal.certifications", []), learningTasks: safeRead("signal.learningTasks", []), missions, saved, activities, emailOpportunities, exportedAt: new Date().toISOString() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "signal-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Your SIGNAL backup is ready");
  };
  const clearSignalData = () => {
    if (!window.confirm("Clear all SIGNAL data saved in this browser? This cannot be undone.")) return;
    Object.keys(localStorage).filter((key) => key.startsWith("signal.")).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };
  const removeActivity = (id) =>
    persist(
      "activities",
      activities.filter((activity) => activity.id !== id),
      setActivities,
    );
  const connectGmail = async () => {
    if (!emailConfig.clientId.trim()) {
      notify("Add your Google OAuth Client ID first");
      return;
    }
    try {
      await loadGoogleIdentity();
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: emailConfig.clientId.trim(),
        scope:
          "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email",
        callback: async (response) => {
          if (response.error) {
            notify("Gmail connection was not completed");
            return;
          }
          setEmailToken(response.access_token);
          try {
            const user = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              { headers: { Authorization: `Bearer ${response.access_token}` } },
            ).then((result) => result.json());
            setEmailConfig((current) => {
              const next = {
                ...current,
                account: user.email || current.account,
              };
              localStorage.setItem("signal.emailConfig", JSON.stringify(next));
              return next;
            });
            notify(`Gmail connected${user.email ? `: ${user.email}` : ""}`);
          } catch {
            notify("Gmail connected");
          }
        },
      });
      client.requestAccessToken({
        prompt: emailConfig.account ? "" : "consent",
      });
    } catch {
      notify(
        "Could not load Google sign-in. Check your connection and try again.",
      );
    }
  };
  const syncGmail = useCallback(async () => {
    if (!emailToken) {
      notify("Reconnect Gmail to sync your inbox");
      return;
    }
    setSyncing(true);
    try {
      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=newer_than:45d&maxResults=40",
        { headers: { Authorization: `Bearer ${emailToken}` } },
      );
      if (!response.ok) throw new Error("Gmail could not be read");
      const data = await response.json();
      const messages = await Promise.all(
        (data.messages || []).slice(0, 30).map(async ({ id }) => {
          const result = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
            { headers: { Authorization: `Bearer ${emailToken}` } },
          );
          if (!result.ok) return null;
          return result.json();
        }),
      );
      const imported = messages
        .map((message) => message && opportunityFromEmail(message))
        .filter(Boolean);
      const next = [
        ...imported,
        ...emailOpportunities.filter(
          (item) => !imported.some((fresh) => fresh.gmailId === item.gmailId),
        ),
      ];
      setEmailOpportunities(next);
      localStorage.setItem("signal.emailOpportunities", JSON.stringify(next));
      const syncedAt = new Date().toISOString();
      setEmailConfig((current) => {
        const updated = { ...current, lastSync: syncedAt };
        localStorage.setItem("signal.emailConfig", JSON.stringify(updated));
        return updated;
      });
      notify(
        `Synced ${imported.length} opportunity ${imported.length === 1 ? "email" : "emails"}`,
      );
    } catch {
      notify("Could not sync Gmail. Reconnect and try again.");
    } finally {
      setSyncing(false);
    }
  }, [emailToken, emailOpportunities, notify]);
  useEffect(() => {
    syncGmailRef.current = syncGmail;
  }, [syncGmail]);
  useEffect(() => {
    if (!emailToken) return undefined;
    syncGmailRef.current?.();
    const interval = window.setInterval(
      () => syncGmailRef.current?.(),
      5 * 60 * 1000,
    );
    return () => window.clearInterval(interval);
  }, [emailToken]);
  const navigation = [
    { label: "Discover", icon: Compass },
    { label: "My Missions", icon: ListTodo, count: missionItems.length },
    { label: "Saved", icon: Bookmark, count: saved.length },
    { label: "Activity", icon: CalendarCheck, count: activities.length },
    { label: "Resume", icon: FileText },
    { label: "Email sync", icon: Mail, count: emailOpportunities.length },
    { label: "Profile", icon: Settings2 },
    { label: "Developer Hub", icon: Code2 },
  ];

  return (
    <div className="app-shell" data-theme={theme}>
      {mobileNav && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <aside
        id="signal-sidebar"
        className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}
      >
        <button
          className="mobile-sidebar-close icon-button"
          aria-label="Close menu"
          onClick={() => setMobileNav(false)}
        >
          <X size={19} />
        </button>
        <a
          className="brand"
          href="#discover"
          onClick={(event) => {
            event.preventDefault();
            setPage("Discover");
          }}
        >
          <span className="brand-mark">
            <Zap size={17} fill="currentColor" />
          </span>
          <span>
            SIGNAL<span className="brand-period">.</span>
          </span>
        </a>
        <div className="workspace-label">
          {theme === "dev" || theme === "lavender"
            ? "DEV WORKSPACE / 01"
            : "YOUR WORKSPACE"}
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              className={`nav-item ${page === label ? "nav-active" : ""}`}
              onClick={() => {
                setPage(label);
                setMobileNav(false);
              }}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {count > 0 && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="signal-card">
            <div className="signal-card-top">
              <span className="pulse-dot" /> SIGNAL BRIEFING
            </div>
            <p>Your next opportunity could be one search away.</p>
            <button
              onClick={() => {
                setPage("Discover");
                setCategory("All opportunities");
              }}
            >
              Explore opportunities <ArrowUpRight size={14} />
            </button>
          </div>
          <button className="user-mini" onClick={() => setPage("Profile")}>
            <span className="avatar"><AvatarVisual profile={profile} /></span>
            <span className="user-mini-copy">
              <b>{profile.name}</b>
              <small>{profile.role}</small>
            </span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            aria-label={mobileNav ? "Close menu" : "Open menu"}
            aria-expanded={mobileNav}
            aria-controls="signal-sidebar"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="crumb-slash">/</span>
            <strong>{page}</strong>
          </div>
          <div className="topbar-right">
            <span className="dev-context-badge">
              <Code2 size={14} />
              <span>DEV WORKSPACE</span>
              <code>v1.0</code>
            </span>
            <span className="live-indicator">
              <span className="pulse-dot" /> Live intelligence
            </span>
            <button
              className="theme-picker-trigger"
              onClick={() => setShowThemePicker(true)}
            >
              <Palette size={15} />
              <span>Themes</span>
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => notify("You’re all caught up")}
            >
              <Bell size={17} />
              <i />
            </button>
            <button className="top-avatar" aria-label="Open profile" onClick={() => setPage("Profile")}><AvatarVisual profile={profile} /></button>
          </div>
        </header>
        <div className="content-wrap">
          {page === "Discover" && (
            <DiscoverPage
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              searchInputRef={searchInputRef}
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
              saved={saved}
              toggleSaved={toggleSaved}
              setActive={setActive}
              missions={missions}
              addMission={addMission}
            />
          )}
          {page === "My Missions" && (
            <MissionsPage
              missions={missionItems}
              updateStatus={updateStatus}
              setActive={setActive}
              setPage={setPage}
            />
          )}
          {page === "Saved" && (
            <SavedPage
              savedItems={allOpportunities.filter((item) =>
                saved.includes(item.id),
              )}
              toggleSaved={toggleSaved}
              setActive={setActive}
              missions={missions}
              addMission={addMission}
            />
          )}
          {page === "Profile" && (
            <ProfilePage
              profile={profile}
              setEditing={() => {
                setDraft(profile);
                setEditing(true);
              }}
              missions={missionItems}
              savedCount={saved.length}
              onAvatarChange={updateProfileAvatar}
              onAvatarRemove={removeProfileAvatar}
              onBannerChange={updateProfileBanner}
              onBannerRemove={removeProfileBanner}
              onExportData={exportSignalData}
              onClearData={clearSignalData}
            />
          )}
                    {page === "Developer Hub" && <DeveloperHub profile={profile} />}
          {page === "Activity" && (
            <ActivityPage
              activities={activities}
              draft={activityDraft}
              setDraft={setActivityDraft}
              onAdd={addActivity}
              onRemove={removeActivity}
            />
          )}
          {page === "Resume" && (
            <ResumePage
              profile={profile}
              activities={activities}
              missions={missionItems}
            />
          )}
          {page === "Email sync" && (
            <EmailPage
              config={emailConfig}
              setConfig={setEmailConfig}
              token={emailToken}
              syncing={syncing}
              opportunityCount={emailOpportunities.length}
              importedItems={emailOpportunities}
              onRemoveImported={removeImportedOpportunity}
              onClearImported={clearImportedOpportunities}
              onConnect={connectGmail}
              onSync={syncGmail}
              onDisconnect={() => {
                setEmailToken("");
                setEmailConfig((current) => {
                  const next = { ...current, account: "" };
                  localStorage.setItem(
                    "signal.emailConfig",
                    JSON.stringify(next),
                  );
                  return next;
                });
                notify("Gmail disconnected from this session");
              }}
            />
          )}
        </div>
        <footer className="footer">
          <span>© 2026 SIGNAL INTELLIGENCE</span>
          <span>
            Find your next move<span className="brand-period">.</span>
          </span>
        </footer>
      </main>

      <AnimatePresence>
        {active && (
          <OpportunityModal
            item={active}
            saved={saved.includes(active.id)}
            inMission={missions.some((mission) => mission.id === active.id)}
            onClose={() => setActive(null)}
            onSave={() => toggleSaved(active.id)}
            onAdd={() => addMission(active)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editing && (
          <ProfileModal
            draft={draft}
            setDraft={setDraft}
            onClose={() => setEditing(false)}
            onSave={saveProfile}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showThemePicker && (
          <ThemePicker
            theme={theme}
            onChoose={(next) => {
              setTheme(next);
              localStorage.setItem("signal.themePreview", JSON.stringify(next));
            }}
            onClose={() => setShowThemePicker(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <CheckCircle2 size={17} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DiscoverPage({
  filtered,
  query,
  setQuery,
  searchInputRef,
  category,
  setCategory,
  sort,
  setSort,
  saved,
  toggleSaved,
  setActive,
  missions,
  addMission,
}) {
  const categories = [
    "All opportunities",
    "Hackathon",
    "Internship",
    "Competition",
    "Design",
    "Fellowship",
    "Opportunity",
  ];
  const featured = opportunities[0];
  const featuredMatches = filtered.some((item) => item.id === featured.id);
  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> OPPORTUNITY INTELLIGENCE{" "}
            <span className="eyebrow-date">· MON, 23 NOV 2026</span>
          </div>
          <h1>
            Find your next <span>move.</span>
          </h1>
          <p className="page-subtitle">
            A clearer signal in a noisy world. Opportunities matched to your
            ambition.
          </p>
        </div>
        <div className="welcome-badge">
          <div className="badge-icon">
            <Sparkles size={17} />
          </div>
          <div>
            <b>Personalized for you</b>
            <span>Based on your interests & profile</span>
          </div>
        </div>
      </section>
      <section className="stats-grid" aria-label="Opportunity overview">
        <StatCard
          icon={Compass}
          label="OPEN OPPORTUNITIES"
          value="24"
          note="Across 6 categories"
          accent="lime"
        />
        <StatCard
          icon={Target}
          label="HIGH FIT FOR YOU"
          value="08"
          note="Above 80% relevance"
          accent="blue"
        />
        <StatCard
          icon={Clock3}
          label="CLOSING SOON"
          value="03"
          note="Next 7 days"
          accent="orange"
        />
        <StatCard
          icon={ListTodo}
          label="ACTIVE MISSIONS"
          value={String(missions.length).padStart(2, "0")}
          note="Keep your momentum"
          accent="violet"
        />
      </section>
      {featuredMatches && <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              <span className="spark-mini">✳</span> SIGNAL PICK
            </span>
            <h2>Worth your attention</h2>
          </div>
          <span className="curated-label">
            <span className="pulse-dot" /> CURATED FOR YOU
          </span>
        </div>
        <article className="featured-card">
          <div className="featured-art">
            <div className="art-grid" />
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-core">
              <Zap size={25} fill="currentColor" />
            </div>
            <span className="art-label">01 / 06</span>
            <span className="art-caption">
              MAKE SOMETHING
              <br />
              THAT MATTERS.
            </span>
            <div
              className="dev-code-window"
              aria-label="Developer opportunity preview"
            >
              <div className="code-window-top">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <code>signal/opportunity.js</code>
                <span className="code-live">
                  <span /> MATCHED
                </span>
              </div>
              <div className="code-window-lines">
                <code>
                  <span className="code-muted">01</span>{" "}
                  <span className="code-purple">const</span>{" "}
                  <span className="code-blue">opportunity</span> = {"{"}
                </code>
                <code>
                  <span className="code-muted">02</span> &nbsp; title:{" "}
                  <span className="code-green">'Build Your Own Website'</span>,
                </code>
                <code>
                  <span className="code-muted">03</span> &nbsp; match:{" "}
                  <span className="code-number">98</span>,
                </code>
                <code>
                  <span className="code-muted">04</span> &nbsp; reward:{" "}
                  <span className="code-green">'₹15,000'</span>
                </code>
                <code>
                  <span className="code-muted">05</span> {"}"}
                </code>
                <div className="code-cursor-line">
                  <span className="code-muted">06</span> <i />
                </div>
              </div>
            </div>
          </div>
          <div className="featured-body">
            <div className="card-meta">
              <span className="type-pill lime-pill">
                <span className="mini-square" /> HACKATHON
              </span>
              <span className="time-left">
                <Clock3 size={13} /> 2 days left
              </span>
            </div>
            <div className="featured-title-row">
              <div>
                <span className="org-name">{featured.org}</span>
                <h3>{featured.title}</h3>
              </div>
              <button
                className={`bookmark-button ${saved.includes(featured.id) ? "is-saved" : ""}`}
                aria-label="Save opportunity"
                onClick={() => toggleSaved(featured.id)}
              >
                <Bookmark
                  size={17}
                  fill={saved.includes(featured.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <p className="featured-description">
              Build a website worth showing off. Ship your idea, share your
              process, and get it in front of a community of builders.
            </p>
            <div className="fit-row">
              <div className="fit-label">
                <Sparkles size={14} />
                <span>
                  <b>98% match</b>
                  <small>Strong fit for your profile</small>
                </span>
              </div>
              <div className="fit-meter">
                <i style={{ width: "98%" }} />
              </div>
            </div>
            <div className="featured-bottom">
              <div className="reward">
                <span className="reward-icon">✳</span>
                <span>
                  <small>REWARD</small>
                  <b>₹15,000 in goodies</b>
                </span>
              </div>
              <button
                className="button-primary"
                onClick={() => setActive(featured)}
              >
                View opportunity <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </article>
      </section>}
      <section className="discover-list">
        <div className="list-heading">
          <div>
            <span className="section-kicker">THE SIGNAL FEED</span>
            <h2>
              Opportunities for you{" "}
              <span className="result-count">{filtered.length}</span>
            </h2>
          </div>
          <label className="sort-select">
            <span>Sort:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Best match</option>
              <option>Deadline soon</option>
            </select>
            <ChevronDown size={13} />
          </label>
        </div>
        <div className="filter-row">
          <div className="category-tabs">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={category === item ? "category-active" : ""}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search-box">
            <Search size={15} />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search opportunities"
            />
            <kbd>Ctrl K</kbd>
          </label>
        </div>
        <div className="opportunity-grid">
          {filtered
            .filter((item) => !item.featured)
            .map((item, index) => (
              <OpportunityCard
                key={item.id}
                item={item}
                index={index}
                saved={saved.includes(item.id)}
                onSave={() => toggleSaved(item.id)}
                onOpen={() => setActive(item)}
                inMission={missions.some((mission) => mission.id === item.id)}
                onAdd={() => addMission(item)}
              />
            ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={23} />
            <h3>No signals found</h3>
            <p>Try another search or category.</p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All opportunities");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function StatCard({ icon: Icon, label, value, note, accent }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${accent}`}>
        <Icon size={16} />
      </div>
      <span className="stat-label">{label}</span>
      <div className="stat-value-row">
        <b>{value}</b>
        <span className="stat-note">{note}</span>
      </div>
      <div className="stat-accent-line" />
    </article>
  );
}

function OpportunityCard({
  item,
  index,
  saved,
  onSave,
  onOpen,
  inMission,
  onAdd,
}) {
  return (
    <motion.article
      className="opportunity-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045 }}
    >
      <div className="opportunity-card-top">
        <span className={`type-pill ${item.color}-pill`}>
          <span className="mini-square" /> {item.type.toUpperCase()}
        </span>
        <button
          className={`bookmark-button small ${saved ? "is-saved" : ""}`}
          aria-label="Save opportunity"
          onClick={onSave}
        >
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <span className="org-name">{item.org}</span>
      <button className="card-title-button" onClick={onOpen}>
        <h3>{item.title}</h3>
      </button>
      <div className="card-location">
        <MapPin size={13} /> {item.location}
        <span>·</span>
        <Globe2 size={13} /> {item.mode}
      </div>
      <div className="card-tags">
        {item.tags.slice(0, 2).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="card-bottom">
        <div className="card-deadline">
          <CalendarDays size={13} />
          <span>
            {item.days <= 7 ? `${item.days} days left` : item.deadline}
          </span>
        </div>
        <span className={`match-score ${item.fit >= 90 ? "match-strong" : ""}`}>
          <Sparkles size={12} /> {item.fit}%
        </span>
      </div>
      <div className="card-actions">
        <button className="button-quiet" onClick={onOpen}>
          Details <ArrowUpRight size={14} />
        </button>
        {inMission ? (
          <span className="added-status">
            <Check size={13} /> In missions
          </span>
        ) : (
          <button className="button-quiet" onClick={onAdd}>
            Track <ArrowDownRight size={14} />
          </button>
        )}
      </div>
    </motion.article>
  );
}

function MissionsPage({ missions, updateStatus, setActive, setPage }) {
  const [filter, setFilter] = useState("All missions");
  const statuses = ["In progress", "Applied", "Completed"];
  const visible =
    filter === "All missions"
      ? missions
      : missions.filter((mission) => mission.status === filter);
  return (
    <>
      <PageIntro
        eyebrow="YOUR MOMENTUM"
        title="My Missions"
        subtitle="Every opportunity you decide to pursue, all in one place."
      />
      <div className="mission-summary">
        <div>
          <span>ACTIVE MISSIONS</span>
          <b>
            {missions
              .filter((item) => item.status !== "Completed")
              .length.toString()
              .padStart(2, "0")}
          </b>
        </div>
        <div>
          <span>APPLICATIONS SENT</span>
          <b>
            {missions
              .filter((item) => item.status === "Applied")
              .length.toString()
              .padStart(2, "0")}
          </b>
        </div>
        <div>
          <span>COMPLETED</span>
          <b>
            {missions
              .filter((item) => item.status === "Completed")
              .length.toString()
              .padStart(2, "0")}
          </b>
        </div>
        <div className="mission-summary-note">
          <Zap size={17} />
          <span>
            Small steps add up.
            <br />
            <b>Keep the momentum going.</b>
          </span>
        </div>
      </div>
          {missions.some((mission) => mission.status !== "Completed" && Number.isFinite(mission.days) && mission.days >= 0 && mission.days <= 7) && (
            <div className="mission-deadline-reminder">
              <CalendarDays size={17} />
              <span><b>Deadlines coming up</b> — {missions.filter((mission) => mission.status !== "Completed" && Number.isFinite(mission.days) && mission.days >= 0 && mission.days <= 7).map((mission) => `${mission.title} (${mission.days}d)`).join(" · ")}</span>
            </div>
          )}
          <div className="mission-list-head">
        <div className="category-tabs">
          {["All missions", ...statuses].map((value) => (
            <button
              key={value}
              className={filter === value ? "category-active" : ""}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <span>
          {visible.length} {visible.length === 1 ? "mission" : "missions"}
        </span>
      </div>
      {visible.length ? (
        <div className="mission-list">
          {visible.map((mission) => (
            <article className="mission-row" key={mission.id}>
              <div className={`mission-symbol ${mission.color}`}>
                <BriefcaseBusiness size={18} />
              </div>
              <div className="mission-info">
                <span className="org-name">{mission.org}</span>
                <button
                  className="mission-title"
                  onClick={() => setActive(mission)}
                >
                  {mission.title}
                </button>
                <span className="mission-date">
                  <CalendarDays size={13} /> Deadline {mission.deadline}{" "}
                  <span>·</span> Added {mission.addedAt}
                </span>
              </div>
              <span
                className={`status-pill ${mission.status.toLowerCase().replaceAll(" ", "-")}`}
              >
                {mission.status}
              </span>
              <select
                className="mission-status-select"
                value={mission.status}
                onChange={(e) => updateStatus(mission.id, e.target.value)}
                aria-label={`Update status for ${mission.title}`}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <button
                className="icon-button mission-open"
                aria-label="Open opportunity"
                onClick={() => setActive(mission)}
              >
                <ArrowUpRight size={17} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ListTodo size={25} />
          <h3>No missions yet</h3>
          <p>
            Save opportunities you want to pursue and track your progress here.
          </p>
          <button onClick={() => setPage("Discover")}>
            Discover opportunities <ArrowRight size={14} />
          </button>
        </div>
      )}
    </>
  );
}

function SavedPage({
  savedItems,
  toggleSaved,
  setActive,
  missions,
  addMission,
}) {
  return (
    <>
      <PageIntro
        eyebrow="YOUR SHORTLIST"
        title="Saved opportunities"
        subtitle="The signals you want to come back to."
      />
      {savedItems.length ? (
        <div className="opportunity-grid saved-grid">
          {savedItems.map((item, index) => (
            <OpportunityCard
              key={item.id}
              item={item}
              index={index}
              saved
              onSave={() => toggleSaved(item.id)}
              onOpen={() => setActive(item)}
              inMission={missions.some((mission) => mission.id === item.id)}
              onAdd={() => addMission(item)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={24} />
          <h3>Your shortlist is clear</h3>
          <p>
            Save opportunities that feel like a good fit and they’ll be waiting
            here.
          </p>
        </div>
      )}
    </>
  );
}

function ProfilePage({ profile, setEditing, missions, savedCount, onAvatarChange, onAvatarRemove, onBannerChange, onBannerRemove, onExportData, onClearData }) {
  return (
    <>
      <PageIntro
        eyebrow="YOUR SIGNAL PROFILE"
        title="A little about you."
        subtitle="A stronger profile helps SIGNAL find the opportunities that fit."
      />
      <div className="profile-layout">
        <section className="profile-card">
          <div
            className={profile.banner ? "profile-cover has-banner" : "profile-cover"}
            style={
              profile.banner
                ? {
                    backgroundImage:
                      "linear-gradient(90deg, rgba(12,10,16,.48), rgba(12,10,16,.12)), url('" +
                      profile.banner +
                      "')",
                  }
                : undefined
            }
          >
            <span className="cover-grid" />
            <span className="cover-orbit" />
            <div className="profile-banner-actions">
              <label className="button-outline banner-upload-button">
                <ImagePlus size={14} />
                {profile.banner ? "Change banner" : "Upload banner"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label="Upload profile banner"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) onBannerChange(file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {profile.banner && (
                <button
                  type="button"
                  className="button-outline banner-remove-button"
                  onClick={onBannerRemove}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="profile-main">
            <div className="profile-avatar-control">
              <div className="profile-avatar"><AvatarVisual profile={profile} /></div>
              <div className="profile-avatar-actions">
                <label className="button-outline avatar-upload-button">
                  <ImagePlus size={14} />
                  {profile.avatar ? "Change photo" : "Upload photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label="Upload profile picture"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) onAvatarChange(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {profile.avatar && (
                  <button
                    type="button"
                    className="button-quiet avatar-remove-button"
                    onClick={onAvatarRemove}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <button
              className="button-outline edit-profile"
              onClick={setEditing}
            >
              Edit profile <Settings2 size={14} />
            </button>
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
            <span className="profile-location">
              <MapPin size={14} /> {profile.location || "Add your location"}
            </span>
            <div className="profile-divider" />
            <div className="profile-section-label">I’M INTERESTED IN</div>
            <div className="interest-chips">
              {profile.interests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
            {profile.github && (
              <a
                className="profile-social"
                href={`https://${profile.github.replace(/^https?:\/\//, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={15} /> {profile.github} <ExternalLink size={12} />
              </a>
            )}
          {profile.linkedin && <a className="profile-social" href={"https://" + profile.linkedin.replace(/^https?:\/\//, "")} target="_blank" rel="noreferrer"><BriefcaseBusiness size={15} /> {profile.linkedin} <ExternalLink size={12} /></a>}
{profile.portfolio && <a className="profile-social" href={"https://" + profile.portfolio.replace(/^https?:\/\//, "")} target="_blank" rel="noreferrer"><Globe2 size={15} /> {profile.portfolio} <ExternalLink size={12} /></a>}
          </div>
        </section>
        <div className="profile-side">
          <section className="completion-card">
            <div className="completion-heading">
              <div>
                <span className="section-kicker">PROFILE STRENGTH</span>
                <h3>You’re off to a good start.</h3>
              </div>
              <span className="completion-number">{profile.completion}%</span>
            </div>
            <div className="completion-bar">
              <span style={{ width: `${profile.completion}%` }} />
            </div>
            <p>
              Complete your profile so we can send more relevant opportunities
              your way.
            </p>
            <button className="button-quiet" onClick={setEditing}>
              Improve your profile <ArrowRight size={14} />
            </button>
          </section>
          <section className="profile-activity">
            <span className="section-kicker">YOUR SIGNAL ACTIVITY</span>
            <div className="activity-line">
              <span className="activity-icon lime">
                <Compass size={15} />
              </span>
              <div>
                <b>{missions.length} missions tracked</b>
                <span>Your next move is taking shape.</span>
              </div>
            </div>
            <div className="activity-line">
              <span className="activity-icon blue">
                <Bookmark size={15} />
              </span>
              <div>
                <b>{savedCount} opportunities saved</b>
                <span>Your personal shortlist is growing.</span>
              </div>
            </div>
            <div className="activity-line">
              <span className="activity-icon violet">
                <Sparkles size={15} />
              </span>
              <div>
                <b>Discovery is personalized</b>
                <span>Matches update as your profile evolves.</span>
              </div>
            </div>
          </section>
          <section className="profile-data-card">
            <span className="section-kicker">YOUR DATA</span>
            <h3>Your SIGNAL data, yours.</h3>
            <p>Download a local backup or clear saved SIGNAL data from this browser.</p>
            <div className="profile-data-actions">
              <button className="button-outline" onClick={onExportData}><Download size={14} /> Export backup</button>
              <button className="button-quiet" onClick={onClearData}>Clear local data</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function PageIntro({ eyebrow, title, subtitle }) {
  return (
    <section className="page-intro">
      <div className="eyebrow">
        <span className="eyebrow-line" /> {eyebrow}
      </div>
      <h1>{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </section>
  );
}

function ActivityPage({ activities, draft, setDraft, onAdd, onRemove }) {
  const update = (field, value) => setDraft({ ...draft, [field]: value });
  return (
    <>
      <PageIntro
        eyebrow="YOUR JOURNEY, IN ONE PLACE"
        title="The things you’ve done."
        subtitle="Save conferences, DevFests, courses, projects, and milestones. Your experience should travel with you."
      />
      <div className="activity-layout">
        <form className="activity-form-panel" onSubmit={onAdd}>
          <div className="section-kicker">ADD TO YOUR STORY</div>
          <h2>Log an activity</h2>
          <p>Every experience makes your next opportunity more personal.</p>
          <label className="form-field">
            Activity name
            <input
              required
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Google DevFest"
            />
          </label>
          <div className="form-row">
            <label className="form-field">
              Type
              <select
                value={draft.kind}
                onChange={(event) => update("kind", event.target.value)}
              >
                <option>Event attended</option>
                <option>Course completed</option>
                <option>Project shipped</option>
                <option>Award received</option>
                <option>Volunteer work</option>
                <option>Open-source contribution</option>
                <option>Certificate earned</option>
                <option>Internship experience</option>
                <option>Research published</option>
                <option>Other milestone</option>
              </select>
            </label>
            <label className="form-field">
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(event) => update("date", event.target.value)}
              />
            </label>
          </div>
          <label className="form-field">
            Organization
            <input
              value={draft.organization}
              onChange={(event) => update("organization", event.target.value)}
              placeholder="Organizer or company"
            />
          </label>
          <label className="form-field">
            What did you learn or do?
            <textarea
              rows="3"
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="A few details you’d like to remember…"
            />
          </label>
          <label className="form-field">
            Skills or topics <span>Separate with commas</span>
            <input
              value={draft.skills}
              onChange={(event) => update("skills", event.target.value)}
              placeholder="AI, networking, React"
            />
          </label>
          <button className="button-primary activity-submit" type="submit">
            <Plus size={15} /> Add to my journey
          </button>
        </form>
        <section className="activity-timeline-panel">
          <div className="activity-section-heading">
            <div>
              <span className="section-kicker">YOUR ACTIVITY LOG</span>
              <h2>Experience, captured.</h2>
            </div>
            <span className="result-count">{activities.length}</span>
          </div>
          {activities.length ? (
            <div className="activity-timeline">
              {activities.map((activity, index) => (
                <article className="timeline-entry" key={activity.id}>
                  <span className="timeline-marker">
                    {activity.kind === "Event attended" ? (
                      <CalendarCheck size={15} />
                    ) : activity.kind === "Project shipped" ? (
                      <Zap size={15} />
                    ) : (
                      <CheckCircle2 size={15} />
                    )}
                  </span>
                  <div className="timeline-copy">
                    <div className="timeline-meta">
                      <span>{activity.kind.toUpperCase()}</span>
                      <time>
                        {activity.date
                          ? new Date(
                              `${activity.date}T12:00:00`,
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "DATE NOT ADDED"}
                      </time>
                    </div>
                    <h3>{activity.title}</h3>
                    {activity.organization && (
                      <span className="timeline-org">
                        {activity.organization}
                      </span>
                    )}
                    {activity.notes && <p>{activity.notes}</p>}
                    {activity.skills?.length > 0 && (
                      <div className="interest-chips">
                        {activity.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="activity-delete icon-button"
                    onClick={() => onRemove(activity.id)}
                    aria-label={`Remove ${activity.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                  {index < activities.length - 1 && (
                    <span className="timeline-stem" />
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <CalendarCheck size={23} />
              <h3>Your story starts here</h3>
              <p>
                Log an event, project, or milestone to begin building your
                experience.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function ResumePage({ profile, activities, missions }) {
  const projects = useMemo(() => safeRead("signal.projects", []), []);
  const education = useMemo(() => safeRead("signal.education", []), []);
  const certifications = useMemo(() => safeRead("signal.certifications", []), []);
  const completedMissions = missions.filter(
    (mission) => mission.status === "Completed" || mission.status === "Applied",
  );
  const skills = [
    ...new Set([
      ...profile.interests,
      ...activities.flatMap((activity) => activity.skills || []),
    ]),
  ];
  return (
    <>
      <div className="resume-page-head">
        <div>
          <PageIntro
            eyebrow="BUILT FROM YOUR SIGNAL PROFILE"
            title="Your resume, in motion."
            subtitle="As you log experience and make progress, your resume gets richer. Preview it anytime or print to PDF."
          />
        </div>
        <button
          className="button-primary resume-download"
          onClick={() => window.print()}
        >
          <Download size={15} /> Export / print PDF
        </button>
      </div>
      <div className="resume-paper">
        <div className="resume-document">
          <header className="resume-header">
            <div>
              <h2>{profile.name || "Your name"}</h2>
              <p>
                {[profile.role, profile.location, profile.email, profile.phone].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="resume-contact">
              {[profile.email, profile.phone, profile.github, profile.linkedin, profile.portfolio].filter(Boolean).map((link) => <span key={link}>{link}</span>)}
              <span>Built with SIGNAL</span>
            </div>
          </header>
          <section className="resume-section">
            <h3>PROFILE</h3>
            <p>
              {profile.role
                ? `${profile.name} is a ${profile.role.toLowerCase()}`
                : profile.name}{" "}
              with a growing track record in{" "}
              {skills.slice(0, 3).join(", ") ||
                "technology and product building"}
              . Curious, hands-on, and always learning through real-world
              experiences.
            </p>
          </section>
          <section className="resume-section">
            <h3>EXPERIENCE & MILESTONES</h3>
            {activities.length || completedMissions.length ? (
              <div className="resume-experience">
                {activities.map((activity) => (
                  <article key={activity.id}>
                    <div>
                      <b>{activity.title}</b>
                      <span>
                        {activity.organization || activity.kind}
                        {activity.date
                          ? ` · ${new Date(`${activity.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
                          : ""}
                      </span>
                    </div>
                    {activity.notes && <p>{activity.notes}</p>}
                    {activity.skills?.length > 0 && (
                      <small>{activity.skills.join(" · ")}</small>
                    )}
                  </article>
                ))}
                {completedMissions.map((mission) => (
                  <article key={mission.id}>
                    <div>
                      <b>{mission.title}</b>
                      <span>
                        {mission.org} · {mission.status}
                      </span>
                    </div>
                    <p>
                      Tracked through SIGNAL and moved forward as part of a
                      focused opportunity journey.
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="resume-empty">
                Add events, projects, or milestones in Activity to start
                building this section.
              </p>
            )}
          </section>
          <section className="resume-section">
            <h3>SKILLS & INTERESTS</h3>
            <div className="resume-skills">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>
          {projects.length > 0 && <section className="resume-section"><h3>PROJECTS</h3><div className="resume-experience">{projects.map((project) => <article key={project.id}><div><b>{project.title}</b><span>{project.tech?.join(" · ")}</span></div>{project.description && <p>{project.description}</p>}<small>{[project.github, project.live].filter(Boolean).join(" · ")}</small></article>)}</div></section>}
          {education.length > 0 && <section className="resume-section"><h3>EDUCATION</h3><div className="resume-experience">{education.map((item) => <article key={item.id}><div><b>{item.qualification}</b><span>{[item.institution, [item.start, item.end].filter(Boolean).join("–")].filter(Boolean).join(" · ")}</span></div>{item.details && <p>{item.details}</p>}</article>)}</div></section>}
          {certifications.length > 0 && <section className="resume-section"><h3>CERTIFICATIONS</h3><div className="resume-experience">{certifications.map((item) => <article key={item.id}><div><b>{item.name}</b><span>{[item.issuer, item.date].filter(Boolean).join(" · ")}</span></div>{item.credential && <p>{item.credential}</p>}</article>)}</div></section>}          <footer className="resume-footer">
            Updated from SIGNAL · {activities.length} activities ·{" "}
            {completedMissions.length} opportunities progressed
          </footer>
        </div>
      </div>
    </>
  );
}

function EmailPage({
  config,
  setConfig,
  token,
  syncing,
  opportunityCount,
  importedItems,
  onRemoveImported,
  onClearImported,
  onConnect,
  onSync,
  onDisconnect,
}) {
  const [showSetup, setShowSetup] = useState(!config.clientId);
  const updateClient = (clientId) => {
    const next = { ...config, clientId };
    setConfig(next);
    localStorage.setItem("signal.emailConfig", JSON.stringify(next));
  };
  const lastSynced = config.lastSync
    ? new Date(config.lastSync).toLocaleString()
    : "Not synced yet";
  return (
    <>
      <PageIntro
        eyebrow="INBOX TO INSIGHT"
        title="Let the signals find you."
        subtitle="Connect Gmail and SIGNAL will spot opportunity emails, pull their details, and keep them beside your other discoveries."
      />
      <div className="email-layout">
        <section className="email-connect-card">
          <div className="email-card-head">
            <span className="email-icon">
              <Mail size={20} />
            </span>
            <span className={`email-state ${token ? "email-state-on" : ""}`}>
              <span className="pulse-dot" />{" "}
              {token
                ? "CONNECTED THIS SESSION"
                : config.account
                  ? "RECONNECT TO SYNC"
                  : "NOT CONNECTED"}
            </span>
          </div>
          <h2>{config.account || "Connect your Gmail"}</h2>
          <p className="email-description">
            SIGNAL reads recent inbox messages using Gmail’s read-only
            permission. Opportunity matches are saved in this browser and can be
            reviewed or removed anytime.
          </p>
          <div className="email-metrics">
            <div>
              <span>IMPORTED SIGNALS</span>
              <b>{opportunityCount.toString().padStart(2, "0")}</b>
            </div>
            <div>
              <span>LAST SYNC</span>
              <b>{lastSynced}</b>
            </div>
          </div>
          <div className="email-actions">
            {token ? (
              <button
                className="button-primary"
                onClick={onSync}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <RefreshCw size={15} className="spin" /> Syncing inbox…
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} /> Sync now
                  </>
                )}
              </button>
            ) : (
              <button className="button-primary" onClick={onConnect}>
                <Mail size={15} />{" "}
                {config.account ? "Reconnect Gmail" : "Connect Gmail"}
              </button>
            )}
            {config.account && (
              <button className="button-outline" onClick={onDisconnect}>
                Disconnect session
              </button>
            )}
          </div>
          <div className="privacy-note">
            <CheckCircle2 size={15} />
            <span>
              Read-only access. SIGNAL never sends or deletes emails. Your
              access token stays in memory and is cleared when you close the
              tab.
            </span>
          </div>
        </section>
        <section className="email-setup-card">
          <button
            className="setup-toggle"
            onClick={() => setShowSetup(!showSetup)}
          >
            <span>
              <span className="section-kicker">ONE-TIME SETUP</span>
              <b>Set up a Google OAuth Client ID</b>
            </span>
            <ChevronDown size={17} className={showSetup ? "rotated" : ""} />
          </button>
          {showSetup && (
            <div className="setup-content">
              <p>
                Create a Web application OAuth client in Google Cloud Console,
                enable the Gmail API, and add this app’s URL as an authorized
                JavaScript origin.
              </p>
              <ol>
                <li>Open Google Cloud Console → APIs & Services.</li>
                <li>
                  Enable the <b>Gmail API</b> and configure the OAuth consent
                  screen.
                </li>
                <li>
                  Create an OAuth Client ID → <b>Web application</b>.
                </li>
                <li>
                  Add your local app URL (for example{" "}
                  <code>http://localhost:5173</code>) under Authorized
                  JavaScript origins.
                </li>
              </ol>
              <label className="form-field">
                Google OAuth Client ID
                <input
                  value={config.clientId}
                  onChange={(event) => updateClient(event.target.value)}
                  placeholder="1234567890-abc…apps.googleusercontent.com"
                />
              </label>
              <span className="client-id-help">
                This public client ID is stored in this browser only. Never
                paste a client secret here.
              </span>
              {config.clientId && (
                <span className="client-ready">
                  <CheckCircle2 size={14} /> Client ID saved. You can connect
                  Gmail now.
                </span>
              )}
            </div>
          )}
        </section>
      </div>
      <section className="email-imported-card">
        <div className="activity-section-heading">
          <div><span className="section-kicker">INBOX REVIEW</span><h2>Imported opportunities</h2></div>
          {importedItems.length > 0 && <button className="button-quiet" onClick={onClearImported}>Clear all</button>}
        </div>
        {importedItems.length ? (
          <div className="email-imported-list">
            {importedItems.map((item) => (
              <article className="email-imported-row" key={item.id}>
                <div><b>{item.title}</b><span>{item.org} · {item.emailDate ? new Date(item.emailDate).toLocaleDateString() : "Imported from Gmail"}</span><p>{item.description}</p></div>
                <div className="email-imported-actions"><button className="button-quiet" onClick={() => onRemoveImported(item.id)}>Remove</button><a className="button-quiet" href={item.link} target="_blank" rel="noreferrer">Open <ExternalLink size={13} /></a></div>
              </article>
            ))}
          </div>
        ) : <p className="email-empty">No imported opportunities yet. Connect Gmail and sync to review matching emails here.</p>}
      </section>
      <div className="email-limit-note">
        <Link2 size={15} />
        <p>
          <b>About automatic updates</b>
          <br />
          Gmail sync runs when you ask SIGNAL to sync while this app is open. To
          refresh automatically in the background or while the app is closed,
          SIGNAL will need a secure backend and Google OAuth verification.
        </p>
      </div>
    </>
  );
}

const themeOptions = [
  {
    id: "lavender",
    name: "Lavender Workspace",
    description: "Soft white · creative violet",
    colors: ["#f1f0f8", "#ffffff", "#7464e8"],
  },
  {
    id: "dev",
    name: "Black + Lavender",
    description: "Developer workspace · violet glow",
    colors: ["#0b0a10", "#191622", "#b79aff"],
  },
  {
    id: "aurora",
    name: "Aurora Blue",
    description: "Deep navy · electric blue",
    colors: ["#0a0d16", "#171e2b", "#83b9ff"],
  },
  {
    id: "violet",
    name: "Violet Pulse",
    description: "Ink black · soft violet",
    colors: ["#0f0c16", "#211a2b", "#c1a3ff"],
  },
  {
    id: "copper",
    name: "Warm Copper",
    description: "Dark espresso · amber glow",
    colors: ["#120e0b", "#282019", "#ffc17a"],
  },
];

function ThemePicker({ theme, onChoose, onClose }) {
  return (
    <motion.div
      className="modal-backdrop theme-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="theme-modal"
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="theme-modal-head">
          <div>
            <span className="section-kicker">PICK YOUR SIGNAL</span>
            <h2>Choose a direction.</h2>
            <p>
              Preview each palette on the dashboard. We’ll polish your favorite.
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="Close theme options"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="theme-option-grid">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              className={`theme-option ${theme === option.id ? "theme-option-active" : ""}`}
              onClick={() => onChoose(option.id)}
            >
              <span className={`theme-swatch theme-swatch-${option.id}`}>
                <i />
                <i />
                <i />
              </span>
              <span className="theme-option-copy">
                <b>{option.name}</b>
                <small>{option.description}</small>
              </span>
              <span className="theme-choice-mark">
                {theme === option.id && <Check size={14} />}
              </span>
            </button>
          ))}
        </div>
        <div className="theme-modal-foot">
          <span>
            Current preview:{" "}
            <b>{themeOptions.find((option) => option.id === theme)?.name}</b>
          </span>
          <button className="button-primary" onClick={onClose}>
            Keep previewing <ArrowRight size={14} />
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function OpportunityModal({ item, saved, inMission, onClose, onSave, onAdd }) {
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="opportunity-modal"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close icon-button"
          aria-label="Close details"
          onClick={onClose}
        >
          <X size={19} />
        </button>
        <div className={`modal-art ${item.color}`}>
          <div className="modal-art-orbit" />
          <span className="modal-art-icon">
            <Zap size={23} fill="currentColor" />
          </span>
          <span className="modal-art-tag">
            {item.type.toUpperCase()} <span>·</span> {item.mode.toUpperCase()}
          </span>
        </div>
        <div className="modal-content">
          <div className="eyebrow">
            <span className="eyebrow-line" /> OPPORTUNITY BRIEF
          </div>
          <span className="org-name">{item.org}</span>
          <h2>{item.title}</h2>
          <p className="modal-description">{item.description}</p>
          <div className="modal-facts">
            <div>
              <CalendarDays size={15} />
              <span>
                <small>DEADLINE</small>
                <b>{item.deadline}</b>
              </span>
            </div>
            <div>
              <MapPin size={15} />
              <span>
                <small>LOCATION</small>
                <b>{item.location}</b>
              </span>
            </div>
            <div>
              <Sparkles size={15} />
              <span>
                <small>YOUR MATCH</small>
                <b>{item.fit}% relevance</b>
              </span>
            </div>
            <div>
              <GraduationCap size={15} />
              <span>
                <small>REWARD</small>
                <b>{item.reward}</b>
              </span>
            </div>
          </div>
          <div className="modal-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="modal-steps">
            <h3>How to make your move</h3>
            {item.steps.map((step, index) => (
              <div className="modal-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button
              className="button-primary"
              onClick={inMission ? onClose : onAdd}
            >
              {inMission ? (
                <>
                  <Check size={15} /> In your missions
                </>
              ) : (
                <>
                  Add to My Missions <ArrowRight size={15} />
                </>
              )}
            </button>
            <button
              className={`button-outline ${saved ? "is-saved" : ""}`}
              onClick={onSave}
            >
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />{" "}
              {saved ? "Saved" : "Save"}
            </button>
            <a
              className="external-link"
              href={item.link}
              target="_blank"
              rel="noreferrer"
            >
              Open listing <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function ProfileModal({ draft, setDraft, onClose, onSave }) {
  const setField = (field, value) => setDraft({ ...draft, [field]: value });
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="edit-modal"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edit-modal-heading">
          <div>
            <span className="section-kicker">YOUR PROFILE</span>
            <h2>Edit your details</h2>
          </div>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <label className="form-field">
          Full name
          <input
            value={draft.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </label>
        <label className="form-field">
          What do you do?
          <input
            value={draft.role}
            onChange={(e) => setField("role", e.target.value)}
          />
        </label>
        <label className="form-field">
          Location
          <input
            value={draft.location}
            onChange={(e) => setField("location", e.target.value)}
          />
        </label>
        <label className="form-field">
          Email
          <input type="email" value={draft.email || ""} onChange={(e) => setField("email", e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="form-field">
          Phone
          <input type="tel" value={draft.phone || ""} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 …" />
        </label>
        <label className="form-field">          GitHub profile
          <input
            value={draft.github}
            onChange={(e) => setField("github", e.target.value)}
            placeholder="github.com/you"
          />
        </label>
        <label className="form-field">
          LinkedIn profile
          <input value={draft.linkedin || ""} onChange={(e) => setField("linkedin", e.target.value)} placeholder="linkedin.com/in/you" />
        </label>
        <label className="form-field">
          Portfolio / personal site
          <input value={draft.portfolio || ""} onChange={(e) => setField("portfolio", e.target.value)} placeholder="yourportfolio.dev" />
        </label>
        <label className="form-field">
          Interests <span>Separate with commas</span>
          <input
            value={draft.interests.join(", ")}
            onChange={(e) =>
              setField(
                "interests",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <div className="edit-modal-actions">
          <button className="button-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={onSave}>
            <Check size={15} /> Save profile
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default App;
