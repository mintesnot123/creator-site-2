import { Row, Col, Divider, Card, Avatar } from "antd";
const ProfileCard = () => {
    return (
        <Card
            style={{ width: "100%", /*width: "100%" */ }}
            className="video-card"
            hoverable
            cover={
                <img
                    height={180}
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }
        >
            {/* <Meta
                        avatar={
                          <Avatar src="https://joeschmoe.io/api/v1/random" />
                        }
                        title="Card title"
                        description="This is the description"
                      /> */}
            <Row justify="space-between" align="middle">
                <Col span={12}>Rock Songs</Col>
                <Col span={12} className="price-container">$5.00</Col></Row>
        </Card>
    );
}

export default ProfileCard;