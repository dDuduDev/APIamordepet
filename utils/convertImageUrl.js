const fs = require('node:fs');

function convertImageUrl(imageUrl) {
  if (imageUrl) {
    return fs.readFileSync(imageUrl.slice(1), { encoding: 'base64' })
  }

  return null
}

module.exports = {
  convertImageUrl
}