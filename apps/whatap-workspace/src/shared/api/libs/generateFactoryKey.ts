const existingKeys = new Set<string>();

function generateFactoryKey<T extends string>(key: T): T {
  if (process.env.NODE_ENV === 'production') {
    return key;
  }
  if (existingKeys.has(key)) {
    throw new Error(`Duplicate query factory key found: ${key}`);
  }
  existingKeys.add(key);
  return key;
}

export default generateFactoryKey;
