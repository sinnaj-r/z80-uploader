import React, { FC } from "react";
import { Row, Col, Button, Space, Popconfirm } from "antd";
import {
    SettingOutlined,
    CaretRightOutlined,
    CopyOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
export const ButtonRow: FC<{
    transmit: () => void;
    showHex: () => void;
    copyHex: () => void;
    openSettings: () => void;
    actionsDisabled: boolean;
}> = ({ transmit, showHex, copyHex, openSettings, actionsDisabled }) => {
    return (
        <Row
            justify="space-around"
            align="middle"
            style={{
                height: "10%",
            }}
        >
            <Col>
                <Popconfirm
                    title="Do you really want to start transmitting?"
                    onConfirm={transmit}
                    okText="Yes"
                    cancelText="No"
                    disabled={actionsDisabled}
                >
                    <Button
                        type="primary"
                        icon={<CaretRightOutlined />}
                        disabled={actionsDisabled}
                    >
                        Transmit
                    </Button>
                </Popconfirm>
            </Col>
            <Col>
                <Space>
                    <Button
                        disabled={actionsDisabled}
                        icon={<FileTextOutlined />}
                        onClick={showHex}
                    >
                        Show Hex-File
                    </Button>
                    <Button
                        disabled={actionsDisabled}
                        icon={<CopyOutlined />}
                        onClick={copyHex}
                    >
                        Copy Hex to Clipboard
                    </Button>
                </Space>
            </Col>
            <Col>
                <Button icon={<SettingOutlined />} onClick={openSettings}>
                    Settings
                </Button>
            </Col>
        </Row>
    );
};
