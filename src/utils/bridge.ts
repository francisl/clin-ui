import { bridgeOrigin } from 'utils/config';

export const createPrescription = () => {
  window.postMessage({ action: 'createNewPrescription' }, window.origin);
};

export const createNanuqReport = (e: React.ChangeEvent) => {
  window.postMessage({ action: 'createNanuqReport' }, window.origin);
};

export const redirectParent = (path: string) => {
  /* eslint no-restricted-globals: ["off"] */
  if (top && top.window) {
    // iframe support
    top.window.location.href = `${bridgeOrigin}${path}`;
  } else {
    window.location.href = `${path}`;
  }
};
