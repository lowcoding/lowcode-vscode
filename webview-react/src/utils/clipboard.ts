export function getClipboardImage() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    try {
      const clipboardContents = await navigator.clipboard.read();
      // eslint-disable-next-line no-restricted-syntax
      for (const item of clipboardContents) {
        if (!item.types.includes('image/png')) {
          resolve('');
          return;
        }
        // eslint-disable-next-line no-await-in-loop
        const blob = await item.getType('image/png');
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const base64data = reader.result;
          resolve(base64data as string);
        };
      }
    } catch (err) {
      console.log(err);
      resolve('');
    }
  });
}
