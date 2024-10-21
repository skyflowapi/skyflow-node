import { JwtPayload, jwtDecode } from 'jwt-decode';
import { MessageType, printLog } from '..';
import logs from '../logs';

function isValid(token: string) {
    printLog(logs.warnLogs.ISVALID_DEPRECATED, MessageType.WARN)
    return !isExpired(token)
};

function isExpired(token: string) {
    if (token === "") {
        printLog(logs.infoLogs.EMPTY_BEARER_TOKEN, MessageType.LOG);
        return true
    }
    let isJwtExpired = false;
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = (new Date().getTime() / 1000);
    const expiryTime = decoded.exp;
    if (expiryTime && currentTime > expiryTime) {
        printLog(logs.infoLogs.BEARER_TOKEN_EXPIRED, MessageType.LOG);
        isJwtExpired = true;
    }
    return isJwtExpired;
}

function isTokenValid(token: string) {
    if (token === "") return false
    let isJwtExpired = false;
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = (new Date().getTime() / 1000);
    const expiryTime = decoded.exp;
    if (expiryTime && currentTime > expiryTime) {
        isJwtExpired = true;
    }
    return !isJwtExpired;
};

export { isValid, isExpired, isTokenValid };