// src/routes/_errors.ts
var BadRequest = class extends Error {
};
var Conflict = class extends Error {
};
var NotFound = class extends Error {
};

export {
  BadRequest,
  Conflict,
  NotFound
};
