import { bridgeOrigin } from 'utils/config';
import { useState, SetStateAction, Dispatch } from 'react';

export const createPrescription = () => {
  window.parent.postMessage({ action: 'createNewPrescription' }, window.origin);
};

export const createNanuqReport = (e: React.ChangeEvent) => {
  window.parent.postMessage({ action: 'createNanuqReport' }, window.origin);
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

export class IFrameBridge {
  private callbacks: Record<string, () => void> = {}

  constructor() {
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (typeof(data) === 'string' && data.split(":")[0] !== 'clinFrontend' ) return;

      if (event.origin !== window.origin)
        return;

      if (data in this.callbacks) {
        this.callbacks[data]()
      }
    }, false);
  }

  setCallback (msgKey: string, fn: () => void) {
    this.callbacks[msgKey] = fn;
  }
}

const bridge = new IFrameBridge();

export function useBridge (msg: string): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [needReload, setNeedReload] = useState(false);
  bridge.setCallback(msg, () => setNeedReload(true))
  return [needReload, setNeedReload];
}