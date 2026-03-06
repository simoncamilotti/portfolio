export type WindowConfig = {
  captcha: {
    siteKey: string;
  };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    grecaptcha: {
      ready(cb: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
      render(container: string | HTMLElement, parameters: object): number;
    };
    config: WindowConfig;
  }
}
