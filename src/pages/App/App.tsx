import { ButtonRow } from "../../components/ButtonRow";
import { FileSelector } from "../../components/FileSelector";
import React, { useState, useRef } from "react";
import {
    Row,
    Col,
    Divider,
    Layout,
    Typography,
    PageHeader,
    notification,
} from "antd";
import "./App.css";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { FileList } from "../../components/FileList";
import { SettingsModal } from "../SettingsModal/SettingsModal";
import { useLocalStorage } from "../../helper/useLocalStorage";
import { initialSettings, SettingsType } from "../../initialSettings";
import produce from "immer";
import { hexAction } from "../../helper/createZ80Commands";
import { ProgressType, initialProgress } from "../../helper/serialConnection";
import { LoadingModal } from "../../components/LoadingModal";
import { throttle } from "lodash";
import HexViewModal from "../../components/HexViewModal";

const { Content, Footer } = Layout;
const { Title } = Typography;

function App() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [settings, setSettings] = useLocalStorage<SettingsType>(
        "settings",
        initialSettings
    );
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [progressState, setProgress] = useState<ProgressType>(
        initialProgress(0)
    );
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const onDraggerChange = (info: UploadChangeParam<UploadFile<any>>) => {
        setFiles([...files, info.file]);
        notification.success({ message: `Added ${info.file.name}!` });
    };
    const removeFile = (uid: string) => {
        notification.success({ message: `File removed!` });
        setFiles(files.filter(({ uid: item_uid }) => item_uid !== uid));
    };
    const editFileName = (uid: string, name: string) => {
        const newFiles = produce(files, (draft) => {
            const changedItem = draft.find(
                ({ uid: item_uid }) => item_uid === uid
            );
            if (!changedItem) {
                return;
            }
            changedItem.name = name;
        });
        setFiles(newFiles);
    };

    const onTransmitProgress = useRef(
        throttle((progress: ProgressType) => setProgress(progress), 50)
    );
    const onTransmit = () => {
        setErrorMessage(null);
        setProgress(initialProgress(0));
        hexAction(
            "TRANSMIT",
            files,
            settings,
            onTransmitProgress.current
        ).catch((err) => {
            setErrorMessage(err.message);
        });
        setLoadingModalVisible(true);
    };

    const [hexString, setHexString] = useState("");

    return (
        <Layout className="App">
            <HexViewModal
                hexString={hexString}
                onClose={() => setHexString("")}
            />
            <SettingsModal
                initialValues={settings}
                visible={settingsVisible}
                onCancel={() => setSettingsVisible(false)}
                onCreate={(settings: any) => {
                    setSettingsVisible(false);
                    setSettings(settings);
                }}
            />
            <LoadingModal
                onClose={() => setLoadingModalVisible(false)}
                progress={progressState}
                visible={loadingModalVisible}
                errorMessage={errorMessage}
            />
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
                            <FileList
                                data={files}
                                removeFile={removeFile}
                                editFileName={editFileName}
                            />
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
                    <ButtonRow
                        transmit={onTransmit}
                        showHex={async () =>
                            setHexString(
                                (await hexAction("SHOW", files, settings)) || ""
                            )
                        }
                        copyHex={() => hexAction("COPY", files, settings)}
                        openSettings={() => setSettingsVisible(true)}
                        actionsDisabled={files.length < 1}
                    />
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
