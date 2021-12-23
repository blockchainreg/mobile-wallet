import * as React from 'react';
import { ProgressBar } from 'react-native-paper';
import Images from '../Images';

export default ({ store }) => {
  const { stakingStore } = store;
  const epochTime = stakingStore.epochTime;
  const formatTime = epochTime * 3600;
  const fullTimeEpoch = 172800;
  //   console.log('formatTime', formatTime)
  const progress = (formatTime) => {
    if (!formatTime) return 0;
    if (formatTime <= fullTimeEpoch && formatTime > 0.9 * fullTimeEpoch)
      return 0.1;
    if (formatTime <= 0.9 * fullTimeEpoch && formatTime > 0.8 * fullTimeEpoch)
      return 0.2;
    if (formatTime <= 0.8 * fullTimeEpoch && formatTime > 0.7 * fullTimeEpoch)
      return 0.3;
    if (formatTime <= 0.7 * fullTimeEpoch && formatTime > 0.6 * fullTimeEpoch)
      return 0.4;
    if (formatTime <= 0.6 * fullTimeEpoch && formatTime > 0.5 * fullTimeEpoch)
      return 0.5;
    if (formatTime <= 0.5 * fullTimeEpoch && formatTime > 0.4 * fullTimeEpoch)
      return 0.6;
    if (formatTime <= 0.4 * fullTimeEpoch && formatTime > 0.3 * fullTimeEpoch)
      return 0.7;
    if (formatTime <= 0.3 * fullTimeEpoch && formatTime > 0.2 * fullTimeEpoch)
      return 0.8;
    if (formatTime <= 0.2 * fullTimeEpoch && formatTime > 0.1 * fullTimeEpoch)
      return 0.9;
    if (formatTime <= 0.1 * fullTimeEpoch) return 1;
  };

  return (
    <ProgressBar
      style={{ paddingVertical: 0 }}
      progress={progress(formatTime)}
      color={Images.orange}
    />
  );
};
