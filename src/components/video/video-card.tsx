import {
  EyeFilled, LikeFilled, HourglassFilled, PlayCircleOutlined, CommentOutlined
} from '@ant-design/icons';
import { Tooltip, message } from 'antd';
import { connect } from 'react-redux';
import { videoDuration } from '@lib/index';
import { IVideo, IUser } from 'src/interfaces';
import { shortenLargeNumber } from '@lib/number';
import Router from 'next/router';
import './video.less';

interface IProps {
  video: IVideo;
  user: IUser
}

const VideoCard = ({ video, user }: IProps) => {
  console.log('video',video)
  const { thumbnail, video: file, teaser } = video;
  const url = (thumbnail?.thumbnails && thumbnail?.thumbnails[0]) || thumbnail?.url || (teaser?.thumbnails && teaser?.thumbnails[0]) || (file?.thumbnails && file?.thumbnails[0]) || '/placeholder-image.jpg';
  return (
    <div
      aria-hidden
      onClick={() => {
        if (!user?._id) {
          message.error('Please login or register to check out videos!');
          Router.push('/auth/login');
          return;
        }
        if (user?.isPerformer && user?._id !== video?.performerId) return;
        Router.push({ pathname: '/video', query: { id: video?.slug || video?._id } }, `/video/${video?.slug || video?._id}`);
      }}
      className="vid-card"
      style={{ backgroundImage: `url(${url})`, cursor: (!user?._id || (user?.isPerformer && video?.performerId !== user?._id)) ? 'not-allowed' : 'pointer' }}
    >
      <div className="vid-price">
        {video?.isSaleVideo && video?.price > 0 && (
        <span className="label-price">
          $
          {(video?.price || 0).toFixed(2)}
        </span>
        )}
        {video?.isSchedule && (
        <span className="label-price custom">
          Upcoming
        </span>
        )}
      </div>
      <span className="play-ico"><PlayCircleOutlined /></span>
      <div className="vid-stats">
        <div className="like">
          <span>
            <EyeFilled />
            {' '}
            {shortenLargeNumber(video?.stats?.views || 0)}
          </span>
          <span>
            <LikeFilled />
            {' '}
            {shortenLargeNumber(video?.stats?.likes || 0)}
          </span>
          <span>
            <CommentOutlined />
            {' '}
            {shortenLargeNumber(video?.stats?.comments || 0)}
          </span>
        </div>
        <div className="duration">
          <HourglassFilled />
          {' '}
          {videoDuration(video?.video?.duration || 0)}
        </div>
      </div>
      <Tooltip title={video?.title}>
        <div className="vid-info">
          {video?.title}
        </div>
      </Tooltip>
    </div>
  );
};

const mapProps = (state) => ({
  user: state.user.current
});

export default connect(mapProps, {})(VideoCard);
