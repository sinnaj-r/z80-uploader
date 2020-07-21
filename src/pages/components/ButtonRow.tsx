import React from "react";
import { Row, Col, Button, Space } from "antd";
import {
    SettingOutlined,
    PlayCircleOutlined,
    CaretRightOutlined,
    CopyOutlined,
    FileOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
export const ButtonRow = () => {
    return (
        <Row
            justify="space-around"
            align="middle"
            style={{
                height: "10%",
            }}
        >
            <Col>
                <Button type="primary" icon={<CaretRightOutlined />}>
                    Transmit
                </Button>
            </Col>
            <Col>
                <Space>
                    <Button icon={<FileTextOutlined />}>Show File</Button>
                    <Button icon={<CopyOutlined />}>Copy to Clipboard</Button>
                </Space>
            </Col>
            <Col>
                <Button icon={<SettingOutlined />}>Settings</Button>
            </Col>
        </Row>
    );
};
