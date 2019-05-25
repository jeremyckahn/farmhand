import React from 'react';
import { NotificationSystem } from './NotificationSystem';
import { shallow } from 'enzyme';

let component;

beforeEach(() => {
  component = shallow(
    <NotificationSystem
      {...{
        handleCloseNotification: () => {},
        handleNotificationExited: () => {},
        notifications: [],
        doShowNotifications: false,
      }}
    />
  );
});

test('renders', () => {
  expect(component.hasClass('NotificationSystem')).toBeTruthy();
});
