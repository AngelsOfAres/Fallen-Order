

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
      console.log("Woops! Backend sent unexpected data...", response)
    }

    return response.json()
  } catch {
    console.log("Backend currently offline...")
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
    }

    const response = await fetchDataFromBackend('shuffle/shuffle2', requestBody, wallet)
    return response
  } catch (error) {
    console.error(error)
  }
}
