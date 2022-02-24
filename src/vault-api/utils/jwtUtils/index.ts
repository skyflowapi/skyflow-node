import jwt_decode, { JwtPayload } from 'jwt-decode';

function isValid(token: string) {
  if(token === "") return false
  let isJwtExpired = false;
  const decoded: JwtPayload = jwt_decode(token);
  const currentTime = (new Date().getTime() / 1000) - 300;
  const expiryTime = decoded.exp;

  if (expiryTime && currentTime > expiryTime) {
    isJwtExpired = true;
  }
  return !isJwtExpired;
};

export default isValid;
