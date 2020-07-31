import React from "react";
import Modal from "antd/lib/modal/Modal";
import { Button, Input } from "antd";

export default function HexViewModal({
    hexString,
    onClose,
}: {
    hexString: string;
    onClose: () => void;
}) {
    return (
        <Modal
            visible={!!hexString}
            title="Hex Code"
            onOk={onClose}
            onCancel={onClose}
            footer={[
                <Button type="primary" onClick={onClose}>
                    Ok
                </Button>,
            ]}
        >
            <Input.TextArea
                rows={10}
                cols={30}
                value={hexString}
                style={{ fontFamily: "monospace", color: "black" }}
                disabled
            ></Input.TextArea>
        </Modal>
    );
}
