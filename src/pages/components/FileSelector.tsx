import React from "react";
import { Row, Col, Divider, Button } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";

export const FileSelector = ({ onDraggerChange }: any) => {
    return (
        <>
            <Row justify="center">
                <Col>
                    <Dragger
                        name="file"
                        multiple
                        onChange={onDraggerChange}
                        beforeUpload={() => false}
                        style={{
                            padding: "30px",
                        }}
                        showUploadList={false}
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
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Browse
                    </Button>
                </Col>
            </Row>
        </>
    );
};
