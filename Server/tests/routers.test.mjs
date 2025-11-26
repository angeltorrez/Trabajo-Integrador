import { strict as assert } from 'assert';
import test from 'node:test';

import authRouter, { verifyToken } from '../routes/auth.js';
import todosRouter from '../routes/todos.js';
import { asyncHandler } from '../utils.js';

test('routers should be defined and exports exist', () => {
  assert.ok(authRouter, 'authRouter should be defined');
  assert.ok(todosRouter, 'todosRouter should be defined');
  assert.equal(typeof asyncHandler, 'function', 'asyncHandler should be a function');
  assert.equal(typeof verifyToken, 'function', 'verifyToken should be a function');
});
