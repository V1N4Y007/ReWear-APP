const axios = require('axios');
async function test() {
  try {
    const r1 = await axios.post('http://localhost:5000/api/auth/register', {name: 'test', email: 'test'+Date.now()+'@test.com', password: 'password'});
    const token = r1.data.token;
    const r2 = await axios.post('http://localhost:5000/api/items', {title: 'a', description: 'b', category: 'c', type: 'd', size: 'e', condition: 'f', tags: [], images: []}, {headers: {Authorization: 'Bearer ' + token}});
    console.log('success', r2.data);
  } catch(e) {
    if (e.response && e.response.data) console.log('ERROR:', e.response.data);
    else console.log('ERROR:', e.message);
  }
}
test();
