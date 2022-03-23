import * as Sentry from '@sentry/react-native';
import { ExtraErrorData as ExtraErrorDataIntegration } from '@sentry/integrations';

export const initCrashreporting = () => {
  if (__DEV__) {
    // do not init sentry in dev mode
    return;
  }

  // to avoid performance issues in prod mode console.* invocations should be removed or stubbed
  // https://reactnative.dev/docs/performance#using-consolelog-statements
  const stubArrowFunc = () => {};
  console.log = stubArrowFunc;
  console.warn = stubArrowFunc;
  console.info = stubArrowFunc;
  console.debug = stubArrowFunc;
  console.assert = stubArrowFunc;

  Sentry.init({
    dsn: 'https://4c978e8a45e94d4c85b4419b2882b55b@o1175175.ingest.sentry.io/6271876',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    // tracesSampleRate: __DEV__ ? 1.0 : 0.5,
    integrations: [
      new ExtraErrorDataIntegration({
        // Limit of how deep the object serializer should go. Anything deeper than limit will
        // be replaced with standard Node.js REPL notation of [Object], [Array], [Function] or
        // a primitive value. Defaults to 3.
        // When changing this value, make sure to update `normalizeDepth` of the whole SDK
        // to `depth + 1` in order to get it serialized properly - https://docs.sentry.io/platforms/javascript/configuration/options/#normalize-depth
        depth: 3,
      }),
    ],
  });
};
