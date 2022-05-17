import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Card, Avatar, Input, Button, Switch } from "antd";
import { MdMoreVert } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";
import DropzoneComponent from '@components/common/DropzoneComponent.js';

import './add-post.less';
const AddPostComponent = () => {

    const { TextArea } = Input;
    const [currentTab2, setCurrentTab2] = useState('image');
    const onChangeTab2 = (tab) => {
        setCurrentTab2(tab);
    }

    return (

        <div >
            <TextArea className="post-card-textarea" rows={4} placeholder="Post photo or videos" maxLength={6} />
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
        </div>
    );
}

export default AddPostComponent;