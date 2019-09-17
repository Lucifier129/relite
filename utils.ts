
/**
 * Get the Object.keys() as keyof inputed object.
 * 
 * @template T The typeof inputed object. 
 * 
 * @param o A value extends object.
 * 
 * @returns Object.keys(o) with type keyof T.
 */
export const getKeys = <T extends {}>(o: T) => Object.keys(o) as Array<keyof T>