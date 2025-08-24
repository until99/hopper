/**
 * Safely converts a value to lowercase string for filtering
 * @param {any} value - The value to convert
 * @returns {string} - Lowercase string or empty string if value is null/undefined
 */
export const safeToLowerCase = (value) => {
  return typeof value === "string" ? value.toLowerCase() : "";
};

/**
 * Safely checks if a string includes a search term (case-insensitive)
 * @param {any} haystack - The string to search in
 * @param {string} needle - The search term
 * @returns {boolean} - Whether the haystack includes the needle
 */
export const safeIncludes = (haystack, needle) => {
  if (typeof haystack !== "string" || typeof needle !== "string") {
    return false;
  }
  return haystack.toLowerCase().includes(needle.toLowerCase());
};

/**
 * Creates a multi-field filter function for arrays
 * @param {string[]} fields - Array of field names to search in
 * @param {string} searchQuery - The search query
 * @returns {Function} - Filter function for array.filter()
 */
export const createMultiFieldFilter = (fields, searchQuery) => {
  const query = searchQuery.toLowerCase().trim();

  return (item) => {
    if (!query) return true;

    return fields.some((field) => {
      const value = item[field];
      return safeIncludes(value, query);
    });
  };
};
