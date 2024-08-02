export type StylesType = {
  [key: string]: string;
};
export interface IElement {
  html: string;
  styles: StylesType;
}
export interface IStorage {
  elementFirstSelected: IElement | null;
  elementSecondSelected: IElement | null;
  activeExtension: boolean;
}
