import { useState, useEffect, useRef } from "react";

const TOPICS = ["DSA","Logic Puzzles","CS Fundamentals","System Design","Behavioral","OOP","Databases","OS & Threads","Networking","Math & Probability","Recursion","Dynamic Programming"];
const DIFFICULTIES = ["Easy","Medium","Hard","Mixed"];
const COMPANIES = ["Microsoft","Google","Both"];

const SYSTEM_PROMPT = `You are an elite technical interview coach for Google and Microsoft. Generate exactly ONE interview question based on the given parameters.

Respond ONLY with a valid JSON object, no markdown, no explanation, no backticks. Format:
{
  "type": "mcq" or "riddle",
  "question": "the question text",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."] (only for mcq, omit for riddle),
  "answer": "the correct answer letter like A or full answer for riddle",
  "explanation": "brief explanation of the answer (2-3 sentences)",
  "hint": "one helpful hint without giving away the answer"
}

For MCQ: provide 4 options and answer as the letter (A/B/C/D).
For riddle: answer is the full text answer, no options needed.
Make questions realistic, challenging, and exactly what Google/Microsoft ask.`;

const ANALYSIS_PROMPT = `You are a harsh but honest senior engineer at Google who reviews interview performance. Analyze the session data below and give a brutally honest, detailed report.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "overall_grade": "one of: EXCEPTIONAL / STRONG / AVERAGE / NEEDS WORK / CRITICAL",
  "readiness": "a short 1-line verdict like 'Not ready for Google L4 yet' or 'Strong candidate for Microsoft SWE II'",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "patterns": "2-3 sentences analyzing behavioral patterns — e.g. did they use hints a lot, skip hard questions, rush, run out of time often",
  "improvement_plan": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "next_focus": "the single most important topic they should study next and why"
}`;

const C = {
  bg:"#0d1117", surface:"#0d1117", card:"#161b22", cardAlt:"#1c2128",
  border:"#21262d", borderStrong:"#30363d",
  accent:"#39d353", accentDim:"#0a2a12", accentHover:"#56e868",
  text:"#e6edf3", textMuted:"#8b949e", textDim:"#484f58",
  success:"#0d2a1a", successBorder:"#1f6b35", successText:"#39d353",
  danger:"#2a0d0d", dangerBorder:"#8a2020", dangerText:"#f87171",
  warn:"#2a1e00", warnBorder:"#7a5200", warnText:"#e3b341",
  font:"'Roboto Mono', monospace",
};

