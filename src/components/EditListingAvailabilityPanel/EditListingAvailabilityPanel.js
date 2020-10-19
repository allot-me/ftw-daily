import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import moment from 'moment';
import { isSameDate, monthIdStringInUTC } from '../../util/dates';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailableFromForm } from '../../forms';

import css from './EditListingAvailabilityPanel.css';
import { deleteAvailabilityExceptionSuccess } from '../../containers/EditListingPage/EditListingPage.duck';

const momentToUTCDate = dateMoment =>
  dateMoment
    .clone()
    .utc()
    .add(dateMoment.utcOffset(), 'minutes')
    .toDate();

const MAX_BOOKINGS_RANGE = 180;
const TODAY_MOMENT = moment().startOf('day');
const MAX_AVAILABILITY_EXCEPTIONS_RANGE = 365;
const END_OF_RANGE_MOMENT = TODAY_MOMENT.clone()
  .add(MAX_AVAILABILITY_EXCEPTIONS_RANGE - 1, 'days')
  .startOf('day');
const END_OF_BOOKING_RANGE_MOMENT = TODAY_MOMENT.clone()
  .add(MAX_BOOKINGS_RANGE - 1, 'days')
  .startOf('day');

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    availability,
    disabled,
    ready,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const defaultAvailabilityPlan = {
    type: 'availability-plan/day',
    entries: [
      { dayOfWeek: 'mon', seats: 1 },
      { dayOfWeek: 'tue', seats: 1 },
      { dayOfWeek: 'wed', seats: 1 },
      { dayOfWeek: 'thu', seats: 1 },
      { dayOfWeek: 'fri', seats: 1 },
      { dayOfWeek: 'sat', seats: 1 },
      { dayOfWeek: 'sun', seats: 1 },
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const dateInputProps = {
    name: 'availableFrom',
    placeholderText: 'hello',
    useMobileMargins: false,
    id: 'AvailabilityFrom.availableFrom',
    label: 'Select Date',
    format: (value) => value,
    validate: null,
    onBlur: () => console.log('onBlur called'),
  }
  const getCurrentExceptions = (availability, monthYear) => {
    return availability.calendar[monthYear].exceptions
  }
  const submitAvailability = (value) => {
    onSubmit({availabilityPlan})
    const monthYear = monthIdStringInUTC(value)
    const exceptions = getCurrentExceptions(availability, monthYear)
    if (exceptions.length > 0){
      debugger
    }
    const exception_start = momentToUTCDate(TODAY_MOMENT)
    const exception_end = momentToUTCDate(moment(value.availableFrom.date).startOf('day'))
    const exception = null
    const params = { listingId: currentListing.id, start: exception_start, end: exception_end, seats: 0, currentException: exception };
    availability.onCreateAvailabilityException(params)
  }


  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
        )}
      </h1>
      <EditListingAvailableFromForm 
        submitButtonText={submitButtonText}
        dateInputProps={dateInputProps}
        onSubmit={submitAvailability}
        onChange={()=>console.log('onChange called')}
        availability={availability}
        listingId={currentListing.id}
      />
    </div>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,
  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
