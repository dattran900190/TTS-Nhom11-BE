export const pickFields = (source, allowedFields) => {
  const result = {};
  allowedFields.forEach((field) => {
    if (source.hasOwnProperty(field)) {
      result[field] = source[field];
    }
  });
  return result;
};
