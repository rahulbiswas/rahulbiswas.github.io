class XiangqiGame {
  constructor() {
    this.board = new Board();
    this.gameState = new GameState();
    this.validator = new MoveValidator(this.board);
    
    // Initialize event listeners
    this.eventListeners = {};
    
    // Setup initial check state
    this.updateCheckState();
    
    // Start timer if enabled
    if (this.gameState.gameSettings.timer.enabled) {
      this.gameState.startTimer();
    }
  }

  makeMove(from, to) {
    // Validate the move
    if (!this.validator.isValidMove(from, to, this.gameState.currentPlayer)) {
      return {
        success: false,
        error: "Invalid move",
        gameState: this.gameState.serialize()
      };
    }

    // Check if game is still active
    if (this.gameState.status !== XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE && 
        this.gameState.status !== XIANGQI_CONSTANTS.GAME_STATUS.CHECK) {
      return {
        success: false,
        error: "Game is not active",
        gameState: this.gameState.serialize()
      };
    }

    // Execute the move
    const moveData = this.board.movePiece(from, to);
    if (!moveData) {
      return {
        success: false,
        error: "Failed to execute move",
        gameState: this.gameState.serialize()
      };
    }

    // Add move to game state
    const move = this.gameState.addMove(moveData);

    // Play sound effect
    if (moveData.capturedPiece) {
      Helpers.playSound('CAPTURE');
    } else {
      Helpers.playSound('MOVE');
    }

    // Switch player
    this.gameState.switchPlayer();

    // Update check state and game status
    this.updateCheckState();
    this.checkGameEnd();

    // Emit move event
    this.emit('moveMade', {
      move: move,
      moveData: moveData,
      gameState: this.gameState.serialize()
    });

    return {
      success: true,
      move: move,
      moveData: moveData,
      gameState: this.gameState.serialize()
    };
  }

  undoMove() {
    if (!this.gameState.gameSettings.allowUndo || 
        this.gameState.moveHistory.length === 0) {
      return {
        success: false,
        error: "Undo not available",
        gameState: this.gameState.serialize()
      };
    }

    const lastMove = this.gameState.undoLastMove();
    if (!lastMove) {
      return {
        success: false,
        error: "No moves to undo",
        gameState: this.gameState.serialize()
      };
    }

    // Reconstruct the board state by replaying all moves except the last one
    this.reconstructBoardState();

    // Update check state and game status
    this.updateCheckState();
    
    // If game was ended, set it back to active
    if (this.gameState.status !== XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE &&
        this.gameState.status !== XIANGQI_CONSTANTS.GAME_STATUS.CHECK) {
      this.gameState.setStatus(XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE);
    }

    this.emit('moveUndone', {
      undoneMov: lastMove,
      gameState: this.gameState.serialize()
    });

    return {
      success: true,
      undonMove: lastMove,
      gameState: this.gameState.serialize()
    };
  }

  reconstructBoardState() {
    // Reset board to initial position
    this.board.reset();
    
    // Replay all moves in history
    for (const move of this.gameState.moveHistory) {
      this.board.movePiece(move.from, move.to);
    }
  }

  resign(player = null) {
    const resigningPlayer = player || this.gameState.currentPlayer;
    const winner = Helpers.getOpponentColor(resigningPlayer);
    
    this.gameState.setStatus(
      XIANGQI_CONSTANTS.GAME_STATUS.RESIGNED,
      winner,
      `${resigningPlayer} resigned`
    );

    Helpers.playSound('GAME_END');

    this.emit('gameEnded', {
      result: 'resignation',
      winner: winner,
      gameState: this.gameState.serialize()
    });

    return {
      success: true,
      result: 'resignation',
      winner: winner,
      gameState: this.gameState.serialize()
    };
  }

  offerDraw() {
    this.emit('drawOffered', {
      player: this.gameState.currentPlayer
    });
  }

  acceptDraw() {
    this.gameState.setStatus(
      XIANGQI_CONSTANTS.GAME_STATUS.DRAW,
      null,
      'Draw by agreement'
    );

    this.emit('gameEnded', {
      result: 'draw',
      winner: null,
      gameState: this.gameState.serialize()
    });
  }

  updateCheckState() {
    const currentPlayerInCheck = this.board.isInCheck(this.gameState.currentPlayer);
    
    if (currentPlayerInCheck) {
      const checkingPieces = this.validator.findCheckingPieces(this.gameState.currentPlayer);
      this.gameState.updateCheckState(true, checkingPieces);
      Helpers.playSound('CHECK');
    } else {
      this.gameState.updateCheckState(false, []);
    }
  }

  checkGameEnd() {
    const currentPlayer = this.gameState.currentPlayer;
    
    if (this.validator.isCheckmate(currentPlayer)) {
      const winner = Helpers.getOpponentColor(currentPlayer);
      this.gameState.setStatus(
        XIANGQI_CONSTANTS.GAME_STATUS.CHECKMATE,
        winner,
        'Checkmate'
      );
      
      Helpers.playSound('GAME_END');
      
      this.emit('gameEnded', {
        result: 'checkmate',
        winner: winner,
        gameState: this.gameState.serialize()
      });
    } else if (this.validator.isStalemate(currentPlayer)) {
      this.gameState.setStatus(
        XIANGQI_CONSTANTS.GAME_STATUS.STALEMATE,
        null,
        'Stalemate'
      );
      
      this.emit('gameEnded', {
        result: 'stalemate',
        winner: null,
        gameState: this.gameState.serialize()
      });
    }
  }

  getValidMoves(from) {
    return this.validator.getValidMoves(from, this.gameState.currentPlayer);
  }

  isValidMove(from, to) {
    return this.validator.isValidMove(from, to, this.gameState.currentPlayer);
  }

  getCurrentPlayer() {
    return this.gameState.currentPlayer;
  }

  getGameStatus() {
    return this.gameState.status;
  }

  getMoveHistory() {
    return this.gameState.moveHistory;
  }

  getBoardState() {
    return this.board.getBoardState();
  }

  getGameState() {
    return this.gameState.serialize();
  }

  newGame() {
    this.board.reset();
    this.gameState.reset();
    this.validator = new MoveValidator(this.board);
    
    this.updateCheckState();
    
    if (this.gameState.gameSettings.timer.enabled) {
      this.gameState.startTimer();
    }

    this.emit('gameStarted', {
      gameState: this.gameState.serialize()
    });

    return {
      success: true,
      gameState: this.gameState.serialize()
    };
  }

  saveGame(name = null) {
    return this.gameState.save(name);
  }

  loadGame(saveName) {
    const loadedState = GameState.load(saveName);
    if (loadedState) {
      this.gameState = loadedState;
      this.reconstructBoardState();
      this.validator = new MoveValidator(this.board);
      this.updateCheckState();

      this.emit('gameLoaded', {
        gameState: this.gameState.serialize()
      });

      return {
        success: true,
        gameState: this.gameState.serialize()
      };
    }

    return {
      success: false,
      error: "Failed to load game"
    };
  }

  getAllSaves() {
    return GameState.getAllSaves();
  }

  updateSettings(settings) {
    Object.assign(this.gameState.gameSettings, settings);
    
    // Apply timer settings
    if (settings.timer) {
      if (settings.timer.enabled && !this.gameState.timers.activeTimer) {
        this.gameState.startTimer();
      } else if (!settings.timer.enabled && this.gameState.timers.activeTimer) {
        this.gameState.stopTimer();
      }
    }

    // Save settings to localStorage
    Helpers.saveToStorage('settings', this.gameState.gameSettings);

    this.emit('settingsUpdated', {
      settings: this.gameState.gameSettings
    });
  }

  loadSettings() {
    const savedSettings = Helpers.loadFromStorage('settings');
    if (savedSettings) {
      this.updateSettings(savedSettings);
    }
  }

  getSettings() {
    return this.gameState.gameSettings;
  }

  // Event system methods
  on(eventName, callback) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(callback);
  }

  off(eventName, callback) {
    if (this.eventListeners[eventName]) {
      const index = this.eventListeners[eventName].indexOf(callback);
      if (index > -1) {
        this.eventListeners[eventName].splice(index, 1);
      }
    }
  }

  emit(eventName, data) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach(callback => callback(data));
    }
  }

  // Utility methods
  getPiece(row, col) {
    return this.board.getPiece(row, col);
  }

  isInCheck(color = null) {
    const player = color || this.gameState.currentPlayer;
    return this.board.isInCheck(player);
  }

  getCheckingPieces(color = null) {
    const player = color || this.gameState.currentPlayer;
    return this.validator.findCheckingPieces(player);
  }

  evaluatePosition() {
    // Simple position evaluation for AI purposes
    let redScore = 0;
    let blackScore = 0;

    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.board.getPiece(row, col);
        if (piece) {
          if (piece.color === XIANGQI_CONSTANTS.COLORS.RED) {
            redScore += piece.getValue();
          } else {
            blackScore += piece.getValue();
          }
        }
      }
    }

    return redScore - blackScore; // Positive favors red, negative favors black
  }

  toString() {
    return `XiangqiGame - ${this.gameState.currentPlayer} to move - ${this.gameState.status}`;
  }
}

window.XiangqiGame = XiangqiGame;