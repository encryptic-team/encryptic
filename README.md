<div align="center">
  <h1>Encryptic | The open source note-taking app</h1>

    <H2>This project is deprecated.</H2>

  <h3>🔖  &nbsp;🔏  &nbsp;📄&nbsp;</h3>
  <p><strong>An encryption-focused open source note taking application.</strong><br>
<h3><a href="https://encryptic.org">Website</a> | <a href="https://app.encryptic.org">Demo</a></h3>
    Encryptic is based upon the <a href="https://github.com/Laverna/laverna">Laverna Project</a><br>

  [![Build Status](https://travis-ci.org/encryptic-team/Encryptic.svg?branch=master)](https://travis-ci.org/encryptic-team/Encryptic)
  [![Coverage Status](https://coveralls.io/repos/github/encryptic-team/Encryptic/badge.svg?branch=master)](https://coveralls.io/github/encryptic-team/Encryptic)
  ![Version](https://img.shields.io/badge/Version-0.0.3.beta-blue.svg)

  <h3>
    <a href="https://gitter.im/encryptic-team/Lobby">
      Gitter
    </a>
    <span> | </span>
    <a href="https://github.com/encryptic-team/Encryptic/wiki">
      Wiki
    </a>
    <span> | </span>
    <a href="#developer-install--documentation">
      Contribute
    </a>
  </h3>

  <sub>
    Encryptic uses the
    <a href="http://marionettejs.com/">Marionette JS framework</a>,
    <a href="http://gulpjs.com/">Gulp</a> and runs on Node.js. The test runner is <a href="https://github.com/substack/tape">tape</a>
  </sub>
</div>

## Features

* Markdown editor based on Pagedown
* Synchronization with cloud storage via Dropbox or RemoteStorage
* Multiple editing modes: normal, preview, and distraction free
* Offline access to your notes
* WYSIWYG control buttons
* Syntax highlighting, MathJax support
* Robust keyboard shortcuts

## Security
* [Client-side document encryption](#encryption)
* No registration required. Encryptic manages signup/login via security tools built in to all modern browsers.
* By default, Encryptic stores notes using the database in your browser (such as indexedDB or localStorage). This means that no data is synced to the cloud without your permission.

## Quick Start (recommended)

* Open [app.encryptic.org](https://app.encryptic.org/) and get started in less than 30 seconds.
* No extra steps are required!

## Install Standalone Desktop App (beta)

**NOTE: IF YOU ARE UPGRADING FROM AN OLD VERSION OF Encryptic, BACKUP EVERYTHING FIRST.  THIS CODE HAS BEEN TESTED BUT MANY THINGS HAVE CHANGED.  DATA LOSS IS POTENTIAL.**

Install a version of Encryptic from here:

https://github.com/encryptic-team/Encryptic/releases/

### Post installation

None.  Removed the signal server component for the time being.

#### Arch Linux (or derived distributions)

* Install the package [encryptic](https://aur.archlinux.org/packages/encryptic/) with your favorite AUR helper (e.g. `$ yay -S encryptic`)

> *Running into issues with Arch Linux installation? Report [here](https://github.com/funilrys/PKGBUILD/issues/new) or contact [@funilrys](https://github.com/funilrys) on Gitter [here](https://gitter.im/funilrys_/PKGBUILD)*.

### Previous Releases

* All historical releases [are available here](https://github.com/encryptic-team/encryptic/releases).

## Developer Install & Documentation

Setting up the Encryptic development environment only takes a few minutes. To run locally, you need to have the following installed:
* [Node.js version 8.11.4 or 10.9.0](https://nodejs.org/). Encryptic works with other previous Node versions, but requires changes to `package.json` and is not recommended.
* [Git](https://git-scm.com/book/en/v2) (note: Windows users need to set the PATH variable for git after installation).
* [Yarn](https://yarnpkg.com/en/) You can use npm but it's not recommended due to inconsistencies observed in the modules installed.


### Part One: Install Encryptic

If you're planning to contribute to the project's development, hit the fork button at the top of the page and move on to **step 2**.


**1. Clone the Encryptic repository:**

With SSH :
```bash
$ git clone git@github.com:encryptic-team/encryptic.git
```

With HTTPS :
```bash
$ git clone https://github.com/encryptic-team/encryptic.git
```


**2. Navigate to project directory and install gulp and yarn globally:**

```bash
$ cd encryptic

$ npm install -g gulp
$ npm install -g yarn
```


**4. Install dependencies and build:**

```bash
$ yarn
```
\- or -
```bash
$ npm run setup
```


**5. Start Encryptic:**

```bash
$ gulp
```

**6. Point a web browser to http://localhost:9000**

## Coding Style Guidelines

We ask that you use either **plain JavaScript or the [Marionette.js](http://marionettejs.com/) framework** (for more details on the preferred coding style see [.editorconfig](https://github.com/encryptic-team/Encryptic/blob/master/.editorconfig)).

## Encryption

**In our effort to permanently enhance the application's security**, Encryptic is implementing OpenPGP encryption via [OpenPGP.js](https://github.com/openpgpjs/openpgpjs).

## Support Encryptic

* Hit the star button on [GitHub](https://github.com/encryptic-team/encryptic)
* Like us on [alternativeto.net](http://alternativeto.net/software/Encryptic/)
* Contribute!


## License

Published under [MPL-2.0 License](https://www.mozilla.org/en-US/MPL/2.0/).
Encryptic uses a lot of other libraries and each of these [libraries use different licenses](https://github.com/encryptic-team/encryptic/blob/master/package.json).
