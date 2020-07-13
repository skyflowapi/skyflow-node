import axios from 'axios';
import https from 'https';
import jwtDecode from 'jwt-decode';
import { isConstructorDeclaration } from 'typescript';



export function isTokenValid(token) {
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    }
    catch (e) {
      console.log(e)
      return false;
    }
    return !(decodedToken.exp * 1000 < Date.now());
  }

