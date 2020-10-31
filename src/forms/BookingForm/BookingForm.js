import React, { Component } from 'react';
import { string, bool, arrayOf, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import moment from 'moment';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, IconSpinner, PrimaryButton, FieldDateRangeInput } from '../../components';

import css from './BookingDatesForm.css';

const now = moment();
const one_week_tomorrow = now
  .startOf('day')
  .add(8, 'days')
  .toDate();
const two_weeks_tomorrow = now
  .startOf('day')
  .add(15, 'days')
  .toDate();


export class BookingDatesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.onFocusedInputChange = this.onFocusedInputChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  // Function that can be passed to nested components
  // so that they can notify this component when the
  // focused input changes.
  onFocusedInputChange(focusedInput) {
    this.setState({ focusedInput });
  }

  handleFormSubmit(e) {
    e.bookingDates = {
      startDate: one_week_tomorrow,
      endDate: two_weeks_tomorrow 
    }
    this.props.onSubmit(e);
  }

  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  handleOnChange(formValues) {
    const { startDate, endDate } =
      formValues.values && formValues.values.bookingDates ? formValues.values.bookingDates : {};
    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    if (startDate && endDate && !this.props.fetchLineItemsInProgress) {
      this.props.onFetchTransactionLineItems({
        bookingData: { startDate, endDate },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            handleSubmit,
            isOwnListing,
            submitButtonWrapperClassName,
            fetchTimeSlotsError,
            fetchLineItemsInProgress,
            fetchLineItemsError,
          } = fieldRenderProps;

          const timeSlotsError = fetchTimeSlotsError ? (
            <p className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.timeSlotsError" />
            </p>
          ) : null;

          const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
            <IconSpinner className={css.spinner} />
          ) : null;

          const bookingInfoErrorMaybe = fetchLineItemsError ? (
            <span className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.fetchLineItemsError" />
            </span>
          ) : null;

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          return (
            <Form onSubmit={handleSubmit} className={classes}>
              {timeSlotsError}
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />

              {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe}

              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesForm.ownListing'
                      : 'BookingDatesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingDatesForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingDatesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingDatesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent);
BookingForm.displayName = 'BookingForm';

export default BookingForm;
