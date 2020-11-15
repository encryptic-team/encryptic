export interface Notebook {
  id: string;
  new: boolean;
  ciphered: string;
  plaintext: {
    author: string;
    title: string;
    version: number;
    created: string;
    modified: string;
    notes: [];
    comment: string;
  }
}
