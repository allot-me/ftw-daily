import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './SectionHero.css';

const SectionHero = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <h1 className={css.heroMainTitle}>
          <FormattedMessage id="SectionHero.title" />
        </h1>
        <h2 className={css.heroSubTitle}>
          <FormattedMessage id="SectionHero.subTitle" />
        </h2>
        <div className={css.heroButtonCols}>
        <NamedLink
          name="SearchPage"
          to={{
            search:
              'address=London&bounds=51.74188336%2C0.18448499%2C51.25834807%2C-0.45834824&pub_availability=available',
          }}
          className={css.heroButton}
        >
          <FormattedMessage id="SectionHero.browseButton" />
        </NamedLink>
        <NamedLink
          name="NewListingPage"
          className={css.heroButton}
        >
          <FormattedMessage id="SectionHero.newButton" />
        </NamedLink>
        </div>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
