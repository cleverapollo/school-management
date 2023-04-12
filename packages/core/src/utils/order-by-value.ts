export function orderByValue<T = unknown>(
  data: Array<T>,
  getValueKey: (value: T) => string,
  orderObject: { [key: string]: number }
): Array<T> {
  return data.sort((a, b) => {
    const aValue = getValueKey(a);
    const bValue = getValueKey(b);
    const aOrder = orderObject[aValue];
    const bOrder = orderObject[bValue];
    if (aOrder === undefined || bOrder === undefined) {
      return 0;
    }
    return aOrder - bOrder;
  });
}
