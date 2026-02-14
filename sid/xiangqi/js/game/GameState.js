class GameState {
  constructor() {
    this.id = Helpers.generateId();
    this.players = {
      red: { name: "Red Player", id: "red_player" },
      black: { name: "Black Player", id: "black_player" }
    };
    this.currentPlayer = XIANGQI_CONSTANTS.COLORS.RED;
    this.status = XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE;
    this.moveHistory = [];
    this.moveCount = 0;
    this.gameSettings = {
      timer: { enabled: false, timePerSide: 1800 }, // 30 minutes
      allowUndo: true,
      showValidMoves: true,
      soundEnabled: true
    };
    this.metadata = {
      startTime: new Date().toISOString(),
      lastMoveTime: null,
      result: null,
      winner: null,
      endTime: null
    };
    this.timers = {
      red: 1800,
      black: 1800,
      activeTimer: null
    };
    this.checkState = {
      inCheck: false,
      checkingPieces: []
    };
  }

  addMove(moveData) {
    const move = {
      moveNumber: Math.floor(this.moveHistory.length / 2) + 1,
      player: this.currentPlayer,
      from: moveData.from,
      to: moveData.to,
      piece: moveData.piece,
      capturedPiece: moveData.capturedPiece,
      notation: this.generateNotation(moveData),
      timestamp: new Date().toISOString(),
      isCheck: false,
      isCheckmate: false
    };

    this.moveHistory.push(move);
    this.moveCount++;
    this.metadata.lastMoveTime = move.timestamp;

    return move;
  }

  generateNotation(moveData) {
    const { piece, from, to, capturedPiece } = moveData;
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    return Helpers.getMoveNotation(piece, fromRow, fromCol, toRow, toCol, !!capturedPiece);
  }

  undoLastMove() {
    if (this.moveHistory.length === 0) {
      return null;
    }

    const lastMove = this.moveHistory.pop();
    this.moveCount--;
    
    // Switch back to previous player
    this.switchPlayer();
    
    // Update metadata
    if (this.moveHistory.length > 0) {
      this.metadata.lastMoveTime = this.moveHistory[this.moveHistory.length - 1].timestamp;
    } else {
      this.metadata.lastMoveTime = null;
    }

    return lastMove;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === XIANGQI_CONSTANTS.COLORS.RED ? 
                        XIANGQI_CONSTANTS.COLORS.BLACK : 
                        XIANGQI_CONSTANTS.COLORS.RED;
  }

  setStatus(status, winner = null, result = null) {
    this.status = status;
    
    if (status !== XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE) {
      this.metadata.endTime = new Date().toISOString();
      this.metadata.result = result;
      this.metadata.winner = winner;
      this.stopTimer();
    }
  }

  updateCheckState(inCheck, checkingPieces = []) {
    this.checkState.inCheck = inCheck;
    this.checkState.checkingPieces = checkingPieces;
    
    if (inCheck) {
      this.status = XIANGQI_CONSTANTS.GAME_STATUS.CHECK;
    } else if (this.status === XIANGQI_CONSTANTS.GAME_STATUS.CHECK) {
      this.status = XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE;
    }
  }

  startTimer() {
    if (!this.gameSettings.timer.enabled) {
      return;
    }

    this.stopTimer(); // Stop any existing timer
    
    this.timers.activeTimer = setInterval(() => {
      this.timers[this.currentPlayer]--;
      
      if (this.timers[this.currentPlayer] <= 0) {
        this.setStatus(
          XIANGQI_CONSTANTS.GAME_STATUS.RESIGNED,
          Helpers.getOpponentColor(this.currentPlayer),
          `${this.currentPlayer} ran out of time`
        );
      }
      
      // Emit timer update event
      this.emit('timerUpdate', {
        red: this.timers.red,
        black: this.timers.black,
        current: this.currentPlayer
      });
    }, 1000);
  }

  stopTimer() {
    if (this.timers.activeTimer) {
      clearInterval(this.timers.activeTimer);
      this.timers.activeTimer = null;
    }
  }

  pauseTimer() {
    this.stopTimer();
  }

  resumeTimer() {
    if (this.status === XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE) {
      this.startTimer();
    }
  }

  resetTimers() {
    this.stopTimer();
    this.timers.red = this.gameSettings.timer.timePerSide;
    this.timers.black = this.gameSettings.timer.timePerSide;
  }

  getGameDuration() {
    const startTime = new Date(this.metadata.startTime);
    const endTime = this.metadata.endTime ? new Date(this.metadata.endTime) : new Date();
    return Math.floor((endTime - startTime) / 1000); // Duration in seconds
  }

  getLastMove() {
    return this.moveHistory.length > 0 ? this.moveHistory[this.moveHistory.length - 1] : null;
  }

  getMoveByNumber(moveNumber) {
    return this.moveHistory.find(move => move.moveNumber === moveNumber);
  }

  getMovesForPlayer(color) {
    return this.moveHistory.filter(move => move.player === color);
  }

  exportMoveHistory() {
    return this.moveHistory.map(move => ({
      moveNumber: move.moveNumber,
      player: move.player,
      notation: move.notation,
      timestamp: move.timestamp
    }));
  }

  importMoveHistory(moves) {
    this.moveHistory = moves.map((move, index) => ({
      ...move,
      moveNumber: Math.floor(index / 2) + 1,
      timestamp: move.timestamp || new Date().toISOString()
    }));
    this.moveCount = this.moveHistory.length;
  }

  reset() {
    this.currentPlayer = XIANGQI_CONSTANTS.COLORS.RED;
    this.status = XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE;
    this.moveHistory = [];
    this.moveCount = 0;
    this.metadata = {
      startTime: new Date().toISOString(),
      lastMoveTime: null,
      result: null,
      winner: null,
      endTime: null
    };
    this.checkState = {
      inCheck: false,
      checkingPieces: []
    };
    this.resetTimers();
  }

  clone() {
    const clonedState = new GameState();
    clonedState.id = this.id;
    clonedState.players = { ...this.players };
    clonedState.currentPlayer = this.currentPlayer;
    clonedState.status = this.status;
    clonedState.moveHistory = [...this.moveHistory];
    clonedState.moveCount = this.moveCount;
    clonedState.gameSettings = { ...this.gameSettings };
    clonedState.metadata = { ...this.metadata };
    clonedState.timers = { ...this.timers };
    clonedState.checkState = { ...this.checkState };
    return clonedState;
  }

  serialize() {
    return {
      id: this.id,
      players: this.players,
      currentPlayer: this.currentPlayer,
      status: this.status,
      moveHistory: this.moveHistory,
      moveCount: this.moveCount,
      gameSettings: this.gameSettings,
      metadata: this.metadata,
      timers: {
        red: this.timers.red,
        black: this.timers.black
      },
      checkState: this.checkState
    };
  }

  deserialize(data) {
    Object.assign(this, data);
    // Don't restore the active timer - it should be restarted manually
    this.timers.activeTimer = null;
  }

  save(name = null) {
    const saveData = this.serialize();
    const saveName = name || `Game_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
    
    return Helpers.saveToStorage(`save_${saveName}`, saveData);
  }

  static load(saveName) {
    const saveData = Helpers.loadFromStorage(`save_${saveName}`);
    if (saveData) {
      const gameState = new GameState();
      gameState.deserialize(saveData);
      return gameState;
    }
    return null;
  }

  static getAllSaves() {
    const saves = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('xiangqi_save_')) {
        const saveName = key.replace('xiangqi_save_', '');
        const saveData = Helpers.loadFromStorage(`save_${saveName}`);
        if (saveData) {
          saves.push({
            name: saveName,
            data: saveData,
            lastModified: saveData.metadata.lastMoveTime || saveData.metadata.startTime
          });
        }
      }
    }
    
    return saves.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  }

  // Simple event system for UI updates
  emit(eventName, data) {
    if (this.eventListeners && this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach(callback => callback(data));
    }
  }

  on(eventName, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(callback);
  }

  off(eventName, callback) {
    if (this.eventListeners && this.eventListeners[eventName]) {
      const index = this.eventListeners[eventName].indexOf(callback);
      if (index > -1) {
        this.eventListeners[eventName].splice(index, 1);
      }
    }
  }

  toString() {
    return `GameState: ${this.currentPlayer} to move, Status: ${this.status}, Moves: ${this.moveCount}`;
  }
}

window.GameState = GameState;