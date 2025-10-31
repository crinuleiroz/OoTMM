<!-- HEADER -->
<p align="center">
  <a id="readme-top"></a>
  <a href="https://ootmm.com/">
    <img alt="OoTMM Logo" with="256" height="256" src="./packages/gui/src/assets/logo-banner-rounded.png"/>
  </a>
  <p align="center">
    A randomizer of <em>The Legend of Zelda: Ocarina of Time</em> and <em>The Legend of Zelda: Majora's Mask</em> for the <em>Nintendo 64</em> that randomizes and combines both games into a single ROM file.
  </p>
  <p align="center">
    <em>Created by: <a href="https://github.com/Nax">Maxime Bacoux "Nax"</a></em>
  </p>
</p>




<!-- BADGES -->
<p align="center">
    <img alt="badge-version" src="https://img.shields.io/github/v/tag/OoTMM/OoTMM?label=version&sort=semver" />
    <img alt="badge-license" src="https://img.shields.io/github/license/OoTMM/OoTMM" />
    <img alt="badge-build" src="https://img.shields.io/github/actions/workflow/status/OoTMM/OoTMM/ci.yml?branch=master" />
    <img alt="badge-stars" src="https://img.shields.io/github/stars/OoTMM/OoTMM" />
    <img alt="badge-discord" src="https://discordapp.com/api/guilds/1004394204992118935/widget.png?style=shield" />
</p>




<!-- QUICK LINKS -->
<p align="center">
  <strong>
  <a href="https://ootmm.com/gen/stable">Web Generator</a>
  &nbsp;&bull;&nbsp;
  <a href="./CHANGELOG.md">Changelog</a>
  &nbsp;&bull;&nbsp;
  <a href="https://ootmm.wiki.gg/">Wiki</a>
  &nbsp;&bull;&nbsp;
  <a href="https://discord.gg/4QdtPBP6wf">Discord</a>
  </strong>
</p>




<!-- TABLE OF CONTENTS -->
<p>
  <h2 id="table-of-contents">
    📑 Table of Contents
  </h2>
  <ul>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <ul>
      <li>
        <a href="#rom-file-requirements">ROM File Requirements</a>
      </li>
      <li>
        <a href="#rom-file-byte-order">ROM File Byte Order</a>
      </li>
    </ul>
    <li>
     <a href="#changelog">Changelog</a>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#local-setup">Local Setup</a>
    </li>
    <ol>
      <li>
        <a href="#installing-the-required-tools">Installing the Required Tools</a>
      </li>
      <li>
        <a href="#download-or-clone-the-projects-repository">Download or Clone the Project's Repository</a>
      </li>
      <li>
        <a href="#adding-the-rom-files">Adding the ROM Files</a>
      </li>
      <li>
        <a href="#environment-setup">Environment Setup</a>
      </li>
      <li>
        <a href="#building-a-rom">Building a ROM</a>
      </li>
    </ol>
    <li>
      <a href="#related-projects">Related Projects</a>
    </li>
  </ul>
</p>




<!-- USAGE -->
<h2 id="usage">
  ⚙️ Usage
</h2>

The easiest way to generate OoTMM ROMs is with the [web generator][ootmm-randomizer-gen-stable].

If you wish to generate seeds locally, see <a href="#local-setup">Local Setup</a>.

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>

### ROM File Requirements

OoTMM requires clean, unmodified, and compressed ROM files for *Ocarina of Time* and *Majora's Mask*. Using unsupported ROMs will prevent the randomizer from generating a randomized ROM.

The tables below lists compatible ROM files, along with their compression status, byte order, version, and MD5 checksums for verification.

#### Ocarina of Time

