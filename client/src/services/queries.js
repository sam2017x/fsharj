import { gql } from 'apollo-boost';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      username
      id
    }
  }
`;

export const SIGN = gql`
  mutation sign($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      username
      id
    }
  }
`;

export const ALL_USERS = gql`
  {
    allUsers {
      username
      id
    }
  }
`;

export const GET_USER_INFO = gql`
  query getUserInfo($username: String) {
    getUserInfo(username: $username) {
      posts
      username
      level
      id
      friends {
        username
        posts
        level
        id
      }
    }
  }
`;
