import { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Row, Col } from 'antd';
import { IGallery } from '@interfaces/gallery';
import GalleryCard from './gallery-card';

interface IProps {
  items: IGallery[];
  canLoadmore: boolean;
  loadMore(): Function;
  loading: boolean;
}

export class ScrollListGallery extends PureComponent<IProps> {
  render() {
    const {
      items = [], loadMore, canLoadmore = false, loading = false
    } = this.props;
    return (
      <InfiniteScroll
        dataLength={items.length}
        hasMore={canLoadmore}
        loader={null}
        next={loadMore}
        endMessage={null}
        scrollThreshold={0.9}
      >
        <Row>
          {items.length > 0
              && items.map((gallery: IGallery) => (
                <Col
                  xs={12}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={6}
                  key={gallery._id}
                >
                  <GalleryCard gallery={gallery} />
                </Col>
              ))}
        </Row>
        {!loading && !items.length && <div className="text-center">No gallery was found</div>}
        {loading && <div className="text-center"><Spin /></div>}
      </InfiniteScroll>
    );
  }
}
