const path = require('path');

module.exports = {
    packagerConfig: {
        asar: true,
        name: 'ares',
        executableName: 'ares',
        overwrite: true,
        icon: path.join(__dirname, 'public/favicon'),
        prune: true
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip'
        }
    ]
};