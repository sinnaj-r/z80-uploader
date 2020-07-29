export type SettingsType = {
    byteOffset: string;
    copyCommands: boolean;
    showCommands: boolean;
    downloadExecName: string;
};
export const initalSettings: SettingsType = {
    byteOffset: "5000",
    copyCommands: true,
    showCommands: true,
    downloadExecName: "DOWNLOAD",
};
