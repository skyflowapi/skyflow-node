import { LogLevel, MessageType, printLog } from './index';

const warned = new Set<string>();

export function warnOnce(message: string, logLevel: LogLevel = LogLevel.WARN): void {
    if (!warned.has(message)) {
        warned.add(message);
        printLog(message, MessageType.WARN, logLevel);
    }
}
