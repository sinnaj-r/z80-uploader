import React from "react";
import { Row, Col, Divider, Button, Upload } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";

export const FileSelector = ({ onDraggerChange }: any) => {
    const uploadProps = {
        name: "file",
        multiple: true,
        customRequest: ({
            onSuccess,
            file,
            onProgress,
        }: RcCustomRequestOptions) => {
            onProgress({ percent: 100 }, file);
            onSuccess({}, file);
        },
        onChange: onDraggerChange,

        showUploadList: false,
    };
    return (
        <>
            <Row justify="center">
                <Col>
                    <Dragger
                        {...uploadProps}
                        style={{
                            padding: "30px",
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Drag file to this area to add
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk selection.
                        </p>
                    </Dragger>
                </Col>
            </Row>
            <Row>
                <Col offset={6} span={12}>
                    <Divider />
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                    <Upload {...uploadProps}>
                        <Button>
                            <PlusOutlined /> Browse
                        </Button>
                    </Upload>
                </Col>
            </Row>
        </>
    );
};
