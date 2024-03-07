function filterByKey(obj: Record<any, any>, keys: Array<any>) {
  return Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

function unwrapJson(response: Response): Promise<any> {
  if (!response.ok) {
    throw response.json();
  }
  return response.json();
}

export { filterByKey, unwrapJson };
