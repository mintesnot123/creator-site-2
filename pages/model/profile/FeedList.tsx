import { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Row, Col } from 'antd';
import { IGallery } from '@interfaces/gallery';
import ProfileCard from './ProfileCard';
import AddPost from './AddPost';

interface IProps {
    items: number[];
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
                    <Col xs={24} sm={24} md={16} lg={16}
                        key={"add"}
                    >
                        <AddPost />
                    </Col>
                    {items.length > 0
                        && items.map((gallery: number) => (
                            <Col xs={24} sm={24} md={16} lg={16}
                                key={gallery}
                            >
                                <ProfileCard />
                            </Col>
                        ))}
                </Row>
                {!loading && !items.length && <div className="text-center">No gallery was found</div>}
                {loading && <div className="text-center"><Spin /></div>}
            </InfiniteScroll>
        );
    }
}
export default ScrollListGallery;
