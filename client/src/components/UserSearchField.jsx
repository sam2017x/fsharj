import React from 'react';
import { Form, Button } from 'react-bootstrap';
import translate from '../util/localization/i18n';

const UserPageSearch = ({ searchField, handleClear }) => {
  const focusRef = React.useRef(null);

  const clear = () => {
    focusRef.current.focus();
    handleClear();
  };
  return (
    <Form>
      <Form.Group>
        <Form.Label>{translate('usersearch_form_label')}</Form.Label>
        <Form.Control
          ref={focusRef}
          {...searchField}
          reset={null}
          placeholder={translate('login_username')}
        />
      </Form.Group>
      <Button onClick={clear} variant="primary">
        {translate('clear')}
      </Button>
    </Form>
  );
};

export default UserPageSearch;
