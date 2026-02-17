/**
 * Math.random() mock for consistent snapshot testing
 *
 * This mock ensures Math.random() returns predictable values across test runs.
 * Without this, components that generate random IDs (e.g., superdesk-ui-framework's
 * Tooltip component generates "uif-tooltip-{random}") would produce different snapshots
 * on every test run, causing snapshot tests to fail.
 *
 * The mock generates sequential values (0.1, 0.2, 0.3, etc.) instead of random ones,
 * making tooltip IDs stable: "uif-tooltip-1", "uif-tooltip-2", etc.
 */

let mockRandomValue = 0;

beforeEach(() => {
  mockRandomValue = 0;
  jest.spyOn(Math, 'random').mockImplementation(() => {
    mockRandomValue += 0.1;
    return mockRandomValue % 1;
  });
});

afterEach(() => {
  Math.random.mockRestore();
});
