const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state
const gameState = {
  players: new Map(),
  rooms: new Map(),
  gameEvents: []
};

// Site types with their properties
const SITE_TYPES = {
  BLOG: { name: 'Blog', cost: 100, baseTraffic: 10, defenseRating: 3, description: 'Steady growth, weak defenses' },
  VIDEO_HUB: { name: 'Video Hub', cost: 300, baseTraffic: 50, defenseRating: 5, description: 'High traffic, expensive upkeep' },
  MEME_PAGE: { name: 'Meme Page', cost: 150, baseTraffic: 25, defenseRating: 2, description: 'Viral spikes, unpredictable income' },
  FAKE_NEWS: { name: 'Fake News', cost: 200, baseTraffic: 40, defenseRating: 1, description: 'Explosive growth, high shutdown risk' },
  SCAM_STORE: { name: 'Scam Store', cost: 250, baseTraffic: 30, defenseRating: 2, description: 'High profit margins, legal risks' }
};

// Random events
const RANDOM_EVENTS = [
  { name: 'Google Algorithm Update', effect: 'seo_reset', description: 'All SEO resets, favoring certain site types' },
  { name: 'Meme Storm', effect: 'meme_boost', description: 'Meme Pages explode in traffic' },
  { name: 'Government Crackdown', effect: 'fake_news_risk', description: 'Fake News/Scam sites risk shutdown' },
  { name: 'Celebrity Endorsement', effect: 'random_boost', description: 'Random player gets traffic surge' },
  { name: 'Adpocalypse', effect: 'ad_revenue_drop', description: 'Ad revenue tanks globally' }
];

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.money = 1000;
    this.influence = 0;
    this.sites = [];
    this.seoLevel = 1;
    this.isOnline = true;
  }

  addSite(siteType) {
    const site = {
      id: Date.now(),
      type: siteType,
      traffic: SITE_TYPES[siteType].baseTraffic,
      revenue: 0,
      level: 1
    };
    this.sites.push(site);
    return site;
  }

  calculateTotalTraffic() {
    return this.sites.reduce((total, site) => {
      const baseTraffic = SITE_TYPES[site.type].baseTraffic * site.level;
      return total + (baseTraffic * this.seoLevel);
    }, 0);
  }

  tick() {
    // Generate revenue from traffic
    const totalTraffic = this.calculateTotalTraffic();
    const revenue = Math.floor(totalTraffic * 0.1 * (Math.random() * 0.5 + 0.75)); // 0.075-0.125 per visitor
    this.money += revenue;
    
    // Convert traffic to influence
    this.influence += Math.floor(totalTraffic * 0.01);
    
    return { traffic: totalTraffic, revenue };
  }
}

class GameRoom {
  constructor(id) {
    this.id = id;
    this.players = new Map();
    this.gameStarted = false;
    this.gameTimer = 600; // 10 minutes in seconds
    this.lastEventTime = 0;
    this.tickInterval = null;
  }

  addPlayer(player) {
    this.players.set(player.id, player);
    if (this.players.size >= 2 && !this.gameStarted) {
      this.startGame();
    }
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    if (this.players.size === 0) {
      this.stopGame();
    }
  }

  startGame() {
    this.gameStarted = true;
    this.tickInterval = setInterval(() => {
      this.gameTick();
    }, 3000); // Tick every 3 seconds
  }

