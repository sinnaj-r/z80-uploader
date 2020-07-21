import { ButtonRow } from "./../components/ButtonRow";
import { FileSelector } from "./../components/FileSelector";
import React, { useState } from "react";
import {
    Row,
    Col,
    List,
    Button,
    Upload,
    message,
    Space,
    Divider,
    Layout,
    Typography,
    PageHeader,
} from "antd";
import "./App.css";
import {
    InboxOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { FileList } from "../components/FileList";

const data = ["test.dat", "test2.dat"];

const { Dragger } = Upload;
const { Content, Footer, Header } = Layout;
const { Title } = Typography;

function App() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const onDraggerChange = (info: UploadChangeParam<UploadFile<any>>) => {
        console.log(info.file, info.fileList);
        setFiles([...files, ...info.fileList]);
    };
    return (
        <Layout className="App">
            <PageHeader
                ghost={false}
                title="z80 Uploader"
                subTitle="The easy way to transfer programms to your z80"
            />
            <Layout>
                <Content>
                    <Row
                        justify="space-around"
                        align="middle"
                        style={{ height: "70%" }}
                    >
                        <Col span={8}>
                            <Title level={3}> Files</Title>
                            <FileList data={files} />
                        </Col>
                        <Col span={1} style={{ height: "50%" }}>
                            <Divider
                                type="vertical"
                                style={{ height: "100%" }}
                            ></Divider>
                        </Col>
                        <Col span={8}>
                            <FileSelector onDraggerChange={onDraggerChange} />
                        </Col>
                    </Row>
                    <ButtonRow />
                    <Row
                        justify="space-around"
                        align="middle"
                        style={{ height: "10%" }}
                    ></Row>
                    <Footer>
                        © {new Date().getFullYear()} Tim Kuffner & Jannis
                        Rosenbaum
                    </Footer>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
