

async function fetchDataFromBackend(endpoint: string, data: Record<string, any>, activeAddress: any): Promise<any> {
    const apiUrl = `https://gorgeous-bunny-sadly.ngrok-free.app/${endpoint}`
  try {
    const authToken = localStorage.getItem('token_' + activeAddress)
    const headers = {
      'Content-Type': 'application/json',
      'userAuth': `${authToken}`
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 400) {
        return 'Error'
      }
      console.log("Woops! Backend sent unexpected data...", response)
    }

    return response.json()
  } catch (error: any) {
    console.log(error.message)
  }
}

export async function manageChar(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('manage', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getAuth(decSTxn: any, wallet: any) {
  try {
    const requestBody = {
      decSTxn: decSTxn,
      wallet: wallet
    }

    const response = await fetchDataFromBackend('auth', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getShuffle1(data: any, wallet: any) {
  try {
    const requestBody = {
      data: data,
      wallet: wallet
    }

    const response = await fetchDataFromBackend('shuffle/shuffle1', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getShuffle2(data: any, wallet: any) {
  try {
    const requestBody = {
      shuffleToken: localStorage.getItem('shuffle'),
      data: data,
      wallet: wallet
    }

    const response = await fetchDataFromBackend('shuffle/shuffle2', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function createProfile(wallet: any, userid: any) {
  try {
    const requestBody = {
      wallet: wallet,
      userid: userid && userid !== 0 ? userid : '00000000000000000'
    }

    const response = await fetchDataFromBackend('users/createprofile', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function getDrip(wallet: any) {
  try {
    const requestBody = {
      wallet: wallet
    }

    const response = await fetchDataFromBackend('misc/drip', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function switchMain(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('users/maincharacter', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function equipTool(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('users/equiptool', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function subKinship(wallet: any, subCount: any) {
  try {
    const requestBody = {
      wallet: wallet,
      subCount: subCount
    }

    const response = await fetchDataFromBackend('users/subkinship', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function createListing(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('ge/createlisting', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function purchaseItem(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('ge/purchaselisting', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function makeAlgoPurchase(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('ge/makealgopurchase', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function finalizeAlgoPurchase(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('ge/finalizealgopurchase', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function makeExpPurchase(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('ge/makeexppurchase', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function updateListing(wallet: any, data: any) {
  try {
    const requestBody = {
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('ge/updatelisting', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}

export async function unfreezeAsset(wallet: any, assetID: any) {
  try {
    const requestBody = {
      wallet: wallet,
      assetID: assetID
    }

    const response = await fetchDataFromBackend('ge/unfreezeasset', requestBody, wallet)
    return response
  } catch (error: any) {
    console.error(error.message)
  }
}



export async function getBVMShuffle1(wallet: any, txn: any) {
  try {
    const requestBody = {
      wallet: wallet,
      txn: txn
    }

    const response = await fetchDataFromBackend('bvm/shuffle1', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getBVMShuffle2(wallet: any, data: any) {
  try {
    const shuffleToken = localStorage.getItem('bvmshuffle')
    const requestBody = {
      wallet: wallet,
      shuffleToken: shuffleToken,
      data: data
    }
    const response = await fetchDataFromBackend('bvm/shuffle2', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}
