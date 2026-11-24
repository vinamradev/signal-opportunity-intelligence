import { useState } from "react";
import { ArrowUpRight, Award, BookOpen, CalendarDays, Check, Code2, ExternalLink, GraduationCap, Plus, Trash2, WandSparkles } from "lucide-react";
import "./DeveloperHub.css";

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(`signal.${key}`) || "[]"); }
  catch { return []; }
};
const save = (key, value) => localStorage.setItem(`signal.${key}`, JSON.stringify(value));
const today = () => new Date().toISOString().slice(0, 10);
const afterDays = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const newId = () => `dev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function starterSteps(goal, weeks) {
  const value = goal.toLowerCase();
  let topics;
  if (/python/.test(value)) topics = ["Set up Python, VS Code, and Git; write your first scripts", "Learn variables, conditions, loops, functions, and core data structures", "Practice files, packages, APIs, and error handling with small exercises", "Build a useful command-line or web project from start to finish", "Add tests, improve the README, publish it, and review what you learned"];
  else if (/react/.test(value)) topics = ["Refresh modern JavaScript, modules, and async code", "Build reusable components and learn props, state, and hooks", "Create forms and multi-page flows; practice state management", "Connect an API and add loading, error, and empty states", "Polish, test, deploy, and document a complete React project"];
  else if (/javascript| js\b/.test(value)) topics = ["Review the browser, console, editor, and Git workflow", "Practice values, functions, conditions, loops, and arrays", "Learn objects, modules, DOM events, and form handling", "Use promises, fetch, async/await, and handle failures", "Build, test, deploy, and document a small JavaScript app"];
  else if (/dsa|data structures|algorithms/.test(value)) topics = ["Learn Big O and practice arrays and strings", "Solve hash map, stack, queue, and linked-list problems", "Practice recursion, binary search, and tree traversals", "Study graphs, sorting, and common greedy patterns", "Practice dynamic programming and review a set of timed problems"];
  else topics = ["Define the fundamentals and set up your learning environment", `Study the core concepts of ${goal} and take concise notes`, `Complete guided exercises and explain the concepts in your own words`, `Build a small project that uses ${goal} in a practical way`, "Review gaps, polish the project, and share what you built"];
  return topics.map((title, index) => ({ id: newId(), title, dueDate: afterDays(Math.ceil(((index + 1) / topics.length) * weeks * 7)), done: false }));
}

function ProjectSection({ items, onAdd, onRemove }) {
  const [draft, setDraft] = useState({ title: "", description: "", github: "", live: "", tech: "" });
  const submit = (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onAdd({ ...draft, id: newId(), tech: draft.tech.split(",").map((x) => x.trim()).filter(Boolean) });
    setDraft({ title: "", description: "", github: "", live: "", tech: "" });
  };
  return <section className="devhub-panel"><div className="devhub-heading"><div><span className="section-kicker">BUILD LOG</span><h2>Projects</h2><p>Keep the work you’ve built, the stack behind it, and links to the live result.</p></div><Code2 /></div>
    <form className="devhub-form" onSubmit={submit}>
      <label className="form-field">Project name<input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Campus event finder" /></label>
      <label className="form-field">What does it do?<textarea rows="2" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Problem solved, your contribution, and outcome" /></label>
      <div className="devhub-form-row"><label className="form-field">GitHub link<input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} placeholder="github.com/you/project" /></label><label className="form-field">Live link<input value={draft.live} onChange={(e) => setDraft({ ...draft, live: e.target.value })} placeholder="project.dev" /></label></div>
      <label className="form-field">Tech stack <span>Separate with commas</span><input value={draft.tech} onChange={(e) => setDraft({ ...draft, tech: e.target.value })} placeholder="React, Vite, Firebase" /></label>
      <button className="button-primary" type="submit"><Plus size={15} /> Add project</button>
    </form>
    <div className="devhub-record-list">{items.length ? items.map((item) => <article className="devhub-record" key={item.id}><div className="devhub-record-title"><div><h3>{item.title}</h3><p>{item.description || "Project description not added yet."}</p></div><button className="icon-button" aria-label={`Remove ${item.title}`} onClick={() => onRemove(item.id)}><Trash2 size={15} /></button></div><div className="devhub-tags">{item.tech?.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="devhub-links">{item.github && <a href={item.github.startsWith("http") ? item.github : `https://${item.github}`} target="_blank" rel="noreferrer"><Code2 size={13} /> Code <ExternalLink size={12} /></a>}{item.live && <a href={item.live.startsWith("http") ? item.live : `https://${item.live}`} target="_blank" rel="noreferrer"><ArrowUpRight size={13} /> Live project <ExternalLink size={12} /></a>}</div></article>) : <p className="devhub-empty">No projects yet. Add your first build above.</p>}</div>
  </section>;
}

