import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
    constructor(options = {}) {
        this.logFile = options.logFile || 'debug.log';
        this.logDir = options.logDir || '.logs';
        this.timestamp = options.timestamp !== false;
        this.console = options.console !== false;
        
        // Ensure log directory exists
        const logPath = path.join(path.resolve(__dirname, '..'), this.logDir);
        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath, { recursive: true });
        }
        
        this.logPath = path.join(logPath, this.logFile);
        
        // Create or clear log file
        fs.writeFileSync(this.logPath, '');
    }

    _getTimestamp() {
        if (!this.timestamp) return '';
        const now = new Date();
        return `[${now.toISOString()}] `;
    }

    _formatMessage(level, message) {
        const timestamp = this._getTimestamp();
        return `${timestamp}[${level}] ${message}\n`;
    }

    _write(level, message) {
        const formattedMessage = this._formatMessage(level, message);
        
        // Write to file
        fs.appendFileSync(this.logPath, formattedMessage);
        
        // Write to stderr if console output is enabled
        if (this.console) {
            process.stderr.write(formattedMessage);
        }
    }

    debug(message) {
        this._write('DEBUG', message);
    }

    info(message) {
        this._write('INFO', message);
    }

    warn(message) {
        this._write('WARN', message);
    }

    error(message) {
        this._write('ERROR', message);
    }

    json(level, data) {
        this._write(level, JSON.stringify(data, null, 2));
    }
}

export default Logger;
