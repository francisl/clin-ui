import React from 'react';
import renderer from 'react-test-renderer';
import intl from 'react-intl-universal';
import locales from 'locales';

require('intl/locale-data/jsonp/fr.js');
intl.init({ locales, currentLocale: "fr" });

describe.skip('Header', () => {
  test('should be as the snapshot', () => {
    const component = renderer.create(
      <Header />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});