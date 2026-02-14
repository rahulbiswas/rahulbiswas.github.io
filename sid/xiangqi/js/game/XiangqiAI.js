class XiangqiAI {
  constructor(difficulty = 'medium', color = 'black') {
    this.difficulty = difficulty;
    this.color = color;
    this.opponentColor = color === 'red' ? 'black' : 'red';
    
    // Difficulty settings
    this.difficulties = {
      easy: {
        depth: 2,
        randomness: 0.3,
        useOpeningBook: false,
        considerTactics: false
      },
      medium: {
        depth: 3,
        randomness: 0.15,
        useOpeningBook: true,
        considerTactics: true
      },
      hard: {
        depth: 4,
        randomness: 0.05,
        useOpeningBook: true,
        considerTactics: true
      },
      expert: {
        depth: 5,
        randomness: 0.02,
        useOpeningBook: true,
        considerTactics: true
      }
    };
    
    this.settings = this.difficulties[difficulty];
    this.transpositionTable = new Map();
    this.killerMoves = [];
    
    // Opening book - common opening moves
    this.openingBook = {
      // Starting positions for different openings
      '': [ // First move options for red
        { from: [9, 4], to: [8, 4] }, // General forward
        { from: [7, 1], to: [7, 2] }, // Cannon forward
        { from: [6, 0], to: [5, 0] }, // Soldier forward
        { from: [6, 2], to: [5, 2] }  // Soldier forward
      ],
      // Responses to common openings
      'cannonCenter': [
        { from: [0, 4], to: [1, 4] }, // General response
        { from: [2, 1], to: [2, 2] }  // Cannon response
      ]
    };
    
    // Piece position tables for evaluation
    this.positionTables = this.initializePositionTables();
  }

  initializePositionTables() {
    // Position value tables for each piece type
    // Higher values for better positions
    return {
      soldier: {
        red: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [10, 20, 10, 20, 30, 20, 10, 20, 10],
          [5, 10, 15, 10, 20, 10, 15, 10, 5],
          [0, 0, 10, 0, 15, 0, 10, 0, 0],
          [0, 0, 0, 0, 10, 0, 0, 0, 0],
          [0, 0, 0, 0, 5, 0, 0, 0, 0]
        ],
        black: [
          [0, 0, 0, 0, 5, 0, 0, 0, 0],
          [0, 0, 0, 0, 10, 0, 0, 0, 0],
          [0, 0, 10, 0, 15, 0, 10, 0, 0],
          [5, 10, 15, 10, 20, 10, 15, 10, 5],
          [10, 20, 10, 20, 30, 20, 10, 20, 10],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
      },
      cannon: {
        red: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 20, 0, 0, 0, 0, 0, 20, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 10, 15, 10, 15, 10, 0, 0],
          [0, 0, 10, 15, 10, 15, 10, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 15, 0, 0, 0, 0, 0, 15, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        black: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 15, 0, 0, 0, 0, 0, 15, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 10, 15, 10, 15, 10, 0, 0],
          [0, 0, 10, 15, 10, 15, 10, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 20, 0, 0, 0, 0, 0, 20, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
      },
      chariot: {
        red: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 10, 10, 10, 10, 10, 0, 0],
          [10, 10, 20, 20, 20, 20, 20, 10, 10],
          [10, 10, 20, 20, 20, 20, 20, 10, 10],
          [15, 15, 25, 25, 25, 25, 25, 15, 15],
          [15, 15, 25, 25, 25, 25, 25, 15, 15],
          [20, 20, 30, 30, 30, 30, 30, 20, 20]
        ],
        black: [
          [20, 20, 30, 30, 30, 30, 30, 20, 20],
          [15, 15, 25, 25, 25, 25, 25, 15, 15],
          [15, 15, 25, 25, 25, 25, 25, 15, 15],
          [10, 10, 20, 20, 20, 20, 20, 10, 10],
          [10, 10, 20, 20, 20, 20, 20, 10, 10],
          [0, 0, 10, 10, 10, 10, 10, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
      }
    };
  }

  async getBestMove(game) {
    console.log(`AI (${this.difficulty}) thinking...`);
    
    // Check opening book first
    if (this.settings.useOpeningBook && game.gameState.moveCount < 6) {
      const bookMove = this.getOpeningMove(game);
      if (bookMove) {
        console.log('AI using opening book move');
        return bookMove;
      }
    }
    
    // Clear transposition table periodically
    if (this.transpositionTable.size > 10000) {
      this.transpositionTable.clear();
    }
    
    // Use minimax with alpha-beta pruning
    const startTime = Date.now();
    const result = this.minimax(
      game, 
      this.settings.depth, 
      -Infinity, 
      Infinity, 
      true, // maximizing for AI
      0
    );
    
    const thinkingTime = Date.now() - startTime;
    console.log(`AI found move in ${thinkingTime}ms, evaluation: ${result.score}`);
    
    // Add some randomness for easier difficulties
    if (this.settings.randomness > 0) {
      const allMoves = this.getAllPossibleMoves(game, this.color);
      if (allMoves.length > 1 && Math.random() < this.settings.randomness) {
        console.log('AI making random move for variety');
        return allMoves[Math.floor(Math.random() * allMoves.length)];
      }
    }
    
    return result.move;
  }

  getOpeningMove(game) {
    // Simple opening book implementation
    const moves = game.gameState.moveHistory;
    
    if (moves.length === 0 && this.color === 'red') {
      // First move for red
      const openingMoves = this.openingBook[''];
      return openingMoves[Math.floor(Math.random() * openingMoves.length)];
    }
    
    if (moves.length === 1 && this.color === 'black') {
      // Response to red's first move
      const lastMove = moves[0];
      if (lastMove.piece.type === 'cannon') {
        const responses = this.openingBook['cannonCenter'];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    return null;
  }

  minimax(game, depth, alpha, beta, maximizingPlayer, ply) {
    // Base case
    if (depth === 0 || this.isGameOver(game)) {
      const score = this.evaluatePosition(game);
      return { score: maximizingPlayer ? score : -score, move: null };
    }
    
    const currentColor = maximizingPlayer ? this.color : this.opponentColor;
    const moves = this.getAllPossibleMoves(game, currentColor);
    
    if (moves.length === 0) {
      // No legal moves available
      const score = maximizingPlayer ? -9999 : 9999;
      return { score, move: null };
    }
    
    // Order moves for better pruning
    this.orderMoves(moves, game);
    
    let bestMove = null;
    let bestScore = maximizingPlayer ? -Infinity : Infinity;
    
    for (const move of moves) {
      // Make the move
      const gameClone = this.cloneGame(game);
      const moveResult = gameClone.makeMove(move.from, move.to);
      
      if (!moveResult.success) continue;
      
      // Recursive call
      const result = this.minimax(
        gameClone, 
        depth - 1, 
        alpha, 
        beta, 
        !maximizingPlayer, 
        ply + 1
      );
      
      if (maximizingPlayer) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }
    
    return { score: bestScore, move: bestMove };
  }

  getAllPossibleMoves(game, color) {
    const moves = [];
    const pieces = game.board.findAllPieces(color);
    
    for (const piece of pieces) {
      const validMoves = game.validator.getValidMoves(piece.position, color);
      for (const move of validMoves) {
        moves.push({
          from: piece.position,
          to: move,
          piece: piece
        });
      }
    }
    
    return moves;
  }

  orderMoves(moves, game) {
    // Order moves for better alpha-beta pruning
    // Captures first, then other moves
    moves.sort((a, b) => {
      const aCapture = game.board.getPiece(a.to[0], a.to[1]);
      const bCapture = game.board.getPiece(b.to[0], b.to[1]);
      
      if (aCapture && !bCapture) return -1;
      if (bCapture && !aCapture) return 1;
      
      if (aCapture && bCapture) {
        return bCapture.getValue() - aCapture.getValue();
      }
      
      return 0;
    });
  }

  evaluatePosition(game) {
    let score = 0;
    
    // Material evaluation
    score += this.evaluateMaterial(game);
    
    // Position evaluation
    score += this.evaluatePositions(game);
    
    // Tactical evaluation
    if (this.settings.considerTactics) {
      score += this.evaluateTactics(game);
    }
    
    // Game state evaluation
    score += this.evaluateGameState(game);
    
    return this.color === 'red' ? score : -score;
  }

  evaluateMaterial(game) {
    let redMaterial = 0;
    let blackMaterial = 0;
    
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = game.board.getPiece(row, col);
        if (piece) {
          const value = piece.getValue();
          if (piece.color === 'red') {
            redMaterial += value;
          } else {
            blackMaterial += value;
          }
        }
      }
    }
    
    return redMaterial - blackMaterial;
  }

  evaluatePositions(game) {
    let score = 0;
    
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = game.board.getPiece(row, col);
        if (piece) {
          const positionValue = this.getPositionValue(piece, row, col);
          if (piece.color === 'red') {
            score += positionValue;
          } else {
            score -= positionValue;
          }
        }
      }
    }
    
    return score;
  }

  getPositionValue(piece, row, col) {
    const table = this.positionTables[piece.type];
    if (table && table[piece.color]) {
      return table[piece.color][row][col] || 0;
    }
    return 0;
  }

  evaluateTactics(game) {
    let score = 0;
    
    // Check for pins, forks, skewers, etc.
    score += this.evaluateThreats(game, 'red');
    score -= this.evaluateThreats(game, 'black');
    
    // Evaluate piece mobility
    score += this.evaluateMobility(game, 'red');
    score -= this.evaluateMobility(game, 'black');
    
    return score;
  }

  evaluateThreats(game, color) {
    let threats = 0;
    const pieces = game.board.findAllPieces(color);
    const opponentColor = color === 'red' ? 'black' : 'red';
    
    for (const piece of pieces) {
      const moves = piece.getValidMoves(game.board);
      for (const move of moves) {
        const targetPiece = game.board.getPiece(move[0], move[1]);
        if (targetPiece && targetPiece.color === opponentColor) {
          threats += Math.min(targetPiece.getValue() / 10, 50);
        }
      }
    }
    
    return threats;
  }

  evaluateMobility(game, color) {
    const pieces = game.board.findAllPieces(color);
    let mobility = 0;
    
    for (const piece of pieces) {
      const validMoves = game.validator.getValidMoves(piece.position, color);
      mobility += validMoves.length;
    }
    
    return mobility;
  }

  evaluateGameState(game) {
    let score = 0;
    
    // Bonus for check
    if (game.board.isInCheck('red')) {
      score -= 50;
    }
    if (game.board.isInCheck('black')) {
      score += 50;
    }
    
    // Massive bonus/penalty for checkmate
    if (game.validator.isCheckmate('red')) {
      score -= 10000;
    }
    if (game.validator.isCheckmate('black')) {
      score += 10000;
    }
    
    return score;
  }

  isGameOver(game) {
    const status = game.getGameStatus();
    return status === XIANGQI_CONSTANTS.GAME_STATUS.CHECKMATE ||
           status === XIANGQI_CONSTANTS.GAME_STATUS.STALEMATE ||
           status === XIANGQI_CONSTANTS.GAME_STATUS.DRAW ||
           status === XIANGQI_CONSTANTS.GAME_STATUS.RESIGNED;
  }

  cloneGame(game) {
    // Create a deep clone of the game for move testing
    const clonedGame = new XiangqiGame();
    clonedGame.board.setBoardState(game.board.getBoardState());
    clonedGame.gameState = game.gameState.clone();
    clonedGame.validator = new MoveValidator(clonedGame.board);
    return clonedGame;
  }

  setDifficulty(difficulty) {
    if (this.difficulties[difficulty]) {
      this.difficulty = difficulty;
      this.settings = this.difficulties[difficulty];
      console.log(`AI difficulty set to: ${difficulty}`);
    }
  }

  getDifficulty() {
    return this.difficulty;
  }

  getAvailableDifficulties() {
    return Object.keys(this.difficulties);
  }

  // Method to make the AI think for a visible amount of time
  async makeMove(game) {
    const move = await this.getBestMove(game);
    
    // Add artificial thinking time for realism
    const thinkingTime = {
      easy: 500,
      medium: 1000,
      hard: 1500,
      expert: 2000
    }[this.difficulty];
    
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    
    return move;
  }
}

window.XiangqiAI = XiangqiAI;