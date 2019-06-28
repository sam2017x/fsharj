import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      genre
      username
    }
  }
`;

const login = async obj => {
  const log = await useMutation(LOGIN, {
    variables: {
      username: obj.username,
      password: obj.password,
    },
  });
  return log.data;
};

export default { login };
