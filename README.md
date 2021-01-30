# Sharetribe Flex Template for Web
# Allotme sharetribe front end

This is a front end application for Allotme, based on the sharetribe daily template.

To run the application locally, install the requirements using `yarn` and then use `yarn run dev`. 

### Booking

Other applications using sharetribe have resources that can be booked for a certain time period, after which they become available to be booked again (e.g. a room in a house like Airbnb). Allotme works by creating a booking between a host and a greenfinger that is only ended when one party decide for it to end. 

It isn't possible to use the sharetribe transaction and booking API with this limitation, as bookings must have a start and an end date and must be shorter than a year.

As such, we do the following: 

- When a booking is requested, we create a booking in sharetribe which will last for 1 week, and will start in 1 week's time.
- We pass payment information to Stripe, but no payment will be taken. It has to be managed manually using the Stripe dashboard.
- We notify how much the booking will cost per month via email
- When the booking is accepted by the host, we toggle the availiablity of the site to 'unavailable'.
- If a booking is rejected by the host, then the availability of the site stays 'available'.

Within the [flex console](https://flex-console.sharetribe.com/o/allotme3/m/allotme3-test/users) you can see 'Transactions'. This lists all the states of current transactions. This shows you the date at which the booking was accepted.

### Process

The default process has been heavily editied in order to support the above booking process. Use the flex-cli to download, edit and push the process and associated email templates.