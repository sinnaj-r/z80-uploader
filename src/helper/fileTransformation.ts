import { UploadFile } from "antd/lib/upload/interface";
import MemoryMap from "nrf-intel-hex";
import { off } from "process";

export const fileToArrayBuffer = (file: File) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onerror = function onerror(ev) {
            reject((ev.target as any).error);
        };

        reader.onload = function onload(ev) {
            resolve((ev.target as any).result);
        };

        reader.readAsArrayBuffer(file);
    });
};

export const dataToHexString = (
    arrayBuffer: ArrayBuffer,
    offset: Number
): string => {
    console.log(arrayBuffer);
    let memMap = new MemoryMap();
    let bytes = new Uint8Array(arrayBuffer);
    memMap.set(offset, bytes);

    let string = memMap.asHexString();
    return string;
};

export type FileHex = {
    hex: string;
    name: string;
};

export const fileArrayToHex = async (files: UploadFile[], offset: string) => {
    console.log(files);
    const returnArray: FileHex[] = [];
    for (let file of files) {
        returnArray.push({
            name: file.name,
            hex: dataToHexString(
                (await fileToArrayBuffer(file.originFileObj as File)) as any,
                parseInt(offset, 16)
            ),
        });
    }
    return returnArray;
};
