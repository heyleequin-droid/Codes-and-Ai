# 🤖 Be Your Own AI

> *Stop waiting for answers. Start generating them.*

A fully interactive online course platform teaching **Code Fundamentals** and **AI Prompting Mastery** — built with vanilla HTML, CSS, and JavaScript (no build tools required).

## 📚 Course Contents

| Module | Topic |
|--------|-------|
| 1 | Variables & Data Types |
| 2 | Logic & Control Flow (If/Else, Loops) |
| 3 | Functions & Clean Code |
| 4 | AI Prompting Basics — What Is a Prompt & The RTF Framework |
| 5 | Advanced Prompting — Chain-of-Thought & Prompt Patterns |

Each module includes interactive lessons and a quiz. The course ends with a **Final Exam** and a **Certificate of Completion**.

## 🌐 Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page — hero, features, curriculum, pricing ($39), ratings |
| `course.html` | Course player — sidebar navigation, lessons, quizzes, progress tracking |
| `exam.html` | 10-question final exam (70% to pass) |
| `certificate.html` | Canvas-drawn personalized certificate + download |

## ✨ Features

- **🔊 Voice guide** — Web Speech API speaks "Be Your Own AI" on load & reads lessons aloud
- **💳 Stripe-ready checkout** — $39 one-time payment flow with card validation
- **🏷️ Free-access code** — `BEYOUROWNAI` — grants free access (for the course owner)
- **⭐ Star ratings** — interactive 1–5 star rating system with localStorage persistence
- **🎯 Interactive quizzes** — immediate feedback per question, pass/fail, retry support
- **🏆 Final exam** — 10 questions with score tracking and pass/fail routing
- **🎓 Certificate generator** — Canvas-drawn certificate with student name, score, date, and confetti
- **📊 Progress tracking** — sidebar progress bar, checkmarks, localStorage-persisted
- **🎉 Confetti celebration** on certificate page

## 🚀 Quick Start

No build step required — just open `index.html` in a browser or serve from any static host.

```bash
# Serve locally (Python 3)
python -m http.server 8080
# Then visit http://localhost:8080
```

## 💰 Pricing & Access

- **Full course:** $39 (one-time, via Stripe)
- **Free access code:** `BEYOUROWNAI` — enter at checkout

## 🔌 Stripe Integration

The payment flow in `js/main.js` uses `simulateStripeCharge()` as a placeholder.

To enable **real payments**, replace `simulateStripeCharge()` with a call to your backend endpoint that:
1. Creates a Stripe PaymentIntent server-side
2. Returns the `client_secret`
3. Uses `stripe.confirmCardPayment(clientSecret, { payment_method: { card: cardElement } })`

See: [https://stripe.com/docs/payments/accept-a-payment](https://stripe.com/docs/payments/accept-a-payment)