<table>
  <thead>
    <tr>
      <th>Compatible</th>
      <th>Compressed</th>
      <th>Byte Order</th>
      <th>Version</th>
      <th>MD5 Checksum</th>
    </tr>
  </thead>
  <tbody>
    <!-- NTSC-U -->
   <tr align="center">
     <td>✅</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-U 1.0</td>
     <td><code>5BD1FE107BF8106B2AB6650ABECD54D6</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-U 1.1</td>
     <td><code>721FDCC6F5F34BE55C43A807F2A16AF4</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-U 1.2</td>
     <td><code>57A9719AD547C516342E1A15D5C28C3D</code></td>
   </tr>
   <!-- NTSC-J -->
   <tr align="center">
     <td>✅</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-J 1.0</td>
     <td><code>9F04C8E68534B870F707C247FA4B50FC</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-J 1.1</td>
     <td><code>1BF5F42B98C3E97948F01155F12E2D88</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-J 1.2</td>
     <td><code>2258052847BDD056C8406A9EF6427F13</code></td>
   </tr>
   <!-- PAL -->
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>PAL 1.0</td>
     <td><code>E040DE91A74B61E3201DB0E2323F768A</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>PAL 1.1</td>
     <td><code>D714580DD74C2C033F5E1B6DC0AEAC77</code></td>
   </tr>
  </tbody>
</table>


#### Majora's Mask

<table>
  <thead>
    <tr>
      <th>Compatible</th>
      <th>Compressed</th>
      <th>Byte Order</th>
      <th>Version</th>
      <th>MD5 Checksum</th>
    </tr>
  </thead>
  <tbody>
    <!-- NTSC-U -->
   <tr align="center">
     <td>✅</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-U 1.0</td>
     <td><code>2A0A8ACB61538235BC1094D297FB6556</code></td>
   </tr>
   <!-- NTSC-J -->
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-J 1.0</td>
     <td><code>15D1A2217CAD61C39CFECBFFA0703E25</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>NTSC-J 1.1</td>
     <td><code>C38A7F6F6B61862EA383A75CDF888279</code></td>
   </tr>
   <!-- PAL -->
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>PAL 1.0</td>
     <td><code>13FAB67E603B002CEAF0EEA84130E973</code></td>
   </tr>
   <tr align="center">
     <td>⛔</td>
     <td>✅</td>
     <td>Big Endian</td>
     <td>PAL 1.1</td>
     <td><code>BECCFDED43A2F159D03555027462A950</code></td>
   </tr>
  </tbody>
</table>

> [!TIP]
> To verify your ROM files, you can calculate their MD5 checksum using <a href="https://emn178.github.io/online-tools/md5_checksum.html" target="_blank" title="MD5 Checksum Tool">this MD5 checksum tool</a>. Your ROM files' checksums must exactly match compatible ones listed above.

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>

### ROM File Byte Order

Majora's Mask Randomizer requires ROM files to be in big endian byte order. Files in little endian or byteswapped formats will not work.

You can often identify a ROM file's byte order by its file extension:

- `📄.z64` — Typically big endian.
- `📄.n64` — Typically little endian.
- `📄.v64` — Typically byteswapped.

> [!WARNING]
> The file extension *does not* guarantee the byte order is correct. Renaming the file *does not* change its byte order. To properly verify or convert a ROM file's byte order, use <a href="https://www.zophar.net/download_file/2854" target="_blank" title="Click to Download Tool64">Tool64</a>.

> [!TIP]
> To convert a ROM file to big endian with Tool64, follow these steps:
> > 1. Open Tool64.
> > 2. At the top of the window, select **File > Open...**.
> > 3. Select the folder containing your ROM file.
> > 4. Click **OK**.
> > 5. In the main window, select your ROM file.
> > 6. Right-click the file and choose **Big Endian** from the context menu.

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>




<!-- CHANGELOG -->
<h2 id="changelog">
  📝 Changelog
</h2>

You can view a detailed changelog of all stable release updates in the [CHANGELOG.md][changelog] file.

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>



<!-- SUPPORT -->
<h2 id="support">
  🧩 Support
</h2>

For help with the randomizer, join the community [Discord server][ootmm-discord]. You can get support in the following channels:

- `#tech-support` — Get support for emulators or other technical issues.
- `#settings-help` — Get support for information on specific settings.
- `#tracker-support` — Get support for tracker-related issues.

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>




<!-- FEATURES -->
<h2 id="features">
  ✨ Features
</h2>

Along with randomizing items across both games, the randomizer includes several additional features to enhance your experience.

<!--
    Potential features to add/list:
    -
-->

### Custom Music

Beyond randomizing the original songs, OoTMM supports custom music not included in *The Legend of Zelda: Ocarina of Time* and *The Legend of Zelda: Majora's Mask*.

#### Adding Music to OoTMM

