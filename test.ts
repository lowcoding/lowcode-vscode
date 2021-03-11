import Axios from 'axios';

Axios.get('https://npm.bu6.io')
  .then((res) => {
    console.log(res.status);
  })
  .catch((ex) => {
    console.log(ex);
    return false;
  });
