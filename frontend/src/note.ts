export interface Note {
  id: string;
  new: boolean;
  ciphered: string;
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
