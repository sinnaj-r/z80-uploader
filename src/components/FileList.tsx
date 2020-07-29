import React from "react";
import { List, Space, Button } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { FileOutlined, DeleteOutlined } from "@ant-design/icons";

export const FileList = ({
    data,
    removeFile,
}: {
    data: UploadFile[];
    removeFile: (uid: string) => void;
}) => {
    return (
        <List
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={() => removeFile(item.uid)}
                        />,
                    ]}
                >
                    <Space>
                        <FileOutlined />
                        {item.name}
                    </Space>
                </List.Item>
            )}
        />
    );
};
