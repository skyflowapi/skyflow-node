import jwt_decode, { JwtPayload } from 'jwt-decode';
import { MessageType, printLog } from '..';
import logs from '../logs';

function isExpired(token: string) {
    try {
        if (token === "") {
            printLog(logs.infoLogs.EMPTY_BEARER_TOKEN, MessageType.LOG);
            return true;
        }
        let isJwtExpired = false;
        const decoded: JwtPayload = jwt_decode(token);
        const currentTime = (new Date().getTime() / 1000);
        const expiryTime = decoded.exp;
        if (expiryTime && currentTime > expiryTime) {
            printLog(logs.infoLogs.BEARER_TOKEN_EXPIRED, MessageType.LOG);
            isJwtExpired = true;
        }
        return isJwtExpired;
    } catch (err) {
        return true;
    }
}

function isTokenValid(token: string) {
    try {
    if (token === "") return false
    let isJwtExpired = false;
    const decoded: JwtPayload = jwt_decode(token);
    const currentTime = (new Date().getTime() / 1000);
    const expiryTime = decoded.exp;
    if (expiryTime && currentTime > expiryTime) {
        isJwtExpired = true;
    }
    return !isJwtExpired;
    } catch (err) {
        return false;
    }
};

export { isExpired, isTokenValid };