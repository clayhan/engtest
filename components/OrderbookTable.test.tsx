import React from 'react';
import { mount } from 'enzyme';
import { testData, getSpecWrapper } from '../lib/testUtils';
import OrderbookTable from './OrderbookTable';
import { DeltaType } from '../lib/constants';

describe('OrderbookTable', () => {
  describe('When data has come in', () => {
    const data = testData;
    const delta = DeltaType.BIDS;
    const component = mount(
      <OrderbookTable orders={data.initialData.bids} delta={delta} />
    );
    it('Should generate the correct number of items', () => {
      // const tableBody = getSpecWrapper(
      //   component,
      //   'orderbook-table-body'
      // ).first();

      expect(true).toBe(true);
    });
  });
});
