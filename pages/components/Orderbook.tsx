import React, { useEffect, useState, Fragment } from 'react';
import { SocketFeed, PriceType } from '../../lib/constants';

import CircularProgress from '@material-ui/core/CircularProgress';

import OrderbookTable from './OrderbookTable';

const Orderbook = () => {
  const [bids, setBids] = useState<[]>([]);
  const [newBids, setNewBids] = useState([]);

  const [asks, setAsks] = useState<[]>([]);
  const [newAsks, setNewAsks] = useState([]);

  const handleNewPrices = (priceType: string) => {
    const currentPrices = priceType === PriceType.BIDS ? [...bids] : [...asks];
    const newPrices = priceType === PriceType.BIDS ? newBids : newAsks;

    newPrices.forEach((newPrice) => {
      let addPrice = true;
      const price = newPrice[0];
      for (let i = 0; i < currentPrices.length; i++) {
        if (price === currentPrices[i][0]) {
          currentPrices[i][1] = newPrice[1];
          addPrice = false;
          break;
        }
      }

      if (addPrice) {
        currentPrices.push(newPrice);
      }
    });

    const handlerToUse = priceType === PriceType.BIDS ? setBids : setAsks;
    handlerToUse(currentPrices.filter((price) => price[1] !== 0).sort());
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
        setBids(data.bids);
        setAsks(data.asks);
      } else if (data.feed === SocketFeed.BOOK) {
        if (data.bids?.length > 0) {
          debounce(() => setNewBids(data.bids), 1000);
        }
        if (data.asks?.length > 0) {
          debounce(() => setNewAsks(data.asks), 1000);
        }
      }
    });

    // cleanup here later
  }, []);

  useEffect(() => {
    handleNewPrices(PriceType.BIDS);
  }, [newBids]);

  useEffect(() => {
    handleNewPrices(PriceType.ASKS);
  }, [newAsks]);

  return (
    <div style={{ display: 'flex' }}>
      {bids.length === 0 && asks.length === 0 ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <OrderbookTable priceType={PriceType.BIDS} prices={bids} />
          <OrderbookTable priceType={PriceType.ASKS} prices={asks} />
        </Fragment>
      )}
    </div>
  );
};

export default Orderbook;

// {"feed":"book_ui_1","product_id":"PI_XBTUSD","bids":[],"asks":[[49147.5,2388590}
