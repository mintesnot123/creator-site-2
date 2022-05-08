import { Row, Col, Spin } from 'antd';
import { PureComponent } from 'react';
import { StarOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { IPerformer } from 'src/interfaces';
import PerformerCard from './card';
import './performer.less';

interface IProps {
  performers: IPerformer[];
  fetching: boolean;
}

export class HomePerformers extends PureComponent<IProps> {
  render() {
    const { performers, fetching } = this.props;
    return (
      <div>
        <Row>
          {performers.length > 0 && performers.map((p: any) => (
            <Col xs={12} sm={12} md={6} lg={6} key={p._id}>
              <PerformerCard performer={p} />
            </Col>
          ))}
        </Row>
        {fetching && <div className="text-center" style={{ margin: 20 }}><Spin /></div>}
        {performers.length > 8 && (
        <div className="show-all">
          <Link href="/model">
            <a>
              <StarOutlined />
              {' '}
              All Models
            </a>
          </Link>
        </div>
        )}
      </div>
    );
  }
}
