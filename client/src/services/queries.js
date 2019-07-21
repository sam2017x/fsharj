import { gql } from 'apollo-boost';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      username
      id
      friends {
        username
        id
        posts
        level
      }
      level
      posts
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
      posts
      level
      friends {
        username
        id
        posts
        level
      }
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoom($user1: String, $user2: String, $title: String) {
    createRoom(user1: $user1, user2: $user2, title: $title) {
      messages {
        sender
        timestamp
        message
      }
      users {
        username
        id
        posts
        level
      }
      title
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

export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(id: $id) {
      id
      username
      posts
      level
      friends {
        username
        id
        posts
        level
      }
    }
  }
`;

export const ME = gql`
  {
    me {
      username
      id
      friends {
        username
        id
        posts
        level
      }
      posts
      level
    }
  }
`;
