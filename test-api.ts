import https from 'https';

async function run() {
  const loginRes = await fetch('https://storet1.codshop.vipone.site/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ottavio.ma', password: 'admin123456' }),
  });
  
  const cookies = loginRes.headers.get('set-cookie');
  const reqHeaders = new Headers();
  if (cookies) {
    reqHeaders.append('Cookie', cookies.split(';')[0]);
  }

  const prodRes = await fetch('https://storet1.codshop.vipone.site/api/admin/products?store=ottavio', {
    headers: reqHeaders,
  });

  const prodData = await prodRes.json();
  console.log("Products response:", prodData);
}

run();