function EducationSection({ items, onAdd, onRemove }) {
  const [draft, setDraft] = useState({ qualification: "", institution: "", start: "", end: "", details: "" });
  const submit = (event) => { event.preventDefault(); if (!draft.qualification.trim()) return; onAdd({ ...draft, id: newId() }); setDraft({ qualification: "", institution: "", start: "", end: "", details: "" }); };
  return <section className="devhub-panel"><div className="devhub-heading"><div><span className="section-kicker">ACADEMIC RECORD</span><h2>Education</h2><p>Add degrees, programs, and relevant coursework.</p></div><GraduationCap /></div>
    <form className="devhub-form" onSubmit={submit}><label className="form-field">Degree or program<input required value={draft.qualification} onChange={(e) => setDraft({ ...draft, qualification: e.target.value })} placeholder="B.Tech in Computer Science" /></label><label className="form-field">School / institution<input value={draft.institution} onChange={(e) => setDraft({ ...draft, institution: e.target.value })} placeholder="College or university" /></label><div className="devhub-form-row"><label className="form-field">From<input value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} placeholder="2023" /></label><label className="form-field">To<input value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} placeholder="2027 or Present" /></label></div><label className="form-field">Details<input value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} placeholder="Relevant subjects, honors, or GPA" /></label><button className="button-primary" type="submit"><Plus size={15} /> Add education</button></form>
    <div className="devhub-record-list">{items.length ? items.map((item) => <article className="devhub-record compact" key={item.id}><div className="devhub-record-title"><div><h3>{item.qualification}</h3><p>{item.institution}{item.start || item.end ? ` · ${item.start}${item.start && item.end ? "–" : ""}${item.end}` : ""}</p>{item.details && <small>{item.details}</small>}</div><button className="icon-button" aria-label={`Remove ${item.qualification}`} onClick={() => onRemove(item.id)}><Trash2 size={15} /></button></div></article>) : <p className="devhub-empty">Education you add will appear here and on your resume.</p>}</div>
  </section>;
}

