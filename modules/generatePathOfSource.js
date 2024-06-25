const { model } = require("mongoose");

function generateNewUrlPath(originalUrl) {
    const segments = originalUrl.split('/');
    const relevantSegments = segments.slice(2);
    const newPath = relevantSegments.join('/');
    return `/${newPath}`;
}

module.exports = generateNewUrlPath;