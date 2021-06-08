import React from 'react';
import { View } from 'react-native'
import Jdenticon from 'react-native-jdenticon';

const IdentIcon = (props) => {
    const config = {
        saturation: {
            color: 0.7
        }
    };

    const style = {
        padding: 3,
        borderRadius: 0,
        backgroundColor: props.backgroundColor || null,
        // marginRight: props.marginRight || null
    }

    return (
        <View>
            <Jdenticon
                value={props.address}
                size={props.size || 50}
                config={config}
                style={style}
            />
        </View>
    )
}

export default IdentIcon;