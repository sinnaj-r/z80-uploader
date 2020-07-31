import { SettingsType } from "./../initalSettings";
import SerialPortType, { darwinBinding, finished } from "serialport";
import { promisify } from "util";

//const Bindings: darwinBinding = window.require("@serialport/bindings");
const Bindings: darwinBinding = window.require("@serialport/binding-mock");
const SerialPort: typeof SerialPortType = window.require("@serialport/stream");
SerialPort.Binding = Bindings;
export { SerialPort };
//@ts-ignore
Bindings.createPort("/dev/ROBOT", { echo: true, record: true });
console.log("bindings", Bindings);

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type ProgressType = {
    finished: number;
    total: number;
    errors: number;
    completed: boolean;
};

export const initalProgress = (total: number) => ({
    finished: 0,
    total,
    errors: 0,
    completed: false,
});

export const transmitCommands = async (
    settings: SettingsType,
    hexString: string,
    onProgress = (x: ProgressType) => {}
) => {
    const port = new SerialPort(settings.serialPort, {
        baudRate: settings.baudRate,
        autoOpen: false,
    });
    console.log("port", port);

    const write = promisify(
        port.write.bind(port) as (
            buffer: string | number[] | Buffer,
            encoding?:
                | "ascii"
                | "utf8"
                | "utf16le"
                | "ucs2"
                | "base64"
                | "binary"
                | "hex",
            callback?: any
        ) => boolean
    );
    const open = promisify(port.open.bind(port));
    const read = promisify(port.read.bind(port));
    const drain = promisify(port.drain.bind(port));
    const flush = promisify(port.flush.bind(port));

    const lines = hexString.split("\n");
    let progress: ProgressType = initalProgress(lines.length);
    await open();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        //
        await write(line + "\n", "ascii");
        await drain();
        await sleep(20);
        const result = false; //await read(1);
        await flush();
        console.log(result);
        progress = { ...progress, finished: i + 1 };
        onProgress(progress);
        // if (result !== ".") {
        //     i--;
        // }
    }
    port.close();
    progress = { ...progress, completed: true };
    onProgress(progress);
};
