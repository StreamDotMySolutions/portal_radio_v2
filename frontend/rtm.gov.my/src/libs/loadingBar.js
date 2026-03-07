const listeners = new Set();
let requestCount = 0;

const notify = () => {
    const isActive = requestCount > 0;
    listeners.forEach(listener => listener(isActive));
};

export const subscribeLoadingBar = (listener) => {
    listeners.add(listener);
    listener(requestCount > 0);
    return () => listeners.delete(listener);
};

export const startLoading = () => {
    requestCount += 1;
    notify();
};

export const stopLoading = () => {
    requestCount = Math.max(0, requestCount - 1);
    notify();
};
