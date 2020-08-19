# z80-uploader

![Logo](./public/logo192.png)

The easy way to transfer programs to your Z80

## A few words about the structure of the project:

The "Uploader" is an [Electron](https://www.electronjs.org) application and is mostly based on [Typescript](https://www.typescriptlang.org) and [React](http://reactjs.org). It can translate any files into the [INTEL-Hex](https://en.wikipedia.org/wiki/Intel_HEX) format and then transfer them via the serial interface of the host computer. (E.g. an inexpensive USB-To-Serial-Adapter)

For best results, the receiving device should have the ["Downloader"](Download-Client/download.pas) client installed. It can read Intel-Hex files taking into account the checksum and store them as a file. The client is written in Turbo Pascal and is especially designed for CPM-80 systems, but it should also run under e.g. DOS with no/minimal adjustments.

The Downloader and Uploader can also be used separately, but when used together they have automatic error detection and correction, which makes it easy to send large amounts of data over unreliable connections.

## How to get the downloader client on your Z80

This project was created while following the instructions of Grant Searle, who built the Z80 with an FPGA. Our [documentation can be found here](https://github.com/sinnaj-r/z80-on-an-fpga).
That Z80 had a special ROM which allows the transfer of Intel-Hex files.
So you just had to convert the compiled download client with our uploader into the Intel-HEX format and then you could transfer it to the Z80.
We would now like to explain this specific process in more detail:

0. Open a serial connection to your fpga
1. (re)boot the FPGA
2. You should see the `Press [SPACE] to activate console`-Prompt
3. Press `SPACE`
4. Open the Uploader-App
5. Open the Settings
6. Disable the `Copy commands`-Switch
7. Set the Offset to `(0x)4100` and `Save` the settings
8. Drop the [Downloader.COM](Download-Client/download.com) file in the Dropzone
9. Click `Copy HEX`
10. Now paste the selected HEX-String in the Terminal (Dots (`...`) should appear)
11. After some time the terminal will say `complete`
12. You want to enter `GFFE8` and press enter
13. CP/M will be started; Navigate to the drive where the download program should be located
14. Type `SAVE 2 DOWNLOAD.COM` and press enter.
15. The Download.com program is now **ready to be used**.

## How to run or build the uploader app as a developer

First of all you need a **current node version** (e.g. Node 12). We also recommend **yarn** as a packet manager.
You can find many great guides how to install this software on the internet.
To install our dependencies you now only need to run `yarn install`.

Then you can create a **build** for the current platform with `yarn build-full`.

A **development version** with Live-Reload can be started with `yarn start`.

## How to run or compile the downloader client as a developer

Just open the source file [Downloader.PAS](Download-Client/download.pas) with an TurboPascal installation and run or compile it with it.
