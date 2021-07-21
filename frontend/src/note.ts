import * as openpgp from 'openpgp';

export interface Note {
  id: string;
  new: boolean;
  ciphered: string | openpgp.WebStream<string> | openpgp.NodeStream<string>
  plaintext: {
    author: string;
    title: string;
    version: number;
    created: string;
    modified: string;
    contents: string;
    notebook: string;
  };
}
