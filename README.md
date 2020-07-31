# z80-uploader
The easy way to transfer programs to your Z80


## A few words about the structure of the project:

The "Uploader" is an Electron application and is mostly based on Typescript and React. It can translate any files into the INTEL-Hex format and then transfer them via the serial interface of the host computer.

For best results, the receiving device should have the "Downloader" client installed. It can read Intel-Hex files taking into account the checksum and store them as a file. The client is written in Turbo Pascal and is especially designed for CPM-80 systems, but it should also run under e.g. DOS with no/minimal adjustments. 

The Downloader and Uploader can also be used separately, but when used together they have automatic error detection and correction, which makes it easy to send large amounts of data over unreliable connections.
