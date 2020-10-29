export interface Popup {
  title: string;
  text: string[];
  input: string;
  ok: boolean;
  okFunc(result?: string): string[];
  cancel: boolean;
  cancelFunc?(): any;
  errorMessage?: string[];
}
