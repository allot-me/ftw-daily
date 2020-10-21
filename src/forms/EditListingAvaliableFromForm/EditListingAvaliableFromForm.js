/* eslint-disable no-console */
import React, { Component } from 'react';
import { bool, func, object, string, shape } from 'prop-types';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import moment from 'moment';
import { Button } from '../../components';
import FieldDateInput from '../../components/FieldDateInput/FieldDateInput';
import { compose } from 'redux';
import { injectIntl } from '../../util/reactIntl';

const momentToUTCDate = dateMoment =>
  dateMoment
    .clone()
    .utc()
    .add(dateMoment.utcOffset(), 'minutes')
    .toDate();

const TODAY_MOMENT = moment().startOf('day');
const getLastDayOfAvailability = (availability) => {
    const firstMonthYearOfAvailability = Object.keys(availability.calendar)[0]
    if (firstMonthYearOfAvailability){
        if (availability.calendar[firstMonthYearOfAvailability].exceptions.length > 0){
            return availability.calendar[firstMonthYearOfAvailability].exceptions[0].availabilityException.attributes.end.toString()
        }
    }
}

export class EditListingAvailableFromForm extends Component {
    async componentDidMount(){
        let { availability, listingId } = this.props
        const start = momentToUTCDate(TODAY_MOMENT)
        const end = momentToUTCDate(TODAY_MOMENT.clone().add(1, 'months').startOf('month'))
        await availability.onFetchAvailabilityExceptions({ listingId, start, end });
    }
    render() {
        const lastDay = getLastDayOfAvailability(this.props.availability)
        const placeholderText = lastDay || this.props.defaultPlaceholderText
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
                if (values && values.availableFrom) {
                    onChange(values.availableFrom);
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
                    <FieldDateInput {...dateInputProps} placeholderText={placeholderText}/>
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
      format: func,
      validate: func,
      onBlur: func,
      onFocus: func,
    }),
    defaultPlaceholderText: string,
    onChange: func,
    onSubmit: func 
};

export default compose(injectIntl)(EditListingAvailableFromForm)