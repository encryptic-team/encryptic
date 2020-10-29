export interface Note {
  id: string;
  new: boolean;
  ciphered: string;
  plaintext: {
    author: string;
    title: string;
    contents: string;
    version: number;
    created: string;
    modified: string;
    notebook: string;
  };
}
