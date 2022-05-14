import { Row, Col, Divider, Card, Avatar } from "antd";
const ProfileCard = () => {
    const { Meta } = Card;
    return (
        <Card
            style={{ width: "100%", /*width: "100%" */ }}
            className="video-card"
            hoverable
            cover={
                <>
                    <Meta
                        avatar={
                            <Avatar src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" shape="square" size={{ xs: 10, sm: 10, }} />
                        }
                        title="Card title"
                        style={{ padding: "10px 10px" }}
                    /* description="This is the description" */
                    />
                    <Divider style={{ padding: "0px 0px" }} />
                    <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                    {/* <img
                        style={{ padding: "0px 0px" }}
                        height={180}
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    /> */}
                </>
            }
        >
            <Row justify="space-between" align="middle">
                <Col span={12}>Rock Songs</Col>
                <Col span={12} className="price-container">$5.00</Col></Row>
        </Card>
    );
}

export default ProfileCard;