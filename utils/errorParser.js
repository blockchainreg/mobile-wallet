export class ErrorParser {
  static parse(error) {
    const prepare_str = (str) => {
      return (str || '').toString();
    };
    const textIsPresentInString = (input, stringToMatch) => {
      prepare_str(input).indexOf(stringToMatch);
    };
    const result =
      error.code && error.message
        ? prepare_str(error.message)
        : prepare_str(error);
    const parsedResult = (function () {
      switch (true) {
        case textIsPresentInString(
          result,
          'Attempt to debit an account but found no record of a prior credit'
        ):
          return 'Not enough VLX Native balance for this transaction.';

        case textIsPresentInString(result, 'custom program error: 0x1') ||
          textIsPresentInString(result, 'custom program error: 0x2') ||
          textIsPresentInString(result, 'insufficient funds for instruction'):
          return 'Failed to get the latest data, please refresh and try again.';

        case result.description:
          return result.description;

        default:
          return (
            'Something went wrong. Please contact support. You can still use web interface for full staking support.\n\n' +
            prepare_str(result)
          );
      }
    })();

    return parsedResult;
  }
}
