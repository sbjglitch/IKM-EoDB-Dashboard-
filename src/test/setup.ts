import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrolling; pages call it on navigation.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
