import * as React from 'react';
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg';

export const WithdrawImage = (props) => {
  return (
    <Svg
      width={64}
      height={37}
      viewBox="0 0 64 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0-319728)" d="M0 0H64V37H0z" />
      <Defs>
        <Pattern
          id="pattern0-319728"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0" transform="scale(.01563 .02703)" />
        </Pattern>
        <Image
          id="image0"
          width={64}
          height={37}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAlCAYAAADyUO83AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAJQAAAAAXg7qNAAACP0lEQVRoBd2Zu0rEQBSGTSN4abVS8C6CpU/gC+hqJ1iJpa/hrRDsrHwDUXt1rSwUtBCx9d4IgltqsX6z5ODu6JqcJJvMeODfk4S5nO/PTLKQoK2gqFarE0w9id7QRRAElYJKyXdawPvQIaqPd06W8q2kgNmAHEB39eTW8WYBZeUzZQx48eL/maCAFxM28rktOcwC0SC6FzJF9t+EFPDik78mZADvrwlUPoSSLHuBtrM/KyGEf7AJMjh334QWwot/7ppAhcNIe+ev6PMhdDGzeyZQeBL4U/p1oRmkNWE9hzd4vClC+EeyJmrwMgMd/TSBws2d18KX6dMp8JK55pcJFDyCMoGvM2GWMd3fDq2A98aEEP6JrIkyjX8se4G2M22TrIQ1e5zMzynMLPuWwkvRzplAQaN5wTtnQkL4E/rFXvYCbWfGKCHtgzG77RDCP5M1kQm8mMHExZjAxGOoUPjCTHAJPncTXIRPacKq9I/MIfwLWROZ7vmoIiksyTMh2gQGHkdOw4s51DmHtG+H5iYkhD+mX+pXnUBpc2Ym+AgvZoUmfJI18b0S6NWN/vpc9dvA5s53SBFFZ2ox20FrwnKtbjpuIU04BS/mA6A1wXyQ7Wnj51ZB7yR8ChNKxoBKTAOOaOfMshdoO1PjPIq7HVaMAWcoKryAFzOAiWvCtDFgMYLeK3iFCTdwt9fac7DbxIR9rju/7AXaztRu/jGah50dr1yYamjPBfMU3UPX6AAtNDTw9ASOfrSDLtE52ka9gvMFWOn1B6UbI9UAAAAASUVORK5CYII="
        />
      </Defs>
    </Svg>
  );
};
