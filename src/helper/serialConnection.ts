import SerialPortType, { darwinBinding } from "serialport";

const Bindings: darwinBinding = window.require("@serialport/bindings");
const SerialPort: typeof SerialPortType = window.require("@serialport/stream");
SerialPort.Binding = Bindings;
export { SerialPort };
