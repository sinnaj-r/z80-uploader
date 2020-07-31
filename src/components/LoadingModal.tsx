import * as React from "react";
import Modal from "antd/lib/modal/Modal";
import { ProgressType } from "../helper/serialConnection";
import { Progress, Row, Col, Statistic } from "antd";
type Props = {
    visible: boolean;
    onClose: () => void;
    progress: ProgressType;
};
export const LoadingModal = (props: Props) => {
    const percent = Math.ceil(
        (props.progress.finished / props.progress.total) * 100
    );
    return (
        <Modal
            title="Transmit in Progress"
            visible={props.visible}
            closable={props.progress.completed}
            confirmLoading={!props.progress.completed}
            maskClosable={props.progress.completed}
            onOk={props.onClose}
            cancelButtonProps={{ disabled: true }}
        >
            <Row gutter={16} justify="space-between" align="middle">
                <Col span={17}>
                    <Progress percent={percent} status="active" />
                </Col>
                <Col offset={1} span={6}>
                    <Statistic title="Failures" value={props.progress.errors} />
                </Col>
            </Row>
        </Modal>
    );
};
