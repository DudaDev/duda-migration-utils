const { v4: uuidv4 } = require('uuid');

async function getDomainUrl({ zipModifier }) {
  let domainUrl;
  await zipModifier.modifyFiles(/index.html$/, async (content) => {
    const pageUrlRegex = content.match(/<!-- Mirrored from (.*) by HTTrack/);
    if (!pageUrlRegex) {
      return content;
    }
    const pageUrl = pageUrlRegex[1];
    domainUrl = pageUrl.substr(0, pageUrl.indexOf('/'));
    return content;
  });

  return domainUrl;
}

async function addImages({ zipModifier, content, images, baseUrl }) {
  if (!images) {
    return;
  }

  await Promise.all(
    images
      .filter((image) => image !== null)
      .map(async (image) => {
        const imageUrl = baseUrl + image.replace(/\"/g, '');
        if (imageUrl.indexOf('http') < 0) {
          imageUrl = 'http://' + imageUrl;
        }
        const body = await fetch(imageUrl);
        const fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        const fileExtensionRegex = /\.(jpg|png|jpeg|gif)/gi;
        const fileExtension = fileName.match(fileExtensionRegex);
        const uniqueFileName = uuidv4() + fileExtension;

        content = content.replace(image, 'images/' + uniqueFileName);
        return addNewFile(zipModifier, {
          content: body.body,
          path: 'web/images/' + uniqueFileName,
          newTxtFields: { URL: imageUrl }
        });
      })
  );

  return content;
}

async function addNewFile(
  zipModifier,
  { content, path, newTxtFields: { localfile, URL, ...restOfFields } = {} } = {}
) {
  const newTxtModifier = new NewTxtModifier(zipModifier);
  await zipModifier.addFile(path, content, '');
  await newTxtModifier.addRecord(
    {
      localfile: localfile || path,
      URL: URL + uuidv4(),
      ...restOfFields
    },
    ''
  );
}

module.exports = {
  getDomainUrl,
  addImages
};
