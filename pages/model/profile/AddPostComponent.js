import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Card, Avatar, Input, Button, Switch, message, Form, Select, Upload } from "antd";
import { MdMoreVert } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";
import DropzoneComponent from '@components/common/DropzoneComponent.js';
import Router from 'next/router';

import './add-post.less';
const AddPostComponent = () => {

    const { TextArea } = Input;
    const [currentTab2, setCurrentTab2] = useState('image');
    const onChangeTab2 = (tab) => {
        setCurrentTab2(tab);
    }

    const [form] = Form.useForm();
    const [submiting, setSubmiting] = useState(false);

    const onFinish = async (data) => {
        try {
            setSubmiting(true);
            await galleryService.create(data);
            message.success('Created successfully!');
            Router.push('/model/my-gallery/listing');
        } catch (e) {
            setSubmiting(false);
            message.error(getResponseError(await e) || 'An error occurred, please try again!');
        }
    }

    return (

        <div >
            <Form
                form={form}
                name="postForm"
                onFinish={onFinish}
                initialValues={
                    { name: '', status: 'active', description: '' }
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="account-form"
            >
                <Form.Item
                    name="description"
                >
                    <TextArea className="post-card-textarea" rows={4} placeholder="Post photo or videos" maxLength={6} />
                </Form.Item>
                <Row >
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <div className='button-tab-wrapper'>
                            <div className={`tab-button ${currentTab2 === 'image' && "active"}`}>
                                <Button type="primary" onClick={() => onChangeTab2('image')}>
                                    Image
                                </Button>
                            </div>
                            <div className={`tab-button ${currentTab2 === 'video' && "active"}`}>
                                <Button type="primary" onClick={() => onChangeTab2('video')}>
                                    Video
                                </Button>
                            </div>
                            <div className={`tab-button ${currentTab2 === 'tag' && "active"}`}>
                                <Button type="primary" onClick={() => onChangeTab2('tag')}>
                                    Tag
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <DropzoneComponent className="post-card-image-drop" />

                <Row className='post-btn-wrapper'>
                    <Col span={24} style={{ textAlign: 'left' }}>
                        <Switch defaultChecked onChange={(checked) => console.log(checked)} /><span className='swith-label'>Premium</span>
                    </Col>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" danger>
                            Post
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default AddPostComponent;