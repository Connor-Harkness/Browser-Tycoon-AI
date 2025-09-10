import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'joining', 'playing', 'ended'
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [, setRoomId] = useState(''); // roomId used for future features
  const [siteTypes, setSiteTypes] = useState({});
  const [playerData, setPlayerData] = useState({
    money: 1000,
    influence: 0,
    sites: [],
    seoLevel: 1
  });
  const [players, setPlayers] = useState([]);
  const [gameTimer, setGameTimer] = useState(600);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [error, setError] = useState('');

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('gameJoined', (data) => {
      console.log('Game joined:', data);
      setPlayerId(data.playerId);
      setRoomId(data.roomId);
      setSiteTypes(data.siteTypes);
      setGameState('playing');
      setError('');
    });

    socket.on('gameUpdate', (data) => {
      console.log('Game update:', data);
      setPlayers(data.players);
      setGameTimer(data.timer);
      
      // Update current player data
      const currentPlayer = data.players.find(p => p.id === playerId);
      if (currentPlayer) {
        setPlayerData(prev => ({
          ...prev,
          money: currentPlayer.money || prev.money,
          influence: currentPlayer.influence || prev.influence
        }));
      }
    });

    socket.on('siteBuilt', (data) => {
      console.log('Site built:', data);
      setPlayerData(prev => ({
        ...prev,
        sites: [...prev.sites, data.site],
        money: data.newBalance
      }));
      setError('');
    });

    socket.on('seoUpgraded', (data) => {
      console.log('SEO upgraded:', data);
      setPlayerData(prev => ({
        ...prev,
        seoLevel: data.newLevel,
        money: data.newBalance
      }));
      setError('');
    });

    socket.on('randomEvent', (event) => {
      console.log('Random event:', event);
      setCurrentEvent(event);
      setTimeout(() => setCurrentEvent(null), 5000);
    });

    socket.on('gameEnd', (data) => {
      console.log('Game ended:', data);
      setGameState('ended');
      // Handle game end UI
    });

    socket.on('error', (data) => {
      console.log('Error:', data);
      setError(data.message);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('playerJoined', (player) => {
      console.log('Player joined:', player);
    });

    socket.on('playerLeft', (player) => {
      console.log('Player left:', player);
    });

    return () => {
      socket.off('gameJoined');
      socket.off('gameUpdate');
      socket.off('siteBuilt');
      socket.off('seoUpgraded');
      socket.off('randomEvent');
      socket.off('gameEnd');
      socket.off('error');
      socket.off('playerJoined');
      socket.off('playerLeft');
    };
  }, [socket, playerId]);

  const joinGame = useCallback(() => {
    if (socket && playerName.trim()) {
      setGameState('joining');
      setError('');
      socket.emit('joinGame', playerName.trim());
    }
  }, [socket, playerName]);

  const buildSite = useCallback((siteType) => {
    if (socket) {
      socket.emit('buildSite', siteType);
    }
  }, [socket]);

  const upgradeSEO = useCallback(() => {
    if (socket) {
      socket.emit('upgradeSEO');
    }
  }, [socket]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (gameState === 'menu') {
    return (
      <div className="app">
        <div className="header">
          <h1>🌐 BROWSER TYCOON 🌐</h1>
          <p>Dominate the digital economy!</p>
        </div>
        
        <div className="join-form">
          <h2>Enter the Digital Battlefield</h2>
          <input
            type="text"
            placeholder="Enter your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinGame()}
            maxLength={20}
          />
          <button 
            className="join-btn"
            onClick={joinGame}
            disabled={!playerName.trim()}
          >
            START GAME
          </button>
          {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        </div>
      </div>
    );
  }

  if (gameState === 'joining') {
    return (
      <div className="app">
        <div className="header">
          <h1>🌐 BROWSER TYCOON 🌐</h1>
        </div>
        <div className="join-form">
          <h2>Connecting to game...</h2>
          <p>Finding other players...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="app">
        {gameTimer > 0 && (
          <div className="game-timer">
            ⏰ {formatTime(gameTimer)}
          </div>
        )}

        {currentEvent && (
          <div className="event-notification">
            <strong>🚨 {currentEvent.name} 🚨</strong>
            <br />
            {currentEvent.description}
          </div>
        )}

        <div className="header">
          <h1>🌐 BROWSER TYCOON 🌐</h1>
          <p>Player: {playerName}</p>
        </div>

        {error && (
          <div style={{
            background: '#ff4444',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="game-stats">
          <div className="stat-card">
            <div className="stat-value">${formatNumber(playerData.money)}</div>
            <div className="stat-label">Money</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatNumber(playerData.influence)}</div>
            <div className="stat-label">Influence</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{playerData.sites.length}</div>
            <div className="stat-label">Sites</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Lv.{playerData.seoLevel}</div>
            <div className="stat-label">SEO Level</div>
          </div>
        </div>

        <div className="actions">
          <button
            className="action-btn"
            onClick={upgradeSEO}
            disabled={playerData.money < playerData.seoLevel * 100}
          >
            Upgrade SEO
            <br />
            ${playerData.seoLevel * 100}
          </button>
        </div>

        <div className="site-builder">
          <h2>🏗️ Build Your Empire</h2>
          <div className="site-types">
            {Object.entries(siteTypes).map(([key, site]) => (
              <div
                key={key}
                className={`site-type ${playerData.money < site.cost ? 'disabled' : ''}`}
                onClick={() => playerData.money >= site.cost && buildSite(key)}
              >
                <h3>{site.name}</h3>
                <div className="site-cost">${site.cost}</div>
                <div className="site-description">{site.description}</div>
                <div style={{fontSize: '0.7rem', marginTop: '5px'}}>
                  Base Traffic: {site.baseTraffic}/tick
                </div>
              </div>
            ))}
          </div>
        </div>

        {playerData.sites.length > 0 && (
          <div className="player-sites">
            <h2>🏢 Your Sites ({playerData.sites.length})</h2>
            <div className="sites-grid">
              {playerData.sites.map((site, index) => (
                <div key={site.id || index} className="site-card">
                  <h3>{siteTypes[site.type]?.name || site.type}</h3>
                  <div>Level: {site.level}</div>
                  <div>Traffic: {site.traffic || siteTypes[site.type]?.baseTraffic}/tick</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {players.length > 0 && (
          <div className="players-list">
            <h2>👥 Players ({players.length})</h2>
            {players
              .sort((a, b) => b.influence - a.influence)
              .map((player, index) => (
                <div key={player.id} className="player-card">
                  <div className="player-name">
                    {index === 0 && '👑 '}
                    {player.name}
                    {player.id === playerId && ' (You)'}
                  </div>
                  <div className="player-stats">
                    <span>💰 ${formatNumber(player.money || 0)}</span>
                    <span>📈 {formatNumber(player.influence || 0)}</span>
                    <span>🏢 {player.sites || 0}</span>
                    <span>📊 {formatNumber(player.traffic || 0)}/tick</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="app">
        <div className="header">
          <h1>🌐 GAME OVER 🌐</h1>
        </div>
        <div className="join-form">
          <h2>🏆 Game Complete!</h2>
          <p>Check the final scores above!</p>
          <button 
            className="join-btn"
            onClick={() => {
              setGameState('menu');
              setPlayerName('');
              setPlayerData({
                money: 1000,
                influence: 0,
                sites: [],
                seoLevel: 1
              });
              setPlayers([]);
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;