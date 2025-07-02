const { sum } = require('../utils'); // Adjust the path as necessary

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});