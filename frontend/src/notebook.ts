export interface Notebook {
  id: string;
  new: boolean;
  ciphered: string;
  plaintext: {
    title: string;
    version: number;
    notes: [];
    created: string;
    modified: string;
    comment: string;
    author: string;
  }
}
