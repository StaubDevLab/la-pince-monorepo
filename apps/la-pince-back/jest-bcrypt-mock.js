/**
 * Mock file for the 'bcrypt' module.
 *
 * This prevents Jest from failing due to issues resolving the native C++ bindings
 * when running tests, especially in containerized environments.
 */
module.exports = {
  // Mock the primary asynchronous functions used for hashing and comparing passwords
  hash: jest.fn().mockImplementation((data, salt) => Promise.resolve(`mocked_hash_of_${data}`)),
  compare: jest.fn().mockImplementation((data, hash) => Promise.resolve(data === 'valid_password')),
  genSalt: jest.fn().mockResolvedValue('mockedSalt'),
  // Mock the primary synchronous functions (if used)
  hashSync: jest.fn().mockImplementation((data, salt) => `mocked_hash_of_${data}_sync`),
  compareSync: jest.fn().mockImplementation((data, hash) => data === 'valid_password'),
};