function CertificationSection({ items, onAdd, onRemove }) {
  const [draft, setDraft] = useState({ name: "", issuer: "", date: "", credential: "" });
  const submit = (event) => { event.preventDefault(); if (!draft.name.trim()) return; onAdd({ ...draft, id: newId() }); setDraft({ name: "", issuer: "", date: "", credential: "" }); };
  return <section className="devhub-panel"><div className="devhub-heading"><div><span className="section-kicker">VERIFIED LEARNING</span><h2>Certifications</h2><p>Record certificates, who issued them, and a verification link.</p></div><Award /></div>
    <form className="devhub-form"><label className="form-field">Certificate name<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Google Cloud Digital Leader" /></label><label className="form-field">Issuing organization<input value={draft.issuer} onChange={(e) => setDraft({ ...draft, issuer: e.target.value })} placeholder="Issuer" /></label><div className="devhub-form-row"><label className="form-field">Date earned<input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label><label className="form-field">Credential URL<input value={draft.credential} onChange={(e) => setDraft({ ...draft, credential: e.target.value })} placeholder="Credential verification link" /></label></div><button className="button-primary" type="button" onClick={submit}><Plus size={15} /> Add certification</button></form>
    <div className="devhub-record-list">{items.length ? items.map((item) => <article className="devhub-record compact" key={item.id}><div className="devhub-record-title"><div><h3>{item.name}</h3><p>{[item.issuer, item.date].filter(Boolean).join(" · ")}</p>{item.credential && <a className="devhub-inline-link" href={item.credential.startsWith("http") ? item.credential : `https://${item.credential}`} target="_blank" rel="noreferrer">Verify credential <ExternalLink size={12} /></a>}</div><button className="icon-button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}><Trash2 size={15} /></button></div></article>) : <p className="devhub-empty">Add a certificate to include it on your resume.</p>}</div>
  </section>;
}

function LearningLab({ items, onAdd, onUpdate, onRemove }) {
  const [goal, setGoal] = useState("");
  const [weeks, setWeeks] = useState(6);
  const create = (event) => { event.preventDefault(); if (!goal.trim()) return; onAdd({ id: newId(), title: goal.trim(), createdAt: today(), weeks: Number(weeks), steps: starterSteps(goal.trim(), Number(weeks)) }); setGoal(""); };
  const patchTask = (taskId, patch) => onUpdate(items.map((task) => task.id === taskId ? { ...task, ...patch } : task));
  const patchStep = (task, stepId, patch) => patchTask(task.id, { steps: task.steps.map((step) => step.id === stepId ? { ...step, ...patch } : step) });
  const addStep = (task) => patchTask(task.id, { steps: [...task.steps, { id: newId(), title: "New learning step", dueDate: afterDays(7), done: false }] });
  const deleteStep = (task, stepId) => patchTask(task.id, { steps: task.steps.filter((step) => step.id !== stepId) });
  return <section className="devhub-panel learning-panel"><div className="devhub-heading"><div><span className="section-kicker">PLAN · PRACTICE · SHIP</span><h2>Learning plans</h2><p>Turn a skill into a dated plan. Generated milestones are editable and saved in this browser.</p></div><WandSparkles /></div>
    <form className="learning-create" onSubmit={create}><label className="form-field">What do you want to learn?<input required value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Learn Python" /></label><label className="form-field learning-duration">Timeline<select value={weeks} onChange={(e) => setWeeks(e.target.value)}><option value="4">4 weeks</option><option value="6">6 weeks</option><option value="8">8 weeks</option><option value="12">12 weeks</option></select></label><button className="button-primary" type="submit"><WandSparkles size={15} /> Generate starter plan</button></form>
    <p className="learning-note">Plans are generated from built-in skill roadmaps right now; connect an AI service later for personalized generation.</p>
    {items.length ? <div className="learning-list">{items.map((task) => { const completed = task.steps.filter((step) => step.done).length; return <article className="learning-task" key={task.id}><div className="learning-task-head"><div><span className="section-kicker">{completed}/{task.steps.length} MILESTONES DONE · {task.weeks} WEEKS</span><input className="learning-title-input" aria-label="Learning goal" value={task.title} onChange={(e) => patchTask(task.id, { title: e.target.value })} /></div><button className="icon-button" aria-label={`Delete ${task.title}`} onClick={() => onRemove(task.id)}><Trash2 size={15} /></button></div><div className="learning-progress"><span style={{ width: `${task.steps.length ? completed / task.steps.length * 100 : 0}%` }} /></div><div className="learning-steps">{task.steps.map((step, index) => <div className={`learning-step ${step.done ? "is-done" : ""}`} key={step.id}><button className="learning-check" aria-label={step.done ? "Mark incomplete" : "Mark complete"} onClick={() => patchStep(task, step.id, { done: !step.done })}>{step.done ? <Check size={14} /> : <span>{String(index + 1).padStart(2, "0")}</span>}</button><input className="learning-step-title" aria-label="Edit learning step" value={step.title} onChange={(e) => patchStep(task, step.id, { title: e.target.value })} /><label className="learning-date"><CalendarDays size={13} /><input type="date" value={step.dueDate} onChange={(e) => patchStep(task, step.id, { dueDate: e.target.value })} /></label><button className="icon-button learning-step-delete" aria-label="Delete step" onClick={() => deleteStep(task, step.id)}><Trash2 size={13} /></button></div>)}</div><button className="button-quiet learning-add-step" onClick={() => addStep(task)}><Plus size={14} /> Add a step</button></article>; })}</div> : <div className="devhub-empty"><BookOpen size={20} /><p>No learning plans yet. Add a goal above to create your first roadmap.</p></div>}
  </section>;
}

export default function DeveloperHub({ profile }) {
  const [projects, setProjects] = useState(() => read("projects"));
  const [education, setEducation] = useState(() => read("education"));
  const [certifications, setCertifications] = useState(() => read("certifications"));
  const [learningTasks, setLearningTasks] = useState(() => read("learningTasks"));
  const update = (key, set, value) => { save(key, value); set(value); };
  const add = (key, set, value) => update(key, set, [value, ...read(key)]);
  const remove = (key, set, id) => update(key, set, read(key).filter((item) => item.id !== id));
  return <><div className="devhub-intro"><span className="eyebrow"><span className="eyebrow-line" /> DEVELOPER WORKSPACE</span><h1>Your work, <span>your next step.</span></h1><p className="page-subtitle">A living record of what you’ve learned, built, and want to learn next.</p><div className="devhub-profile-chip"><span>{profile.name || "Developer"}</span><span>{profile.role || "Add your role in Profile"}</span></div></div>
    <div className="devhub-grid"><ProjectSection items={projects} onAdd={(item) => add("projects", setProjects, item)} onRemove={(id) => remove("projects", setProjects, id)} /><div className="devhub-stack"><EducationSection items={education} onAdd={(item) => add("education", setEducation, item)} onRemove={(id) => remove("education", setEducation, id)} /><CertificationSection items={certifications} onAdd={(item) => add("certifications", setCertifications, item)} onRemove={(id) => remove("certifications", setCertifications, id)} /></div><LearningLab items={learningTasks} onAdd={(item) => add("learningTasks", setLearningTasks, item)} onUpdate={(items) => update("learningTasks", setLearningTasks, items)} onRemove={(id) => remove("learningTasks", setLearningTasks, id)} /></div>
  </>;
}
