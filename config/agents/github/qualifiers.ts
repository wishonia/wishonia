import { createQualifiers } from '../base/scopes';

export const GITHUB_QUALIFIERS = createQualifiers({
  NAME: {
    qualifier: 'in:name',
    description: 'Search in user\'s full name',
    example: 'Jane+in:name'
  },
  USERNAME: {
    qualifier: 'in:login',
    description: 'Search in username',
    example: 'jane+in:login'
  },
  EMAIL: {
    qualifier: 'in:email',
    description: 'Search in email address',
    example: 'example@example.com+in:email'
  },
  LOCATION: {
    qualifier: 'location:',
    description: 'Filter by user location',
    example: 'location:Berlin'
  },
  FOLLOWERS: {
    qualifier: 'followers:',
    description: 'Filter by number of followers',
    example: 'followers:>100, followers:250..500'
  },
  BIO: {
    qualifier: 'in:bio',
    description: 'Search in user bio',
    example: 'developer+in:bio'
  }
}); 