const fs = require('fs');
const { google } = require('googleapis');
const credentials = require('./credentials.json');
const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes,
);
const drive = google.drive({ version: 'v3', auth });

(async function () {
  let res = await new Promise((resolve, reject) => {
    drive.files.list(
      {
        pageSize: 50,
        /* fields: '*', // exibe todos os campos de cada item //  */
        fields: 'files(name, id, thumbnailLink, webViewLink)',
        orderBy: 'createdTime desc',
      },
      function (err, res) {
        if (err) {
          reject(err);
        }
        resolve(res);
      },
    );
  });

  // gerar arquivo JSON
  var json = JSON.stringify(res.data);
  fs.writeFile('data.json', json, (err) => {
    if (err) throw err;
  });

  // gerar arquivo CSV
  /*
  let data = 'Name,URL\n';
  res.data.files.map((entry) => {
    const { name, webViewLink } = entry;
    data += `${name},${webViewLink}\n`;
  });
  fs.writeFile('data.csv', data, (err) => {
    if (err) throw err;    
  });
  */
})();