const GRADE_COLOR = { EXCEPTIONAL: "#39d353", STRONG: "#56e868", AVERAGE: "#e3b341", "NEEDS WORK": "#f0883e", CRITICAL: "#f87171" };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.root{background:${C.bg};min-height:100vh;font-family:${C.font};color:${C.text};padding:2rem 1rem;}
.btn{background:transparent;border:1px solid ${C.border};color:${C.textMuted};padding:7px 14px;font-family:${C.font};font-size:12px;cursor:pointer;letter-spacing:.04em;transition:border-color .12s,color .12s,background .12s;}
.btn:hover{border-color:${C.accent};color:${C.accent};}
.btn.active{border-color:${C.accent};color:${C.accent};background:${C.accentDim};}
.btn.primary{border:1px solid ${C.accent};color:${C.accent};background:${C.accentDim};font-size:13px;font-weight:600;padding:12px 20px;width:100%;letter-spacing:.1em;text-transform:uppercase;}
.btn.primary:hover{background:#0f3d1c;border-color:${C.accentHover};color:${C.accentHover};}
.btn.ghost{border-color:${C.borderStrong};color:${C.textMuted};font-size:12px;padding:8px 14px;}
.btn.ghost:hover{border-color:${C.accent};color:${C.accent};}
.card{background:${C.card};border:1px solid ${C.border};padding:1.1rem 1.25rem;}
.opt-btn{text-align:left;width:100%;background:${C.card};border:1px solid ${C.border};color:${C.text};padding:11px 16px;font-family:${C.font};font-size:13px;cursor:pointer;line-height:1.55;letter-spacing:.01em;transition:border-color .12s,background .12s;}
.opt-btn:hover{border-color:${C.accent};background:${C.cardAlt};}
.opt-btn.correct{background:${C.success};border-color:${C.successBorder};color:${C.successText};}
.opt-btn.wrong{background:${C.danger};border-color:${C.dangerBorder};color:${C.dangerText};}
.opt-btn.neutral{opacity:.38;cursor:default;}
input[type=text]{width:100%;background:${C.card};border:1px solid ${C.borderStrong};color:${C.text};padding:10px 14px;font-family:${C.font};font-size:13px;outline:none;letter-spacing:.02em;transition:border-color .12s;}
input[type=text]:focus{border-color:${C.accent};}
input[type=text]::placeholder{color:${C.textDim};}
.tag{font-size:11px;padding:3px 10px;border:1px solid ${C.borderStrong};color:${C.textMuted};background:${C.card};font-family:${C.font};letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;}
.tag.accent{border-color:${C.accent};color:${C.accent};background:${C.accentDim};}
.label{font-size:11px;color:${C.textDim};letter-spacing:.12em;text-transform:uppercase;margin:0 0 9px;font-family:${C.font};}
.metric{background:${C.card};border:1px solid ${C.border};padding:12px 16px;flex:1;}
.metric-val{font-size:24px;font-weight:600;color:${C.accent};font-family:${C.font};}
.metric-label{font-size:10px;color:${C.textDim};letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;}
.divider{border:none;border-top:1px solid ${C.border};margin:1.4rem 0;}
.pulse{animation:blink 1.1s step-start infinite;}
@keyframes blink{50%{opacity:0;}}
.q-row{display:grid;grid-template-columns:auto 1fr auto auto;gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid ${C.border};}
.q-row:last-child{border-bottom:none;}
`;

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [company, setCompany] = useState("Microsoft");
  const [topic, setTopic] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Medium");
  const [qType, setQType] = useState("Mixed");
  const [customTopic, setCustomTopic] = useState("");

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [riddleInput, setRiddleInput] = useState("");
  const [riddleResult, setRiddleResult] = useState(null);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [qNum, setQNum] = useState(0);
  const timerRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      setRevealed(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, timerActive]);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelected(null);
    setRevealed(false);
    setShowHint(false);
    setRiddleInput("");
    setRiddleResult(null);
    setTimer(60);
    setTimerActive(false);
    setQNum(n => n + 1);

    const activeTopic = topic === "__custom__" ? customTopic.trim() : topic;
    const typeInstruction = qType === "Mixed" ? (Math.random() > 0.5 ? "mcq" : "riddle") : qType === "MCQ" ? "mcq" : "riddle";
    const prompt = `Company: ${company}\nTopic: ${activeTopic}\nDifficulty: ${difficulty}\nType: ${typeInstruction}\nGenerate a realistic ${difficulty} level question about "${activeTopic}" that ${company === "Both" ? "Google or Microsoft" : company} would ask.`;

    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: SYSTEM_PROMPT, messages: [{ role: "user", content: prompt }] })
        });
        if (!res.ok) { attempts++; continue; }
        const data = await res.json();
        const raw = (data.content || []).map(b => b.text || "").join("");
        const clean = raw.replace(/```json|```/g, "").trim();
        const jm = clean.match(/\{[\s\S]*\}/);
        if (!jm) { attempts++; continue; }
        const parsed = JSON.parse(jm[0]);
        if (!parsed.question || !parsed.type || !parsed.answer || !parsed.explanation) { attempts++; continue; }
        if (parsed.type === "mcq") {
          if (!Array.isArray(parsed.options) || parsed.options.length < 4) { attempts++; continue; }
          const letters = ["A","B","C","D"];
          const ci = letters.findIndex(l => parsed.answer.toUpperCase().startsWith(l));
          if (ci === -1) { attempts++; continue; }
          const ct = parsed.options[ci].slice(3);
          const raw2 = parsed.options.map(o => o.slice(3));
          const sh = [...raw2].sort(() => Math.random() - 0.5);
          parsed.options = sh.map((t, i) => letters[i] + ") " + t);
          parsed.answer = letters[sh.indexOf(ct)];
        }
        if (!parsed.hint) parsed.hint = "Think carefully about edge cases.";
        setQuestion(parsed);
        setLoading(false);
        setTimerActive(true);
        return;
      } catch { attempts++; }
    }
    setLoading(false);
    fetchQuestion();
  };

  const recordHistory = (q, correct, skipped, usedHint, timeLeft, userAnswer) => {
    setHistory(h => [...h, {
      qNum: h.length + 1,
      question: q.question.slice(0, 80) + (q.question.length > 80 ? "…" : ""),
      type: q.type,
      topic: topic === "__custom__" ? customTopic : topic,
      difficulty,
      correct,
      skipped,
      usedHint,
      timeLeft,
      userAnswer: userAnswer || (skipped ? "SKIPPED" : ""),
      correctAnswer: q.answer,
    }]);
  };

  const handleMCQ = (opt) => {
    if (revealed) return;
    const tl = timer;
    setSelected(opt);
    setTimerActive(false);
    setRevealed(true);
    const correct = opt[0] === question.answer;
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    recordHistory(question, correct, false, showHint, tl, opt[0]);
  };

  const handleRiddle = () => {
    if (!riddleInput.trim()) return;
    const tl = timer;
    setTimerActive(false);
    setRevealed(true);
    const correct = riddleInput.trim().toLowerCase().includes(question.answer.toLowerCase().slice(0, 6));
    setRiddleResult(correct);
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    recordHistory(question, correct, false, showHint, tl, riddleInput.trim().slice(0, 30));
  };

  const skipQuestion = () => {
    const tl = timer;
    setTimerActive(false);
    setRevealed(true);
    setTotal(t => t + 1);
    recordHistory(question, false, true, showHint, tl, "SKIPPED");
  };

  const fetchAnalysis = async (hist, sc, tot) => {
    setAnalysisLoading(true);
    const sessionData = {
      company, topic: topic === "__custom__" ? customTopic : topic, difficulty,
      score: sc, total: tot, accuracy: tot > 0 ? Math.round((sc/tot)*100) : 0,
      questions: hist.map(h => ({
        q: h.qNum, topic: h.topic, type: h.type, difficulty: h.difficulty,
        correct: h.correct, skipped: h.skipped, usedHint: h.usedHint,
        timeLeft: h.timeLeft, userAnswer: h.userAnswer, correctAnswer: h.correctAnswer,
      })),
      patterns: {
        hintsUsed: hist.filter(h => h.usedHint).length,
        skipped: hist.filter(h => h.skipped).length,
        timeouts: hist.filter(h => h.timeLeft === 0).length,
        fastAnswers: hist.filter(h => h.timeLeft > 45).length,
      }
    };
    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1500, system: ANALYSIS_PROMPT, messages: [{ role: "user", content: JSON.stringify(sessionData) }] })
        });
        if (!res.ok) { attempts++; continue; }
        const data = await res.json();
        const raw = (data.content || []).map(b => b.text || "").join("");
        const clean = raw.replace(/```json|```/g, "").trim();
        const jm = clean.match(/\{[\s\S]*\}/);
        if (!jm) { attempts++; continue; }
        const parsed = JSON.parse(jm[0]);
        setAnalysis(parsed);
        setAnalysisLoading(false);
        return;
      } catch { attempts++; }
    }
    setAnalysisLoading(false);
  };

  const endSession = () => {
    setTimerActive(false);
    const finalHistory = [...history];
    const finalScore = score;
    const finalTotal = total;
    setScreen("scoreboard");
    fetchAnalysis(finalHistory, finalScore, finalTotal);
  };

  const resetAll = () => {
    setScreen("setup"); setScore(0); setTotal(0); setHistory([]);
    setAnalysis(null); setQuestion(null); setQNum(0);
  };

  const timerCol = timer > 30 ? C.successText : timer > 15 ? C.warnText : C.dangerText;
  const acc = total > 0 ? Math.round((score / total) * 100) : 0;
  const activeTopic = topic === "__custom__" ? (customTopic || "Custom") : topic;

  if (screen === "setup") return (
    <div className="root">
      <style>{css}</style>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", borderLeft: `3px solid ${C.accent}`, paddingLeft: 14 }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: C.text, letterSpacing: ".06em", marginBottom: 4 }}>INTERVIEW_CRACKER</p>
          <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: ".1em" }}>GOOGLE &amp; MICROSOFT — AI POWERED SIMULATOR <span className="pulse" style={{ color: C.accent }}>_</span></p>
        </div>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <p className="label">target company</p>
            <div style={{ display: "flex", gap: 8 }}>
              {COMPANIES.map(o => <button key={o} className={`btn${company===o?" active":""}`} onClick={() => setCompany(o)}>{o}</button>)}
            </div>
          </div>
          <div>
            <p className="label">topic</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {TOPICS.map(o => <button key={o} className={`btn${topic===o?" active":""}`} onClick={() => setTopic(o)} style={{ fontSize: 11 }}>{o}</button>)}
              <button className={`btn${topic==="__custom__"?" active":""}`} onClick={() => setTopic("__custom__")} style={{ fontSize: 11, borderStyle: topic==="__custom__"?"solid":"dashed" }}>+ CUSTOM</button>
            </div>
            {topic === "__custom__" && (
              <div>
                <input type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="> e.g. Binary Trees, React Hooks, SOLID principles..." style={{ marginBottom: 6 }} />
                <p style={{ fontSize: 11, color: C.textDim, letterSpacing: ".05em" }}>// AI analyzes your input and generates tailored questions</p>
              </div>
            )}
          </div>
          <div>
            <p className="label">difficulty</p>
            <div style={{ display: "flex", gap: 8 }}>
              {DIFFICULTIES.map(o => <button key={o} className={`btn${difficulty===o?" active":""}`} onClick={() => setDifficulty(o)}>{o}</button>)}
            </div>
          </div>
          <div>
            <p className="label">format</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["MCQ","Riddle","Mixed"].map(o => <button key={o} className={`btn${qType===o?" active":""}`} onClick={() => setQType(o)}>{o}</button>)}
            </div>
          </div>
        </div>
        {total > 0 && (<>
          <hr className="divider" />
          <p className="label" style={{ marginBottom: 10 }}>last session</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="metric"><p className="metric-label">score</p><p className="metric-val">{score}</p></div>
            <div className="metric"><p className="metric-label">total</p><p className="metric-val">{total}</p></div>
            <div className="metric"><p className="metric-label">accuracy</p><p className="metric-val">{acc}%</p></div>
          </div>
        </>)}
        <hr className="divider" />
        <button className="btn primary" onClick={() => { if (topic==="__custom__"&&!customTopic.trim()) return; setScreen("quiz"); fetchQuestion(); }} style={{ opacity: topic==="__custom__"&&!customTopic.trim()?0.4:1 }}>&gt;_ START SESSION</button>
      </div>
    </div>
  );

  if (screen === "scoreboard") return (
    <div className="root">
      <style>{css}</style>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem", borderLeft: `3px solid ${C.accent}`, paddingLeft: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: ".08em", marginBottom: 4 }}>SESSION_REPORT</p>
          <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: ".08em" }}>{company} · {activeTopic} · {difficulty}</p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div className="metric"><p className="metric-label">score</p><p className="metric-val">{score}/{total}</p></div>
          <div className="metric"><p className="metric-label">accuracy</p><p className="metric-val">{acc}%</p></div>
          <div className="metric"><p className="metric-label">hints used</p><p className="metric-val">{history.filter(h=>h.usedHint).length}</p></div>
          <div className="metric"><p className="metric-label">skipped</p><p className="metric-val">{history.filter(h=>h.skipped).length}</p></div>
        </div>

        <p className="label" style={{ marginBottom: 10 }}>question breakdown</p>
        <div className="card" style={{ marginBottom: "1.5rem", padding: "0 1.25rem" }}>
          {history.map((h, i) => (
            <div key={i} className="q-row">
              <span style={{ fontSize: 11, color: C.textDim, minWidth: 36 }}>Q_{String(h.qNum).padStart(3,"0")}</span>
              <span style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{h.question}</span>
              <span style={{ fontSize: 11, color: C.textDim }}>{h.timeLeft}s left</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: h.skipped ? C.warnText : h.correct ? C.successText : C.dangerText, minWidth: 50, textAlign: "right" }}>
                {h.skipped ? "SKIP" : h.correct ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
        </div>

        <p className="label" style={{ marginBottom: 12 }}>ai analysis</p>

        {analysisLoading && (
          <div className="card" style={{ textAlign: "center", padding: "2.5rem", marginBottom: "1.5rem" }}>
            <p style={{ color: C.accent, fontSize: 13, letterSpacing: ".12em" }}>ANALYZING SESSION<span className="pulse">_</span></p>
            <p style={{ color: C.textDim, fontSize: 11, marginTop: 8, letterSpacing: ".08em" }}>RUNNING PERFORMANCE DIAGNOSTICS</p>
          </div>
        )}

        {analysis && !analysisLoading && (
          <div style={{ display: "grid", gap: 10, marginBottom: "1.5rem" }}>
            <div className="card" style={{ borderLeft: `3px solid ${GRADE_COLOR[analysis.overall_grade] || C.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: GRADE_COLOR[analysis.overall_grade] || C.accent, letterSpacing: ".08em" }}>{analysis.overall_grade}</span>
                <span className="tag" style={{ borderColor: GRADE_COLOR[analysis.overall_grade] || C.accent, color: GRADE_COLOR[analysis.overall_grade] || C.accent }}>VERDICT</span>
              </div>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{analysis.readiness}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="card" style={{ borderLeft: `3px solid ${C.successBorder}` }}>
                <p className="label" style={{ color: C.successText, marginBottom: 10 }}>// strengths</p>
                {(analysis.strengths || []).map((s, i) => (
                  <p key={i} style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 6 }}>
                    <span style={{ color: C.successText, marginRight: 6 }}>+</span>{s}
                  </p>
                ))}
              </div>
              <div className="card" style={{ borderLeft: `3px solid ${C.dangerBorder}` }}>
                <p className="label" style={{ color: C.dangerText, marginBottom: 10 }}>// weaknesses</p>
                {(analysis.weaknesses || []).map((w, i) => (
                  <p key={i} style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 6 }}>
                    <span style={{ color: C.dangerText, marginRight: 6 }}>-</span>{w}
                  </p>
                ))}
              </div>
            </div>

            <div className="card" style={{ borderLeft: `3px solid ${C.warnBorder}`, background: C.warn }}>
              <p className="label" style={{ color: C.warnText, marginBottom: 8 }}>// behavior patterns</p>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{analysis.patterns}</p>
            </div>

            <div className="card">
              <p className="label" style={{ marginBottom: 10 }}>// improvement plan</p>
              {(analysis.improvement_plan || []).map((step, i) => (
                <p key={i} style={{ fontSize: 12, color: C.text, lineHeight: 1.65, marginBottom: 8, paddingLeft: 16, borderLeft: `2px solid ${C.borderStrong}` }}>
                  <span style={{ color: C.accent, marginRight: 8 }}>{i+1}.</span>{step}
                </p>
              ))}
            </div>

            <div className="card" style={{ borderLeft: `3px solid ${C.accent}`, background: C.accentDim }}>
              <p className="label" style={{ color: C.accent, marginBottom: 8 }}>// study next</p>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{analysis.next_focus}</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => { setScreen("quiz"); fetchQuestion(); }}>&gt;_ NEW SESSION</button>
          <button className="btn primary" style={{ flex: 1 }} onClick={resetAll}>&gt;_ RESET ALL</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="root">
      <style>{css}</style>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" onClick={() => setScreen("setup")}>← BACK</button>
            {total >= 3 && <button className="btn ghost" style={{ borderColor: C.warnBorder, color: C.warnText }} onClick={endSession}>END &amp; ANALYZE</button>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span className="tag">{company}</span>
            <span className="tag">{activeTopic.length>16?activeTopic.slice(0,16)+"…":activeTopic}</span>
            <span className="tag">{difficulty}</span>
            <span className="tag accent">{score}/{total}</span>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ color: C.accent, fontSize: 13, letterSpacing: ".15em" }}>LOADING QUESTION<span className="pulse">_</span></p>
            <p style={{ color: C.textDim, fontSize: 11, letterSpacing: ".1em", marginTop: 8 }}>QUERYING AI ENGINE</p>
          </div>
        )}

        {!loading && question && !question.error && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="tag">Q_{String(qNum).padStart(3,"0")}</span>
                <span className="tag accent">{question.type==="mcq"?"MCQ":"RIDDLE"}</span>
              </div>
              {!revealed && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 90, height: 3, background: C.border, position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(timer/60)*100}%`, background: timerCol, transition: "width 1s linear, background 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 12, color: timerCol, fontFamily: C.font, minWidth: 30 }}>{timer}s</span>
                </div>
              )}
            </div>

            <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: C.text, fontFamily: C.font, margin: 0 }}>{question.question}</p>
            </div>

            {question.type === "mcq" && (
              <div style={{ display: "grid", gap: 7, marginBottom: 12 }}>
                {question.options.map(opt => {
                  const letter = opt[0];
                  const isCorrect = letter === question.answer;
                  const isSelected = selected === opt;
                  let cls = "opt-btn";
                  if (revealed) { if (isCorrect) cls += " correct"; else if (isSelected) cls += " wrong"; else cls += " neutral"; }
                  return (
                    <button key={opt} className={cls} onClick={() => handleMCQ(opt)}>
                      <span style={{ color: C.accent, marginRight: 10 }}>{letter}&gt;</span>{opt.slice(3)}
                    </button>
                  );
                })}
              </div>
            )}

            {question.type === "riddle" && !revealed && (
              <div style={{ marginBottom: 12 }}>
                <input type="text" value={riddleInput} onChange={e => setRiddleInput(e.target.value)} onKeyDown={e => e.key==="Enter" && handleRiddle()} placeholder="> type your answer here..." />
                <button className="btn primary" onClick={handleRiddle} style={{ marginTop: 8 }}>&gt;_ SUBMIT ANSWER</button>
              </div>
            )}

            {question.type === "riddle" && revealed && (
              <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${riddleResult?C.successBorder:C.dangerBorder}`, background: riddleResult?C.success:C.danger }}>
                <p style={{ fontSize: 13, color: riddleResult?C.successText:C.dangerText, fontFamily: C.font, margin: 0 }}>
                  {riddleResult ? "// CORRECT" : `// ANSWER: ${question.answer}`}
                </p>
              </div>
            )}

            {revealed && (
              <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${C.warnBorder}`, background: C.warn }}>
                <p className="label" style={{ color: C.warnText, marginBottom: 8 }}>// EXPLANATION</p>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontFamily: C.font, margin: 0 }}>{question.explanation}</p>
              </div>
            )}

            {!revealed && (
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button className="btn ghost" style={{ flex: 1 }} onClick={() => setShowHint(h => !h)}>{showHint?"HIDE HINT":"SHOW HINT"}</button>
                <button className="btn ghost" style={{ flex: 1 }} onClick={skipQuestion}>SKIP</button>
              </div>
            )}

            {showHint && !revealed && (
              <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${C.warnBorder}`, background: C.warn }}>
                <p style={{ fontSize: 13, color: C.warnText, fontFamily: C.font, margin: 0 }}>&gt; {question.hint}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn primary" style={{ flex: 1 }} onClick={fetchQuestion}>&gt;_ NEXT QUESTION</button>
              {total >= 3 && <button className="btn ghost" style={{ borderColor: C.warnBorder, color: C.warnText, whiteSpace: "nowrap" }} onClick={endSession}>END &amp; ANALYZE</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}