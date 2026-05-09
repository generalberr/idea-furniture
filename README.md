# IDEA Furniture Website

Premium furniture e-commerce platform built for IDEA Furniture, Beirut.

## Features
- Full homepage with hero, catalog preview, process, testimonials
- Complete furniture catalog (10 pieces, 4 categories) with filters
- Product detail modal with color/size selector
- AI Room Visualizer — upload your room photo + AI design assistant
- Quote request system with WhatsApp integration
- Admin dashboard (login: admin / idea2024)

## Deploy to Vercel (3 steps)

### 1. Upload to GitHub
- Go to github.com/new
- Name it `idea-furniture`
- Upload all these files
- Click "Commit changes"

### 2. Deploy on Vercel
- Go to vercel.com/new
- Import your GitHub repo
- Click Deploy
- Done! Your site is live.

### 3. Customize
Before deploying, update these in `src/App.jsx`:
- WhatsApp number: replace `96100000000` with your real number
- Email: replace `hello@idea.lb` with your real email
- Admin password: replace `idea2024` with a secure password

## Local Development
```bash
npm install
npm start
```

## Tech Stack
- React 18
- No external UI libraries (pure CSS-in-JS)
- Anthropic Claude API (for room visualizer chat)
