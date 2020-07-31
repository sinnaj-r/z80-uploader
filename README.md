# z80-uploader
![Logo](./public/logo192.png)

The easy way to transfer programs to your Z80

## A few words about the structure of the project:

The "Uploader" is an Electron application and is mostly based on Typescript and React. It can translate any files into the INTEL-Hex format and then transfer them via the serial interface of the host computer.

For best results, the receiving device should have the "Downloader" client installed. It can read Intel-Hex files taking into account the checksum and store them as a file. The client is written in Turbo Pascal and is especially designed for CPM-80 systems, but it should also run under e.g. DOS with no/minimal adjustments. 

The Downloader and Uploader can also be used separately, but when used together they have automatic error detection and correction, which makes it easy to send large amounts of data over unreliable connections.


### ToDos

[] Add more generall Documentation and Usage-Info
[] Add specific instructions to install the Downloader
[] Add a CI Pipeline or similar to directly provide executables
[] Resolving "TODO"s in the Code
[] Fixing Linter Issues
[] Refactoring the Download-Client
[] Add Screenshots/-cast to give a feeling for the App
