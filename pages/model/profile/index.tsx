import { PureComponent } from 'react';
import {
  Layout, Tabs, Button, message, Modal, Tooltip, Result
} from 'antd';
import { connect } from 'react-redux';
import {
  getVideos, moreVideo, getVods, moreVod, resetVideoState
} from '@redux/video/actions';
import { getGalleries, moreGalleries, resetGalleryState } from '@redux/gallery/actions';
import { listProducts, moreProduct, resetProductState } from '@redux/product/actions';
import { performerService, paymentService, utilsService } from 'src/services';
import Head from 'next/head';
import {
  LikeOutlined, ArrowLeftOutlined, ShoppingOutlined, VideoCameraOutlined, PictureOutlined,
  UsergroupAddOutlined, HomeOutlined, ContactsOutlined
} from '@ant-design/icons';
import { TickIcon, MessageIcon, SaleVidIcon } from 'src/icons';
import { ScrollListVideo, VideoPlayer } from '@components/video';
import { ScrollListProduct } from '@components/product/scroll-list-item';
import { ConfirmSubscriptionPerformerForm, PerformerInfo } from '@components/performer';
import { ScrollListGallery } from '@components/gallery';
import { shortenLargeNumber } from '@lib/index';
import {
  IPerformer, IUser, IUIConfig, ISettings, ICountry, IError
} from 'src/interfaces';
import Router from 'next/router';
import '@components/performer/performer.less';

interface IProps {
  ui: IUIConfig;
  countries: ICountry[];
  error: IError;
  settings: ISettings;
  user: IUser;
  performer: IPerformer;
  query: any;
  listProducts: Function;
  getVideos: Function;
  moreVideo: Function;
  getVods: Function;
  moreProduct: Function;
  moreVod: Function;
  videoState: any;
  saleVideoState: any;
  productState: any;
  getGalleries: Function;
  moreGalleries: Function;
  galleryState: any;
  resetVideoState: Function;
  resetProductState: Function;
  resetGalleryState: Function;
}
const { TabPane } = Tabs;

