import { BaseDetokenizeRequest } from 'skyflow-common';
import { TokenGroupRedactions } from '../../../types';

/** Request to detokenize a list of tokens. */
class DetokenizeRequest extends BaseDetokenizeRequest {
  private _tokens: string[];
  private _tokenGroupRedactions?: TokenGroupRedactions[];

  constructor(tokens: string[], tokenGroupRedactions?: TokenGroupRedactions[]) {
    super();
    this._tokens = tokens;
    this._tokenGroupRedactions = tokenGroupRedactions;
  }

  public get tokens(): string[] {
    return this._tokens;
  }

  public set tokens(value: string[]) {
    this._tokens = value;
  }

  public get tokenGroupRedactions(): TokenGroupRedactions[] | undefined {
    return this._tokenGroupRedactions;
  }

  public set tokenGroupRedactions(value: TokenGroupRedactions[] | undefined) {
    this._tokenGroupRedactions = value;
  }
}

export default DetokenizeRequest;
