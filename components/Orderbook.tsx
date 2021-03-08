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
});

const Orderbook = () => {
  const classes = useStyles();
  const bids = useRef([]);
  const asks = useRef([]);

  const [sliderValue, setSliderValue] = useState(10);

  const handleSliderValue = (value: number) => {
    if (value !== sliderValue) {
      setSliderValue(value);
    }
  };

  const [, setRerender] = useState(1);
  const throttledRerender = useCallback(
    throttle(() => {
      setRerender((x) => x + 1);
    }, 500),
    [setRerender]
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
    <div>
      <Typography variant="body1" gutterBottom>
        Adjust the number of displayed orders by using the slider.
      </Typography>
      <Slider
        defaultValue={10}
        getAriaValueText={handleSliderValue}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={20}
      />
      <div className={classes.wrapper}>
        <OrderbookTable
          deltaType={DeltaType.BIDS}
          orders={bids.current.slice(0, sliderValue)}
        />
        <OrderbookTable
          deltaType={DeltaType.ASKS}
          orders={asks.current.slice(0, sliderValue)}
        />
      </div>
    </div>
  );
};

export default Orderbook;
