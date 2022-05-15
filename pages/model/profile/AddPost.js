import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Card, Avatar, Input } from "antd";
import { MdMoreVert } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";

import './profile-card.less';
const ProfileCard = () => {
    const { Meta } = Card;
    const { TextArea } = Input;
    const [currentTab, setCurrentTab] = useState('post');
    const onChangeTab = (tab) => {
        setCurrentTab(tab);
    }
    return (
        <Card
            style={{ width: "100%" }}
            className="add-post-card-wrapper"
        /* hoverable */
        >
            <Row className='add-post-header-tabs-wrapper' justify="center" gutter={32}>
                <Col span={6}>
                    <div className='add-post-header-tabs' onClick={() => onChangeTab('post')}>
                        Post
                    </div>
                </Col>
                <Col span={6}>
                    <div className='add-post-header-tabs' onClick={() => onChangeTab('clips')}>
                        Clips
                    </div>
                </Col>
                <Col span={6}>
                    <div className='add-post-header-tabs' onClick={() => onChangeTab('pic-set')}>
                        Pic Set
                    </div>
                </Col>
                <Col span={6}>
                    <div className='add-post-header-tabs' onClick={() => onChangeTab('live-show')}>
                        Live show
                    </div>
                </Col>
            </Row>
            <TextArea rows={4} placeholder="Post photo or videos" maxLength={6} />
        </Card>
    );
}

export default ProfileCard;