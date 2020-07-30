import { SettingsType } from "./../initalSettings";
import { UploadFile } from "antd/lib/upload/interface";
import { fileArrayToHex } from "./fileTransformation";
import { notification } from "antd";

const { clipboard } = window.require("electron");

export const createZ80Commands = async (
    files: UploadFile[],
    settings: SettingsType,
    action: "SHOW" | "COPY"
) => {
    const fileHexes = await fileArrayToHex(files, settings.byteOffset);
    console.log(fileHexes);
    let resultString = "";
    for (let fileHex of fileHexes) {
        if (
            (action === "COPY" && settings.copyCommands) ||
            (action === "SHOW" && settings.showCommands)
        ) {
            resultString += `DOWNLOAD ${fileHex.name.toUpperCase()}\n`;
        }
        resultString += fileHex.hex;
        resultString += "\n";
    }
    return resultString;
};

export const hexAction = async (
    action: "SHOW" | "COPY",
    files: UploadFile[],
    settings: SettingsType
) => {
    const hexString = await createZ80Commands(files, settings, action);
    console.log(hexString);

    if (action === "COPY") {
        clipboard.writeText(hexString);
        notification.success({
            message: "The Hex-String was copied successfully!",
        });
    } else {
        alert(hexString);
    }
};
