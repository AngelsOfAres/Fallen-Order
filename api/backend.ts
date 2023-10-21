async function fetchDataFromBackend(endpoint: string, data: Record<string, any>): Promise<any> {
    const apiUrl = `https://10.0.0.50:5000/${endpoint}`
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      auth: localStorage.getItem('token'),
      wallet: wallet,
      data: data
    }

    const response = await fetchDataFromBackend('manage', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function getAuth(decSTxn: any) {
  try {
    const requestBody = {
      decSTxn: decSTxn,
    }

    const response = await fetchDataFromBackend('auth', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}
