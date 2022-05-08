import { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { IVideo } from 'src/interfaces/video';
import VideoCard from './video-card';

interface IProps {
  videos: IVideo[];
}

export class PerformerListVideo extends PureComponent<IProps> {
  render() {
    const { videos } = this.props;
    return (
      <Row>
        {videos.length > 0
          && videos.map((video: IVideo) => {
            if (!video) return null;
            return (
              <Col xs={12} sm={12} md={6} lg={6} key={video?._id}>
                <VideoCard video={video} />
              </Col>
            );
          })}
      </Row>
    );
  }
}
