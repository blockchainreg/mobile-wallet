import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const StakeIcon = (props) => {
  return (
    <Svg width={22} height={24} viewBox="0 0 22 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.99 20.923c-2.766 0-5.885-.614-8.344-1.638-.85-.358-1.584-.923-2.194-1.393l-.112-.087a.212.212 0 00-.34.168v.665c0 1.483 1.241 2.812 3.495 3.742 2.015.832 4.677 1.29 7.495 1.29 2.818 0 5.479-.458 7.495-1.29 2.253-.93 3.495-2.259 3.495-3.742v-.665a.21.21 0 00-.232-.21.211.211 0 00-.108.042l-.118.091c-.609.468-1.341 1.032-2.188 1.389-2.46 1.024-5.578 1.638-8.344 1.638zm10.99-15.93c-.043-1.46-1.278-2.768-3.488-3.69C16.471.463 13.808 0 10.99 0 8.172 0 5.509.463 3.492 1.303 1.285 2.223.05 3.528.005 4.985L0 5.918c0 .338.275.87.773 1.306.588.514 1.461 1.021 2.525 1.465 2.263.946 5.138 1.508 7.692 1.508 2.553 0 5.43-.564 7.692-1.51 1.064-.444 1.937-.95 2.525-1.465.498-.433.773-.965.773-1.304v-.925zm-2.647 5.257c-2.458 1.027-5.577 1.638-8.343 1.638s-5.886-.611-8.345-1.638c-.852-.357-1.59-.927-2.2-1.399l-.105-.08a.211.211 0 00-.34.17v1.626c0 .339.275.765.773 1.2.588.516 1.46 1.022 2.524 1.466 2.263.945 5.14 1.508 7.693 1.508s5.429-.564 7.692-1.51c1.063-.444 1.936-.95 2.524-1.465.499-.434.773-.86.773-1.199V8.941a.212.212 0 00-.34-.168l-.117.09c-.609.468-1.341 1.032-2.189 1.387zm-8.343 6.182c2.766 0 5.884-.613 8.343-1.638.847-.356 1.58-.92 2.189-1.388l.118-.09a.211.211 0 01.34.167v1.575c0 .337-.275.763-.774 1.199-.588.514-1.46 1.021-2.524 1.465-2.263.946-5.138 1.51-7.692 1.51-2.554 0-5.43-.564-7.693-1.509-1.063-.444-1.936-.95-2.525-1.465-.497-.436-.772-.861-.772-1.2v-1.575a.211.211 0 01.34-.169l.111.086c.61.47 1.345 1.037 2.194 1.394 2.46 1.025 5.579 1.638 8.345 1.638z"
        fill={props.fill || '#fff'}
      />
    </Svg>
  );
};
