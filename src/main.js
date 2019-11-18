function getTruckIdsCallback(callback) {
  setTimeout(() => {
    callback([1,2,5,9,67]);
  }, 1000)
}

function getTruckIds() {
  return new Promise((resolve => {
    getTruckIdsCallback(result => resolve(result));
  }))
}

function getTruckByIdCallback(id, callback) {
  setTimeout(() => {
    const isError = Math.ceil(Math.random()*1000) < 100;

    if (isError) {
      return callback(undefined, 'Internal error'); 
    }

    callback({
      id: id,
      model: `truck ${id}`
    });
  })  
}

function getTruckById(id) {
  return new Promise ((resolve, reject) => {
    getTruckByIdCallback(id, (succes, error) => {
      return (id && succes) ? resolve(succes) : reject(error);
    })
  })
}

getTruckById(36)
  .then(data => console.log(`id: ${data.id}, model: ${data.model}`))
  .catch(error => console.log(`getTruckById - ${error}`));

let countForCallbackRequest = 0;

function getTruckListCallback(id, callback) {
  setTimeout(() => {
    const isError = Math.ceil(Math.random()*1000) < 100;
    
    if(isError && (countForCallbackRequest < 1)) {
      getTruckListCallback(id, callback);
      countForCallbackRequest += 1;
    } else if(isError && (countForCallbackRequest === 1)) {
      callback(id, 'Internal error');
    } else {
      callback(id);
      countForCallbackRequest = 0;
    }
  });
}

getTruckListCallback(57, (id, error) => {
  if(!id || error) {
  console.log(`Callback - ${error}`)
  } else {
  console.log(`id: ${id}, model: truck ${id}`)
  }
});

let countForPromiseRequest = 0;

function getTruckListPromise(id) {
  let isError = Math.ceil(Math.random()*1000) < 100;

  return new Promise((resolve,reject) => {
    setTimeout(() => {
      if(isError && (countForPromiseRequest < 1)) {
        countForPromiseRequest += 1;
        reject();
      } else {
        resolve(id);
        countForPromiseRequest = 0;
      }
    });
  }).then(data => {
    console.log(`Promise - id: ${data}, model: truck ${data}`)
  })
    .catch(() => {
      if(isError && countForPromiseRequest === 1) {
        return getTruckListPromise(id);
      }
      return new Promise((resolve, reject) => reject(console.log('Promise - Internal error')));
    })
}

getTruckListPromise(92);

let countForAsyncAwaitRequest = 0;

async function getTruckListAsyncAwait(id) {
  let isError = Math.ceil(Math.random()*1000) < 100;

  let result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if(isError && (countForAsyncAwaitRequest < 1)) {
        countForAsyncAwaitRequest += 1;
        reject();
      } else {
        resolve(id);
        countForAsyncAwaitRequest = 0;
      }
    })
  }).then(data => data)
    .catch((error) => {
      if(isError && countForAsyncAwaitRequest === 2) {
        return getTruckListAsyncAwait(id);
      }
      return new Promise((resolve, reject) => reject(error));
    });
  return result;
}

getTruckListAsyncAwait(120)
  .then(data => {
    console.log(`id: ${data}, model: ${data}`)
  })
  .catch(() => console.log('AsynAwait - Internal error'));
