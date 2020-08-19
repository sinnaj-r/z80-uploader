import { SettingsType } from "../initialSettings";
import SerialPortType, { darwinBinding } from "serialport";
import { promisify } from "util";

const Bindings: darwinBinding = window.require("@serialport/bindings");
//const Bindings: darwinBinding = window.require("@serialport/binding-mock");
const SerialPort: typeof SerialPortType = window.require("@serialport/stream");
SerialPort.Binding = Bindings;
export { SerialPort };
//@ts-ignore
//Bindings.createPort("/dev/ROBOT", { echo: false, record: true });

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type ProgressType = {
    finished: number;
    total: number;
    errors: number;
    completed: boolean;
};

export const initialProgress = (total: number) => ({
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
    //TODO Move to Settings
    let maxRetries = 35;
    const port = new SerialPort(settings.serialPort, {
        baudRate: settings.baudRate,
        autoOpen: false,
        lock: true,
    });

    const open = promisify(port.open.bind(port));
    const drain = promisify(port.drain.bind(port));
    const flush = promisify(port.flush.bind(port));

    const lines = hexString.split("\n");
    let progress: ProgressType = initialProgress(lines.length);
    await open();
    port.write("\r\n", "ascii");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let errors = progress.errors;
        console.log("-----\n" + line);

        await flush();
        if (line[0] !== ":") {
            await sleep(1000);
        }
        for (let char of line) {
            port.write(char, "ascii");
            await drain();
        }

        await drain();
        await sleep(line[0] !== ":" ? 500 : 50);
        const result = port.read()?.toString();
        console.log(result);

        if (line[0]) {
            const resultWithoutInput =
                result && result.replace(line + "\r\n", "");
            if (!resultWithoutInput || !resultWithoutInput.includes(".")) {
                i--;
                maxRetries--;
                errors += 1;
            }
        }
        if (maxRetries <= 0) {
            throw new Error("Too Many transmission Errors!");
        }

        progress = { ...progress, finished: i + 1, errors };
        onProgress(progress);
    }
    port.write("\r\n", "ascii");
    flush();
    port.close();
    progress = { ...progress, completed: true };
    onProgress(progress);
};
