import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import moment from 'moment';
import { monthIdStringInUTC } from '../../util/dates';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailableFromForm } from '../../forms';

import css from './EditListingAvailabilityPanel.css';

const momentToUTCDate = dateMoment =>
  dateMoment
    .clone()
    .utc()
    .add(dateMoment.utcOffset(), 'minutes')
    .toDate();

const TODAY_MOMENT = moment().startOf('day');

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    availability,
    submitButtonText,
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
  const getCurrentExceptions = (availability, monthYear) => {
    return availability.calendar[monthYear].exceptions
  }
  const dateInputProps = {
    name: 'availableFrom',
    useMobileMargins: false,
    id: 'AvailabilityFrom.availableFrom',
    label: 'Select Date',
    format: (value) => value,
    validate: null,
    onBlur: () => console.log('onBlur called'),
  }
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const submitAvailability = (value) => {
    const exception_start = momentToUTCDate(TODAY_MOMENT)
    const monthYear = monthIdStringInUTC(value)
    const exceptions = getCurrentExceptions(availability, monthYear)
    onSubmit({availabilityPlan})
    const exception_end = momentToUTCDate(moment(value.availableFrom.date).startOf('day'))
    // TODO currentException should not be null
    const params = { listingId: currentListing.id, start: exception_start, end: exception_end, seats: 0, currentException: null};
    if (exceptions.length === 1){
      const exception = exceptions[0]
      availability.onDeleteAvailabilityException({id: exception.availabilityException.id, seats: 1, currentException: exception}).then(() => {
        availability.onCreateAvailabilityException(params)
      }
      )
    }
    else {
      availability.onCreateAvailabilityException(params)
    }
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
        defaultPlaceholderText={moment().format('MMMM D, YYYY')}
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
