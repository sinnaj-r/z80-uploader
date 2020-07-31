export type SettingsType = {
    byteOffset: string;
    copyCommands: boolean;
    showCommands: boolean;
    transmitCommands: boolean;
    downloadExecName: string;
    baudRate: number;
    serialPort: string;
};
export const initalSettings: SettingsType = {
    byteOffset: "5000",
    copyCommands: true,
    showCommands: true,
    transmitCommands: true,
    downloadExecName: "DOWNLOAD",
    baudRate: 115200,
    serialPort: "",
};
