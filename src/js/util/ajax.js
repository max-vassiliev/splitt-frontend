class AJAX {
  // TODO1 удалить (старый код)
  // const timeout = function (s) {
  //   return new Promise(function (_, reject) {
  //     setTimeout(function () {
  //       reject(new Error(`Request took too long! Timeout after ${s} second`));
  //     }, s * 1000);
  //   });
  // };
  // export const AJAX = async function (url, uploadData = undefined) {
  //   try {
  //     const fetchPro = uploadData
  //       ? fetch(url, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(uploadData),
  //         })
  //       : fetch(url);
  //     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  //     return data;
  //   } catch (err) {
  //     throw err;
  //   }
  // };
  // TODO1 доработать
  // static async request() {}
  // static async makeRequest() {}
  // TODO1 доработать
  // static get(url) {
  //   return this.request('GET', url);
  // }
  // TODO1 доработать
  // static post(url, data) {
  //   return this.request('POST', url, data);
  // }
  // TODO1 доработать
  // static patch(url, data) {
  //   return this.request('PATCH', url, data);
  // }
  // TODO1 доработать
  // static delete(url) {
  //   return this.request('DELETE', url);
  // }

  static async getTestData(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data;
    } catch (error) {
      throw err;
    }
  }
}

export default new AJAX();
