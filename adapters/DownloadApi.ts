const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

export function DownloadApi(url: string, dist: string) {
  return new Promise<void>((resolve) => {
    const file = fs.createWriteStream(dist);
    const request = https.get(url, function (response: any) {
      response.pipe(file);
      // after download completed close filestream
      file.on('finish', () => {
        file.close();
        console.log('Download Completed');
        resolve();
      });
    });
  });
}
