import 'vitest-browser-lit';
import {defineAllCustomElements} from '../src/utils/defineCustomElements';
import {beforeEach} from 'vitest';

// Defines all custom elements before all tests run.
defineAllCustomElements();

beforeEach(async () => {
  // Set the browser color scheme to light mode so all screenshots are consistent.
  document.body.style.colorScheme = 'light';
});