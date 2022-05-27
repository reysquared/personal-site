export function supportsLocalStorage() {
  const teststr = '__localstorage_test__';
  try {
    localStorage.setItem(teststr, teststr);
    localStorage.removeItem(teststr);
    return true;
  } catch (e) {
    return false;
  }
}