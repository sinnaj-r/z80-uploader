import React, { useState } from "react";
import { List, Space, Button, Input } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import {
    FileOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
} from "@ant-design/icons";

export const FileList = ({
    data,
    removeFile,
    editFileName,
}: {
    data: UploadFile[];
    removeFile: (uid: string) => void;
    editFileName: (uid: string, name: string) => void;
}) => {
    const [editEnabled, setEditEnabled] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState("");
    return (
        <List
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item
                    actions={
                        editEnabled === item.uid
                            ? [
                                  <Button
                                      icon={<CheckOutlined />}
                                      onClick={() => {
                                          editFileName(item.uid, newFileName);
                                          setEditEnabled(null);
                                      }}
                                  />,
                              ]
                            : [
                                  <Button
                                      icon={<EditOutlined />}
                                      onClick={() => {
                                          setNewFileName(item.name);
                                          setEditEnabled(item.uid);
                                      }}
                                  />,
                                  <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => removeFile(item.uid)}
                                  />,
                              ]
                    }
                >
                    <Space>
                        <FileOutlined />
                        {editEnabled === item.uid ? (
                            <Input
                                onChange={({ target: { value } }) =>
                                    setNewFileName(value)
                                }
                                value={newFileName}
                            />
                        ) : (
                            item.name
                        )}
                    </Space>
                </List.Item>
            )}
        />
    );
};
