Start Mutli Scale GUI
======

This utility is a graphical front-end intended to help create, manage, and submit input templates to the Start Mutli Scale helper utility developed by [Emergent Art](https://emergentartwork.com/). This application is built using Electron and can be run on any of its supported platforms.

## Development

To get started developing, the following two dependencies are required:

* [Node.js](https://nodejs.org/en/) (recommend latest LTS version)
* [Python 3](https://www.python.org/downloads/) (recommend 3.7 or higher)

Once downloading all of the above and cloning this repository, navigate to the root directory from a terminal and run the following command to install all Node package dependencies: 

```npm install```

Once this is complete, use the 'electron' npm script to build, run, and debug the application:

```npm run electron```

## Packaging and distribution

To package this applicaiton for distribution, electron-forge has been included as a dependency and can be installed via NPM. At time of writing the applciation is built as a Debian software package (.deb file). To extend this build project to other distributions/operating systems, the [electron-forge documentation](https://www.electronforge.io/) should be referenced. Configuration is located in package.json.

### Steps

1) Update metadata: If releasing a new version, the metadata in package.json can be updated. Crucially the version number is located there, and the description/title can be updated as well. If different output formats such as other Linux packages or Windows EXE must be created, that can be configured under the "makers" section in package.json (see documentation above).
2) In the application's root directory, execute ```npm run make``` - this will create the package(s) to distribute and send any to the 'out' directory.

Tray icon for Linux distributions is currently configured in main.ts within the options parameter for the 'BrowserWindow' object. 

## Troubleshooting
If an 'electron not found' error occurs even after running npm install, try installing Electron globally via ```npm install -g electron```. 