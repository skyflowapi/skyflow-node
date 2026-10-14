import { BaseDetokenizeRequest } from 'skyflow-common';
import { TokenGroupRedaction } from '../../../types';

/** Request to detokenize a list of tokens. */
class DetokenizeRequest extends BaseDetokenizeRequest {
  private _tokens: string[];
  private _tokenGroupRedactions?: TokenGroupRedaction[];

  constructor(tokens: string[], tokenGroupRedactions?: TokenGroupRedaction[]) {
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

  public get tokenGroupRedactions(): TokenGroupRedaction[] | undefined {
    return this._tokenGroupRedactions;
  }

  public set tokenGroupRedactions(value: TokenGroupRedaction[] | undefined) {
    this._tokenGroupRedactions = value;
  }
}

export default DetokenizeRequest;
