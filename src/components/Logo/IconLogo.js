import React from 'react';
import PropTypes from 'prop-types';
import LogoImage from './allotme-logo.svg';

const IconLogo = props => {
  const { className, ...rest } = props;

  return (
    <img
      className={className}
      {...rest}
      width="30"
      height="30"
      viewBox="0 0 21 25"
      xmlns="http://www.w3.org/2000/svg"
      src={LogoImage}
      alt='Allot Me Logo'
    >
    </img>
  );
};

const { string } = PropTypes;

IconLogo.defaultProps = {
  className: null,
};

IconLogo.propTypes = {
  className: string,
};

export default IconLogo;
