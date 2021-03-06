import { baseUrl } from '@/api/constants';

export function makeUrl(route, params = {}) {
  const url = new URL(`${baseUrl}${route}`);

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });

  return url;
}

export function makeAuthHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function pathNameify(name) {
  const hyphenated = name.replace(/\s/g, '-');
  const pathName = hyphenated.toLowerCase();

  return pathName;
}

export function addPathNames(forums) {
  const withPathNames = [];
  const pathNames = [];

  forums.forEach((forum) => {
    let pathName = pathNameify(forum.name);

    // eslint-disable-next-line no-confusing-arrow
    const numDuplicates = pathNames.reduce((acc, cur) => cur === pathName ? acc + 1 : acc, 0);

    if (numDuplicates > 0) {
      const regex = /-(\d+)$/;

      const suffixes = pathNames
        .filter(pn => pn.startsWith(pathName) && regex.test(pn))
        .map(pn => Number.parseInt(pn.match(regex)[1], 10));

      if (suffixes.length > 0) {
        const newSuffix = Math.max(...suffixes) + 1;

        pathName = `${pathName}-${newSuffix}`;
      } else {
        pathName = `${pathName}-1`;
      }
    }

    withPathNames.push({
      ...forum,
      pathName,
    });
    pathNames.push(pathName);
  });

  return withPathNames;
}

/**
 * Renames keys in an object.
 * @param {Object} obj     The object whose keys will be renamed.
 * @param {Object} renames New-old-name pairs as newKey: oldKey.
 *
 * @returns {Object} The key-renamed object.
 */
export function renameKeys(obj, renames) {
  const copy = { ...obj };

  Object.keys(renames).forEach((newKey) => {
    const oldKey = renames[newKey];
    const valueAtKey = copy[oldKey];
    delete copy[oldKey];
    copy[newKey] = valueAtKey;
  });

  return copy;
}
