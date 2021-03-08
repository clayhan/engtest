import { ReactWrapper } from 'enzyme';

export const testData = {
  initialData: {
    bids: [[100, 10], [200, 20], [300, 30], [400, 40], [500, 50]],
    asks: [[100, 10], [200, 20], [300, 30], [400, 40], [500, 50]]
  },
  newData: {
    bids: [[600, 60], [700, 70], [800, 80], [900, 90], [1000, 100]],
    asks: [[600, 60], [700, 70], [800, 80], [900, 90], [1000, 100]]
  },
  zeroData: {
    bids: [[100, 0]],
    asks: [[200, 0]]
  },
  newSizeData: {
    bids: [[300, 50], [400, 50]],
    asks: [[500, 60]]
  }
};

export const getSpecWrapper = (componentWrapper: ReactWrapper, specName: string) => {
  return componentWrapper.find(`[data-spec=“${specName}“]`);
};