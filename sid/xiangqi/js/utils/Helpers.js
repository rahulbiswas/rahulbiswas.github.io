class Helpers {
  static isWithinBounds(row, col) {
    return row >= 0 && row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS && 
           col >= 0 && col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS;
  }

  static isInPalace(row, col, color) {
    const palace = XIANGQI_CONSTANTS.PALACE_BOUNDS[color.toUpperCase()];
    return row >= palace.minRow && row <= palace.maxRow && 
           col >= palace.minCol && col <= palace.maxCol;
  }

  static hasRiverBetween(fromRow, toRow) {
    return (fromRow <= 4 && toRow >= 5) || (fromRow >= 5 && toRow <= 4);
  }

  static isOnOwnSide(row, color) {
    if (color === XIANGQI_CONSTANTS.COLORS.RED) {
      return row >= 5;
    } else {
      return row <= 4;
    }
  }

  static getOpponentColor(color) {
    return color === XIANGQI_CONSTANTS.COLORS.RED ? 
           XIANGQI_CONSTANTS.COLORS.BLACK : 
           XIANGQI_CONSTANTS.COLORS.RED;
  }

  static getPieceChar(type, color) {
    const pieceInfo = XIANGQI_CONSTANTS.PIECE_TYPES[color.toUpperCase()];
    for (const [key, value] of Object.entries(pieceInfo)) {
      if (value.type === type) {
        return value.char;
      }
    }
    return '';
  }

  static getPieceValue(type, color) {
    const pieceInfo = XIANGQI_CONSTANTS.PIECE_TYPES[color.toUpperCase()];
    for (const [key, value] of Object.entries(pieceInfo)) {
      if (value.type === type) {
        return value.value;
      }
    }
    return 0;
  }

  static formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static coordsToNotation(row, col) {
    const fileNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return fileNames[col] + (10 - row).toString();
  }

  static notationToCoords(notation) {
    const fileNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const file = fileNames.indexOf(notation[0]);
    const rank = 10 - parseInt(notation[1]);
    return [rank, file];
  }

  static getMoveNotation(piece, fromRow, fromCol, toRow, toCol, isCapture = false) {
    const pieceChar = this.getPieceChar(piece.type, piece.color);
    const fromFile = (9 - fromCol).toString();
    const toFile = (9 - toCol).toString();
    
    let direction;
    if (toRow < fromRow) {
      direction = piece.color === 'red' ? '进' : '退';
    } else if (toRow > fromRow) {
      direction = piece.color === 'red' ? '退' : '进';
    } else {
      direction = '平';
    }
    
    return `${pieceChar}${fromFile}${direction}${direction === '平' ? toFile : Math.abs(toRow - fromRow)}`;
  }

  static playSound(soundType) {
    if (window.GAME_SETTINGS && window.GAME_SETTINGS.soundEnabled) {
      const audio = new Audio(XIANGQI_CONSTANTS.SOUNDS[soundType]);
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play sound:', e));
    }
  }

  static showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#28a745'};
      color: white;
      border-radius: 5px;
      z-index: 1001;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static saveToStorage(key, data) {
    try {
      localStorage.setItem(`xiangqi_${key}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save to storage:', e);
      return false;
    }
  }

  static loadFromStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`xiangqi_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Failed to load from storage:', e);
      return defaultValue;
    }
  }

  static clearStorage(key = null) {
    if (key) {
      localStorage.removeItem(`xiangqi_${key}`);
    } else {
      // Clear all xiangqi related storage
      const keys = Object.keys(localStorage).filter(k => k.startsWith('xiangqi_'));
      keys.forEach(k => localStorage.removeItem(k));
    }
  }

  static isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static addEventListeners(element, events, handler) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, handler);
    });
  }

  static removeEventListeners(element, events, handler) {
    events.split(' ').forEach(event => {
      element.removeEventListener(event, handler);
    });
  }
}

window.Helpers = Helpers;