To use custom music with the web generator, follow these steps:

> 1. Compress your music files into a ZIP file.
> 2. In the generator, select **Cosmetics**.
> 3. On the cosmetics page, click the **Custom Music ZIP** box.
> 4. Select the ZIP file containing your music files.

> [!TIP]
> In Windows 11, Windows Explorer can compress files without additional software. To compress files into a ZIP file, follow these steps:
> > 1. Select the files you want to compress.
> > 2. Right-click the files and select **Compress to... > ZIP File**.

#### Feature Support

OoTMM supports the following custom music features:

- ✅ Ocarina of Time Randomizer custom music files (`🗃️.ootrs`)
- ✅ Majora's Mask Randomizer custom music files (`🗃️.mmrs`)
- ✅ Custom sequences
- ✅ Custom instrument banks
- ⛔ Custom audio samples
- ⛔ Formmask

> [!WARNING]
> Files that do not work with the randomizer will show a warning and be skipped during generation.

#### Obtaining Custom Music

If you do not already have any custom music, you can download custom music files from the resources below:

- [OoTMM Discord Server][ootmm-discord] — Found in the `#music-releases` channel of the server.
- [Darunia's Joy Repository][darunias-joy] — A community resource of Ocarina of Time Randomizer custom music files.
- [MMR Discord Server][mmr-discord] — Found in the `#music-releases` channel of the server.
- [Majora's Music-Box House Repository][majoras-music-box-house] — A community resource of Majora's Mask Randomizer custom music files.

> [!IMPORTANT]
> For Majora's Mask Randomizer custom music files, standalone sequence files (`📄.zseq`) are not supported.


<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>



<!-- LOCAL SETUP -->
<h2 id="local-setup">
  🛠️ Local Setup
</h2>

You can build and run OoTMM locally using either a **Dev Container** (recommended) or your **native environment** by following the steps detailed below.

<h3 id="installing-the-required-tools">
  1. Installing the Required Tools
</h3>

Before building, ensure you have the following tools installed.

#### Dev Container

- [Docker][docker]
- [Visual Studio Code][visual-studio-code]
- [Dev Containers Extension][dev-containers-ext]

#### Native Build

- **C/C++ toolchain**:
    - [GCC][gcc] (Linux, macOS, or Windows via [MSYS2][msys2])
    - [CLang][clang] (macOS, Linux, or Windows via [LLVM][llvm])
    - [Visual C++ Build Tools][visual-cpp-build-tools] (Windows)
- [CMake][cmake]
- [Ninja][ninja-build]
- [n64-ultra][n64-ultra]
- [Node][node-js] (Version 22 or newer)
- [Git][git]

> [!TIP]
> On Windows, it is recommended to use [Windows Subsystem for Linux][wsl] for a better build experience.

<h3 id="download-or-clone-the-projects-repository">
  2. Download or Clone the Project's Repository
</h3>

#### Downloading Project from GitHub

To download the project from GitHub, follow these steps:

> 1. Click **Code**.
> 2. Select **Download ZIP** from the menu.
> 3. Extract the contents of the ZIP file to a folder of your choice.

#### Cloning Project with Git

To clone the project with Git, follow these steps:

> 1. Open a terminal in the folder of your choice.
> 2. Run the following command:
> ```
> git clone https://github.com/crinuleiroz/OoTMM.git
> ```

<h3 id="adding-the-rom-files">
1. Adding the ROM Files
</h3>

After you have the project's repository, will need to prepare your ROM files:

> 1. Rename your *Ocarina of Time* ROM file to: `oot.z64`.
> 2. Rename your *Majora's Mask* ROM file to: `mm.z64`.
> 3. Place both your ROM files into the `📁/roms` folder in the project's root directory:

<h3 id="environment-setup">
4. Environment Setup
</h3>

#### Dev Container

To set up the environment with Docker, follow these steps:

> 1. Open Visual Studio Code.
> 2. Click **File > Open Folder...**, then select the project's folder.
> 3. When prompted, click **Reopen in Container**.

#### Native

To set up the environment natively, follow these steps:

> 1. Open a terminal in the project's root directory.
> 2. Run the setup script:
> ```
> ./setup.sh
> ```

<h3 id="building-a-rom">
1. Building a ROM
</h3>

Once setup completes, you can build a randomized ROM by running the following command:
```
pnpm start:core:config
```

> [!NOTE]
> **ROM File Output Location**
>
> The generated ROM will be located in the `📁/out` folder.

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>




<!-- RELATED PROJECTS -->
<h2 id="related-projects">
  🔗 Related Projects
</h2>

- **Ocarina of Time Randomizer**
    - [Website][oot-randomizer-site]
    - [Discord][ootr-discord]
    - [GitHub][oot-randomizer-github]
- **Majora's Mask Randomizer**
    <!--- [Website][mm-randomizer-site]-->
    - [Discord][mmr-discord]
    - [GitHub][mm-randomizer-github]

<p align="right"><sub><a href="#readme-top">Back to Top</a> 🔝</sub></p>




<!-- LINKS -->
<!--
    Links here use reference style linking:
    https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[docker]: https://www.docker.com/
[visual-studio-code]: https://code.visualstudio.com/
[dev-containers-ext]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
[gcc]: https://gcc.gnu.org/
[msys2]: https://www.msys2.org/
[clang]: https://clang.llvm.org/
[llvm]: https://releases.llvm.org/download.html
[visual-cpp-build-tools]: https://visualstudio.microsoft.com/visual-cpp-build-tools/
[cmake]: https://cmake.org/
[ninja-build]: https://ninja-build.org/
[node-js]: https://nodejs.org/en
[git]: https://git-scm.com/
[n64-ultra]: https://github.com/glankk/n64
[wsl]: https://learn.microsoft.com/windows/wsl/install


<!-- Local Repo Files -->
[license]: LICENSE
[readme]: README.md
[changelog]: CHANGELOG.md

<!-- OOTMM -->
[ootmm-randomizer-site]: https://ootmm.com
[ootmm-randomizer-gen-stable]: https://ootmm.com/gen/stable
[ootmm-randomizer-gen-dev]: https://ootmm.com/gen/dev
[ootmm-randomizer-wiki]: https://ootmm.wiki.gg/

<!-- Related Projects -->
[oot-randomizer-site]: https://ootrandomizer.com/
[oot-randomizer-github]: github.com/OoTRandomizer/OoT-Randomizer
[mm-randomizer-site]: https://mmrandomizer.com/
[mm-randomizer-github]: https://github.com/ZoeyZolotova/mm-rando

<!-- Social Links -->
[ootmm-discord]: https://discord.gg/4QdtPBP6wf
[ootr-discord]: https://discord.gg/ootrandomizer
[mmr-discord]: https://discord.gg/8qbreUM

<!-- Custom Music Link -->
[darunias-joy]: https://github.com/DaruniasJoy/OoT-Custom-Sequences
[majoras-music-box-house]: https://github.com/MajorasMusicBoxHouse/Majoras-MusicBox-House

<!-- Contributors -->
[user-nax]: https://github.com/Nax
[user-celestialkitsune]: https://github.com/CelestialKitsune
[user-xenowars]: https://github.com/XenoWars
[user-zoeyzolotova]: https://github.com/ZoeyZolotova
[user-joshua8600]: https://github.com/Joshua8600
[user-amazingampharos]: https://github.com/AmazingAmpharos
[user-revvenn]: https://github.com/Revvenn
[user-matthewkirby]: https://github.com/matthewkirby
[user-ghunzor]: https://github.com/Ghunzor
[user-lkarvec]: https://github.com/lkarvec
[user-aegiker]: https://github.com/Aegiker
[user-eedefeed]: https://github.com/eedefeed
[user-hamelatoire]: https://github.com/Hamelatoire
[user-ggkfox]: https://github.com/ggkfox
[user-zeemaji]: https://github.com/ZeeMaji
[user-lumineonrl]: https://github.com/LumineonRL
[user-sciencenerd2240]: https://github.com/ScienceNerd2240
[user-skyros4]: https://github.com/Skyros4
[user-itsbirdseed]: https://github.com/itsbirdseed
[user-demitastes]: https://github.com/demitastes
[user-matthe815]: https://github.com/matthe815
[user-jupiter0fire]: https://github.com/jupiter0fire
[user-kethku]: https://github.com/Kethku
[user-crinuleiroz]: https://github.com/crinuleiroz
