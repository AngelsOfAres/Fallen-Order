async function fetchDataFromBackend(endpoint: string, data: Record<string, any>): Promise<any> {
    const apiUrl = `http://localhost:5000/${endpoint}`
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.log("Woops! Backend sent unexpected data...")
    }

    return response.json()
  } catch {
    console.log("Backend currently offline...")
  }
}

export async function equipBG(char_id: any, bg_id: any, wallet: any) {
  try {
    const requestBody = {
      char_id: char_id,
      bg_id: bg_id,
      wallet: wallet
    }

    const response = await fetchDataFromBackend('manage/equip', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}
