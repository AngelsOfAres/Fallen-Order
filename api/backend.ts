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
      console.log("Woops! Backend sent unexpected data...")
    }

    return response.json()
  } catch {
    console.log("Backend currently offline...")
  }
}

export async function equipBG(char_id: any, bg_id: any, wallet: any, type: any) {
  try {
    const requestBody = {
      char_id: char_id,
      bg_id: bg_id,
      wallet: wallet,
      type: type
    }

    const response = await fetchDataFromBackend('manage/equip', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function renameChar(char_id: any, wallet: any, newName: any) {
  try {
    const requestBody = {
      char_id: char_id,
      wallet: wallet,
      name: newName
    }

    const response = await fetchDataFromBackend('manage/rename', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function statsChar(char_id: any, wallet: any, stats: any) {
  try {
    const requestBody = {
      char_id: char_id,
      wallet: wallet,
      stats: stats
    }

    const response = await fetchDataFromBackend('manage/stats', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function abilitiesChar(char_id: any, wallet: any, abilities: any) {
  try {
    const requestBody = {
      char_id: char_id,
      wallet: wallet,
      abilities: abilities
    }

    const response = await fetchDataFromBackend('manage/abilities', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}

export async function levelChar(char_id: any, wallet: any) {
  try {
    const requestBody = {
      char_id: char_id,
      wallet: wallet
    }

    const response = await fetchDataFromBackend('manage/level', requestBody)
    return response
  } catch (error) {
    console.error(error)
  }
}
