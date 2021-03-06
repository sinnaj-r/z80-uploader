import { transmitCommands, ProgressType } from "./serialConnection";
import { SettingsType } from "../initialSettings";
import { UploadFile } from "antd/lib/upload/interface";
import { fileArrayToHex } from "./fileTransformation";
import { notification } from "antd";

const { clipboard } = window.require("electron");

export const createZ80Commands = async (
    files: UploadFile[],
    settings: SettingsType,
    action: "SHOW" | "COPY" | "TRANSMIT"
) => {
    const fileHexes = await fileArrayToHex(files, settings.byteOffset);
    let resultString = "";
    for (let fileHex of fileHexes) {
        if (
            (action === "COPY" && settings.copyCommands) ||
            (action === "SHOW" && settings.showCommands) ||
            (action === "TRANSMIT" && settings.transmitCommands)
        ) {
            resultString += `${
                settings.downloadExecName
            } ${fileHex.name.toUpperCase()}\r\n`;
        }
        resultString += fileHex.hex;
        resultString += "\r\n";
    }
    return resultString;
};

export const hexAction = async (
    action: "SHOW" | "COPY" | "TRANSMIT",
    files: UploadFile[],
    settings: SettingsType,
    onProgress?: (progress: ProgressType) => void
) => {
    const hexString = await createZ80Commands(files, settings, action);

    if (action === "COPY") {
        clipboard.writeText(hexString);
        notification.success({
            message: "The Hex-String was copied successfully!",
        });
    } else if (action === "SHOW") {
        return hexString;
    } else if (action === "TRANSMIT") {
        return transmitCommands(settings, hexString, onProgress);
    }
};
