export interface IStatusScreenProps {
  title: string;
  text: string;
  /** When set, a Try again button is shown. */
  onRetry?: () => void;
}
