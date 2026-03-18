# 🧠 Interview Cracker

> An AI-powered interview simulator for cracking Google & Microsoft technical interviews.  
> Built with React, Vite, and the Anthropic Claude API.

---

## 🚀 Live Demo

[interview-cracker.vercel.app](https://interview-cracker.vercel.app)

---

## 📌 What Is This?

Interview Cracker is a fully AI-powered quiz simulator designed for candidates preparing for software engineering interviews at **Google** and **Microsoft**. Every question is generated live by Claude AI — so you never see the same question twice.

It tests you on real topics that are actually asked in these interviews, gives you instant feedback, tracks your performance, and at the end of every session, an AI coach analyzes your behavior and tells you exactly what to improve.

---

## ✨ Features

- **AI-generated questions** — Every question is unique, generated fresh by Claude Sonnet
- **12 topics** — DSA, Logic Puzzles, CS Fundamentals, System Design, Behavioral, OOP, Databases, OS & Threads, Networking, Math & Probability, Recursion, Dynamic Programming
- **Custom topic input** — Type anything and the AI generates questions for it
- **Two question formats** — MCQ (multiple choice) and Riddles
- **Three difficulty levels** — Easy, Medium, Hard (or Mixed)
- **60-second countdown timer** — Simulates real interview pressure
- **Randomized answer positions** — MCQ options are shuffled every time so you can't guess by position
- **Instant explanations** — After every answer, Claude explains why it's correct
- **Hint system** — Stuck? Get a hint without giving away the full answer
- **Full session tracking** — Every question tracked: pass/fail/skip, time left, hints used
- **AI scoreboard & analysis** — After your session, Claude analyzes your performance and gives a brutally honest report
- **Dark navy UI** — Clean terminal-style design with Matrix green accents and Roboto Mono font

---

## 🧪 AI Analysis Report

After every session (minimum 3 questions), you can end and get a full AI-generated performance report including:

| Section | What It Tells You |
|---|---|
| Overall Grade | EXCEPTIONAL / STRONG / AVERAGE / NEEDS WORK / CRITICAL |
| Readiness Verdict | e.g. "Not ready for Google L4 yet" |
| Strengths | What you are doing well |
| Weaknesses | Where you are falling short |
| Behavior Patterns | Did you rely on hints? Skip hard questions? Rush? |
| Improvement Plan | 3 concrete actionable steps |
| Study Next | The single most important topic to focus on next |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Inline CSS + Google Fonts (Roboto Mono) |
| AI Engine | Anthropic Claude Sonnet (`claude-sonnet-4-6`) |
| Deployment | Vercel |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js installed
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/fussdeek-del/interview-cracker.git
cd interview-cracker
```

**2. Install dependencies**
```bash
npm install
```

**3. Create environment file**

Create a file called `.env` in the root of the project and add:
```
VITE_ANTHROPIC_KEY=your_api_key_here
```

**4. Run locally**
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deploying to Vercel

**1.** Push your code to GitHub

**2.** Go to [vercel.com](https://vercel.com) and import the repository

**3.** In Vercel project settings → **Environment Variables**, add:
```
VITE_ANTHROPIC_KEY = your_api_key_here
```

**4.** Click Deploy — your app goes live in ~60 seconds

---

## 📁 Project Structure

```
interview-cracker/
├── src/
│   ├── App.jsx          # Main application —
