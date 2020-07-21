import React from "react";
import { List, Space } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { FileOutlined } from "@ant-design/icons";

export const FileList = ({ data }: { data: UploadFile[] }) => {
    return (
        <List
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Space>
                        <FileOutlined />
                        {item.name}
                    </Space>
                </List.Item>
            )}
        />
    );
};
