/* eslint-disable no-console */
import { types as sdkTypes } from '../../util/sdkLoader';
import { LINE_ITEM_NIGHT } from '../../util/types';
import BookingForm from './BookingForm';

const { Money } = sdkTypes;

export const Form = {
  component: BookingForm,
  props: {
    unitType: LINE_ITEM_NIGHT,
    onSubmit: values => {
      console.log('Submit BookingForm with values:', values);
    },
    price: new Money(1099, 'USD'),
    fetchLineItemsInProgress: false,
    onFetchTransactionLineItems: () => null,
  },
  group: 'forms',
};
