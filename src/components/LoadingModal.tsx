import * as React from "react";
import Modal from "antd/lib/modal/Modal";
import { ProgressType } from "../helper/serialConnection";
import { Progress, Row, Col, Statistic, Result } from "antd";
type Props = {
    visible: boolean;
    onClose: () => void;
    progress: ProgressType;
    errorMessage: string | null;
};
export const LoadingModal = (props: Props) => {
    const percent = Math.ceil(
        (props.progress.finished / props.progress.total) * 100
    );
    const finished = !!props.errorMessage || props.progress.completed;

    return (
        <Modal
            title="Transmit in Progress"
            visible={props.visible}
            closable={finished}
            confirmLoading={!finished}
            maskClosable={finished}
            onOk={props.onClose}
            cancelButtonProps={{ disabled: true }}
        >
            {props.errorMessage !== null ? (
                <Result
                    status="error"
                    title="Transmission failed!"
                    subTitle={props.errorMessage}
                ></Result>
            ) : (
                <Row gutter={16} justify="space-between" align="middle">
                    <Col span={17}>
                        <Progress
                            percent={percent}
                            status={finished ? "success" : "active"}
                        />
                    </Col>
                    <Col offset={1} span={6}>
                        <Statistic
                            title="Failures"
                            value={props.progress.errors}
                            suffix="corrected"
                        />
                    </Col>
                </Row>
            )}
        </Modal>
    );
};
