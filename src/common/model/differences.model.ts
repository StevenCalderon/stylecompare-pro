export interface ICardDifferences {
  title: string;
  element: HTMLElement;
  differences: {
    [key: string]: { style1: string };
  };
}
