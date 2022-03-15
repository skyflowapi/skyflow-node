import jwt_decode, { JwtPayload } from 'jwt-decode';
import  logs  from "../logs";
import { MessageType } from "../common";
import { printLog } from "../logsHelper";

function isValid(token: string) {
  printLog(logs.warnLogs.ISVALID_DEPRECATED, MessageType.WARN)
  return !isExpired(token)
};

function isExpired(token: string) {
  if(token === ""){
    printLog(logs.infoLogs.EMPTY_BEARER_TOKEN, MessageType.LOG);
    return true
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
}

export  {isValid,isExpired};
