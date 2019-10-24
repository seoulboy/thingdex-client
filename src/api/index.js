import { domain } from '../constants';

export const searchItem = async (searchString, userId) => {
  if (searchString.length) {
    // TODO: query string...
    const data = await fetch(
      `http://${domain}:4000/search_item/${userId}/${searchString}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      }
    );

    const response = await data.json();

    return response;
  }
};
