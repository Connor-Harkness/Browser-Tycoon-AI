# 🌐 Browser Tycoon 🌐

A competitive, fast-paced multiplayer strategy game where players run shady, exaggerated "websites" competing for traffic, ad revenue, and dominance of the digital economy. Think Monopoly crossed with Cookie Clicker, flavored with the chaos of a meme-fueled internet.

![Browser Tycoon Menu](https://github.com/user-attachments/assets/58abc736-ea82-4b3e-8744-547b0ded9b4d)

## 🎮 Game Features

### Core Gameplay
- **Build Sites**: Choose from 5 different website types, each with unique characteristics:
  - **Blog**: Steady growth, weak defenses
  - **Video Hub**: High traffic, expensive upkeep
  - **Meme Page**: Viral spikes, unpredictable income
  - **Fake News**: Explosive growth, high shutdown risk
  - **Scam Store**: High profit margins, legal risks

- **Economy System**: Traffic → Revenue → Influence (victory condition)
- **SEO Upgrades**: Boost traffic multipliers for all your sites
- **Random Events**: Algorithm updates, meme storms, government crackdowns
- **Real-time Multiplayer**: 2-4 players per game, 10-minute rounds

![Browser Tycoon Gameplay](https://github.com/user-attachments/assets/a6fb4531-e8e0-41b9-b4ba-dc1deec58922)

### Mobile Optimized
- **Responsive Design**: Seamless experience on desktop and mobile
- **Touch-friendly Controls**: Tap-based site management
- **Mobile-first Layout**: Stacked cards and optimized UI

![Browser Tycoon Mobile](https://github.com/user-attachments/assets/59e60eff-f266-4c15-a4b4-711db71c811c)

## 🔧 Tech Stack

### Frontend
- **React 18**: Modern UI framework with hooks
- **Socket.io Client**: Real-time multiplayer communication
- **CSS Grid/Flexbox**: Responsive layout system
- **2000s Web Aesthetic**: Retro styling with animated gradients

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework
- **Socket.io**: WebSocket communication for multiplayer
- **Real-time Game State**: Live updates every 3 seconds

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Connor-Harkness/Browser-Tycoon-AI.git
cd Browser-Tycoon-AI
```

2. Install dependencies:
```bash
npm run install:all
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend client on `http://localhost:3000`

### Manual Setup
Alternatively, start servers individually:

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend  
cd client
npm install
npm start
```

## 🎯 How to Play

1. **Enter Your Name**: Join the digital battlefield with your tycoon name
2. **Build Sites**: Choose from 5 website types to generate traffic
3. **Earn Revenue**: Convert traffic into money through ads and data sales
4. **Upgrade SEO**: Multiply your traffic across all sites
5. **Compete**: Race against other players for the highest influence
6. **Adapt**: Random events will shake up your strategy

### Victory Conditions
- **Primary**: Highest influence when the 10-minute timer expires
- **Tiebreaker**: Most money remaining

## 🎨 Game Design

### Random Events
- **Google Algorithm Update**: All SEO resets
- **Meme Storm**: Meme Pages get massive traffic boost
- **Government Crackdown**: Fake News/Scam sites risk shutdown
- **Celebrity Endorsement**: Random player gets traffic surge
- **Adpocalypse**: Ad revenue drops globally

### Site Economics
Each site type has unique properties:
- **Cost**: Initial investment required
- **Base Traffic**: Visitors generated per tick
- **Defense Rating**: Resistance to sabotage (planned feature)
- **Special Mechanics**: Unique behaviors and risks

## 🔮 Planned Features

- **Sabotage System**: DDoS attacks, ad-block viruses, meme storms
- **Defense Mechanisms**: Firewalls, PR campaigns, bot purges
- **Team Play**: Corporate conglomerates mode
- **Extended Game Modes**: 30-minute strategic games
- **Player Stats**: Persistent accounts and leaderboards
- **More Random Events**: Seasonal events and meta updates

## 🏗️ Project Structure

```
Browser-Tycoon-AI/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # React components
│   │   ├── App.js         # Main game component
│   │   ├── index.css      # Responsive styling
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── server.js          # Express + Socket.io server
│   └── package.json       # Backend dependencies
├── package.json           # Root package for scripts
└── README.md             # This file
```

## 📱 Cross-Platform Support

Browser Tycoon runs smoothly in modern browsers:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Firefox Mobile
- **Responsive**: Adapts to all screen sizes
- **Touch Optimized**: Mobile-friendly controls

## 🎪 Aesthetic & Theme

The game features a satirical 2000s web aesthetic:
- **Animated Gradients**: Psychedelic background animations
- **Neon Colors**: Hot pink, electric blue, acid yellow
- **Retro Typography**: Monospace fonts and bold styling
- **Popup-style UI**: Reminiscent of early web design
- **Satirical Tone**: Parodies shady internet capitalism

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ and excessive amounts of neon colors**