type NestedObject = Record<string, unknown>;

export function flattenObject(obj: NestedObject, parentKey = ''): NestedObject {
  return Object.keys(obj).reduce<NestedObject>((acc, key) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively flatten nested objects
      const nestedResult = flattenObject(obj[key] as NestedObject, newKey);
      return { ...acc, ...nestedResult };
    }

    return { ...acc, [newKey]: obj[key] };
  }, {});
}
