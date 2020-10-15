/* eslint-disable no-console */
import React, { Component } from 'react';
import { bool, func, object, string, shape } from 'prop-types';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import moment from 'moment';
import { Button } from '../../components';
import { required, bookingDateRequired, composeValidators } from '../../util/validators';
import { createTimeSlots } from '../../util/test-data';
import FieldDateInput from '../../components/FieldDateInput/FieldDateInput';
import { compose } from 'redux';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';

const identity = v => v;

const createAvailableTimeSlots = (dayCount, availableDayCount) => {
  const slots = createTimeSlots(new Date(), dayCount);
  const availableSlotIndices = Array.from({ length: availableDayCount }, () =>
    Math.floor(Math.random() * dayCount)
  );

  return availableSlotIndices.sort().map(i => slots[i]);
};

export class EditListingAvailableFromForm extends Component {
    render() {
        return (
            <FinalForm
                {...this.props}
                render={fieldRenderProps => {
                const {
                    style,
                    form,
                    handleSubmit,
                    onChange,
                    pristine,
                    submitting,
                    dateInputProps,
                    values,
                    submitButtonText
                } = fieldRenderProps;
                const submitDisabled = pristine || submitting;
                if (values && values.bookingDates) {
                    onChange(values.bookingDates);
                }

                return (
                    <form
                    style={style}
                    onSubmit={e => {
                        e.preventDefault();
                        handleSubmit(e);
                    }}
                    >
                    <FormSpy onChange={onChange} />
                    <FieldDateInput {...dateInputProps} />
                    <Button type="submit" disabled={submitDisabled} style={{ marginTop: '24px' }}>
                        {submitButtonText}
                    </Button>
                    </form>
                );
                }}
            />
        )
    }
}

EditListingAvailableFromForm.propTypes= {
    style: object,
    dateInputProps: shape({
      name: string,
      useMobileMargins: bool,
      id: string,
      label: string,
      placeholderText: string,
      format: func,
      validate: func,
      onBlur: func,
      onFocus: func,
    }),
    onChange: func,
    onSubmit: func 
};

export default compose(injectIntl)(EditListingAvailableFromForm)