class PerformerProfile extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  subscriptionType = 'monthly';

  state = {
    tab: 'video',
    itemPerPage: 24,
    videoPage: 0,
    vodPage: 0,
    productPage: 0,
    galleryPage: 0,
    showWelcomVideo: false,
    openSubscriptionModal: false,
    submiting: false
  };

  static async getInitialProps({ ctx }) {
    try {
      const { query } = ctx;
      const [performer, countries] = await Promise.all([
        performerService.findOne(query.username, {
          Authorization: ctx.token || ''
        }),
        utilsService.countriesList()
      ]);
      return {
        performer: performer.data,
        countries: countries.data
      };
    } catch (e) {
      return { error: await e };
    }
  }

  async componentDidMount() {
    const {
      performer
    } = this.props;
    if (performer) {
      const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos');
      const showWelcomVideo = !notShownWelcomeVideos || (notShownWelcomeVideos && !notShownWelcomeVideos.includes(performer._id));
      this.setState({ showWelcomVideo });
      this.loadItems();
    }
  }

  componentWillUnmount() {
    const { resetGalleryState: resetGal, resetProductState: resetProd, resetVideoState: resetVid } = this.props;
    resetGal();
    resetProd();
    resetVid();
  }

  loadMoreItem = async () => {
    const {
      moreVideo: moreVideoHandler,
      moreProduct: moreProductHandler,
      moreGalleries: moreGalleryHandler,
      moreVod: moreVodHandler,
      videoState: videosVal,
      productState: productsVal,
      saleVideoState: saleVideosVal,
      galleryState: galleryVal,
      performer
    } = this.props;

    const {
      videoPage, itemPerPage, vodPage, productPage, galleryPage, tab
    } = this.state;
    const query = {
      limit: itemPerPage,
      performerId: performer._id
    };
    if (tab === 'video') {
      if (videosVal.items.length >= videosVal.total) return;
      this.setState({ videoPage: videoPage + 1 });
      moreVideoHandler({
        ...query,
        offset: (videoPage + 1) * itemPerPage,
        isSaleVideo: false
      });
    }
    if (tab === 'saleVideo') {
      if (saleVideosVal.items.length >= saleVideosVal.total) return;
      this.setState({ vodPage: vodPage + 1 });
      moreVodHandler({
        ...query,
        offset: (vodPage + 1) * itemPerPage,
        isSaleVideo: true
      });
    }
    if (tab === 'gallery') {
      if (galleryVal.items.length >= galleryVal.total) return;
      this.setState({ galleryPage: galleryPage + 1 });
      moreGalleryHandler({
        ...query,
        offset: (galleryPage + 1) * itemPerPage
      });
    }
    if (tab === 'store') {
      if (productsVal.items.length >= productsVal.total) return;
      this.setState({ productPage: productPage + 1 });
      moreProductHandler({
        ...query,
        offset: (productPage + 1) * itemPerPage
      });
    }
  };

  loadItems = () => {
    const { itemPerPage, tab } = this.state;
    const {
      performer,
      getGalleries: getGalleriesHandler,
      listProducts: listProductsHandler,
      getVideos: getVideosHandler,
      getVods: getVodsHandler
    } = this.props;
    const query = {
      limit: itemPerPage,
      offset: 0,
      performerId: performer._id
    };
    switch (tab) {
      case 'video':
        this.setState({ videoPage: 0 });
        getVideosHandler({
          ...query,
          isSaleVideo: false
        });
        break;
      case 'saleVideo':
        this.setState({ vodPage: 0 });
        getVodsHandler({
          ...query,
          isSaleVideo: true
        });
        break;
      case 'gallery':
        this.setState({ galleryPage: 0 });
        getGalleriesHandler(query);
        break;
      case 'store':
        this.setState({ productPage: 0 });
        listProductsHandler(query);
        break;
      default: break;
    }
  }

  handleViewWelcomeVideo = () => {
    const { performer } = this.props;
    const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos');
    if (!notShownWelcomeVideos?.includes(performer._id)) {
      const Ids = JSON.parse(notShownWelcomeVideos || '[]');
      const values = Array.isArray(Ids) ? Ids.concat([performer._id]) : [performer._id];
      localStorage.setItem('notShownWelcomeVideos', JSON.stringify(values));
    }
    this.setState({ showWelcomVideo: false });
  }

  handleClickMessage = () => {
    const { user, performer } = this.props;
    if (!user._id) {
      message.error('You can message a model just as soon as you login/register.’');
      Router.push('/auth/login');
      return;
    }
    if (!performer.isSubscribed) {
      message.error(`Please subscribe to ${performer?.name || performer?.username || 'the model'} to start chatting`);
      return;
    }
    Router.push({
      pathname: '/messages',
      query: {
        toSource: 'performer',
        toId: performer?._id
      }
    });
  }

  handleClickSubscribe = () => {
    const { user } = this.props;
    if (!user._id) {
      message.error('You can subscribe to the models just as soon as you login/register.');
      Router.push('/auth/login');
      return;
    }
    this.setState({ openSubscriptionModal: true });
  }

  async subscribe(paymentGateway = 'ccbill') {
    const { performer } = this.props;
    try {
      await this.setState({ submiting: true });
      const resp = await (
        await paymentService.subscribe({ type: this.subscriptionType, performerId: performer._id, paymentGateway })
      ).data;
      message.info('Redirecting to payment gateway, do not reload page at this time', 30);
      if (['ccbill', 'verotel'].includes(paymentGateway)) window.location.href = resp.paymentUrl;
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  render() {
    const {
      error,
      performer,
      ui,
      countries,
      settings,
      user,
      videoState: videoProps,
      productState: productProps,
      saleVideoState: saleVideoProps,
      galleryState: galleryProps
    } = this.props;
    if (error) {
      return (
        <Result
          status={error?.statusCode === 404 ? '404' : 'error'}
          title={error?.statusCode === 404 ? null : error?.statusCode}
          subTitle={error?.statusCode === 404 ? 'Alas! It hurts us to realize that we have let you down. We are not able to find the page you are hunting for :(' : error?.message}
          extra={[
            <Button className="secondary" key="console" onClick={() => Router.push('/')}>
              <HomeOutlined />
              BACK HOME
            </Button>,
            <Button key="buy" className="primary" onClick={() => Router.push('/contact')}>
              <ContactsOutlined />
              CONTACT US
            </Button>
          ]}
        />
      );
    }
    const { items: videos = [], total: totalVideos, requesting: loadingVid } = videoProps;
    const { items: saleVideos = [], total: totalVods, requesting: loadingVod } = saleVideoProps;
    const { items: products, total: totalProducts, requesting: loadingProduct } = productProps;
    const { items: galleries, total: totalGalleries, requesting: loadingGallery } = galleryProps;
    const {
      showWelcomVideo, openSubscriptionModal, submiting
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | ${performer?.name || performer?.username || ''}`}
          </title>
          <meta
            name="keywords"
            content={`${performer?.username}, ${performer?.name}`}
          />
          <meta name="description" content={performer?.bio} />
          {/* OG tags */}
          <meta
            property="og:title"
            content={`${ui?.siteName} | ${performer?.name || performer?.username || ''}`}
            key="title"
          />
          <meta property="og:image" content={performer?.avatar || '/no-avatar.png'} />
          <meta
            property="og:keywords"
            content={`${performer?.username}, ${performer?.name}`}
          />
          <meta
            property="og:description"
            content={performer?.bio}
          />
          {/* Twitter tags */}
          <meta
            name="twitter:title"
            content={`${ui?.siteName} | ${performer?.name || performer?.username || ''}`}
          />
          <meta name="twitter:image" content={performer?.avatar || '/no-avatar.png'} />
          <meta
            name="twitter:description"
            content={performer?.bio}
          />
        </Head>
        <div className="main-container">
          <div
            className="top-profile"
            style={{
              backgroundImage:
              performer?.cover
                ? `url('${performer?.cover}')`
                : "url('/banner-image.jpg')"
            }}
          >
            <div className="bg-2nd">
              <div className="top-banner">
                <a aria-hidden className="arrow-back" onClick={() => Router.back()}>
                  <ArrowLeftOutlined />
                </a>
                <div className="stats-row">
                  <div className="tab-stat">
                    {/* <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.views || 0)}
                        {' '}
                        <EyeOutlined />
                      </span>
                    </div> */}
                    <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.totalVideos || 0)}
                        {' '}
                        <VideoCameraOutlined />
                      </span>
                    </div>
                    <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.totalPhotos || 0)}
                        {' '}
                        <PictureOutlined />
                      </span>
                    </div>
                    <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.totalProducts || 0)}
                        {' '}
                        <ShoppingOutlined />
                      </span>
                    </div>
                    <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.likes || 0)}
                        {' '}
                        <LikeOutlined />
                      </span>
                    </div>
                    <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.subscribers || 0)}
                        {' '}
                        <UsergroupAddOutlined />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-profile">
            <div className="fl-col">
              <img
                alt="Avatar"
                src={performer?.avatar || '/no-avatar.png'}
              />
              <div className="m-user-name">
                <Tooltip title={performer?.name}>
                  <h4>
                    {performer?.name || 'N/A'}
                    &nbsp;
                    {performer?.verifiedAccount && <TickIcon />}
                  </h4>
                </Tooltip>
                <h5>
                  @
                  {performer?.username || 'n/a'}
                </h5>
              </div>
            </div>
            <div className="btn-grp">
              {user && !user.isPerformer && (
                <Button className="primary" onClick={() => this.handleClickMessage()}>
                  <MessageIcon />
                  {' '}
                  Message
                </Button>
              )}
            </div>
            <div className={user.isPerformer ? 'mar-0 pro-desc' : 'pro-desc'}>
              <PerformerInfo countries={countries} performer={performer} />
            </div>
            {!performer?.isSubscribed && !user?.isPerformer && (
              <div className="subscription-bl">
                <Button
                  className="sub-btn"
                  disabled={(submiting && this.subscriptionType === 'monthly') || user?.isPerformer}
                  onClick={() => {
                    this.subscriptionType = 'monthly';
                    this.handleClickSubscribe();
                  }}
                >
                  {`Monthly Subscription | $${performer?.monthlyPrice.toFixed(2)}`}
                </Button>
                <Button
                  className="sub-btn"
                  disabled={(submiting && this.subscriptionType === 'yearly') || user?.isPerformer}
                  onClick={() => {
                    this.subscriptionType = 'yearly';
                    this.handleClickSubscribe();
                  }}
                >
                  {`Yearly Subscription | $${performer?.yearlyPrice.toFixed(2)}`}
                </Button>
              </div>
            )}
          </div>
          <div className="model-content">
            <Tabs defaultActiveKey="Video" className="model-tabs" size="large" onTabClick={(tab) => this.setState({ tab }, () => this.loadItems())}>
              <TabPane
                tab={(<Tooltip placement="top" title="Videos"><VideoCameraOutlined /></Tooltip>)}
                key="video"
              >
                {/* <div className="heading-tab">
                  <h4>
                    {totalVideos > 1 ? `${totalVideos} VIDEOS` : 'VIDEO'}
                  </h4>
                </div> */}
                <ScrollListVideo
                  items={videos}
                  loading={loadingVid}
                  canLoadmore={videos && videos.length < totalVideos}
                  loadMore={this.loadMoreItem.bind(this)}
                />

              </TabPane>
              <TabPane
                tab={<Tooltip placement="top" title="Premium content"><span><SaleVidIcon /></span></Tooltip>}
                key="saleVideo"
              >
                {/* <div className="heading-tab">
                  <h4>
                    {totalVods > 1 ? `${totalVods} SALE VIDEOS` : 'SALE VIDEO'}
                  </h4>
                </div> */}
                <ScrollListVideo
                  items={saleVideos}
                  loading={loadingVod}
                  canLoadmore={saleVideos && saleVideos.length < totalVods}
                  loadMore={this.loadMoreItem.bind(this)}
                />
              </TabPane>
              <TabPane
                tab={<Tooltip placement="top" title="Galleries"><PictureOutlined /></Tooltip>}
                key="gallery"
              >
                {/* <div className="heading-tab">
                  <h4>
                    {totalGalleries > 1 ? `${totalGalleries} GALLERIES` : 'GALLERY'}
                  </h4>
                </div> */}
                <ScrollListGallery
                  items={galleries}
                  loading={loadingGallery}
                  canLoadmore={galleries && galleries.length < totalGalleries}
                  loadMore={this.loadMoreItem.bind(this)}
                />
              </TabPane>

              <TabPane
                tab={<Tooltip placement="top" title="Merchandise"><ShoppingOutlined /></Tooltip>}
                key="store"
              >
                {/* <div className="heading-tab">
                  <h4>
                    {totalProducts > 1 ? `${totalProducts} PRODUCTS` : 'PRODUCT'}
                  </h4>
                </div> */}
                <ScrollListProduct
                  items={products}
                  loading={loadingProduct}
                  canLoadmore={products && products.length < totalProducts}
                  loadMore={this.loadMoreItem.bind(this)}
                />
              </TabPane>

            </Tabs>
          </div>
        </div>
        {performer
          && performer?.welcomeVideoPath
          && performer?.activateWelcomeVideo && (
            <Modal
              key="welcome-video"
              destroyOnClose
              width={767}
              visible={showWelcomVideo}
              title={null}
              onCancel={() => this.setState({ showWelcomVideo: false })}
              footer={[
                <Button
                  key="close"
                  className="secondary"
                  onClick={() => this.setState({ showWelcomVideo: false })}
                >
                  Close
                </Button>,
                <Button
                  style={{ marginLeft: 0 }}
                  key="close-show"
                  className="primary"
                  onClick={this.handleViewWelcomeVideo.bind(this)}
                >
                  Don&apos;t show me again
                </Button>
              ]}
            >
              <VideoPlayer {...{
                key: performer?._id,
                autoplay: true,
                controls: true,
                playsinline: true,
                fluid: true,
                sources: [
                  {
                    src: performer?.welcomeVideoPath,
                    type: 'video/mp4'
                  }
                ]
              }}
              />
            </Modal>
        )}
        <Modal
          key="subscribe_performer"
          centered
          width={600}
          title={null}
          visible={openSubscriptionModal}
          confirmLoading={submiting}
          footer={null}
          onCancel={() => this.setState({ openSubscriptionModal: false })}
        >
          <ConfirmSubscriptionPerformerForm
            settings={settings}
            type={this.subscriptionType || 'monthly'}
            performer={performer}
            submiting={submiting}
            onFinish={this.subscribe.bind(this)}
          />
        </Modal>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  settings: { ...state.settings },
  videoState: { ...state.video.videos },
  saleVideoState: { ...state.video.saleVideos },
  productState: { ...state.product.products },
  galleryState: { ...state.gallery.galleries },
  user: { ...state.user.current }
});

const mapDispatch = {
  getVideos,
  moreVideo,
  getVods,
  listProducts,
  moreProduct,
  getGalleries,
  moreGalleries,
  moreVod,
  resetProductState,
  resetVideoState,
  resetGalleryState
};
export default connect(mapStates, mapDispatch)(PerformerProfile);