  stopGame() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    this.gameStarted = false;
  }

  gameTick() {
    if (this.gameTimer <= 0) {
      this.endGame();
      return;
    }

    this.gameTimer -= 3;

    // Process each player's tick
    const tickResults = {};
    this.players.forEach((player, id) => {
      if (player.isOnline) {
        tickResults[id] = player.tick();
      }
    });

    // Random event chance (every ~30 seconds on average)
    if (Math.random() < 0.1 && Date.now() - this.lastEventTime > 30000) {
      this.triggerRandomEvent();
    }

    // Broadcast game state update
    io.to(this.id).emit('gameUpdate', {
      players: Array.from(this.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        money: p.money,
        influence: p.influence,
        sites: p.sites.length,
        traffic: p.calculateTotalTraffic()
      })),
      timer: this.gameTimer,
      tickResults
    });
  }

  triggerRandomEvent() {
    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    this.lastEventTime = Date.now();

    // Apply event effects
    this.players.forEach(player => {
      switch (event.effect) {
        case 'seo_reset':
          player.seoLevel = 1;
          break;
        case 'meme_boost':
          player.sites.forEach(site => {
            if (site.type === 'MEME_PAGE') {
              site.traffic *= 2;
            }
          });
          break;
        case 'fake_news_risk':
          player.sites = player.sites.filter(site => {
            if ((site.type === 'FAKE_NEWS' || site.type === 'SCAM_STORE') && Math.random() < 0.3) {
              return false; // Site shut down
            }
            return true;
          });
          break;
        case 'random_boost':
          if (Math.random() < 0.25) { // 25% chance for this player
            player.sites.forEach(site => {
              site.traffic *= 1.5;
            });
          }
          break;
        case 'ad_revenue_drop':
          // This would affect revenue calculation in next ticks
          break;
      }
    });

    io.to(this.id).emit('randomEvent', event);
  }

  endGame() {
    this.stopGame();
    
    // Calculate winner
    let winner = null;
    let highestInfluence = 0;
    
    this.players.forEach(player => {
      if (player.influence > highestInfluence) {
        highestInfluence = player.influence;
        winner = player;
      }
    });

    io.to(this.id).emit('gameEnd', {
      winner: winner ? { id: winner.id, name: winner.name, influence: winner.influence } : null,
      finalScores: Array.from(this.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        influence: p.influence,
        money: p.money
      })).sort((a, b) => b.influence - a.influence)
    });
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinGame', (playerName) => {
    const player = new Player(socket.id, playerName);
    gameState.players.set(socket.id, player);

    // Find or create a room
    let room = null;
    for (const [roomId, gameRoom] of gameState.rooms) {
      if (gameRoom.players.size < 4 && !gameRoom.gameStarted) {
        room = gameRoom;
        break;
      }
    }

    if (!room) {
      const roomId = 'room_' + Date.now();
      room = new GameRoom(roomId);
      gameState.rooms.set(roomId, room);
    }

    socket.join(room.id);
    room.addPlayer(player);

    socket.emit('gameJoined', {
      playerId: socket.id,
      roomId: room.id,
      siteTypes: SITE_TYPES
    });

    // Broadcast player joined
    socket.to(room.id).emit('playerJoined', {
      id: player.id,
      name: player.name
    });
  });

  socket.on('buildSite', (siteType) => {
    const player = gameState.players.get(socket.id);
    if (!player || !SITE_TYPES[siteType]) return;

    const cost = SITE_TYPES[siteType].cost;
    if (player.money >= cost) {
      player.money -= cost;
      const site = player.addSite(siteType);
      
      socket.emit('siteBuilt', {
        site,
        newBalance: player.money
      });
    } else {
      socket.emit('error', { message: 'Insufficient funds' });
    }
  });

  socket.on('upgradeSEO', () => {
    const player = gameState.players.get(socket.id);
    if (!player) return;

    const cost = player.seoLevel * 100;
    if (player.money >= cost) {
      player.money -= cost;
      player.seoLevel += 1;
      
      socket.emit('seoUpgraded', {
        newLevel: player.seoLevel,
        newBalance: player.money
      });
    } else {
      socket.emit('error', { message: 'Insufficient funds' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const player = gameState.players.get(socket.id);
    if (player) {
      // Find and remove from room
      for (const [roomId, room] of gameState.rooms) {
        if (room.players.has(socket.id)) {
          room.removePlayer(socket.id);
          socket.to(roomId).emit('playerLeft', { id: socket.id, name: player.name });
          
          if (room.players.size === 0) {
            gameState.rooms.delete(roomId);
          }
          break;
        }
      }
    }
    
    gameState.players.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Game mechanics initialized:');
  console.log('- Site types:', Object.keys(SITE_TYPES).length);
  console.log('- Random events:', RANDOM_EVENTS.length);
});