import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import getLang from '../wallet/get-lang.js';

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export default ({ children, swipeRefresh, store }) => {
  /*
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        swipeRefresh(true);
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);
   */
  // refreshing = false
  const onRefresh = (err, data) => {
    swipeRefresh();
  };
  // alert(store+"")
  //const lang = getLang(store);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={store.current.refreshingBalances}
          onRefresh={onRefresh}
          tintColor="#fff"
        />
      }
    >
      {children}
    </ScrollView>
  );
};
