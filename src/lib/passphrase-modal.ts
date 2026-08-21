type Resolver = (value: string | null) => void;

let requestOpen: ((resolve: Resolver) => void) | null = null;

export function registerPassphraseModal(fn: (resolve: Resolver) => void) {
  requestOpen = fn;
}

export function askForPassphrase(): Promise<string | null> {
  return new Promise((resolve) => {
    if (requestOpen) {
      requestOpen(resolve);
    } else {
      resolve(window.prompt("This site is passphrase-protected. Enter it:"));
    }
  });
}
