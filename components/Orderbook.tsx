import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SocketFeed, DeltaType } from '../lib/constants';

import OrderbookTable from './OrderbookTable';

import { throttle } from 'lodash';

const Orderbook = () => {
  const bids = useRef([]);
  const asks = useRef([]);

  const [, setDummy] = useState(1);
  const throttledRerender = useCallback(
    throttle(() => {
      setDummy((x) => x + 1);
    }, 750),
    [setDummy]
  );

  const handleOrdersUpdate = (originalOrders, newOrders) => {
    newOrders.forEach((newOrder) => {
      let addOrder = true;
      const newOrderPrice = newOrder[0];
      for (let i = 0; i < originalOrders.length; i++) {
        if (newOrderPrice === originalOrders[i][0]) {
          originalOrders[i][1] = newOrder[1];
          addOrder = false;
          break;
        }
      }
      if (addOrder) {
        originalOrders.push(newOrder);
      }
    });
    return originalOrders.filter((order) => order[1] !== 0);
  };

  const handleDelta = (deltaData) => {
    const newBids = deltaData.bids;
    const newAsks = deltaData.asks;

    if (newBids?.length > 0) {
      bids.current = handleOrdersUpdate([...bids.current], newBids);
    }

    if (newAsks?.length > 0) {
      asks.current = handleOrdersUpdate([...asks.current], newAsks);
    }

    throttledRerender();
  };

  useEffect(() => {
    const socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1');
    socket.addEventListener('open', function (event) {
      const message = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: ['PI_XBTUSD'],
      };

      socket.send(JSON.stringify(message));
    });

    socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data);
      if (data.feed === SocketFeed.SNAPSHOT) {
        bids.current = bids.current.concat(data.bids);
        asks.current = asks.current.concat(data.asks);
        throttledRerender();
      } else if (data.feed === SocketFeed.BOOK) {
        handleDelta(data);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <OrderbookTable deltaType={DeltaType.BIDS} orders={bids.current} />
      <OrderbookTable deltaType={DeltaType.ASKS} orders={asks.current} />
    </div>
  );
};

export default Orderbook;
