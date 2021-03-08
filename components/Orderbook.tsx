import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { throttle } from 'lodash';
import { SocketFeed, DeltaType } from '../lib/constants';

import OrderbookTable from './OrderbookTable';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    '@media(max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  pageHeaderWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const groupBy = (ary, keyFunc) => {
  const r = {};
  ary.forEach(function (x) {
    const currentPrice = x[0];
    const y = keyFunc(currentPrice);
    r[y] = (r[y] || []).concat([x]);
  });
  return Object.keys(r).map(function (y) {
    return r[y];
  });
};

const Orderbook = (): JSX.Element => {
  const classes = useStyles();

  const bids = useRef([]);
  const asks = useRef([]);

  const groupedBids = useRef([]);
  const groupedAsks = useRef([]);

  const groupingSliderValue = useRef(0);

  // This hook is for triggering a rerender
  const [, setRerender] = useState(1);
  const throttledRerender = useCallback(
    throttle(() => {
      setRerender((x) => x + 1);
    }, 500),
    [setRerender]
  );

  const handleSliderValue = (value: number) => {
    if (value !== groupingSliderValue.current) {
      groupingSliderValue.current = value;
    }
  };

  const handlePriceGrouping = () => {
    // Helper callbacks
    const roundingFunc = (x) => Math.floor(x / groupingSliderValue.current);
    const groupingCb = (group) => {
      let totalSize = 0;
      group.forEach((order) => {
        totalSize += order[1];
      });
      return [Math.floor(group[0][0]), totalSize];
    };

    const groupingBids = groupBy([...bids.current], roundingFunc);
    const groupingAsks = groupBy([...asks.current], roundingFunc);

    groupedBids.current = groupingBids.map(groupingCb);
    groupedAsks.current = groupingAsks.map(groupingCb);

    throttledRerender();
  };

  const handleOrdersUpdate = (originalOrders, newOrders) => {
    newOrders.forEach((newOrder) => {
      let addOrder = true;
      const newOrderPrice = newOrder[0];
      for (let i = 0; i < originalOrders.length; i++) {
        // If the order price already exists, we want to replace it with the new order price
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

    if (groupingSliderValue.current > 0) {
      handlePriceGrouping();
    } else {
      throttledRerender();
    }
  };

  useEffect(() => {
    const socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1');
    socket.addEventListener('open', function () {
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
      } else if (
        data.feed === SocketFeed.BOOK &&
        (bids.current.length > 0 || asks.current.length > 0)
      ) {
        handleDelta(data);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <div className={classes.pageHeaderWrapper}>
        <Typography variant="h4" gutterBottom>
          XBT/USD
        </Typography>
        <Typography variant="h6" gutterBottom>
          Price Level Grouping
        </Typography>
        <Typography variant="body1" gutterBottom>
          Adjust the granularity of the order book using the slider.
        </Typography>
        <Slider
          defaultValue={0}
          getAriaValueText={handleSliderValue}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={100}
        />
      </div>
      <div className={classes.wrapper}>
        <OrderbookTable
          deltaType={DeltaType.BIDS}
          orders={
            groupingSliderValue.current > 0
              ? (groupedBids.current as [])
              : (bids.current as [])
          }
        />
        <OrderbookTable
          deltaType={DeltaType.ASKS}
          orders={
            groupingSliderValue.current > 0
              ? (groupedAsks.current as [])
              : (asks.current as [])
          }
        />
      </div>
    </div>
  );
};

export default Orderbook;
