import jwtDecode from 'jwt-decode';

export function isTokenValid(token) {
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    }
    catch (e) {
      console.log('Cannot find a valid skyflow jwt, creating new one')
      return false;
    }
    return !(decodedToken.exp * 1000 < Date.now());
  }

