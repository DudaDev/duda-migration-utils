# duda-migration-utils

## Setup

```bash
npm install @dudadev/duda-migration-utils
```

## API

## `getDomainUrl`

Usage example:

```js
const { getDomainUrl } = require('@dudadev/duda-migration-utils');

const domainUrl = await getDomainUrl(zipModifier);
```

## `addImages`

Usage example:

```js
const { addImages } = require('@dudadev/duda-migration-utils');

await zipModifier.modifyFiles(/\.html$/, async (content) => {
  const imagesRegex = /https\:\/\/.*?\.(jpg|png|jpeg|gif)/gi;
  const images = content.match(imagesRegex);

  return addImages(zipModifier, {
    content,
    images,
    baseUrl: 'https://my-domain.com'
  });
});
```

## `addNewFile`

Usage example:

```js
const { addNewFile } = require('@dudadev/duda-migration-utils');

const { body: content } = await fetch(imageUrl);
await addNewFile(zipModifier, {
  content,
  path: `images/${fileName}`,
  newTxtFields: { URL: imageUrl }
});
```
