import React, { useEffect, useState } from "react";

import { Modal, Form, Input, Switch, Select, InputNumber } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { SettingsType } from "../../initialSettings";
import { SerialPort } from "../../helper/serialConnection";

export const SettingsModal: React.FC<{
    visible: boolean;
    onCreate: (settings: object) => void;
    onCancel: () => void;
    initialValues: SettingsType;
}> = ({ visible, onCreate, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const [ports, setPorts] = useState<any[]>([]);
    useEffect(() => {
        SerialPort.list().then((li: any) => setPorts(li));
    }, [visible]);
    return (
        <Modal
            visible={visible}
            title="Settings"
            okText="Save"
            cancelText="Cancel"
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            maskClosable={false}
            onOk={() => {
                form.validateFields().then((values) => {
                    onCreate(values);
                });
            }}
        >
            <Form form={form} layout="vertical" initialValues={initialValues}>
                <Form.Item name="serialPort" label="Serial Port" rules={[]}>
                    <Select>
                        {ports.map((port) => (
                            <Select.Option value={port.path}>
                                {port.path}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="baudRate"
                    label="Baud Rate"
                    rules={[
                        {
                            required: true,
                            message: "Please input the Baud Rate",
                        },
                    ]}
                >
                    <InputNumber min={75} max={115200} />
                </Form.Item>
                <Form.Item
                    name="byteOffset"
                    label="Byte Offset"
                    rules={[
                        {
                            required: true,
                            message: "Please input the Byte Offset",
                        },
                        {
                            pattern: /^[0-9a-fA-F]+$/m,
                            message: "You may only input a hex-string",
                        },
                    ]}
                >
                    <Input addonBefore="0x" />
                </Form.Item>
                <Form.Item
                    name="downloadExecName"
                    label="Download Executable Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input the Executable Name",
                        },
                    ]}
                >
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item
                    valuePropName="checked"
                    name="copyCommands"
                    label="Copy Commands when copying hex"
                >
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    name="showCommands"
                    label="Show Commands when viewing hex"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    name="transmitCommands"
                    label="Transmit Commands"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
