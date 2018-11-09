function isNotNullOrUndefined(obj) {
  return (obj !== undefined && obj !== null);
}

function basicToString(obj) {
  return isNotNullOrUndefined(obj) ? `${obj}` : '';
}

export const DefaultRules = {

  'string': (data) => basicToString(data),

};
