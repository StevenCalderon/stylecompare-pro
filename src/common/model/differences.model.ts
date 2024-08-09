export type StylesType = {
  [key: string]: string;
};
export interface IElements {
  html: string;
  styles: StylesType;
  chilren?: IElements[];
}
export interface IStorage {
  elementFirstSelected: IElements | null;
  elementSecondSelected: IElements | null;
  activeExtension: boolean;
}
